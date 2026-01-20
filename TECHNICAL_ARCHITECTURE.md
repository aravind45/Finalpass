# ExpectedEstate - Technical Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Database Schema](#database-schema)
5. [API Architecture](#api-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Security Architecture](#security-architecture)
8. [Integration Architecture](#integration-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [Scalability & Performance](#scalability--performance)

---

## 1. System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  React SPA (Vite)                                           │
│  - TypeScript                                                │
│  - Tailwind CSS + Shadcn UI                                 │
│  - React Router                                              │
│  - Framer Motion                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express API                                       │
│  - TypeScript                                                │
│  - JWT Authentication                                        │
│  - RESTful Endpoints                                         │
│  - Middleware (Auth, CORS, Rate Limiting)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Services                                     │
│  - Estate Service                                            │
│  - Asset Communication Service                               │
│  - Document Service                                          │
│  - Form Service                                              │
│  - Fax Service (PamFax API)                                 │
│  - AI Service (Groq API)                                    │
│  - Discovery Service                                         │
│  - Auth Service                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Neon)                                           │
│  - Prisma ORM                                                │
│  - Relational Data Model                                     │
│  - JSONB for Flexible Metadata                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  - PamFax API (Fax transmission)                            │
│  - Groq API (AI document extraction)                        │
│  - Vercel (Hosting & CDN)                                   │
│  - Neon (PostgreSQL hosting)                                │
└─────────────────────────────────────────────────────────────┘
```

### System Components

**Frontend (React SPA)**
- Single Page Application built with React 19
- TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS + Shadcn UI for consistent design system

**Backend (Node.js API)**
- Express.js REST API
- TypeScript for type safety
- Prisma ORM for database access
- JWT-based authentication

**Database (PostgreSQL)**
- Hosted on Neon (serverless PostgreSQL)
- Prisma for schema management and migrations
- JSONB columns for flexible metadata storage

**External Integrations**
- PamFax for fax transmission
- Groq for AI-powered document extraction
- Vercel for deployment and CDN

---

## 2. Technology Stack

### Frontend Stack

```typescript
{
  "runtime": "Browser",
  "framework": "React 19.2.0",
  "language": "TypeScript 5.9.3",
  "buildTool": "Vite 7.2.4",
  "styling": {
    "framework": "Tailwind CSS 3.4.17",
    "components": "Shadcn UI (Radix UI primitives)",
    "animations": "Framer Motion 12.25.0"
  },
  "routing": "React Router 7.12.0",
  "stateManagement": "React Hooks + Context",
  "httpClient": "Axios 1.13.2",
  "formHandling": "React Hook Form 7.71.1",
  "validation": "Zod 4.3.5"
}
```

### Backend Stack

```typescript
{
  "runtime": "Node.js 20+",
  "framework": "Express.js 4.x",
  "language": "TypeScript 5.x",
  "orm": "Prisma 6.x",
  "database": "PostgreSQL 15+",
  "authentication": "JWT (jsonwebtoken)",
  "security": {
    "helmet": "Security headers",
    "cors": "Cross-origin resource sharing",
    "bcrypt": "Password hashing",
    "rateLimit": "express-rate-limit"
  },
  "fileHandling": {
    "multer": "File uploads",
    "pdfLib": "PDF manipulation"
  }
}
```

### Infrastructure Stack

```typescript
{
  "hosting": {
    "frontend": "Vercel (Static + Edge)",
    "backend": "Vercel Serverless Functions",
    "database": "Neon (Serverless PostgreSQL)"
  },
  "cdn": "Vercel Edge Network",
  "ssl": "Automatic (Vercel)",
  "monitoring": "Vercel Analytics",
  "logging": "Console + Vercel Logs"
}
```

---


## 3. Architecture Patterns

### 3.1 Layered Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (React Components, Pages, UI)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         APPLICATION LAYER               │
│  (API Routes, Controllers)              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER            │
│  (Services, Domain Logic)               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         DATA ACCESS LAYER               │
│  (Prisma ORM, Database)                 │
└─────────────────────────────────────────┘
```

### 3.2 Service-Oriented Architecture

Each business domain has its own service:

```typescript
// Service Structure
services/
├── authService.ts          // Authentication & authorization
├── estateService.ts        // Estate management
├── assetCommunicationService.ts  // Asset tracking & comms
├── documentService.ts      // Document management
├── formService.ts          // Form handling & PDF manipulation
├── faxService.ts           // Fax transmission (PamFax)
├── aiService.ts            // AI document extraction (Groq)
├── discoveryService.ts     // Asset discovery
├── advocacyService.ts      // Advocacy & escalation
└── auditService.ts         // Audit logging
```

### 3.3 Repository Pattern (via Prisma)

```typescript
// Prisma acts as repository layer
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Service uses Prisma for data access
export class EstateService {
  async getEstateById(id: string) {
    return await prisma.estate.findUnique({
      where: { id },
      include: {
        assets: true,
        documents: true
      }
    });
  }
}
```

### 3.4 Middleware Pattern

```typescript
// Authentication Middleware
app.use('/api/estates', authMiddleware);
app.use('/api/assets', authMiddleware);

// Rate Limiting Middleware
app.use('/api/auth', authLimiter);

// Error Handling Middleware
app.use(errorHandler);
```

---


## 4. Database Schema

### 4.1 Core Tables

```prisma
// Prisma Schema (backend/prisma/schema.prisma)

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      String   @default("executor")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  estates   Estate[]
}

model Estate {
  id            Int      @id @default(autoincrement())
  name          String
  deceasedName  String
  dateOfDeath   DateTime?
  status        String   @default("active")
  userId        Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  assets        Asset[]
  documents     Document[]
  communications Communication[]
}

model Asset {
  id            Int      @id @default(autoincrement())
  estateId      Int
  institution   String
  type          String
  accountNumber String?
  value         Decimal  @db.Decimal(15, 2)
  status        String   @default("discovered")
  metadata      Json?
  requirements  Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  estate        Estate   @relation(fields: [estateId], references: [id])
  communications AssetCommunication[]
  escalations   Escalation[]
  faxes         Fax[]
}

model AssetCommunication {
  id            Int      @id @default(autoincrement())
  assetId       Int
  type          String   // phone_call, email, fax, letter, in_person
  direction     String   // inbound, outbound
  contactPerson String?
  summary       String
  outcome       String?
  nextFollowUp  DateTime?
  createdAt     DateTime @default(now())
  
  asset         Asset    @relation(fields: [assetId], references: [id])
  notifications Notification[]
}

model Escalation {
  id            Int      @id @default(autoincrement())
  assetId       Int
  reason        String
  daysSinceContact Int
  priority      String   // low, medium, high, urgent
  status        String   @default("open")
  resolvedAt    DateTime?
  createdAt     DateTime @default(now())
  
  asset         Asset    @relation(fields: [assetId], references: [id])
}

model Notification {
  id            Int      @id @default(autoincrement())
  communicationId Int
  type          String   // reminder, escalation, alert
  message       String
  read          Boolean  @default(false)
  createdAt     DateTime @default(now())
  
  communication AssetCommunication @relation(fields: [communicationId], references: [id])
}

model Fax {
  id            Int      @id @default(autoincrement())
  assetId       Int
  formId        String
  recipient     String
  faxNumber     String
  pageCount     Int
  cost          Decimal  @db.Decimal(10, 2)
  status        String   @default("pending")
  pamfaxId      String?
  sentAt        DateTime?
  deliveredAt   DateTime?
  createdAt     DateTime @default(now())
  
  asset         Asset    @relation(fields: [assetId], references: [id])
}

model Document {
  id            Int      @id @default(autoincrement())
  estateId      Int
  name          String
  type          String
  filePath      String
  fileSize      Int
  mimeType      String
  uploadedAt    DateTime @default(now())
  
  estate        Estate   @relation(fields: [estateId], references: [id])
}

model Communication {
  id            Int      @id @default(autoincrement())
  estateId      Int
  type          String
  subject       String?
  body          String
  createdAt     DateTime @default(now())
  
  estate        Estate   @relation(fields: [estateId], references: [id])
}
```

### 4.2 Database Relationships

```
User (1) ──────── (N) Estate
                       │
                       ├── (N) Asset
                       │        ├── (N) AssetCommunication
                       │        │        └── (N) Notification
                       │        ├── (N) Escalation
                       │        └── (N) Fax
                       │
                       ├── (N) Document
                       └── (N) Communication
```

### 4.3 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_estate_user ON "Estate"("userId");
CREATE INDEX idx_asset_estate ON "Asset"("estateId");
CREATE INDEX idx_asset_status ON "Asset"("status");
CREATE INDEX idx_communication_asset ON "AssetCommunication"("assetId");
CREATE INDEX idx_escalation_asset ON "Escalation"("assetId");
CREATE INDEX idx_escalation_status ON "Escalation"("status");
CREATE INDEX idx_fax_asset ON "Fax"("assetId");
CREATE INDEX idx_fax_status ON "Fax"("status");
```

---


## 5. API Architecture

### 5.1 RESTful API Design

**Base URL:** `https://api.expectedestate.com/api`

**Authentication:** JWT Bearer Token in Authorization header

### 5.2 API Endpoints

```typescript
// Authentication
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // Login user
POST   /api/auth/logout            // Logout user
GET    /api/auth/me                // Get current user

// Estates
GET    /api/estates                // List user's estates
POST   /api/estates                // Create new estate
GET    /api/estates/:id            // Get estate details
PUT    /api/estates/:id            // Update estate
DELETE /api/estates/:id            // Delete estate
GET    /api/estates/dashboard      // Get dashboard data

// Assets
GET    /api/estates/:estateId/assets     // List estate assets
POST   /api/estates/:estateId/assets     // Create asset
GET    /api/assets/:id                   // Get asset details
PUT    /api/assets/:id                   // Update asset
DELETE /api/assets/:id                   // Delete asset
GET    /api/assets/:id/next-actions      // Get recommended actions

// Asset Communications
GET    /api/assets/:assetId/communications     // List communications
POST   /api/assets/:assetId/communications     // Log communication
GET    /api/assets/:assetId/communications/:id // Get communication
PUT    /api/assets/:assetId/communications/:id // Update communication
DELETE /api/assets/:assetId/communications/:id // Delete communication

// Forms
GET    /api/forms                              // List all forms
GET    /api/forms/institution/:name            // Get forms by institution
GET    /api/forms/:formId                      // Get form details
POST   /api/forms/:formId/fill                 // Fill form with data
GET    /api/forms/:formId/download             // Download form PDF

// Fax
POST   /api/fax/send                           // Send fax
GET    /api/fax/:id/status                     // Get fax status
GET    /api/assets/:assetId/faxes              // List asset faxes

// Documents
GET    /api/estates/:estateId/documents        // List documents
POST   /api/estates/:estateId/documents        // Upload document
GET    /api/documents/:id                      // Get document
DELETE /api/documents/:id                      // Delete document
GET    /api/documents/:id/download             // Download document

// AI Services
POST   /api/ai/extract                         // Extract data from document
POST   /api/ai/draft                           // Draft communication

// Discovery
POST   /api/discovery/analyze                  // Analyze documents for assets
GET    /api/discovery/suggestions              // Get asset suggestions

// Communications (General)
GET    /api/communication                      // List all communications
POST   /api/communication                      // Create communication
```

### 5.3 Request/Response Format

**Standard Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}
```

### 5.4 Authentication Flow

```typescript
// 1. User Login
POST /api/auth/login
Body: { email, password }
Response: { success: true, token: "jwt_token", user: {...} }

