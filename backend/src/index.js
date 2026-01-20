// import 'dotenv/config'; // Native --env-file used
import express from 'express';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import estateRoutes from './routes/estate.js';
import documentRoutes from './routes/documents.js';
import communicationRoutes from './routes/communication.js';
import aiRoutes from './routes/aiRoutes.js';
import discoveryRoutes from './routes/discovery.js';
import assetCommunicationRoutes from './routes/assetCommunication.js';
import formRoutes from './routes/forms.js';
import followUpRoutes from './routes/followUp.js';
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    }
}));
// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/estates', estateRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/assets', assetCommunicationRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/follow-ups', followUpRoutes);
// Health check endpoint
app.get('/db-health', async (req, res) => {
    try {
        const estateCount = await prisma.estate.count();
        res.json({ status: 'connected', count: estateCount });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
// Serve static files from the 'public' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));
// Export app for Vercel (Serverless)
export default app;
// Only listen if run directly (locally)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map