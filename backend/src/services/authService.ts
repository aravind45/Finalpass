import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { Request } from 'express';

// TODO: Re-enable once database is configured
// import { hashToken } from '../utils/encryption.js';
// import { logLogin, getClientIp } from '../services/auditService.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface RegisterData {
    email: string;
    password?: string;
    name: string;
    role: 'EXECUTOR' | 'BENEFICIARY';
    state: string;
    estateType?: string;
    googleId?: string;
}

export interface LoginData {
    email: string;
    password: string;
    req?: any; // or Request if you can import it, but any is strictly safer to avoid circular deps if types are tricky here
}

export class AuthService {
    /**
     * Register a new user with email/password
     */
    async register(data: RegisterData) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password if provided (not for OAuth users)
        let passwordHash: string | null = null;
        if (data.password) {
            passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                role: data.role,
                state: data.state,
                googleId: data.googleId || null
            }
        });

        // Create default Estate if estateType is provided
        if (data.estateType) {
            await prisma.estate.create({
                data: {
                    name: `${data.name}'s Estate`,
                    deceasedInfo: '{}',
                    status: 'INITIATION',
                    userId: user.id,
                    type: data.estateType
                }
            });
        }

        // Generate JWT token
        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                state: user.state,
                estateType: data.estateType || null
            },
            token
        };
    }

    /**
     * Login with email/password
     */
    async login(data: LoginData) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { estates: true }
        });

        if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                state: user.state,
                estateType: user.estates[0]?.type || null
            },
            token
        };
    }

    /**
     * Verify JWT token and return user
     */
    async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                email: string;
                role: string;
            };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { estates: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                state: user.state,
                estateType: user.estates[0]?.type || null
            };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(userId: string, email: string, role: string): string {
        return jwt.sign(
            { userId, email, role },
            JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );
    }

    /**
     * Find or create user from Google OAuth
     */
    async findOrCreateGoogleUser(googleProfile: {
        id: string;
        email: string;
        name: string;
    }, additionalData?: { role: 'EXECUTOR' | 'BENEFICIARY'; state: string }) {
        // Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
            where: { googleId: googleProfile.id }
        });

        // If not, check by email
        if (!user) {
            user = await prisma.user.findUnique({
                where: { email: googleProfile.email }
            });
        }

        // If user exists, return token
        if (user) {
            const token = this.generateToken(user.id, user.email, user.role);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    state: user.state
                },
                token,
                isNewUser: false
            };
        }

        // If user doesn't exist and we have additional data, create new user
        if (additionalData) {
            const newUser = await prisma.user.create({
                data: {
                    email: googleProfile.email,
                    name: googleProfile.name,
                    googleId: googleProfile.id,
                    role: additionalData.role,
                    state: additionalData.state,
                    passwordHash: null // OAuth users don't have passwords
                }
            });

            const token = this.generateToken(newUser.id, newUser.email, newUser.role);
            return {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    state: newUser.state
                },
                token,
                isNewUser: true
            };
        }

        // If no additional data, return null (need to collect role and state)
        return {
            user: null,
            token: null,
            isNewUser: true,
            googleProfile
        };
    }
}

export const authService = new AuthService();
