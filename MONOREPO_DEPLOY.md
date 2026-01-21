# Monorepo Deployment Guide

## ✅ What Changed

Your project is now configured as a **monorepo** - one deployment for both frontend and backend!

**Benefits:**
- Single Vercel project instead of two
- No environment variables needed (`VITE_API_URL` removed)
- No CORS configuration needed
- API calls use relative paths (`/api`)
- Simpler to manage and deploy

## 🚀 How to Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Delete old projects** (optional but recommended):
   - Go to https://vercel.com/dashboard
   - Delete `finalpass-frontend` project
   - Delete `finalpass-backend` project

2. **Create new unified project**:
   - Go to https://vercel.com/new
   - Import your GitHub repository: `aravind45/Finalpass`
   - Click **Import**

3. **Configure project**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run vercel-build` (auto-detected)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install` (auto-detected)

4. **Add environment variables**:
   Click **Environment Variables** and add:
   - `DATABASE_URL` = Your Neon PostgreSQL URL
   - `ENCRYPTION_KEY` = Your 32-character key
   - `JWT_SECRET` = Your JWT secret
   - `NODE_ENV` = `production`
   - Optional: `GROQ_API_KEY`, `GOOGLE_VERTEX_AI_PROJECT_ID`, etc.

5. **Deploy**:
   - Click **Deploy**
   - Wait for deployment to complete (2-3 minutes)

6. **Test**:
   - Visit your deployment URL
   - Try registering a new account
   - Everything should work!

### Option 2: Vercel CLI

```bash
# From project root
vercel --prod
```

Follow the prompts and add environment variables when asked.

## 📋 Environment Variables Needed

Only **backend** environment variables are needed now:

- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `ENCRYPTION_KEY` - 32-character random string
- `JWT_SECRET` - Random string for JWT signing
- `NODE_ENV` - `production`
- Optional: `GROQ_API_KEY`, `GOOGLE_VERTEX_AI_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS_JSON`

**No frontend environment variables needed!** ✅

## 🔧 How It Works

### Routing
- `/` → Frontend (Vite app)
- `/api/*` → Backend (Express API)

### API Calls
Frontend makes requests to `/api/auth/login`, `/api/estates`, etc.
Vercel routes these to the backend automatically.

### Same Origin
Since frontend and backend are on the same domain, no CORS issues!

## 🎯 Next Steps

1. Deploy using one of the methods above
2. Test registration and login
3. Enjoy your simplified deployment! 🎉

---

**Need help?** Check the Vercel deployment logs if something goes wrong.