// 2. Store token in localStorage
localStorage.setItem('token', token);

// 3. Include token in subsequent requests
GET /api/estates
Headers: { Authorization: "Bearer jwt_token" }

// 4. Middleware validates token
authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, SECRET);
  req.userId = decoded.userId;
  next();
}
```

### 5.5 Rate Limiting

```typescript
// Auth endpoints: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts'
});

// General API: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

---


## 6. Frontend Architecture

### 6.1 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable components
│   │   ├── ui/             # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── Layout.tsx      # Main layout with sidebar
│   │   ├── CommunicationLog.tsx
│   │   └── SendFaxModal.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Assets.tsx
│   │   ├── AssetDetail.tsx
│   │   ├── Documents.tsx
│   │   ├── Communications.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── lib/                # Utilities
│   │   └── utils.ts
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.cjs
```

### 6.2 Component Architecture

```typescript
// Component Hierarchy
App
├── Router
│   ├── Public Routes
│   │   ├── Login
│   │   ├── Register
│   │   └── RoleSelection
│   └── Protected Routes (wrapped in Layout)
│       ├── Dashboard
│       ├── Assets
│       │   └── AssetDetail
│       │       ├── CommunicationLog
│       │       └── SendFaxModal
│       ├── Documents
│       ├── Communications
│       ├── Checklist
│       ├── Discovery
│       └── Family

