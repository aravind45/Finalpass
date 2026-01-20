# Environment Variables - Quick Reference

## 🚀 Backend (Vercel)

Add these in: **Vercel → Backend Project → Settings → Environment Variables**

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | `postgresql://user:pass@host.neon.tech/db?sslmode=require` | Neon Dashboard → Connection String |
| `JWT_SECRET` | `random-32-character-string` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` | Type exactly: `production` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Copy from Vercel after deploying frontend |

**Optional (for full features):**
| Variable | Value | Where to Get |
|----------|-------|--------------|
| `OPENAI_API_KEY` | `sk-proj-xxxxx` | https://platform.openai.com/api-keys |
| `PAMFAX_USERNAME` | `your-email@example.com` | https://www.pamfax.biz |
| `PAMFAX_PASSWORD` | `your-password` | Your PamFax account |

---

## 🎨 Frontend (Vercel)

Add these in: **Vercel → Frontend Project → Settings → Environment Variables**

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `VITE_API_URL` | `https://your-backend.vercel.app` | Copy from Vercel after deploying backend |

**Important**: Do NOT end with `/api` or `/` - just the base URL

---

## 📁 Frontend File

Create/update: **`frontend/.env.production`**

```bash
VITE_API_URL=https://your-backend.vercel.app
```

Then commit:
```bash
git add frontend/.env.production
git commit -m "chore: configure production API URL"
git push origin main
```

---

## ✅ Minimum Required (5 variables total)

**Backend (4):**
1. DATABASE_URL
2. JWT_SECRET  
3. NODE_ENV
4. FRONTEND_URL

**Frontend (1):**
1. VITE_API_URL

---

## 🔍 How to Get Each Value

### 1. DATABASE_URL
```
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection Details"
4. Copy "Connection string"
5. Make sure it ends with ?sslmode=require
```

### 2. JWT_SECRET
```
Run this command:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Or just type 32+ random characters
```

### 3. NODE_ENV
```
Just type: production
```

### 4. FRONTEND_URL
```
1. Deploy frontend first
2. Go to Vercel dashboard
3. Copy the URL (e.g., https://expectedestate.vercel.app)
4. Add to backend environment variables
```

### 5. VITE_API_URL
```
1. Deploy backend first
2. Go to Vercel dashboard
3. Copy the URL (e.g., https://expectedestate-backend.vercel.app)
4. Add to frontend environment variables
```

---

## 🧪 Test Your Setup

### Backend Health Check
```
Open: https://your-backend.vercel.app/api/health
Should see: {"status":"ok"}
```

### Frontend Check
```
Open: https://your-frontend.vercel.app
Should see: Login/Register page
```

### Full Test
```
1. Register new account
2. Login
3. See dashboard
4. No errors in console (F12)
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to database | Check DATABASE_URL, verify `?sslmode=require` |
| CORS error | Add FRONTEND_URL to backend, redeploy |
| API calls fail | Check VITE_API_URL in frontend |
| Invalid token | Check JWT_SECRET is set, clear cookies |

---

## 📚 More Details

- **Complete guide**: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- **Step-by-step checklist**: [ENV_SETUP_CHECKLIST.md](./ENV_SETUP_CHECKLIST.md)
- **Deployment guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Print this page and fill in your values!** ✍️
