# Deployment Guide: Frontend & Backend on Vercel

This guide walks you through deploying your FinalPass application with separate frontend and backend projects on Vercel.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- Vercel CLI installed: `npm install -g vercel`
- Your code pushed to GitHub

---

## Step 1: Deploy Backend First

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: `finalpass-backend` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 1.3 Set Environment Variables

Go to your Vercel dashboard → Your backend project → Settings → Environment Variables

Add these variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL URL | From Neon dashboard |
| `ENCRYPTION_KEY` | Your encryption key | 32-character random string |
| `JWT_SECRET` | Your JWT secret | Random string |
| `FRONTEND_URL` | (Leave empty for now) | Will add after frontend deployment |
| `NODE_ENV` | `production` | |
| `GROQ_API_KEY` | Your Groq API key | Optional, if using Groq |
| `GOOGLE_VERTEX_AI_PROJECT_ID` | Your GCP project ID | Optional, if using Vertex AI |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Your service account JSON | Optional, stringify the JSON |

### 1.4 Save Your Backend URL

After deployment, Vercel will show you the URL. **Copy this URL!**

Example: `https://finalpass-backend.vercel.app`

---

## Step 2: Deploy Frontend

### 2.1 Update Frontend Environment Variable

Edit `frontend/.env.production`:
```env
VITE_API_URL=https://finalpass-backend.vercel.app
```
Replace with your actual backend URL from Step 1.4.

### 2.2 Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2.3 Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: `finalpass-frontend` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 2.4 Set Environment Variables

Go to Vercel dashboard → Your frontend project → Settings → Environment Variables

Add:

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://finalpass-backend.vercel.app` |

Replace with your actual backend URL.

### 2.5 Save Your Frontend URL

Example: `https://finalpass-frontend.vercel.app`

---

## Step 3: Update Backend CORS

### 3.1 Add Frontend URL to Backend

Go to Vercel dashboard → Backend project → Settings → Environment Variables

Update `FRONTEND_URL`:
```
FRONTEND_URL=https://finalpass-frontend.vercel.app
```

### 3.2 Redeploy Backend

```bash
cd backend
vercel --prod
```

This redeploys with the updated CORS configuration.

---

## Step 4: Test Your Deployment

### 4.1 Visit Your Frontend
Open `https://finalpass-frontend.vercel.app` in your browser

### 4.2 Test Registration
1. Click "Register"
2. Fill in the form
3. Submit

### 4.3 Check Browser Console
- Press F12 to open DevTools
- Go to Console tab
- Look for any errors
- Check Network tab for failed API calls

### 4.4 Test Login
1. Try logging in with your registered account
2. Verify you can access the dashboard

---

## Troubleshooting

### CORS Errors
**Symptom**: "Access to fetch has been blocked by CORS policy"

**Solution**:
1. Verify `FRONTEND_URL` is set correctly in backend
2. Redeploy backend after setting environment variable
3. Check backend logs in Vercel dashboard

### API Calls Failing
**Symptom**: 404 or 500 errors on API calls

**Solution**:
1. Check `VITE_API_URL` in frontend environment variables
2. Verify backend is deployed and running
3. Check backend logs for errors

### Database Connection Errors
**Symptom**: "P1001: Can't reach database server"

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check Neon database is running
3. Ensure IP allowlist includes Vercel IPs (or use "Allow all")

### Build Failures
**Symptom**: Deployment fails during build

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test

---

## Updating Your Deployment

### Update Frontend
```bash
cd frontend
git pull  # if needed
vercel --prod
```

### Update Backend
```bash
cd backend
git pull  # if needed
vercel --prod
```

---

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://...
ENCRYPTION_KEY=your-32-char-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://finalpass-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://finalpass-backend.vercel.app
```

---

## Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Configure analytics
3. ✅ Set up monitoring/alerts
4. ✅ Enable Vercel Analytics
5. ✅ Set up CI/CD with GitHub integration

---

## Quick Commands

```bash
# Deploy backend
cd backend && vercel --prod

# Deploy frontend
cd frontend && vercel --prod

# View logs
vercel logs [deployment-url]

# List deployments
vercel ls
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Project Issues: GitHub Issues

---

**Congratulations!** 🎉 Your application is now deployed!
