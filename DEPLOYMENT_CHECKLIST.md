# Deployment Checklist ✅

Use this checklist to deploy ExpectedEstate step by step.

---

## Pre-Deployment

- [ ] Code is pushed to GitHub main branch
- [ ] You have a Vercel account
- [ ] You have a Neon PostgreSQL database
- [ ] You have your DATABASE_URL from Neon

---

## Backend Deployment

### 1. Create Vercel Project
- [ ] Go to https://vercel.com/new
- [ ] Import your GitHub repository
- [ ] Set **Root Directory** to `backend`
- [ ] Set **Build Command** to `npm run vercel-build`
- [ ] Click "Deploy"

### 2. Add Environment Variables
Go to Project Settings → Environment Variables and add:

- [ ] `DATABASE_URL` = Your Neon PostgreSQL connection string
- [ ] `JWT_SECRET` = Any random string (e.g., `my-super-secret-key-123`)
- [ ] `OPENAI_API_KEY` = Your OpenAI API key (if you have one)
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = (Leave empty for now, will add after frontend deployment)

### 3. Verify Backend Works
- [ ] Copy your backend URL (e.g., `https://expectedestate-backend.vercel.app`)
- [ ] Test health endpoint: `https://your-backend.vercel.app/api/health`
- [ ] Should see: `{"status":"ok"}`

---

## Frontend Deployment

### 1. Update Frontend Config
- [ ] Edit `frontend/.env.production`
- [ ] Set `VITE_API_URL=https://your-backend.vercel.app` (use your actual backend URL)
- [ ] Commit and push:
  ```bash
  git add frontend/.env.production
  git commit -m "chore: configure production API URL"
  git push origin main
  ```

### 2. Create Vercel Project
- [ ] Go to https://vercel.com/new (again)
- [ ] Import the SAME GitHub repository
- [ ] Set **Root Directory** to `frontend`
- [ ] Set **Framework Preset** to `Vite`
- [ ] Set **Build Command** to `npm run build`
- [ ] Set **Output Directory** to `dist`
- [ ] Click "Deploy"

### 3. Add Environment Variables
Go to Project Settings → Environment Variables and add:

- [ ] `VITE_API_URL` = Your backend URL (e.g., `https://expectedestate-backend.vercel.app`)

### 4. Verify Frontend Works
- [ ] Copy your frontend URL (e.g., `https://expectedestate.vercel.app`)
- [ ] Open it in browser
- [ ] Should see the login/register page

---

## Connect Frontend & Backend

### 1. Update Backend CORS
- [ ] Go back to Vercel → Backend Project → Settings → Environment Variables
- [ ] Add/Update `FRONTEND_URL` = Your frontend URL (e.g., `https://expectedestate.vercel.app`)
- [ ] Redeploy backend (Deployments → Click "..." → Redeploy)

### 2. Wait for Redeployment
- [ ] Wait 1-2 minutes for backend to redeploy
- [ ] Check deployment status in Vercel dashboard

---

## Test the Application

### 1. Basic Functionality
- [ ] Open your frontend URL
- [ ] Click "Register"
- [ ] Create a new account (use real email format)
- [ ] Should redirect to role selection
- [ ] Select "Executor" or "Administrator"
- [ ] Should redirect to dashboard

### 2. Dashboard
- [ ] Dashboard loads without errors
- [ ] See welcome message with your name
- [ ] See stats cards (Total Assets, Est. Value, etc.)
- [ ] No console errors in browser DevTools (F12)

### 3. Create Estate
- [ ] Click "Intake" in sidebar
- [ ] Fill in estate information
- [ ] Upload a test document (optional)
- [ ] Click "Submit"
- [ ] Should see success message

### 4. Add Asset
- [ ] Go to "Assets" page
- [ ] Click "Add Asset" (if available)
- [ ] Or go back to dashboard and see assets

### 5. Asset Details
- [ ] Click on an asset
- [ ] Should see asset detail page
- [ ] See communication log section
- [ ] See forms section (if available)

### 6. Log Communication
- [ ] On asset detail page, click "Log Communication"
- [ ] Fill in communication details
- [ ] Submit
- [ ] Should appear in communication history

### 7. Follow-up Widget
- [ ] Go back to dashboard
- [ ] Check if Follow-up Widget appears
- [ ] (May be empty if no assets need follow-up yet)

### 8. Navigation
- [ ] Test all sidebar links
- [ ] Dashboard ✓
- [ ] Assets ✓
- [ ] Communications ✓
- [ ] Documents ✓
- [ ] Discovery ✓
- [ ] Family ✓
- [ ] Checklist ✓

### 9. Logout & Login
- [ ] Click logout
- [ ] Should redirect to login page
- [ ] Login with your credentials
- [ ] Should return to dashboard

---

## Troubleshooting

### If Registration Fails
- [ ] Open browser DevTools (F12) → Console
- [ ] Check for error messages
- [ ] Go to Network tab → Look for failed requests
- [ ] Check backend logs in Vercel dashboard
- [ ] Verify DATABASE_URL is correct in backend environment variables

### If CORS Errors Appear
- [ ] Verify FRONTEND_URL is set in backend environment variables
- [ ] Make sure it matches your actual frontend URL exactly
- [ ] Redeploy backend after updating environment variables
- [ ] Clear browser cache and try again

### If Page is Blank
- [ ] Open browser DevTools (F12) → Console
- [ ] Look for JavaScript errors
- [ ] Check Network tab for failed API calls
- [ ] Verify VITE_API_URL is set correctly in frontend
- [ ] Test backend health endpoint directly

### If Database Errors
- [ ] Check DATABASE_URL format: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`
- [ ] Verify database is accessible from Vercel
- [ ] Check Neon dashboard for connection issues
- [ ] Run migrations: Check backend deployment logs

---

## Post-Deployment

### 1. Save Your URLs
Write down these URLs for future reference:

- **Frontend**: ___________________________________
- **Backend**: ___________________________________
- **Database**: (Neon dashboard URL)

### 2. Set Up Monitoring
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error tracking (Sentry, optional)
- [ ] Monitor backend logs regularly

### 3. Configure Custom Domain (Optional)
- [ ] Purchase domain (e.g., expectedestate.com)
- [ ] Add to Vercel frontend project
- [ ] Add to Vercel backend project (api.expectedestate.com)
- [ ] Update environment variables with new URLs

### 4. Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable 2FA on Vercel account
- [ ] Review Neon database security settings
- [ ] Set up database backups in Neon

---

## Automatic Deployments

After initial setup, deployments are automatic:

```bash
# Make changes to your code
git add .
git commit -m "your changes"
git push origin main
```

Vercel will automatically:
- Detect the push
- Build frontend and backend
- Run tests (if configured)
- Deploy to production
- Update your live site

---

## Success! 🎉

If all checkboxes are checked, your application is live and ready to use!

**Share your app**: Send your frontend URL to users to test.

**Next steps**:
1. Add more test data
2. Test all features thoroughly
3. Gather user feedback
4. Iterate and improve

---

## Quick Reference

### Vercel Dashboard
- Frontend: https://vercel.com/dashboard
- Backend: https://vercel.com/dashboard

### Useful Commands
```bash
# View backend logs
vercel logs expectedestate-backend

# View frontend logs  
vercel logs expectedestate

# Redeploy backend
vercel --prod --force

# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm run dev
```

### Support Resources
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: ⬜ In Progress  ⬜ Complete  ⬜ Issues
