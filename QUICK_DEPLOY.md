# Quick Deploy Guide - 5 Minutes

This is the fastest way to get your app deployed and testable.

## Step 1: Deploy Backend (2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Configure:
   ```
   Project Name: expectedestate-backend
   Root Directory: backend
   Build Command: npm run vercel-build
   ```
4. Add Environment Variables:
   ```
   DATABASE_URL=your_neon_postgres_url
   JWT_SECRET=any_random_string_here
   OPENAI_API_KEY=your_openai_key
   NODE_ENV=production
   ```
5. Click Deploy
6. Copy your backend URL (e.g., `https://expectedestate-backend.vercel.app`)

## Step 2: Update Frontend Config (30 seconds)

Edit `frontend/.env.production`:
```
VITE_API_URL=https://expectedestate-backend.vercel.app
```
(Use your actual backend URL from Step 1)

Commit and push:
```bash
git add frontend/.env.production
git commit -m "chore: update production API URL"
git push origin main
```

## Step 3: Deploy Frontend (2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the SAME GitHub repo
3. Configure:
   ```
   Project Name: expectedestate
   Root Directory: frontend
   Build Command: npm run build
   Framework: Vite
   ```
4. Add Environment Variable:
   ```
   VITE_API_URL=https://expectedestate-backend.vercel.app
   ```
   (Use your backend URL from Step 1)
5. Click Deploy
6. Copy your frontend URL (e.g., `https://expectedestate.vercel.app`)

## Step 4: Update CORS (30 seconds)

Edit `backend/src/index.ts` and add your frontend URL to CORS:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://expectedestate.vercel.app',  // Add your frontend URL here
  ],
  credentials: true
}));
```

Commit and push:
```bash
git add backend/src/index.ts
git commit -m "chore: update CORS for production"
git push origin main
```

Vercel will auto-redeploy your backend.

## Step 5: Test! (1 minute)

1. Open your frontend URL: `https://expectedestate.vercel.app`
2. Click "Register" and create an account
3. Login and explore the dashboard
4. Add a test asset
5. Log a communication

Done! 🎉

---

## Troubleshooting

**Can't register/login?**
- Check backend logs in Vercel dashboard
- Verify DATABASE_URL is correct
- Test backend health: `https://your-backend.vercel.app/api/health`

**CORS errors?**
- Make sure you updated CORS in Step 4
- Wait 1-2 minutes for backend to redeploy
- Clear browser cache

**Blank page?**
- Open browser DevTools (F12)
- Check Console for errors
- Verify VITE_API_URL in frontend environment variables

---

## Your URLs

After deployment, save these:

- **Frontend**: https://expectedestate.vercel.app
- **Backend**: https://expectedestate-backend.vercel.app
- **Backend Health**: https://expectedestate-backend.vercel.app/api/health

---

## Next Time

After the initial setup, deploying updates is automatic:

```bash
git add .
git commit -m "your changes"
git push origin main
```

Vercel will automatically rebuild and deploy both frontend and backend! 🚀
