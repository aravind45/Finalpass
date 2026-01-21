# Single Deployment (Monorepo) Guide

Deploy both frontend and backend together on a single Vercel project.

---

## ✅ Benefits of Monorepo Deployment

- ✅ Single URL for everything
- ✅ No CORS issues (same domain)
- ✅ Simpler environment variables
- ✅ Easier to manage
- ✅ One deployment instead of two

---

## 🚀 How It Works

**Single Domain Setup:**
```
https://your-app.vercel.app/          → Frontend (React)
https://your-app.vercel.app/api/*     → Backend (Express API)
```

All API calls go to `/api/*` on the same domain - no CORS needed!

---

## 📋 Deployment Steps

### Step 1: Delete Old Deployments (Optional)

If you have separate frontend/backend deployments:

1. Go to Vercel Dashboard
2. Delete the old backend project
3. Delete the old frontend project

### Step 2: Deploy Monorepo

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Important:** Set **Root Directory** to `.` (root, not backend or frontend)
4. Vercel should auto-detect the monorepo setup
5. Add Environment Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_Ksf1g8wlXzSW@ep-wispy-band-ah3ncdqb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-random-32-character-string
NODE_ENV=production
LLM_PROVIDER=groq
LLM_API_KEY=your_groq_api_key
LLM_MODEL=llama-3.3-70b-versatile
PAMFAX_USERNAME=your_pamfax_username
PAMFAX_PASSWORD=your_pamfax_password
```

6. Click **Deploy**

### Step 3: Test Your Deployment

1. **Frontend:**
   ```
   https://your-app.vercel.app
   ```
   Should show login/register page

2. **Backend API:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok"}`

3. **Full Test:**
   - Register new account
   - Login
   - Should work without CORS errors!

---

## 🔧 Configuration Files

### Root vercel.json

```json
{
    "version": 2,
    "builds": [
        {
            "src": "backend/src/index.ts",
            "use": "@vercel/node",
            "config": {
                "includeFiles": ["backend/prisma/**", "backend/forms/**"]
            }
        },
        {
            "src": "frontend/package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "frontend/dist"
            }
        }
    ],
    "routes": [
        {
            "src": "/api/(.*)",
            "dest": "backend/src/index.ts"
        },
        {
            "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
            "dest": "frontend/$1"
        },
        {
            "src": "/(.*)",
            "dest": "frontend/index.html"
        }
    ],
    "env": {
        "NODE_ENV": "production"
    }
}
```

### frontend/.env.production

```bash
# Leave empty for monorepo deployment
VITE_API_URL=
```

When `VITE_API_URL` is empty, the frontend uses relative paths (`/api/*`), which works perfectly in monorepo!

---

## 🐛 Troubleshooting Login Issues

### Issue 1: "Cannot POST /api/auth/login"

**Cause:** API routes not configured correctly

**Solution:**
1. Check `vercel.json` has the `/api/(.*)` route
2. Redeploy
3. Clear browser cache

### Issue 2: "Network Error" or "Failed to fetch"

**Cause:** Frontend trying to call wrong API URL

**Solution:**
1. Check `frontend/.env.production` has `VITE_API_URL=` (empty)
2. Rebuild frontend:
   ```bash
   cd frontend
   npm run build
   ```
3. Commit and push
4. Vercel will auto-redeploy

### Issue 3: "CORS Error"