// Layout Component
Layout
├── Sidebar (Desktop)
│   ├── Logo
│   ├── Navigation Menu
│   └── User Profile
├── Mobile Header
│   ├── Hamburger Menu
│   └── User Dropdown
└── Main Content Area
    └── <Outlet /> (React Router)
```

### 6.3 State Management

```typescript
// Local State (useState)
const [asset, setAsset] = useState<Asset | null>(null);
const [loading, setLoading] = useState(true);

// Global State (Context API)
// Currently using localStorage for:
// - JWT token
// - User info

// Future: Consider React Context for:
// - Estate context (current estate)
// - User context (current user)
// - Notification context (alerts, reminders)
```

### 6.4 Routing

```typescript
// React Router v7 Configuration
<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<RoleSelection />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />

    {/* Protected Routes */}
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/assets/:assetId" element={<AssetDetail />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/communications" element={<Communications />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/family" element={<Family />} />
    </Route>
  </Routes>
</Router>
```

### 6.5 API Integration

```typescript
// Axios Configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor (Add JWT token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (Handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usage in Components
const fetchAsset = async (id: string) => {
  const response = await api.get(`/assets/${id}`);
  return response.data;
};
```

### 6.6 Styling System

```typescript
// Tailwind CSS + Shadcn UI
// Design tokens defined in tailwind.config.cjs

const theme = {
  colors: {
    primary: 'hsl(237 84% 60%)',      // Calm blue
    secondary: 'hsl(210 40% 96.1%)',  // Soft gray
    success: 'hsl(142 76% 36%)',      // Gentle green
    warning: 'hsl(38 92% 50%)',       // Warm orange
    destructive: 'hsl(0 84% 60%)',    // Soft red
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem'   // 48px
  }
};

// Usage
<Card className="p-6 space-y-4 bg-card border border-border">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
</Card>
```

---


## 7. Security Architecture

### 7.1 Authentication & Authorization

```typescript
// JWT-based Authentication
interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;  // Issued at
  exp: number;  // Expiration
}

