# Common Deployment Errors & Solutions

This guide helps you fix common errors during Vercel deployment.

---

## ✅ Error Fixed: "prisma: command not found"

**Error Message:**
```
sh: line 1: prisma: command not found
npm error Lifecycle script `vercel-build` failed with error
npm error code 127
```

**Solution:** ✅ FIXED in latest commit
- Added `prisma` package to backend dependencies
- Updated build script to use `npx prisma`
- Push the latest code and redeploy

**Action:**
```bash
git pull origin main
# Then redeploy in Vercel dashboard
```

---

## 🔧 Other Common Errors

### 1. "Cannot find module '@prisma/client'"

**Error:**
```
Error: Cannot find module '@prisma/client'
```

**Cause:** Prisma client not generated

**Solution:**
1. Make sure `vercel-build` script runs `prisma generate`
2. Check that `@prisma/client` is in dependencies
3. Redeploy

**Verify in package.json:**
```json
"scripts": {
  "vercel-build": "npx prisma generate && npx prisma migrate deploy && tsc"
}
```

---

### 2. "Database connection failed"

**Error:**
```
Error: Can't reach database server
P1001: Can't reach database server at `xxx.neon.tech`
```

**Cause:** DATABASE_URL not set or incorrect

**Solution:**
1. Go to Vercel → Project → Settings → Environment Variables
2. Check `DATABASE_URL` is set
3. Verify it ends with `?sslmode=require`
4. Test connection in Neon dashboard
5. Redeploy

**Correct format:**
```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

### 3. "Migration failed"

**Error:**
```
Error: Migration failed to apply
```

**Cause:** Database schema out of sync

**Solution:**
1. Check migrations exist in `backend/prisma/migrations/`
2. Verify DATABASE_URL is correct
3. Try running migrations manually:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
4. If that works, redeploy on Vercel

---

### 4. "Build failed - TypeScript errors"

**Error:**
```
error TS2307: Cannot find module 'xxx'
```

**Cause:** Missing dependencies or type definitions

**Solution:**
1. Check all imports are correct
2. Run locally first:
   ```bash
   cd backend
   npm run build
   ```
3. Fix any TypeScript errors
4. Commit and push

---

### 5. "Function timeout"

**Error:**
```
Task timed out after 10.00 seconds
```

**Cause:** Function taking too long (database connection, migrations)

**Solution:**
1. Check DATABASE_URL is correct
2. Verify database is not paused in Neon
3. Increase timeout in vercel.json:
   ```json
   "functions": {
     "backend/src/index.ts": {
       "maxDuration": 30
     }
   }
   ```

---

### 6. "CORS error" (Frontend)

**Error in browser console:**
```
Access to fetch at 'https://backend.vercel.app/api/...' from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```

**Cause:** FRONTEND_URL not set in backend

**Solution:**
1. Go to Vercel → Backend Project → Settings → Environment Variables
2. Add `FRONTEND_URL` = your frontend URL
3. Redeploy backend
4. Wait 1-2 minutes
5. Clear browser cache

---

### 7. "API calls return 404"

**Error in browser:**
```
GET https://backend.vercel.app/api/health 404 Not Found
```

**Cause:** Routes not configured correctly

**Solution:**
1. Check `backend/vercel.json` has correct routes:
   ```json
   "routes": [
     {
       "src": "/(.*)",
       "dest": "src/index.ts"
     }
   ]
   ```
2. Verify backend is deployed successfully
3. Test health endpoint directly

---

### 8. "Environment variable not found"

**Error:**
```
Error: JWT_SECRET is not defined
```

**Cause:** Environment variable not set in Vercel

**Solution:**
1. Go to Vercel → Project → Settings → Environment Variables
2. Add the missing variable
3. Redeploy
4. Check spelling matches exactly

**Required variables:**
- Backend: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `FRONTEND_URL`
- Frontend: `VITE_API_URL`

---

### 9. "Cannot read property of undefined"

**Error:**
```
TypeError: Cannot read property 'id' of undefined
```

**Cause:** Database query returning null/undefined

**Solution:**
1. Check database has data (run seed script)
2. Verify Prisma schema matches database
3. Add null checks in code:
   ```typescript
   if (!user) {
     return res.status(404).json({ error: 'User not found' });
   }
   ```

---

### 10. "Module not found" (Frontend)

**Error:**
```
Failed to resolve import "@/components/..."
```

**Cause:** Path alias not configured

**Solution:**
1. Check `frontend/vite.config.ts` has:
   ```typescript
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   }
   ```
2. Check `frontend/tsconfig.json` has:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

---

## 🔍 Debugging Steps

### Step 1: Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on the failed deployment
5. Click "View Function Logs"
6. Look for error messages

### Step 2: Test Locally
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

If it works locally but not on Vercel, it's likely an environment variable issue.

### Step 3: Check Environment Variables
1. Vercel → Project → Settings → Environment Variables
2. Verify all required variables are set
3. Check for typos
4. Make sure no extra spaces or quotes

### Step 4: Check Build Output
1. Look at the build logs in Vercel
2. Check for warnings or errors
3. Verify all dependencies installed
4. Check TypeScript compilation succeeded

### Step 5: Test Backend Health
```bash
curl https://your-backend.vercel.app/api/health
```

Should return: `{"status":"ok"}`

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] Code works locally (`npm run dev`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] All dependencies in package.json
- [ ] Environment variables documented
- [ ] Database migrations exist
- [ ] Prisma schema is up to date
- [ ] Git committed and pushed
- [ ] vercel.json configured correctly

---

## 🆘 Still Having Issues?

### Quick Fixes to Try:

1. **Redeploy**
   - Sometimes just redeploying fixes it
   - Vercel Dashboard → Deployments → ... → Redeploy

2. **Clear Build Cache**
   - Vercel Dashboard → Settings → Clear Build Cache
   - Then redeploy

3. **Check Vercel Status**
   - Visit https://www.vercel-status.com
   - Make sure Vercel is operational

4. **Update Dependencies**
   ```bash
   cd backend
   npm update
   git add package-lock.json
   git commit -m "chore: update dependencies"
   git push
   ```

5. **Fresh Deploy**
   - Delete the Vercel project
   - Create a new one
   - Reconfigure environment variables

---

## 📞 Getting Help

If you're still stuck:

1. **Check the logs** - Most errors are explained in Vercel logs
2. **Search the error** - Google the exact error message
3. **Vercel Docs** - https://vercel.com/docs
4. **Prisma Docs** - https://www.prisma.io/docs
5. **Neon Docs** - https://neon.tech/docs

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Backend health check returns `{"status":"ok"}`
- ✅ Frontend loads without errors
- ✅ Can register a new account
- ✅ Can login successfully
- ✅ Dashboard displays correctly
- ✅ No CORS errors in browser console

---

**Last Updated:** January 20, 2026  
**Status:** Prisma CLI error fixed in latest commit
