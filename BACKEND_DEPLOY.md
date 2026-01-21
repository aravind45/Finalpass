# Backend Deployment Steps

## Option 1: Deploy via Vercel CLI (Recommended)

### Step 1: Navigate to backend directory
```bash
cd backend
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No (or Yes if you already created one)
- **Project name**: `finalpass-backend` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### Step 3: Copy the deployment URL
After deployment completes, Vercel will show you the URL.
Example: `https://finalpass-backend.vercel.app`

**Save this URL!** You'll need it for the frontend.

---

## Option 2: Deploy via Vercel Dashboard

### Step 1: Create New Project
1. Go to https://vercel.com/new
2. Import your GitHub repository: `aravind45/Finalpass`
3. Click **Import**

### Step 2: Configure Project
- **Framework Preset**: Other
- **Root Directory**: `backend`
- **Build Command**: Leave default or use `npm run build`
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### Step 3: Add Environment Variables
Click **Environment Variables** and add:
- `DATABASE_URL` = Your Neon PostgreSQL URL
- `ENCRYPTION_KEY` = Your 32-character key
- `JWT_SECRET` = Your JWT secret
- `NODE_ENV` = `production`
- `FRONTEND_URL` = (leave empty for now, add after frontend deploys)

### Step 4: Deploy
Click **Deploy**

### Step 5: Get Your URL
After deployment, click **Domains** tab to see your backend URL.

---

## What to Do After Backend Deploys

1. **Copy the backend URL** (e.g., `https://finalpass-backend.vercel.app`)
2. **Update frontend** with this URL
3. **Update backend** with frontend URL for CORS

---

**Which option would you like to use?**
- CLI (faster, recommended if you have Vercel CLI installed)
- Dashboard (easier, no CLI needed)