// Token Generation
const generateToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

// Token Verification Middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};
```

### 7.2 Password Security

```typescript
// Password Hashing (bcrypt)
import bcrypt from 'bcrypt';

// Hash password on registration
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password on login
const verifyPassword = async (
  password: string, 
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

### 7.3 Data Encryption

```typescript
// Sensitive Data Encryption
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

// Encrypt sensitive data (SSN, account numbers)
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

// Decrypt sensitive data
export const decrypt = (encryptedText: string): string => {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

### 7.4 Security Headers (Helmet)

```typescript
import helmet from 'helmet';

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
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 7.5 CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 7.6 Input Validation

```typescript
// Zod Schema Validation
import { z } from 'zod';

const createAssetSchema = z.object({
  institution: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  value: z.number().positive(),
  accountNumber: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// Validate request body
app.post('/api/assets', authMiddleware, async (req, res) => {
  try {
    const validatedData = createAssetSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      details: error.errors 
    });
  }
});
```

### 7.7 SQL Injection Prevention

```typescript
// Prisma ORM provides automatic SQL injection prevention
// All queries are parameterized

// Safe query (Prisma)
const asset = await prisma.asset.findUnique({
  where: { id: assetId }  // Automatically parameterized
});

// Unsafe query (Raw SQL - AVOID)
// const asset = await prisma.$queryRaw`
//   SELECT * FROM assets WHERE id = ${assetId}
// `;  // DON'T DO THIS
```

### 7.8 XSS Prevention

```typescript
// React automatically escapes content
// Dangerous HTML must be explicitly marked

// Safe (automatic escaping)
<div>{userInput}</div>

// Unsafe (requires explicit opt-in)
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Sanitize HTML if needed
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);
```

### 7.9 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Auth endpoints: 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// General API: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api', apiLimiter);
```

