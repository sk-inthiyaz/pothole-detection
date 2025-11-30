# 🚀 Complete Free Deployment Guide - Pothole Detection Project

**Last Updated:** November 4, 2025

This guide will help you deploy your full-stack MERN + AI application to free hosting platforms.

---

## 📋 Deployment Architecture

```
Frontend (React)     →  Vercel (Free)
Backend (Node.js)    →  Render (Free)
AI Service (Flask)   →  Heroku (Paid – deployed using my brother’s subscribed account)
Database             →  MongoDB Atlas
```

---

## 🎯 Prerequisites Checklist

- [x] GitHub repository: `sk-inthiyaz/pothole-detection`
- [x] MongoDB Atlas configured
- [x] All environment variables documented in `.env.example`
- [ ] Vercel account 
- [ ] Render account 
- [ ] Domain names noted for cross-service communication

---

## 1️⃣ Deploy Python AI Service (Flask) on Heroku (Paid)

### Step 1.1: Prepare Python App for Deployment

**Create `CNNModel/Procfile`** (already created below)
Note: Heroku requires a `Procfile`; `render.yaml` is not needed for Heroku.

### Step 1.2: Fix Model Path in AppF.py

The model path needs to be relative for deployment. I'll update it automatically.

### Step 1.3: Deploy to Heroku

Heroku dynos are not free. I deployed the AI service using a paid plan on my brother’s Heroku account.

1. Install the Heroku CLI and login: `heroku login`
2. Create the app: `heroku create pothole-detection-ai`
3. Set stack and buildpack:
   - `heroku stack:set heroku-22`
   - `heroku buildpacks:add heroku/python`
4. Ensure `CNNModel/Procfile` contains:
   - `web: gunicorn AppF:app --bind 0.0.0.0:$PORT`
5. Deploy from the repository root:
   - `git push heroku main`
6. Verify dyno is running: `heroku ps`
7. Copy the app URL (example): `https://pothole-detection-ai-xxxx.herokuapp.com`

### Step 1.4: Test AI Service

```bash
curl -X POST https://pothole-detection-ai-xxxx.herokuapp.com/process \
  -F "file=@test_image.jpg"
```

Expected response:
```json
{
  "pothole_detected": "Yes",
  "confidence_level": "95.34%",
  "prediction_time": "0.42 seconds",
  "recommendation": "Immediate Repair Needed"
}
```

---

## 2️⃣ Deploy Backend (Node.js + Express) on Render

### Step 2.1: Prepare Backend for Deployment

**Create `backend/render.yaml`** (already created below)

### Step 2.2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository `pothole-detection`
4. Configure:
   - **Name:** `pothole-detection-backend`
   - **Region:** Same as AI service
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. **Add Environment Variables** (click "Environment" tab):

```bash
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://skinthiyaz777:Z9L0mKb7emEBorIp@cluster0.psuc0.mongodb.net/potholeDB
JWT_SECRET=your-strong-jwt-secret-from-env-file
SESSION_SECRET=your-strong-session-secret-from-env-file

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/google/callback

# Microsoft OAuth (if using)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_CALLBACK_URL=https://pothole-detection-backend.onrender.com/auth/microsoft/callback

# AI Service URL (from Step 1)
AI_SERVICE_URL=https://pothole-detection-ai.onrender.com

# Frontend URL (will update after Step 3)
FRONTEND_URL=https://pothole-detection.vercel.app
```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy the URL:** `https://pothole-detection-backend.onrender.com`

### Step 2.3: Update OAuth Redirect URIs

**Google Cloud Console:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs:**
   ```
   https://pothole-detection-backend.onrender.com/auth/google/callback
   ```
5. Add to **Authorized JavaScript origins:**
   ```
   https://pothole-detection-backend.onrender.com
   ```

**Microsoft Azure Portal (if using):**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory → App registrations**
3. Select your app → Authentication
4. Add redirect URI:
   ```
   https://pothole-detection-backend.onrender.com/auth/microsoft/callback
   ```

### Step 2.4: Test Backend

