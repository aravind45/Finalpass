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
    req?: any;
}
export declare class AuthService {
    /**
     * Register a new user with email/password
     */
    register(data: RegisterData): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            state: any;
            estateType: string | null;
        };
        token: string;
    }>;
    /**
     * Login with email/password
     */
    login(data: LoginData): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            state: any;
            estateType: any;
        };
        token: string;
    }>;
    /**
     * Verify JWT token and return user
     */
    verifyToken(token: string): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        state: any;
        estateType: any;
    }>;
    /**
     * Generate JWT token
     */
    private generateToken;
    /**
     * Find or create user from Google OAuth
     */
    findOrCreateGoogleUser(googleProfile: {
        id: string;
        email: string;
        name: string;
    }, additionalData?: {
        role: 'EXECUTOR' | 'BENEFICIARY';
        state: string;
    }): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            state: any;
        };
        token: string;
        isNewUser: boolean;
        googleProfile?: never;
    } | {
        user: null;
        token: null;
        isNewUser: boolean;
        googleProfile: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map