### 7.10 Environment Variables

```bash
# .env (NEVER commit to git)
DATABASE_URL="postgresql://..."
JWT_SECRET="random_secret_key_here"
ENCRYPTION_KEY="32_byte_hex_key_here"
GROQ_API_KEY="gsk_..."
PAMFAX_USERNAME="..."
PAMFAX_PASSWORD="..."
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

---


## 8. Integration Architecture

### 8.1 PamFax Integration (Fax Service)

```typescript
// Fax Service Implementation
import axios from 'axios';

interface PamFaxConfig {
  username: string;
  password: string;
  baseUrl: string;
}

export class FaxService {
  private config: PamFaxConfig;
  
  constructor() {
    this.config = {
      username: process.env.PAMFAX_USERNAME!,
      password: process.env.PAMFAX_PASSWORD!,
      baseUrl: 'https://api.pamfax.biz'
    };
  }
  
  async sendFax(params: {
    recipient: string;
    faxNumber: string;
    pdfBuffer: Buffer;
    coverPage?: string;
  }): Promise<{ faxId: string; cost: number }> {
    // 1. Authenticate
    const auth = await this.authenticate();
    
    // 2. Create fax
    const faxId = await this.createFax(auth.token);
    
    // 3. Add cover page (optional)
    if (params.coverPage) {
      await this.addCoverPage(auth.token, faxId, params.coverPage);
    }
    
    // 4. Upload PDF
    await this.uploadFile(auth.token, faxId, params.pdfBuffer);
    
    // 5. Add recipient
    await this.addRecipient(auth.token, faxId, {
      name: params.recipient,
      number: params.faxNumber
    });
    
    // 6. Send fax
    const result = await this.sendFaxRequest(auth.token, faxId);
    
    return {
      faxId: result.uuid,
      cost: result.cost
    };
  }
  
  async getFaxStatus(faxId: string): Promise<string> {
    const auth = await this.authenticate();
    const response = await axios.get(
      `${this.config.baseUrl}/fax/${faxId}/state`,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return response.data.state; // 'queued', 'sending', 'sent', 'failed'
  }
}
```

### 8.2 Groq AI Integration (Document Extraction)

```typescript
// AI Service Implementation
import Groq from 'groq-sdk';

export class AIService {
  private groq: Groq;
  
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  
  async extractDocumentData(
    documentText: string,
    documentType: string
  ): Promise<any> {
    const prompt = this.buildExtractionPrompt(documentType, documentText);
    
    const completion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at extracting structured data from estate documents.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  }
  
