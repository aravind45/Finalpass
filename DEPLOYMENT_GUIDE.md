# ExpectedEstate - Complete Deployment Guide

## Overview

This guide will help you deploy both the frontend and backend to Vercel so you can test the application as an end user. The setup uses:

- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Express API (deployed to Vercel Serverless Functions)
- **Database**: PostgreSQL on Neon (already configured)

---

## Prerequisites

✅ GitHub account with your code pushed
✅ Vercel account (free tier works)
✅ Neon PostgreSQL database (you already have this)

---

## Deployment Strategy

We'll deploy **TWO separate Vercel projects**:

1. **Backend API** - `https://your-backend.vercel.app`
2. **Frontend App** - `https://your-frontend.vercel.app`

This is simpler and more reliable than trying to deploy both in one project.

---

## Part 1: Deploy Backend API

### Step 1: Prepare Backend for Deployment

First, let's make sure the backend is ready:

```bash
cd backend
```

### Step 2: Create Vercel Project for Backend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Configure the project:**
   - **Project Name**: `expectedestate-backend` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: Leave empty (serverless function)
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key
PAMFAX_USERNAME=your_pamfax_username
PAMFAX_PASSWORD=your_pamfax_password
NODE_ENV=production
```

**Important:** Get your `DATABASE_URL` from Neon dashboard (it should look like `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)

### Step 4: Deploy Backend

Click **"Deploy"** and wait for it to complete.

Your backend will be available at: `https://expectedestate-backend.vercel.app`

### Step 5: Test Backend API

Open your browser and test:
```
https://expectedestate-backend.vercel.app/api/health
```

You should see: `{"status":"ok"}`

---

## Part 2: Deploy Frontend

### Step 1: Update Frontend API Configuration

Before deploying frontend, we need to tell it where the backend is.

Create/update `frontend/.env.production`:

```bash
VITE_API_URL=https://expectedestate-backend.vercel.app
```

### Step 2: Update Frontend Code to Use Environment Variable

The frontend needs to use the production API URL. Let's check if it's configured correctly.

In your frontend code, API calls should use:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '';
```

### Step 3: Create Vercel Project for Frontend

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"** (again, for frontend)
3. Import the **same** GitHub repository
4. **Configure the project:**
   - **Project Name**: `expectedestate` (or your choice)
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Add Frontend Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://expectedestate-backend.vercel.app
```

### Step 5: Deploy Frontend

Click **"Deploy"** and wait for it to complete.

Your frontend will be available at: `https://expectedestate.vercel.app`

---

## Part 3: Configure CORS

The backend needs to allow requests from your frontend domain.

### Update Backend CORS Configuration

In `backend/src/index.ts`, update the CORS configuration:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://expectedestate.vercel.app',  // Add your frontend URL
    'https://your-custom-domain.com'      // If you have a custom domain
  ],
  credentials: true
}));
```

Commit and push this change - Vercel will auto-redeploy.

---

## Part 4: Test the Full Application

### 1. Open Your Frontend
Go to: `https://expectedestate.vercel.app`

### 2. Register a New Account
- Click "Register"
- Fill in your details
- Select role (Executor/Administrator)
- Create account

### 3. Create an Estate
- After login, you'll be on the dashboard
- Go to "Intake" to create a new estate
- Fill in deceased information
- Upload documents (optional)

### 4. Add Assets
- Go to "Assets" page
- Click "Add Asset"
- Add a test asset (e.g., "Chase Checking - $10,000")

### 5. Test Communication Logging
- Click on an asset
- Log a communication
- Check if it appears in the communication history

### 6. Test Follow-up System
- Go back to Dashboard
- Check if the Follow-up Widget shows any items
- (It will show items after 7+ days of no contact)

### 7. Test Forms & Fax
- Go to an asset detail page
- Check if forms are available
- Try filling and sending a fax (if you have PamFax configured)

---

## Part 5: Database Migrations

The database migrations should run automatically during deployment via the `vercel-build` script.

If you need to run migrations manually:

```bash
cd backend
npx prisma migrate deploy
```

Or run them directly in Vercel:
1. Go to your backend project in Vercel
2. Go to Settings → Functions
3. Add a new function or use the deployment logs to verify migrations ran

---

## Part 6: Monitoring & Debugging

### View Backend Logs
1. Go to Vercel dashboard
2. Select your backend project
3. Click "Deployments"
4. Click on the latest deployment
5. View "Functions" logs

### View Frontend Logs
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls

### Common Issues

**Issue: API calls fail with CORS error**
- Solution: Make sure backend CORS includes your frontend URL
- Redeploy backend after updating CORS

**Issue: Database connection fails**
- Solution: Check DATABASE_URL in Vercel environment variables
- Make sure it includes `?sslmode=require`

**Issue: Frontend shows blank page**
- Solution: Check browser console for errors
- Verify VITE_API_URL is set correctly
- Check if backend is responding at `/api/health`

**Issue: Authentication doesn't work**
- Solution: Check JWT_SECRET is set in backend
- Clear browser cookies and try again
- Check if backend `/api/auth/register` endpoint works

---

## Part 7: Custom Domain (Optional)

### Add Custom Domain to Frontend
1. Go to Vercel dashboard → Your frontend project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `app.expectedestate.com`)
4. Follow DNS configuration instructions

### Add Custom Domain to Backend
1. Go to Vercel dashboard → Your backend project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `api.expectedestate.com`)
4. Update frontend `VITE_API_URL` to use new domain
5. Update backend CORS to include new frontend domain

---

## Quick Reference

### Backend URLs
- Production: `https://expectedestate-backend.vercel.app`
- Health Check: `https://expectedestate-backend.vercel.app/api/health`
- API Base: `https://expectedestate-backend.vercel.app/api`

### Frontend URLs
- Production: `https://expectedestate.vercel.app`
- Local Dev: `http://localhost:5173`

### Important Files
- Backend Config: `backend/vercel.json`
- Frontend Config: `frontend/.env.production`
- Database Schema: `backend/prisma/schema.prisma`
- CORS Config: `backend/src/index.ts`

---

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Backend health check responds
- [ ] Frontend loads without errors
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Dashboard shows correctly
- [ ] Can create estate
- [ ] Can add assets
- [ ] Can log communications
- [ ] Follow-up widget displays
- [ ] Can view asset details
- [ ] Forms are available
- [ ] Can navigate between pages
- [ ] Logout works

---

## Troubleshooting Commands

### Check Backend Deployment
```bash
curl https://expectedestate-backend.vercel.app/api/health
```

### Check Database Connection
```bash
cd backend
npx prisma db pull
```

### Rebuild Frontend Locally
```bash
cd frontend
npm run build
npm run preview
```

### View Vercel Logs
```bash
vercel logs expectedestate-backend
vercel logs expectedestate
```

---

## Next Steps After Deployment

1. **Test thoroughly** - Go through all features as an end user
2. **Monitor errors** - Check Vercel logs regularly
3. **Set up analytics** - Add Google Analytics or similar
4. **Configure backups** - Set up Neon database backups
5. **Add monitoring** - Use Vercel Analytics or Sentry
6. **Optimize performance** - Check Lighthouse scores
7. **Add custom domain** - For professional appearance

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test backend API endpoints directly
5. Check database connection in Neon dashboard

---

## Summary

You now have:
- ✅ Backend API deployed on Vercel
- ✅ Frontend app deployed on Vercel
- ✅ Database on Neon (PostgreSQL)
- ✅ Automatic deployments on git push
- ✅ Full application accessible to end users

**Your live application:** `https://expectedestate.vercel.app`

Test it thoroughly and enjoy! 🎉