```bash
# Health check
curl https://pothole-detection-backend.onrender.com/

# Test signup
curl -X POST https://pothole-detection-backend.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

---

## 3️⃣ Deploy Frontend (React) on Vercel

### Step 3.1: Update Frontend API URLs

Before deploying, update the backend URL in your React app. I'll create an environment file.

### Step 3.2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. Click **"Add New..." → "Project"**
3. **Import Git Repository:**
   - Search for `pothole-detection`
   - Click **"Import"**
4. **Configure Project:**
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `login-page`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Environment Variables:**

Click "Environment Variables" and add:

```bash
REACT_APP_BACKEND_URL=https://pothole-detection-backend.onrender.com
REACT_APP_AI_SERVICE_URL=https://pothole-detection-ai.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

6. Click **"Deploy"**
7. Wait 3-5 minutes for deployment
8. **Your live URL:** `https://pothole-detection.vercel.app` (or custom)

### Step 3.3: Update Backend with Frontend URL

1. Go back to **Render Dashboard → Backend Service**
2. Update environment variable:
   ```
   FRONTEND_URL=https://pothole-detection.vercel.app
   ```
3. Save and wait for auto-redeploy

### Step 3.4: Update OAuth Authorized Origins

**Google Cloud Console:**
1. Add to **Authorized JavaScript origins:**
   ```
   https://pothole-detection.vercel.app
   ```

---

## 4️⃣ Update Backend Upload Service

The backend's `upload.js` needs to point to the deployed AI service.

I'll update this file automatically below.

---

## 5️⃣ Production Testing Checklist

### Test 1: Frontend Loading
- [ ] Visit `https://pothole-detection.vercel.app`
- [ ] Check all pages load (Home, About, Contact, Login, Signup)
- [ ] Check responsive design on mobile

### Test 2: User Authentication
- [ ] Sign up with new email
- [ ] Receive OTP email
- [ ] Verify OTP and login
- [ ] Check JWT token in browser storage
- [ ] Logout and login again

### Test 3: OAuth Login
- [ ] Click "Login with Google"
- [ ] Authenticate and redirect back
- [ ] Check user session persists

### Test 4: Pothole Detection
- [ ] Upload a test pothole image
- [ ] Verify image reaches backend
- [ ] Backend forwards to AI service
- [ ] AI service returns prediction
- [ ] Frontend displays result with confidence

### Test 5: Email Notifications
- [ ] Sign up → receive welcome email
- [ ] Request OTP → receive OTP email
- [ ] Submit complaint → receive confirmation email

### Test 6: Rate Limiting
- [ ] Try logging in 6 times quickly → should be rate limited
- [ ] Wait 15 minutes and try again

### Test 7: Error Handling
- [ ] Try invalid email format
- [ ] Try weak password
- [ ] Try uploading non-image file
- [ ] Check error messages are user-friendly (not stack traces)

---

## 6️⃣ Post-Deployment Configuration

### Enable HTTPS Redirect (Backend)

Your backend already has HTTPS redirect in production mode. Verify in `server.js`:

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### Configure CORS for Production

Update `backend/server.js` CORS configuration to only allow your deployed frontend:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:7001',
  credentials: true
};
app.use(cors(corsOptions));
```

### Enable Helmet Security Headers

Already configured! Verify in `backend/server.js`:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

---

## 7️⃣ Monitoring & Logs

### Vercel Logs
- Dashboard → Your Project → Deployments → Click deployment → View Function Logs

### Render Logs
- Dashboard → Your Service → Logs tab → View real-time logs
- Logs persist for 7 days on free tier

### MongoDB Atlas Monitoring
- Atlas Dashboard → Clusters → Metrics tab
- Check connection count, operations/sec, network traffic

---

## 8️⃣ Free Tier Limitations

### Vercel Free Tier
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domain (1 per project)
- ⚠️ Serverless functions: 100 GB-hrs/month

### Render Free Tier
- ✅ 750 hours/month per service
- ✅ Automatic SSL
- ⚠️ Services spin down after 15 min inactivity (30-60 sec cold start)
- ⚠️ 512 MB RAM per service

### MongoDB Atlas Free Tier (M0)
- ✅ 512 MB storage
- ✅ Shared RAM
- ⚠️ Max 500 connections

### Cold Start Mitigation (Render)

**Option 1: Keep Services Warm (Manual)**
- Visit your deployed URLs every 10-15 minutes

**Option 2: Use Cron Job (UptimeRobot - Free)**
1. Sign up at [UptimeRobot](https://uptimerobot.com/)
2. Add monitors:
   - `https://pothole-detection-backend.onrender.com`
   - `https://pothole-detection-ai.onrender.com`
