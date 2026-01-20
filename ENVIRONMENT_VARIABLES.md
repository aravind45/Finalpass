# Environment Variables - Complete Reference

This document lists ALL environment variables needed for ExpectedEstate deployment.

---

## 🎯 Quick Copy-Paste Templates

### For Vercel Backend (Production)

Copy these into Vercel → Backend Project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=change-this-to-a-long-random-string-min-32-characters
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAMFAX_USERNAME=your-pamfax-username
PAMFAX_PASSWORD=your-pamfax-password
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
```

### For Vercel Frontend (Production)

Copy these into Vercel → Frontend Project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-app.vercel.app
```

---

## 📋 Backend Environment Variables

### Required (Must Have)

#### 1. DATABASE_URL
**What it is**: PostgreSQL connection string from Neon  
**Where to get it**: Neon Dashboard → Your Project → Connection String  
**Format**: `postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require`  
**Example**: `postgresql://myuser:mypass123@ep-cool-sound-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`

**How to get it:**
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection Details"
4. Copy the "Connection string" (Pooled connection recommended)
5. Make sure it ends with `?sslmode=require`

---

#### 2. JWT_SECRET
**What it is**: Secret key for signing authentication tokens  
**Where to get it**: Generate a random string  
**Format**: Any long random string (minimum 32 characters)  
**Example**: `my-super-secret-jwt-key-2024-production-xyz123`

**How to generate:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 32

# Option 3: Just make one up
# Type random characters, minimum 32 characters
```

---

#### 3. NODE_ENV
**What it is**: Tells the app it's running in production  
**Value**: `production`  
**Example**: `production`

**Always set to**: `production` (exactly as written)

---

### Optional (Recommended)

#### 4. FRONTEND_URL
**What it is**: Your frontend URL for CORS configuration  
**Where to get it**: From Vercel after deploying frontend  
**Format**: `https://your-app-name.vercel.app`  
**Example**: `https://expectedestate.vercel.app`

**How to get it:**
1. Deploy frontend first
2. Copy the URL from Vercel dashboard
3. Add it to backend environment variables
4. Redeploy backend

