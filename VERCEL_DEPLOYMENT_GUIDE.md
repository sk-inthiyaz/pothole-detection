# 🚀 Vercel Deployment Guide - Pothole Detection Frontend

## ✅ What We've Done:
1. ✅ Fixed Flask API - deployed to Heroku with CORS
2. ✅ Updated all frontend files to use environment variables
3. ✅ Created `.env.production` file
4. ✅ Updated API endpoints to use correct backends

## 📋 Your Architecture:
```
Frontend (React) → Vercel
    ↓ (auth, complaints, contact)
Node.js Backend → Render (https://pothole-detection-backend.onrender.com)
    ↓ (AI predictions)
Flask AI Backend → Heroku (https://pothole-detection-ai-4562ae5b30dc.herokuapp.com)
```

---

## 🔧 Step-by-Step Vercel Deployment:

### **STEP 1: Commit All Changes**
```powershell
cd "C:\Users\sinti\OneDrive\Pictures\Documents\Desktop\PotholeProject"

git add login-page/

git commit -m "feat: update frontend to use production API URLs"

git push origin main
```

### **STEP 2: Deploy to Vercel**

#### **Option A: Using Vercel CLI (Recommended)**
```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend folder
cd login-page

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Follow the prompts:**
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (if first time)
- Project name? **pothole-detection** (or your choice)
- In which directory is your code? **./login-page**
- Want to override settings? **N**

#### **Option B: Using Vercel Dashboard (Easier)**

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository:** `sk-inthiyaz/pothole-detection`
5. **Configure Project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `login-page`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

6. **Add Environment Variables:**
   Click "Environment Variables" and add these:

   ```
   REACT_APP_BACKEND_URL=https://pothole-detection-backend.onrender.com
   REACT_APP_AI_SERVICE_URL=https://pothole-detection-ai-4562ae5b30dc.herokuapp.com
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   REACT_APP_NAME=Pothole Detection System
   REACT_APP_VERSION=1.0.0
   ```

7. **Click "Deploy"**

### **STEP 3: Update Backend CORS**

After deployment, you'll get a Vercel URL like: `https://pothole-detection.vercel.app`

**Update your Node.js backend on Render:**
Add your Vercel URL to the CORS whitelist in `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://pothole-detection.vercel.app',  // Add this
    'http://localhost:3000',
  ],
  credentials: true,
};
```

**Update Flask backend on Heroku:**
The `CORS(app)` we added already allows all origins, so no change needed.

### **STEP 4: Test Everything**

1. Visit your Vercel URL
2. Test login/signup
3. Test pothole detection upload
4. Test complaint submission

---

## 🔍 Troubleshooting:

### **If build fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check that `build` script exists in `package.json`

### **If API calls fail:**
- Check environment variables in Vercel dashboard
- Verify CORS settings on backends
- Check browser console for errors

### **If OAuth fails:**
- Add Vercel URL to Google OAuth Console redirect URIs
- Update `REACT_APP_GOOGLE_CLIENT_ID` in Vercel env vars

---

## 📝 Next Steps After Deployment:

1. **Update Google OAuth:**
   - Go to Google Cloud Console
   - Add your Vercel URL to Authorized Redirect URIs:
     - `https://your-vercel-url.vercel.app`
     - `https://pothole-detection-backend.onrender.com/auth/google/callback`

2. **Update Node.js Backend Environment Variables on Render:**
   - Add `FRONTEND_URL=https://your-vercel-url.vercel.app`

3. **Test all features:**
   - ✅ User signup/login
   - ✅ Email OTP verification
   - ✅ Google OAuth
   - ✅ Pothole detection
   - ✅ Complaint submission
   - ✅ Contact form

---

## 🎉 You're Done!

Your full-stack pothole detection system is now live:
- **Frontend:** Vercel
- **Node Backend:** Render
- **AI Backend:** Heroku
- **Database:** MongoDB Atlas

All communication happens over HTTPS with proper CORS! 🚀