  async draftCommunication(params: {
    institution: string;
    purpose: string;
    context: string;
  }): Promise<string> {
    const prompt = `Draft a professional communication to ${params.institution} 
    for the purpose of ${params.purpose}. Context: ${params.context}`;
    
    const completion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at drafting professional estate settlement communications.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7
    });
    
    return completion.choices[0].message.content;
  }
}
```

### 8.3 Neon PostgreSQL Integration

```typescript
// Prisma Configuration
// DATABASE_URL in .env points to Neon

// Connection pooling handled by Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'error', 'warn']
});

// Connection management
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
```

### 8.4 Vercel Deployment Integration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "GROQ_API_KEY": "@groq-api-key"
  }
}
```

---


## 9. Deployment Architecture

### 9.1 Deployment Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                       │
│                  (Global CDN + Edge Functions)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Static)                         │
│  - React SPA (pre-built)                                    │
│  - Served from Vercel CDN                                   │
│  - Automatic HTTPS                                           │
│  - Edge caching                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Serverless Functions)                  │
│  - Node.js Express API                                       │
│  - Auto-scaling                                              │
│  - Cold start optimization                                   │
│  - Regional deployment                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Neon PostgreSQL)                      │
│  - Serverless PostgreSQL                                     │
│  - Auto-scaling                                              │
│  - Connection pooling                                        │
│  - Automatic backups                                         │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Environment Configuration

```bash
# Development Environment
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/expectedestate
NODE_ENV=development

# Production Environment (Vercel)
FRONTEND_URL=https://expectedestate.com
BACKEND_URL=https://api.expectedestate.com
DATABASE_URL=postgresql://neon.tech/expectedestate
NODE_ENV=production
```

### 9.3 Build Process

```bash
# Frontend Build
cd frontend
npm run build
# Output: frontend/dist/

# Backend Build
cd backend
npm run build
# Output: backend/dist/

# Database Migrations
cd backend
npx prisma migrate deploy
```

### 9.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
      
      - name: Build frontend
        run: cd frontend && npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 9.5 Monitoring & Logging

```typescript
// Application Logging
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Asset created', { assetId, userId });
logger.error('Fax failed', { error, faxId });

// Vercel Analytics
// Automatic page view tracking
// Performance monitoring
// Error tracking
```

### 9.6 Backup Strategy

```typescript
// Database Backups (Neon)
// - Automatic daily backups
// - Point-in-time recovery (7 days)
// - Manual backup before major changes

// Document Backups
// - Files stored in Vercel Blob Storage
// - Automatic replication
// - 30-day retention

// Code Backups
// - Git repository (GitHub)
// - Branch protection
// - Tag releases
```

---


## 10. Scalability & Performance

### 10.1 Scalability Strategy

```
Current Scale (MVP):
├── Users: 1-100
├── Estates: 1-500
├── Assets: 1-5,000
├── Requests: <1,000/day
└── Database: <1GB

Target Scale (Year 1):
├── Users: 10,000
├── Estates: 50,000
├── Assets: 500,000
├── Requests: 100,000/day
└── Database: 10GB

Target Scale (Year 3):
├── Users: 100,000
├── Estates: 500,000
├── Assets: 5,000,000
├── Requests: 1,000,000/day
└── Database: 100GB
```

### 10.2 Performance Optimizations

**Frontend:**
```typescript
// Code Splitting
const AssetDetail = lazy(() => import('./pages/AssetDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Image Optimization
<img 
  src="/image.jpg" 
  loading="lazy" 
  width="800" 
  height="600"
/>

// Memoization
const MemoizedComponent = memo(ExpensiveComponent);

// Virtual Scrolling (for large lists)
import { FixedSizeList } from 'react-window';
```

