# 🔐 Environment Variables Setup Guide

This document lists ALL environment variables needed for deployment across all services.

---

## 📦 Services Overview

| Service | Platform | Env Vars Count | Critical |
|---------|----------|----------------|----------|
| Frontend (React) | Vercel | 3 | ⚠️ Medium |
| Backend (Node.js) | Render | 13 | 🔴 Critical |
| AI Service (Flask) | Render | 0 | ✅ None |

---

## 1️⃣ Frontend (Vercel)

**Platform:** Vercel Dashboard → Your Project → Settings → Environment Variables

### Required Variables (3)

```bash
# Backend API base URL
REACT_APP_BACKEND_URL=https://pothole-detection-backend.onrender.com

# AI Service base URL (may not be used directly, but good to have)
REACT_APP_AI_SERVICE_URL=https://pothole-detection-ai.onrender.com

# Google OAuth Client ID (for frontend Google login button)
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### Where to Get Values

| Variable | Source |
|----------|--------|
| `REACT_APP_BACKEND_URL` | From Render backend deployment (Step 2 of deployment) |
| `REACT_APP_AI_SERVICE_URL` | From Render AI service deployment (Step 1 of deployment) |
| `REACT_APP_GOOGLE_CLIENT_ID` | From Google Cloud Console → APIs & Services → Credentials |

### Notes
- All frontend env vars MUST start with `REACT_APP_` (Create React App requirement)
- These are embedded in the build, NOT secret (public in browser source)
- Never put sensitive data (passwords, secrets) in frontend env vars

---

## 2️⃣ Backend (Render)

**Platform:** Render Dashboard → Your Service → Environment → Add Environment Variable

### Required Variables (13)

#### Application Settings (2)
```bash
NODE_ENV=production
PORT=5001
```

#### Database (1)
```bash
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://skinthiyaz777:Z9L0mKb7emEBorIp@cluster0.psuc0.mongodb.net/potholeDB
```

#### Security (2)
```bash
# JWT secret (for authentication tokens) - 64+ characters random
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Session secret (for express-session) - 64+ characters random
SESSION_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

#### Email (2)
```bash
# Gmail account for sending emails
EMAIL_USER=your-email@gmail.com

# Gmail App Password (NOT regular password)
# Generate at: https://myaccount.google.com/apppasswords
EMAIL_PASS=abcd efgh ijkl mnop
```

#### External Services (2)
```bash
# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=https://pothole-detection.vercel.app

# AI Service URL (for image processing)
AI_SERVICE_URL=https://pothole-detection-ai.onrender.com
```

#### Google OAuth (3)
```bash
# Google OAuth Client ID
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com

# Google OAuth Client Secret
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz

# Google OAuth callback URL (must match Google Cloud Console)
GOOGLE_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/google/callback
```

#### Microsoft OAuth (Optional - 3)
```bash
# Microsoft OAuth Client ID
MICROSOFT_CLIENT_ID=12345678-abcd-1234-efgh-123456789012

# Microsoft OAuth Client Secret
MICROSOFT_CLIENT_SECRET=AbC~dEf1gHi2jKl3mNo4pQr5sTu6vWx7yZ

# Microsoft OAuth callback URL (must match Azure Portal)
MICROSOFT_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/microsoft/callback
```

### Where to Get Values

