# 🔐 Google OAuth Setup - Simple 5-Minute Guide

## ⚠️ Why You're Getting "400 Error"

The "400. That's an error" message happens because Google doesn't recognize your OAuth credentials yet. You need to:

1. Create a Google Cloud project
2. Set up OAuth credentials
3. Add the redirect URL to Google
4. Copy credentials to your `.env` file

---

## 📋 Step-by-Step Setup (5 Minutes)

### **Step 1: Create Google Cloud Project**

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click **"Create Project"** (top left)
4. Enter project name: **"Pothole Detector"**
5. Click **"Create"** and wait 30 seconds

---

### **Step 2: Enable Google+ API**

1. In Google Cloud Console, search for **"Google+ API"**
2. Click on **"Google+ API"** result
3. Click **"Enable"** button (blue)
4. Wait for it to enable (30 seconds)

---

### **Step 3: Create OAuth Consent Screen**

1. Go to **"APIs & Services"** → **"OAuth consent screen"** (left menu)
2. Select **"External"** and click **"Create"**
3. Fill in the form:
   - **App name**: `Pothole Detector`
   - **User support email**: Your email (e.g., sintiyaz76@gmail.com)
   - Click **"Save and Continue"**
4. Skip "Scopes" → Click **"Save and Continue"**
5. Under "Test users" → Click **"Add Users"**
6. Add your email address
7. Click **"Save and Continue"** → **"Back to Dashboard"**

---

### **Step 4: Create OAuth Credentials**  

1. Go to **"APIs & Services"** → **"Credentials"** (left menu)
2. Click **"+ Create Credentials"** (blue button) → **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in:
   - **Name**: `Pothole Detector Web`
5. Under **"Authorized redirect URIs"**, click **"Add URI"** and enter:
   ```
   http://localhost:5001/auth/google/callback
   ```
6. Click **"Create"**
7. A popup appears with your credentials - **COPY THESE!**

---

### **Step 5: Get Your Credentials**

From the popup, you'll see:

```
Client ID: 1234567890-abcdefghijklmnop.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

**Copy both values** ⬆️

---

### **Step 6: Update Your .env File**

Open `backend/.env` and update:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
```

Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with the values you copied.

---

### **Step 7: Restart Backend**

In PowerShell, stop and restart your backend:

```powershell
# Stop backend
Stop-Process -Name node -Force

# Navigate to backend
cd backend

# Start again
npm start
```

---

## ✅ Done! Now Test It

1. Go to: http://localhost:7001/login
2. Click **"Continue with Google"**
3. You'll be redirected to Google login
4. Google will ask for permission (because it's a test app)
5. Click **"Allow"**
6. You should be logged in! ✅

---

## 🆘 If It Still Shows "400 Error"

### Check These:

1. **Copied credentials correctly?**
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
   - No extra spaces or typos

2. **Restarted backend?**
   - Stop-Process -Name node -Force
   - cd backend && npm start

3. **Did you add the redirect URI?**
   - Should be: `http://localhost:5001/auth/google/callback`
   - Check in Google Cloud Console → APIs & Services → Credentials

4. **Browser cache?**
   - Clear cache or use Incognito window
   - Press Ctrl+Shift+Delete

5. **Still not working?**
   - Check backend logs for errors
   - Look for "GOOGLE_CLIENT_ID" in console
   - If undefined, .env wasn't loaded

---

## 📱 Test Account

You can test Google Login with:
- **Email**: Your Gmail account
- **Password**: Your Gmail password

The app will automatically create an account after first login!

---

## 🎉 Success Indicators

- ✅ You click "Continue with Google"
- ✅ Redirects to Google login page
- ✅ Can login with Gmail
- ✅ Redirects back to app
- ✅ You're logged in!

---

**That's it! You now have Google OAuth working! 🎊**