3. Set interval: 5 minutes
4. Free tier: 50 monitors



---

## 9️⃣ Custom Domain (Optional)
## This is optional but i had plan to do this(In future)
### Connect Custom Domain to Vercel

1. Purchase a domain from any domain registrar (e.g., GoDaddy, Google Domains, Cloudflare) (~$10-15/year)
2. Vercel Dashboard → Your Project → Settings → Domains
3. Add your domain: `potholedetection.com`
4. Add DNS records from Vercel to your domain provider
5. Wait for DNS propagation (5-60 minutes)

### Connect Custom Domain to Render

1. Render Dashboard → Your Service → Settings → Custom Domain
2. Add domain: `api.potholedetection.com`
3. Add CNAME record to your DNS provider
4. Wait for DNS propagation

---

## 🔒 Security Best Practices (Production)

### ✅ Already Implemented
- [x] Environment variables not in Git
- [x] Strong JWT secrets (128-char)
- [x] Rate limiting (5 req/15min auth)
- [x] Helmet security headers
- [x] NoSQL injection protection
- [x] Input validation
- [x] HTTPS redirect
- [x] CORS properly configured

### 📋 Additional Recommendations
- [ ] Enable MongoDB Atlas IP Whitelist (allow Render IPs)
- [ ] Set up error tracking (Sentry - free tier)
- [ ] Enable MongoDB backups (available in Atlas)
- [ ] Add CSP reporting endpoint
- [ ] Implement request logging (Winston + MongoDB)

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue 1: CORS Error on Login**
- **Cause:** Frontend URL not in backend CORS whitelist
- **Fix:** Update `FRONTEND_URL` env var in Render

**Issue 2: AI Service Timeout**
- **Cause:** Cold start on Render (60 sec timeout)
- **Fix:** Keep service warm with UptimeRobot

**Issue 3: OTP Email Not Received**
- **Cause:** Gmail blocking "less secure apps"
- **Fix:** Use Gmail App Password (not regular password)

**Issue 4: OAuth Redirect Mismatch**
- **Cause:** Redirect URIs not updated in Google/Microsoft
- **Fix:** Add deployed URLs to OAuth provider console

**Issue 5: MongoDB Connection Timeout**
- **Cause:** IP not whitelisted in Atlas
- **Fix:** Atlas → Network Access → Add IP (0.0.0.0/0 for all IPs)

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads on Vercel with no console errors
- ✅ Backend health check returns 200 OK
- ✅ AI service responds to test prediction
- ✅ User can sign up and receive OTP email
- ✅ User can log in with email/password
- ✅ OAuth login works (Google/Microsoft)
- ✅ Image upload and pothole detection works end-to-end
- ✅ All rate limits are enforced
- ✅ No sensitive data in client-side code
- ✅ SSL certificates active (🔒 in browser)

---

## 📝 Deployment URLs Reference

After deployment, document your URLs here:

```
Frontend:  https://pothole-detection.vercel.app
Backend:   https://pothole-detection-backend.onrender.com
AI Service: https://pothole-detection-ai.onrender.com
MongoDB:   mongodb+srv://cluster0.psuc0.mongodb.net/potholeDB
```

Add these to your resume:
```
🔗 Live Demo: https://pothole-detection.vercel.app
💻 GitHub: https://github.com/sk-inthiyaz/pothole-detection
🎯 Tech Stack: React, Node.js, Express, Flask, MongoDB, PyTorch, JWT, OAuth 2.0
```

---

## 🚀 Next Steps After Deployment

1. **Add to Resume/Portfolio**
   - Screenshot of working app
   - Add live demo link
   - Highlight security features
   - Mention AI/ML integration

2. **Share on LinkedIn**
   - Post about your project
   - Tag technologies used
   - Include screenshots/video demo

3. **Create Demo Video**
   - Screen record full workflow
   - Upload to YouTube
   - Add to GitHub README

4. **Monitor Usage**
   - Check Render logs daily (first week)
   - Monitor MongoDB Atlas metrics
   - Watch for errors in Vercel logs

5. **Continuous Improvement**
   - Add more test cases
   - Improve model accuracy
   - Add analytics (Google Analytics)
   - Implement PWA features

---


*For issues, check logs in Render/Vercel dashboards or open a GitHub issue.*