| Variable | Source |
|----------|--------|
| `NODE_ENV` | Set to `production` |
| `PORT` | Set to `5001` (Render overrides with $PORT) |
| `MONGO_URI` | MongoDB Atlas → Connect → Connect your application |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `SESSION_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail → Account → Security → App passwords |
| `FRONTEND_URL` | From Vercel deployment |
| `AI_SERVICE_URL` | From Render AI service deployment |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials |
| `GOOGLE_CALLBACK_URL` | Your backend URL + `/auth/google/callback` |
| `MICROSOFT_CLIENT_ID` | Azure Portal → App registrations |
| `MICROSOFT_CLIENT_SECRET` | Azure Portal → Certificates & secrets |
| `MICROSOFT_CALLBACK_URL` | Your backend URL + `/auth/microsoft/callback` |

### Security Notes
- ⚠️ NEVER commit these values to Git
- ⚠️ Use different secrets for dev vs production
- ⚠️ Rotate secrets every 90 days
- ⚠️ JWT_SECRET and SESSION_SECRET must be different
- ⚠️ Use Gmail App Password, NOT regular password

---

## 3️⃣ AI Service (Render)

**Platform:** Render Dashboard → AI Service → Environment

### Required Variables (0)

✅ **No environment variables needed!**

The Flask app loads the model from the local file system, no external config required.

---

## 📋 Quick Copy Templates

### For Render Backend (copy-paste to Render dashboard)

```bash
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://skinthiyaz777:Z9L0mKb7emEBorIp@cluster0.psuc0.mongodb.net/potholeDB
JWT_SECRET=<COPY_FROM_YOUR_LOCAL_ENV>
SESSION_SECRET=<COPY_FROM_YOUR_LOCAL_ENV>
EMAIL_USER=<YOUR_GMAIL>
EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>
FRONTEND_URL=https://pothole-detection.vercel.app
AI_SERVICE_URL=https://pothole-detection-ai.onrender.com
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/google/callback
```

### For Vercel Frontend (copy-paste to Vercel dashboard)

```bash
REACT_APP_BACKEND_URL=https://pothole-detection-backend.onrender.com
REACT_APP_AI_SERVICE_URL=https://pothole-detection-ai.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
```

---

## 🔍 How to Find Your Local Values

If you already have the project running locally, your actual values are in:

```
backend/.env (NEVER commit this file!)
```

To safely copy them to production:

```bash
# On Windows (PowerShell)
cd backend
cat .env

# Look for these values and copy them to Render/Vercel dashboards
```

---

## ✅ Validation Checklist

Before deploying, verify:

- [ ] All backend env vars set in Render (13 total)
- [ ] All frontend env vars set in Vercel (3 total)
- [ ] JWT_SECRET is 64+ characters
- [ ] SESSION_SECRET is 64+ characters and different from JWT_SECRET
- [ ] EMAIL_PASS is Gmail App Password (16 chars with spaces)
- [ ] MONGO_URI includes database name (`/potholeDB`)
- [ ] FRONTEND_URL matches actual Vercel URL (no trailing slash)
- [ ] AI_SERVICE_URL matches actual Render AI service URL
- [ ] GOOGLE_CALLBACK_URL matches backend URL + `/auth/google/callback`
- [ ] OAuth redirect URIs updated in Google Cloud Console
- [ ] OAuth redirect URIs updated in Azure Portal (if using Microsoft)

---

## 🚨 Troubleshooting

### "MongoDB connection failed"
❌ **Problem:** `MONGO_URI` incorrect or MongoDB Atlas not allowing connections  
✅ **Fix:** 
1. Check `MONGO_URI` format is correct
2. MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`

### "JWT malformed" or "Invalid token"
❌ **Problem:** `JWT_SECRET` missing or different between restarts  
✅ **Fix:** Set `JWT_SECRET` in Render env vars (persistent)

### "Email not sent" or "Authentication failed"
❌ **Problem:** `EMAIL_PASS` is regular password, not app password  
✅ **Fix:** Generate App Password at https://myaccount.google.com/apppasswords

### "CORS error" in browser
❌ **Problem:** `FRONTEND_URL` in backend doesn't match actual frontend URL  
✅ **Fix:** Update `FRONTEND_URL` in Render backend env vars

### "OAuth redirect mismatch"
❌ **Problem:** Callback URLs not whitelisted in OAuth provider  
✅ **Fix:** 
1. Google Cloud Console → Add `GOOGLE_CALLBACK_URL` to authorized URIs
2. Azure Portal → Add `MICROSOFT_CALLBACK_URL` to redirect URIs

---

## 📚 Additional Resources

- **Generate Random Secrets:** https://randomkeygen.com/
- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Google OAuth Setup:** https://console.cloud.google.com/apis/credentials
- **Microsoft OAuth Setup:** https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Render Docs:** https://render.com/docs/environment-variables
- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables

---

**Security Reminder:** These environment variables contain sensitive credentials. Never:
- ❌ Commit `.env` files to Git
- ❌ Share values in public forums/chat
- ❌ Store in plain text files synced to cloud
- ❌ Include in screenshots or videos
- ❌ Use same values for multiple projects

**Safe Practices:**
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate credentials every 90 days
- ✅ Use password manager (1Password, LastPass) to store
- ✅ Enable 2FA on all third-party accounts
- ✅ Review access logs regularly (MongoDB Atlas, Google Cloud)

---

Made with 🔐 for secure deployments.
