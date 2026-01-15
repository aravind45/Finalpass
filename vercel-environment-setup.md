# Vercel Environment Variables for Estate Settlement Platform

## Required Environment Variables

### Database Configuration
```bash
# PostgreSQL Database (recommend Supabase or Neon for Vercel)
DATABASE_URL="postgresql://username:password@host:port/database"
DATABASE_DIRECT_URL="postgresql://username:password@host:port/database" # For migrations

# Alternative: Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Authentication
```bash
# NextAuth.js configuration
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key-32-chars-min"

# OAuth providers (optional for MVP)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### File Storage & Document Management
```bash
# AWS S3 for document storage (recommended for security)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="estate-documents-bucket"

# Alternative: Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Email Services
```bash
# SendGrid for transactional emails
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"

# Alternative: Resend
RESEND_API_KEY="your-resend-api-key"
```

### Communication & Notifications
```bash
# Twilio for SMS notifications (optional)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Slack for internal notifications
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/your/webhook/url"
```

### External APIs
```bash
# OpenAI for document analysis and AI features
OPENAI_API_KEY="your-openai-api-key"

# Stripe for payments
STRIPE_PUBLISHABLE_KEY="pk_live_or_test_key"
STRIPE_SECRET_KEY="sk_live_or_test_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

### Security & Encryption
```bash
# Document encryption
ENCRYPTION_KEY="your-32-character-encryption-key"
ENCRYPTION_IV="your-16-character-iv"

# JWT secrets
JWT_SECRET="your-jwt-secret-key"
```

### Monitoring & Analytics
```bash
# Sentry for error tracking
SENTRY_DSN="https://your-sentry-dsn"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# PostHog for analytics
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### Environment-Specific
```bash
# Environment identifier
NODE_ENV="production"
VERCEL_ENV="production" # Set automatically by Vercel

# App configuration
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_NAME="Estate Settlement Platform"
```

## Vercel-Specific Configuration

### vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/follow-up-communications",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/escalation-check",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Environment Variable Setup in Vercel Dashboard

#### 1. Production Environment
```bash
# Set these in Vercel Dashboard > Settings > Environment Variables
# Target: Production

DATABASE_URL=postgresql://prod-connection-string
NEXTAUTH_SECRET=your-production-secret
STRIPE_SECRET_KEY=sk_live_your_live_key
SENDGRID_API_KEY=your-production-sendgrid-key
AWS_ACCESS_KEY_ID=your-production-aws-key
OPENAI_API_KEY=your-openai-key
```

#### 2. Preview Environment
```bash
# Target: Preview (for staging/testing)

DATABASE_URL=postgresql://staging-connection-string
NEXTAUTH_SECRET=your-staging-secret
STRIPE_SECRET_KEY=sk_test_your_test_key
SENDGRID_API_KEY=your-staging-sendgrid-key
AWS_ACCESS_KEY_ID=your-staging-aws-key
OPENAI_API_KEY=your-openai-key
```

#### 3. Development Environment
```bash
# Target: Development (for local development)

DATABASE_URL=postgresql://localhost:5432/estate_dev
NEXTAUTH_SECRET=dev-secret-key-for-local-development
STRIPE_SECRET_KEY=sk_test_your_test_key
SENDGRID_API_KEY=your-dev-sendgrid-key
```

## Security Best Practices

### 1. Secret Generation
```bash
# Generate secure secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -hex 32     # For ENCRYPTION_KEY
openssl rand -hex 16     # For ENCRYPTION_IV
```

### 2. Environment Variable Validation
```typescript
// lib/env.ts - Validate environment variables at build time
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  SENDGRID_API_KEY: z.string().startsWith('SG.'),
  AWS_ACCESS_KEY_ID: z.string().min(16),
  AWS_SECRET_ACCESS_KEY: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().regex(/^sk_(live|test)_/),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
});

export const env = envSchema.parse(process.env);
```

### 3. Runtime Environment Check
```typescript
// lib/config.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isPreview: process.env.VERCEL_ENV === 'preview',
  
  database: {
    url: process.env.DATABASE_URL!,
  },
  
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
  },
  
  storage: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET!,
  },
  
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY!,
    fromEmail: process.env.SENDGRID_FROM_EMAIL!,
  },
  
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY!,
  },
  
  payments: {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
};
```

## Deployment Checklist

### Before First Deploy
- [ ] Set up production database (Supabase/Neon)
- [ ] Configure AWS S3 bucket for document storage
- [ ] Set up SendGrid account and verify domain
- [ ] Create Stripe account and get API keys
- [ ] Generate all required secrets
- [ ] Set up Sentry project for error tracking

### Environment Variables Checklist
- [ ] DATABASE_URL (production database)
- [ ] NEXTAUTH_SECRET (32+ character secret)
- [ ] NEXTAUTH_URL (your domain)
- [ ] AWS credentials and S3 bucket
- [ ] SENDGRID_API_KEY and from email
- [ ] STRIPE keys (live for production)
- [ ] OPENAI_API_KEY
- [ ] ENCRYPTION_KEY and IV

### Post-Deploy Verification
- [ ] Database connection works
- [ ] File uploads work (document storage)
- [ ] Email sending works
- [ ] Authentication works
- [ ] Payment processing works (if implemented)
- [ ] Error tracking works

## Common Issues & Solutions

### 1. Database Connection Issues
```bash
# Make sure DATABASE_URL includes SSL for production
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

### 2. File Upload Issues
```bash
# Ensure AWS credentials have S3 permissions
# Bucket policy should allow your AWS user to read/write
```

### 3. Email Delivery Issues
```bash
# Verify your domain with SendGrid
# Check SPF/DKIM records are set up
```

### 4. Build-Time Environment Variables
```bash
# Variables starting with NEXT_PUBLIC_ are available in browser
# Keep sensitive keys server-side only
NEXT_PUBLIC_APP_URL="https://yourdomain.com"  # OK for browser
STRIPE_SECRET_KEY="sk_live_..."               # Server-side only
```

This setup provides a secure, scalable foundation for your Estate Settlement Platform on Vercel with proper environment variable management.