**Backend:**
```typescript
// Database Query Optimization
// Use indexes
await prisma.asset.findMany({
  where: { estateId },  // Indexed
  include: {
    communications: {
      take: 10,  // Limit results
      orderBy: { createdAt: 'desc' }
    }
  }
});

// Connection Pooling (Prisma)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Caching (Redis - future)
const cachedData = await redis.get(`estate:${estateId}`);
if (cachedData) return JSON.parse(cachedData);
```

### 10.3 Database Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_asset_estate_status ON "Asset"("estateId", "status");
CREATE INDEX idx_communication_asset_date ON "AssetCommunication"("assetId", "createdAt" DESC);
CREATE INDEX idx_escalation_status_priority ON "Escalation"("status", "priority");

-- Partial indexes for active records
CREATE INDEX idx_active_assets ON "Asset"("estateId") 
WHERE status NOT IN ('distributed', 'closed');

-- JSONB indexes for metadata queries
CREATE INDEX idx_asset_metadata ON "Asset" USING GIN (metadata);
```

### 10.4 Caching Strategy

```typescript
// Browser Caching (Service Worker - future)
// - Cache static assets (JS, CSS, images)
// - Cache API responses (with TTL)
// - Offline support

// CDN Caching (Vercel)
// - Static assets: 1 year
// - API responses: No cache (dynamic)
// - HTML: No cache (SPA)

// Application Caching (Redis - future)
interface CacheStrategy {
  estates: { ttl: 300 },      // 5 minutes
  assets: { ttl: 300 },       // 5 minutes
  forms: { ttl: 86400 },      // 24 hours
  documents: { ttl: 3600 }    // 1 hour
}
```

### 10.5 Load Balancing

```
Vercel Automatic Load Balancing:
├── Edge Network (Global)
│   ├── US East
│   ├── US West
│   ├── Europe
│   └── Asia Pacific
├── Serverless Functions (Auto-scale)
│   ├── Cold start: <1s
│   ├── Warm instances: <100ms
│   └── Max concurrency: 1000
└── Database (Neon)
    ├── Connection pooling
    ├── Read replicas (future)
    └── Auto-scaling compute
```

### 10.6 Performance Metrics

```typescript
// Target Performance Metrics
const performanceTargets = {
  // Frontend
  firstContentfulPaint: '<1.5s',
  largestContentfulPaint: '<2.5s',
  timeToInteractive: '<3.5s',
  cumulativeLayoutShift: '<0.1',
  
  // Backend
  apiResponseTime: {
    p50: '<200ms',
    p95: '<500ms',
    p99: '<1000ms'
  },
  
  // Database
  queryTime: {
    simple: '<50ms',
    complex: '<200ms',
    aggregation: '<500ms'
  }
};

// Monitoring
import { performance } from 'perf_hooks';

