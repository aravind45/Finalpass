# Environment Variables Setup Checklist

Use this checklist to set up all environment variables correctly.

---

## 🎯 Backend Environment Variables (Vercel)

Go to: Vercel Dashboard → Your Backend Project → Settings → Environment Variables

### Required Variables

- [ ] **DATABASE_URL**
  ```
  Name: DATABASE_URL
  Value: postgresql://user:pass@host.neon.tech/db?sslmode=require
  ```
  Get from: Neon Dashboard → Connection String

- [ ] **JWT_SECRET**
  ```
  Name: JWT_SECRET
  Value: (generate random 32+ character string)
  ```
  Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- [ ] **NODE_ENV**
  ```
  Name: NODE_ENV
  Value: production
  ```
  Always: `production` (exactly as written)

- [ ] **FRONTEND_URL**
  ```
  Name: FRONTEND_URL
  Value: https://your-frontend-app.vercel.app
  ```
  Get from: Vercel Dashboard after deploying frontend

### Optional Variables (for full features)

- [ ] **OPENAI_API_KEY** (for AI features)
  ```
  Name: OPENAI_API_KEY
  Value: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
  ```
  Get from: https://platform.openai.com/api-keys

- [ ] **PAMFAX_USERNAME** (for fax sending)
  ```
  Name: PAMFAX_USERNAME
  Value: your-pamfax-email@example.com
  ```
  Get from: https://www.pamfax.biz (sign up)

- [ ] **PAMFAX_PASSWORD** (for fax sending)
  ```
  Name: PAMFAX_PASSWORD
  Value: your-pamfax-password
  ```
  Get from: Your PamFax account

---

## 🎯 Frontend Environment Variables (Vercel)

Go to: Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

### Required Variables

- [ ] **VITE_API_URL**
  ```
  Name: VITE_API_URL
  Value: https://your-backend-app.vercel.app
  ```
  Get from: Vercel Dashboard after deploying backend
  
  **Important**: 
  - Do NOT end with `/api`
  - Do NOT end with `/`
  - Just the base URL

---

## 📝 Frontend .env.production File

- [ ] **Create/Update file**: `frontend/.env.production`
  ```bash
  VITE_API_URL=https://your-backend-app.vercel.app
  ```

- [ ] **Commit to git**:
  ```bash
  git add frontend/.env.production
  git commit -m "chore: configure production API URL"
  git push origin main
  ```

---

## ✅ Verification Steps

### Test Backend
- [ ] Open: `https://your-backend-app.vercel.app/api/health`
- [ ] Should see: `{"status":"ok"}`

### Test Frontend
- [ ] Open: `https://your-frontend-app.vercel.app`
- [ ] Should see: Login/Register page
- [ ] No errors in browser console (F12)

### Test Registration
- [ ] Click "Register"
- [ ] Fill in details
- [ ] Submit
- [ ] Should create account successfully

### Test Login
- [ ] Enter credentials
- [ ] Click "Login"
- [ ] Should redirect to dashboard

### Test Dashboard
- [ ] Dashboard loads
- [ ] See your name
- [ ] See stats cards
- [ ] No CORS errors

---

## 🐛 Common Issues

### Issue: "Can't connect to database"
- [ ] Check DATABASE_URL is correct
- [ ] Verify it ends with `?sslmode=require`
- [ ] Check database is not paused in Neon

### Issue: "CORS error"
- [ ] Check FRONTEND_URL is set in backend
- [ ] Verify it matches your actual frontend URL
- [ ] Redeploy backend
- [ ] Clear browser cache

### Issue: "API calls fail"
- [ ] Check VITE_API_URL is set in frontend
- [ ] Verify backend URL is correct
- [ ] Test backend health endpoint
- [ ] Check browser console for errors

### Issue: "Invalid token" or "JWT malformed"
- [ ] Check JWT_SECRET is set in backend
- [ ] Make sure it's at least 32 characters
- [ ] Redeploy backend
- [ ] Clear browser cookies

---

## 📋 Quick Copy Template

### For Backend (Vercel)
```
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
JWT_SECRET=your-random-32-character-string-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
OPENAI_API_KEY=sk-proj-xxxxx (optional)
PAMFAX_USERNAME=your-username (optional)
PAMFAX_PASSWORD=your-password (optional)
```

### For Frontend (Vercel)
```
VITE_API_URL=https://your-backend.vercel.app
```

### For frontend/.env.production (File)
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🎯 Minimum Required Setup

**To get the app working with basic features:**

**Backend (4 variables):**
1. DATABASE_URL
2. JWT_SECRET
3. NODE_ENV
4. FRONTEND_URL

**Frontend (1 variable):**
1. VITE_API_URL

**That's it!** Add OpenAI and PamFax later when needed.

---

## 📞 Need Help?

1. See full documentation: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
2. Check deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Review troubleshooting: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

**Status**: ⬜ Not Started  ⬜ In Progress  ⬜ Complete

**Date Completed**: _______________