**Cause:** CORS blocking same-origin requests (shouldn't happen)

**Solution:**
1. Check browser DevTools → Network tab
2. Look at the request URL
3. If it's calling an external domain, check `VITE_API_URL`
4. Should be empty or not set

### Issue 4: "401 Unauthorized" or "Invalid token"

**Cause:** JWT_SECRET not set or different

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `JWT_SECRET` is set
3. Redeploy
4. Clear browser cookies
5. Try registering a new account

### Issue 5: "Database connection failed"

**Cause:** DATABASE_URL not set

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `DATABASE_URL` is set correctly
3. Test connection locally first
4. Redeploy

---

## 🔍 Debug Checklist

If login doesn't work, check these in order:

- [ ] **Frontend loads:** Open https://your-app.vercel.app
- [ ] **Backend responds:** Open https://your-app.vercel.app/api/health
- [ ] **Environment variables set:** Check Vercel dashboard
- [ ] **VITE_API_URL is empty:** Check frontend/.env.production
- [ ] **No CORS errors:** Check browser console (F12)
- [ ] **API calls go to /api/*:** Check Network tab in DevTools
- [ ] **JWT_SECRET is set:** Check Vercel environment variables
- [ ] **Database connected:** Check backend logs in Vercel

---

## 📊 How to Check What's Wrong

### 1. Open Browser DevTools (F12)

**Console Tab:**
- Look for JavaScript errors
- Look for API errors

**Network Tab:**
- Click on the failed request
- Check the URL (should be `/api/auth/login`, not external)
- Check the response
- Check the status code

### 2. Check Vercel Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on latest deployment
5. Click "View Function Logs"
6. Look for errors

### 3. Test API Directly

Open these URLs in your browser:

```
https://your-app.vercel.app/api/health
```

Should return: `{"status":"ok"}`

If this doesn't work, the backend isn't deployed correctly.

---

## 🎯 Expected Behavior

### Registration Flow

1. User fills registration form
2. Frontend sends POST to `/api/auth/register`
3. Backend creates user in database
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. Frontend redirects to role selection

### Login Flow

1. User fills login form
2. Frontend sends POST to `/api/auth/login`
3. Backend verifies credentials
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. Frontend redirects to dashboard

### If It Fails

Check browser console and network tab to see where it fails.

---

## 🔧 Quick Fixes

### Fix 1: Rebuild and Redeploy

```bash
git add -A
git commit -m "fix: update monorepo configuration"
git push origin main
```

Vercel will auto-redeploy.

### Fix 2: Clear Browser Data

1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh page
5. Try again

### Fix 3: Check Environment Variables

```bash
# In Vercel Dashboard
Settings → Environment Variables

Required:
- DATABASE_URL ✓
- JWT_SECRET ✓
- NODE_ENV ✓

Optional:
- LLM_PROVIDER
- LLM_API_KEY
- PAMFAX_USERNAME
- PAMFAX_PASSWORD
```

### Fix 4: Test Locally First

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

If it works locally but not on Vercel, it's an environment variable issue.

---

## ✅ Success Indicators

Your monorepo deployment is working when:

- ✅ Frontend loads at `https://your-app.vercel.app`
- ✅ Backend responds at `https://your-app.vercel.app/api/health`
- ✅ Can register new account
- ✅ Can login successfully
- ✅ Dashboard loads after login
- ✅ No CORS errors in console
- ✅ All API calls go to `/api/*` (same domain)

---

## 📝 Environment Variables Summary

**For Monorepo Deployment:**

```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=random-32-character-string
NODE_ENV=production
LLM_PROVIDER=groq
LLM_API_KEY=your_groq_key
LLM_MODEL=llama-3.3-70b-versatile
PAMFAX_USERNAME=your_username
PAMFAX_PASSWORD=your_password
```

**No FRONTEND_URL needed** - it's the same domain!

**No VITE_API_URL needed** - leave empty for relative paths!

---

## 🎉 Benefits You Get

1. **Simpler:** One deployment instead of two
2. **Faster:** No CORS preflight requests
3. **Cheaper:** One Vercel project instead of two
4. **Easier:** Fewer environment variables to manage
5. **Better:** Same-origin security benefits

---

## 📞 Still Having Issues?

1. Share the error message from browser console
2. Share the URL you're trying to access
3. Share what happens when you try to login
4. Check Vercel deployment logs
5. Test the `/api/health` endpoint

---

**Last Updated:** January 20, 2026  
**Status:** Monorepo configuration ready