const start = performance.now();
// ... operation ...
const duration = performance.now() - start;
logger.info('Operation completed', { duration, operation: 'fetchAssets' });
```

### 10.7 Error Handling & Resilience

```typescript
// Retry Logic
async function fetchWithRetry(
  url: string, 
  maxRetries = 3
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Circuit Breaker (future)
class CircuitBreaker {
  private failures = 0;
  private threshold = 5;
  private timeout = 60000;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}

// Graceful Degradation
try {
  const aiSuggestion = await aiService.generateSuggestion();
  return aiSuggestion;
} catch (error) {
  logger.error('AI service failed, using fallback', { error });
  return fallbackSuggestion;
}
```

---

## 11. Future Enhancements

### 11.1 Planned Features

**Phase 2 (Q2 2024):**
- Real-time notifications (WebSockets)
- Mobile app (React Native)
- Advanced analytics dashboard
- Bulk operations
- Export to PDF/Excel

**Phase 3 (Q3 2024):**
- Multi-language support (i18n)
- White-label solution for institutions
- API for third-party integrations
- Advanced AI features (predictive analytics)
- Automated form filling (OCR)

**Phase 4 (Q4 2024):**
- Blockchain integration (document verification)
- E-signature integration (DocuSign)
- Video conferencing (for virtual meetings)
- Marketplace for estate services
- Mobile-first redesign

### 11.2 Technical Debt

**Current Known Issues:**
- Multiple Prisma client instances (consolidate)
- No automated testing (add Jest + Cypress)
- No connection health checks
- Limited error handling in some services
- No request validation on all endpoints

**Planned Improvements:**
- Add comprehensive test suite
- Implement request validation middleware
- Add health check endpoints
- Consolidate Prisma client usage
- Add API documentation (Swagger/OpenAPI)
- Implement proper logging strategy
- Add performance monitoring (New Relic/Datadog)

---

## 12. Development Workflow

### 12.1 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/yourorg/expectedestate.git
cd expectedestate

# 2. Install dependencies
cd frontend && npm install
cd ../backend && npm install

# 3. Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# 4. Setup database
cd backend
npx prisma migrate dev
npx prisma db seed

# 5. Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# 6. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### 12.2 Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/asset-organization
# ... make changes ...
git add .
git commit -m "feat: add asset organization feature"
git push origin feature/asset-organization
# Create pull request on GitHub

# Branch naming convention
feature/feature-name    # New features
fix/bug-description     # Bug fixes
docs/documentation      # Documentation updates
refactor/code-cleanup   # Code refactoring
test/test-addition      # Test additions
```

### 12.3 Code Standards

```typescript
// TypeScript strict mode
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// ESLint configuration
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ]
}

// Prettier configuration
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 13. Documentation

### 13.1 API Documentation

**Location:** `/docs/api/`

**Tools:** Swagger/OpenAPI (planned)

**Sections:**
- Authentication
- Estates
- Assets
- Communications
- Forms
- Fax
- Documents

### 13.2 User Documentation

**Location:** `/docs/user/`

**Sections:**
- Getting Started
- Dashboard Guide
- Asset Management
- Communication Tracking
- Form Filling & Faxing
- Document Management
- Troubleshooting

### 13.3 Developer Documentation

**Location:** `/docs/developer/`

**Sections:**
- Architecture Overview (this document)
- Setup Guide
- API Reference
- Database Schema
- Deployment Guide
- Contributing Guide

---

## 14. Support & Maintenance

### 14.1 Monitoring

- **Uptime:** Vercel status page
- **Performance:** Vercel Analytics
- **Errors:** Console logs + Vercel logs
- **Database:** Neon dashboard

### 14.2 Backup & Recovery

- **Database:** Daily automated backups (Neon)
- **Code:** Git repository (GitHub)
- **Documents:** Vercel Blob Storage
- **Recovery Time Objective (RTO):** <1 hour
- **Recovery Point Objective (RPO):** <24 hours

### 14.3 Security Updates

- **Dependencies:** Weekly automated checks (Dependabot)
- **Security patches:** Applied within 48 hours
- **Vulnerability scanning:** GitHub Security Alerts
- **Penetration testing:** Quarterly (planned)

---

## Conclusion

This technical architecture provides a solid foundation for the ExpectedEstate platform with:

✅ **Scalable infrastructure** - Serverless architecture that auto-scales
✅ **Secure by design** - JWT auth, encryption, input validation
✅ **Modern tech stack** - React, TypeScript, Node.js, PostgreSQL
✅ **Clean architecture** - Layered design, service-oriented
✅ **Production-ready** - Deployed on Vercel with Neon database
✅ **Maintainable** - Clear structure, documented patterns
✅ **Extensible** - Easy to add new features and integrations

**Current Status:** MVP deployed and operational
**Next Steps:** Implement automated testing, add monitoring, scale infrastructure

---

**Document Version:** 1.0
**Last Updated:** January 20, 2026
**Maintained By:** Development Team
