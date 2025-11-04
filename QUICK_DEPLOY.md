# 🚀 Quick Deployment Commands

## Prerequisites
```bash
# 1. Create accounts (if not already done)
# - Vercel: https://vercel.com/signup
# - Render: https://render.com/register
# - Make sure MongoDB Atlas is set up

# 2. Install CLI tools (optional, but recommended)
npm install -g vercel
```

## Deployment Order (Important!)

### 1️⃣ Deploy AI Service First (Python/Flask on Render)

**Manual Deployment via Render Dashboard:**
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `sk-inthiyaz/pothole-detection`
4. Settings:
   - Name: `pothole-detection-ai`
   - Root Directory: `CNNModel`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT AppF:app`
5. Click "Create Web Service"
6. **COPY THE URL** (e.g., `https://pothole-detection-ai.onrender.com`)

**Test it works:**
```bash
curl https://pothole-detection-ai.onrender.com/process -F "file=@CNNModel/test_image.jpg"
```

---

### 2️⃣ Deploy Backend (Node.js/Express on Render)

**Manual Deployment via Render Dashboard:**
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `sk-inthiyaz/pothole-detection`
4. Settings:
   - Name: `pothole-detection-backend`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** (click "Environment" tab):

```bash
NODE_ENV=production
PORT=5001

# MongoDB (from your existing .env file)
MONGO_URI=mongodb+srv://skinthiyaz777:Z9L0mKb7emEBorIp@cluster0.psuc0.mongodb.net/potholeDB

# JWT & Session (from your existing .env file)
JWT_SECRET=<copy-from-your-backend/.env>
SESSION_SECRET=<copy-from-your-backend/.env>

# Email (from your existing .env file)
EMAIL_USER=<your-gmail>
EMAIL_PASS=<your-gmail-app-password>

# AI Service (from Step 1)
AI_SERVICE_URL=https://pothole-detection-ai.onrender.com

# Frontend (will update after Step 3)
FRONTEND_URL=https://pothole-detection.vercel.app

# Google OAuth (from your existing .env file)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-secret>
GOOGLE_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/google/callback

# Microsoft OAuth (optional, from your existing .env file)
MICROSOFT_CLIENT_ID=<your-microsoft-client-id>
MICROSOFT_CLIENT_SECRET=<your-microsoft-secret>
MICROSOFT_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/microsoft/callback
```

6. Click "Create Web Service"
7. **COPY THE URL** (e.g., `https://pothole-detection-backend.onrender.com`)

**Update OAuth Redirect URIs:**
- **Google Cloud Console:**
  - Go to: https://console.cloud.google.com/apis/credentials
  - Edit OAuth Client ID
  - Add redirect URI: `https://pothole-detection-backend.onrender.com/auth/google/callback`
  - Add authorized origin: `https://pothole-detection-backend.onrender.com`

**Test it works:**
```bash
curl https://pothole-detection-backend.onrender.com/
# Should return: {"message":"Welcome to Pothole Detection API"}
```

---

### 3️⃣ Deploy Frontend (React on Vercel)

**Using Vercel Dashboard (Easiest):**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import `sk-inthiyaz/pothole-detection` from GitHub
4. Settings:
   - Framework Preset: `Create React App`
   - Root Directory: `login-page`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Add Environment Variables:**

```bash
REACT_APP_BACKEND_URL=https://pothole-detection-backend.onrender.com
REACT_APP_AI_SERVICE_URL=https://pothole-detection-ai.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=<your-google-client-id>
```

6. Click "Deploy"
7. **COPY THE URL** (e.g., `https://pothole-detection.vercel.app`)

**Using Vercel CLI (Alternative):**
```bash
cd login-page
vercel login
vercel --prod
```

**Update Backend with Frontend URL:**
1. Go back to Render Dashboard → Backend Service
2. Environment Variables → Edit `FRONTEND_URL`
3. Change to: `https://pothole-detection.vercel.app`
4. Save (service will auto-redeploy)

**Update Google OAuth:**
- Add authorized origin: `https://pothole-detection.vercel.app`

---

## 🧪 Testing Deployment

### Test 1: AI Service
```bash
curl -X POST https://pothole-detection-ai.onrender.com/process \
  -F "file=@CNNModel/test_image.jpg"
```
Expected: JSON with pothole detection result

### Test 2: Backend Health
```bash
curl https://pothole-detection-backend.onrender.com/
```
Expected: `{"message":"Welcome to Pothole Detection API"}`

### Test 3: Frontend
1. Open: `https://pothole-detection.vercel.app`
2. Click "Sign Up"
3. Enter email/password
4. Check email for OTP
5. Verify OTP and login
6. Upload pothole image
7. Check detection result

---

## 📝 Quick Reference URLs

After deployment, save these URLs:

```
Frontend:  https://pothole-detection.vercel.app
Backend:   https://pothole-detection-backend.onrender.com
AI Service: https://pothole-detection-ai.onrender.com
MongoDB:   mongodb+srv://cluster0.psuc0.mongodb.net/potholeDB
```

---

## 🔧 Troubleshooting

### Issue: "Service Unavailable" on first request
**Cause:** Render free tier spins down after 15 minutes
**Fix:** Wait 30-60 seconds for service to wake up

### Issue: CORS error in browser console
**Cause:** Frontend URL not in backend CORS whitelist
**Fix:** Update `FRONTEND_URL` in Render backend environment variables

### Issue: OAuth redirect mismatch
**Cause:** Callback URLs not updated in Google/Microsoft console
**Fix:** Add production URLs to OAuth provider settings

### Issue: OTP email not received
**Cause:** Gmail app password incorrect or not set
**Fix:** Generate new app password: https://myaccount.google.com/apppasswords

### Issue: MongoDB connection timeout
**Cause:** Render IPs not whitelisted in MongoDB Atlas
**Fix:** MongoDB Atlas → Network Access → Allow all IPs (0.0.0.0/0)

---

## 🎯 Post-Deployment Tasks

- [ ] Test all features in production
- [ ] Add deployment URLs to GitHub README
- [ ] Update resume with live demo link
- [ ] Share on LinkedIn with screenshots
- [ ] Monitor logs for first 24 hours
- [ ] Set up UptimeRobot to keep services warm
- [ ] Enable MongoDB backups in Atlas
- [ ] Add Google Analytics (optional)

---

## 💰 Free Tier Monitoring

**Render Free Tier:**
- 750 hours/month per service (enough for 1 service 24/7)
- Check usage: https://dashboard.render.com/usage

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Check usage: https://vercel.com/dashboard/usage

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Check metrics: Atlas Dashboard → Clusters → Metrics

---

## 🚨 Emergency Rollback

If something breaks in production:

**Vercel:**
1. Dashboard → Your Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Render:**
1. Dashboard → Your Service → Events
2. Find previous working commit
3. Manually redeploy from that commit

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://www.mongodb.com/docs/atlas/

For issues with this project: Open GitHub issue or check logs in dashboards.

---

**🎉 You're all set! Your full-stack AI app is now live on the internet!**