**Note**: If not set, CORS will allow localhost only (won't work in production)

---

#### 5. OPENAI_API_KEY
**What it is**: API key for AI features (document analysis, drafting)  
**Where to get it**: OpenAI Platform  
**Format**: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`  
**Example**: `sk-proj-abc123def456ghi789jkl012mno345pqr678`

**How to get it:**
1. Go to https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy it immediately (you can't see it again)

**Note**: App works without this, but AI features will be disabled

---

#### 6. PAMFAX_USERNAME
**What it is**: Username for PamFax fax service  
**Where to get it**: PamFax account  
**Format**: Your PamFax username  
**Example**: `john.doe@example.com`

**How to get it:**
1. Go to https://www.pamfax.biz
2. Sign up for an account
3. Use your email as username

**Note**: App works without this, but fax sending will be disabled

---

#### 7. PAMFAX_PASSWORD
**What it is**: Password for PamFax account  
**Where to get it**: Your PamFax account password  
**Format**: Your password  
**Example**: `MySecurePassword123!`

**Note**: App works without this, but fax sending will be disabled

---

#### 8. PORT
**What it is**: Port number for local development  
**Value**: `3000`  
**Example**: `3000`

**Note**: Vercel ignores this in production (uses its own port)

---

## 📋 Frontend Environment Variables

### Required (Must Have)

#### 1. VITE_API_URL
**What it is**: Backend API URL  
**Where to get it**: From Vercel after deploying backend  
**Format**: `https://your-backend-app.vercel.app`  
**Example**: `https://expectedestate-backend.vercel.app`

**How to get it:**
1. Deploy backend first
2. Copy the URL from Vercel dashboard
3. Add it to frontend `.env.production` file
4. Also add it to Vercel frontend environment variables

**Important**: 
- Must NOT end with `/api`
- Must NOT end with `/`
- Just the base URL

---

## 🔧 Local Development Environment Variables

### Backend Local (.env file)

Create `backend/.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Authentication
JWT_SECRET="local-development-secret-key-change-in-production"

# OpenAI (optional)
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# PamFax (optional)
PAMFAX_USERNAME="your-username"
PAMFAX_PASSWORD="your-password"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"

# Environment
NODE_ENV="development"

# Server
PORT=3000
```

### Frontend Local (.env.development)

Already created at `frontend/.env.development`:

```bash
# Leave empty to use Vite proxy
VITE_API_URL=
```

---

## 📝 Step-by-Step Setup

### Step 1: Get Your Database URL

1. Go to https://console.neon.tech
2. Create a new project (if you haven't)
3. Copy the connection string
4. Make sure it includes `?sslmode=require`

**Your DATABASE_URL**: `_________________________________`

---

### Step 2: Generate JWT Secret

Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Your JWT_SECRET**: `_________________________________`

---

### Step 3: Get OpenAI Key (Optional)

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy it immediately

**Your OPENAI_API_KEY**: `_________________________________`

---

### Step 4: Deploy Backend

1. Go to https://vercel.com/new
2. Import your repo
3. Set Root Directory: `backend`
4. Add these environment variables:
   - `DATABASE_URL` = (from Step 1)
   - `JWT_SECRET` = (from Step 2)
   - `OPENAI_API_KEY` = (from Step 3, optional)
   - `NODE_ENV` = `production`
5. Deploy

**Your Backend URL**: `_________________________________`

---

### Step 5: Update Frontend Config

Edit `frontend/.env.production`:
```bash
VITE_API_URL=https://your-backend-url-from-step-4.vercel.app
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "chore: configure production API URL"
git push origin main
```

---

### Step 6: Deploy Frontend

1. Go to https://vercel.com/new
2. Import same repo
3. Set Root Directory: `frontend`
4. Add environment variable:
   - `VITE_API_URL` = (your backend URL from Step 4)
5. Deploy

**Your Frontend URL**: `_________________________________`

---

### Step 7: Update Backend CORS

1. Go to Vercel → Backend Project → Settings → Environment Variables
2. Add new variable:
   - `FRONTEND_URL` = (your frontend URL from Step 6)
3. Redeploy backend (Deployments → ... → Redeploy)

---

## ✅ Verification Checklist

### Backend Environment Variables (Vercel)
- [ ] `DATABASE_URL` - Set and valid
- [ ] `JWT_SECRET` - Set (minimum 32 characters)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Set to your frontend URL
- [ ] `OPENAI_API_KEY` - Set (optional)
- [ ] `PAMFAX_USERNAME` - Set (optional)
- [ ] `PAMFAX_PASSWORD` - Set (optional)

### Frontend Environment Variables (Vercel)
- [ ] `VITE_API_URL` - Set to your backend URL

### Frontend .env.production File
- [ ] File exists at `frontend/.env.production`
- [ ] Contains `VITE_API_URL=https://your-backend.vercel.app`
- [ ] Committed to git

---

## 🐛 Troubleshooting

### "Can't connect to database"
**Problem**: DATABASE_URL is wrong or database is down  
**Solution**: 
- Check DATABASE_URL format
- Verify it ends with `?sslmode=require`
- Test connection in Neon dashboard
- Make sure database is not paused

### "JWT malformed" or "Invalid token"
**Problem**: JWT_SECRET is not set or different between deployments  
**Solution**:
- Set JWT_SECRET in Vercel
- Make sure it's the same value every time
- Redeploy backend
- Clear browser cookies and try again

### "CORS error" in browser
**Problem**: FRONTEND_URL not set in backend  
**Solution**:
- Add FRONTEND_URL to backend environment variables
- Make sure it matches your actual frontend URL exactly
- Redeploy backend
- Wait 1-2 minutes
- Clear browser cache

### "API calls fail" or "Network error"
**Problem**: VITE_API_URL not set or wrong  
**Solution**:
- Check VITE_API_URL in Vercel frontend settings
- Check frontend/.env.production file
- Make sure URL doesn't end with `/` or `/api`
- Redeploy frontend

### "AI features don't work"
**Problem**: OPENAI_API_KEY not set or invalid  
**Solution**:
- Get valid API key from OpenAI
- Add to backend environment variables
- Redeploy backend
- Check you have credits in OpenAI account

### "Can't send fax"
**Problem**: PamFax credentials not set  
**Solution**:
- Sign up for PamFax account
- Add PAMFAX_USERNAME and PAMFAX_PASSWORD
- Redeploy backend
- Make sure you have credits in PamFax account

---

## 📊 Environment Variables Summary Table

| Variable | Required | Where | Example | Purpose |
|----------|----------|-------|---------|---------|
| `DATABASE_URL` | ✅ Yes | Backend | `postgresql://...` | Database connection |
| `JWT_SECRET` | ✅ Yes | Backend | `random-32-char-string` | Auth token signing |
| `NODE_ENV` | ✅ Yes | Backend | `production` | Environment mode |
| `FRONTEND_URL` | ⚠️ Recommended | Backend | `https://app.vercel.app` | CORS configuration |
| `OPENAI_API_KEY` | ❌ Optional | Backend | `sk-proj-...` | AI features |
| `PAMFAX_USERNAME` | ❌ Optional | Backend | `user@email.com` | Fax sending |
| `PAMFAX_PASSWORD` | ❌ Optional | Backend | `password123` | Fax sending |
| `VITE_API_URL` | ✅ Yes | Frontend | `https://api.vercel.app` | Backend API URL |

---

## 🔐 Security Best Practices

1. **Never commit .env files** - They're in .gitignore
2. **Use strong JWT_SECRET** - Minimum 32 random characters
3. **Rotate secrets regularly** - Change JWT_SECRET periodically
4. **Use environment variables** - Never hardcode secrets
5. **Limit API key permissions** - Use restricted OpenAI keys
6. **Enable 2FA** - On Vercel, Neon, and OpenAI accounts
7. **Monitor usage** - Check API usage regularly
8. **Use different secrets** - Different JWT_SECRET for dev/prod

---

## 📞 Support

If you're still having issues:

1. Double-check all environment variables are set
2. Verify values don't have extra spaces or quotes
3. Check Vercel deployment logs for errors
4. Test backend health endpoint: `https://your-backend.vercel.app/api/health`
5. Check browser console for frontend errors

---

## ✨ Quick Reference Card

**Minimum Required for Basic Functionality:**
```
Backend:
  DATABASE_URL=your_neon_connection_string
  JWT_SECRET=random_32_character_string
  NODE_ENV=production
  FRONTEND_URL=your_frontend_url

Frontend:
  VITE_API_URL=your_backend_url
```

**That's it!** These 5 variables are all you need to get started.

Add OpenAI and PamFax credentials later when you need those features.

---

**Last Updated**: January 20, 2026  
**Version**: 1.0
