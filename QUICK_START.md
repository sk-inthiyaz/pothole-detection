# 🚀 Quick Start Guide - Authentication System

## ⚡ Fast Setup (5 minutes)

### Step 1: OAuth Credentials Setup

#### Google OAuth (2 minutes):
1. Go to https://console.cloud.google.com/
2. Create new project: "Pothole Detection"
3. Enable Google+ API
4. Go to "OAuth consent screen" → External → Fill basic info
5. Go to "Credentials" → Create OAuth 2.0 Client ID → Web application
6. Add authorized redirect URI: `http://localhost:5001/auth/google/callback`
7. Copy Client ID and Client Secret

#### Microsoft OAuth (2 minutes):
1. Go to https://portal.azure.com/
2. Search "App registrations" → New registration
3. Name: "Pothole Detection"
4. Redirect URI (Web): `http://localhost:5001/auth/microsoft/callback`
5. Register → Copy Application (client) ID
6. Go to "Certificates & secrets" → New client secret → Copy Value

### Step 2: Update .env File

Open `backend/.env` and replace:

```env
# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# Microsoft OAuth
MICROSOFT_CLIENT_ID=YOUR_MICROSOFT_CLIENT_ID_HERE
MICROSOFT_CLIENT_SECRET=YOUR_MICROSOFT_CLIENT_SECRET_HERE
```

**Note:** Email credentials are already configured ✅

### Step 3: Start Everything

Open 4 PowerShell terminals:

**Terminal 1 - MongoDB:**
```powershell
mongod --dbpath C:\data\db
```

**Terminal 2 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 3 - Flask ML:**
```powershell
cd CNNModel
py -3.10 AppF.py
```

**Terminal 4 - Frontend:**
```powershell
cd frontend
npm start
```

---

## 🧪 Quick Test (2 minutes)

### Test 1: Email/Password with OTP

1. Open http://localhost:3000/signup
2. Fill in:
   - Name: Test User
   - Email: your-email@gmail.com
   - Password: test123456
   - Confirm Password: test123456
3. Click "Sign Up"
4. Check your email for OTP (should arrive in 5-10 seconds)
5. Enter the 6-digit OTP
6. ✅ You should be logged in and redirected to /pothole

### Test 2: Google OAuth

1. Open http://localhost:3000/login
2. Click "Continue with Google"
3. Select your Google account
4. Grant permissions
5. ✅ You should be logged in automatically

### Test 3: Microsoft OAuth

1. Open http://localhost:3000/login
2. Click "Continue with Microsoft"
3. Sign in with your Microsoft account
4. Grant permissions
5. ✅ You should be logged in automatically

---

## 🎯 What to Expect

### Email/Password Flow:
```
Signup → OTP Email → Verify OTP → Login Success → Redirect to /pothole
```

**OTP Email Example:**
- Subject: "🔐 Verify Your Email - Pothole Detection"
- Contains 6-digit code (e.g., 482719)
- Expires in 10 minutes
- Beautiful HTML design

### Google OAuth Flow:
```
Click Button → Google Consent → Grant Permissions → Auto Login → Redirect
```

### Microsoft OAuth Flow:
```
Click Button → Microsoft Consent → Grant Permissions → Auto Login → Redirect
```

---

## 📊 Check If It's Working

### Backend Health Check:
Open http://localhost:5001/health

Expected response:
```json
{
  "status": "ok",
  "service": "backend",
  "port": 5001
}
```

### Check Email Service:
Backend console should show:
```
✓ Email service is ready to send messages
```

### Check MongoDB:
Backend console should show:
```
MongoDB Connected: 127.0.0.1
```

### Check OAuth Setup:
If you see "Redirect URI mismatch" error:
- Verify `.env` URLs match Google/Azure console exactly

---

## 🐛 Common Quick Fixes

### OTP Email Not Received:
1. Check spam folder
2. Wait 30 seconds (Gmail can be slow)
3. Click "Resend OTP" button
4. Check backend console for errors

### OAuth "Redirect URI mismatch":
```powershell
# In .env, ensure these EXACT URLs:
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
MICROSOFT_CALLBACK_URL=http://localhost:5001/auth/microsoft/callback
```

Then add these EXACT URLs in:
- Google Cloud Console → Credentials
- Azure Portal → Authentication

### "Invalid login" Email Error:
Your Gmail App Password may be incorrect.

**Fix:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate new password for "Mail"
5. Copy 16-character password (remove spaces)
6. Update `EMAIL_PASS` in `.env`

### Port Already in Use:
```powershell
# Backend (5001):
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Frontend (3000):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📱 Test on Mobile

### Method 1: Use your computer's IP
```powershell
# Find your IP
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

Update `.env`:
```env
FRONTEND_URL=http://192.168.1.100:3000
GOOGLE_CALLBACK_URL=http://192.168.1.100:5001/auth/google/callback
MICROSOFT_CALLBACK_URL=http://192.168.1.100:5001/auth/microsoft/callback
```

Add these URLs to Google/Azure console.

Access on mobile: `http://192.168.1.100:3000`

---

## 🎓 Quick Reference

### Email Credentials (Already Set):
```
EMAIL_USER=skinthiyaz777@gmail.com
EMAIL_PASS=eudg phps xcbj ucba
```

### OTP Details:
- Length: 6 digits
- Expires: 10 minutes
- Resend cooldown: 60 seconds
- Auto-deleted after use

### JWT Token:
- Expires: 24 hours
- Stored: localStorage
- Key: 'authToken'

### User Data:
- Stored: localStorage
- Key: 'user'
- Format: JSON object

---

## 🔗 Important URLs

### Development:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- MongoDB: mongodb://127.0.0.1:27017/potholeDB
- Flask ML: http://localhost:7000

### Console Access:
- Google Cloud: https://console.cloud.google.com/
- Azure Portal: https://portal.azure.com/
- Gmail Account: https://myaccount.google.com/

---

## ✅ Quick Verification Checklist

Before testing, ensure:
- [ ] MongoDB is running
- [ ] Backend shows "Email service ready"
- [ ] Backend shows "MongoDB Connected"
- [ ] Frontend loaded without errors
- [ ] Google OAuth credentials in `.env`
- [ ] Microsoft OAuth credentials in `.env`
- [ ] Email credentials in `.env`

---

## 🆘 Need Help?

### Documentation:
- **Full OAuth Setup**: See `OAUTH_SETUP_GUIDE.md`
- **API Reference**: See `AUTHENTICATION_API.md`
- **Implementation Details**: See `AUTH_IMPLEMENTATION.md`
- **Testing Guide**: See `TESTING_CHECKLIST.md`

### Check Logs:
```powershell
# Backend logs
cd backend
npm start
# Watch for errors in console

# Frontend logs
cd frontend
npm start
# Open browser console (F12)
```

### Test Individual Components:
```powershell
# Test backend health
curl http://localhost:5001/health

# Test email sending (backend must be running)
curl -X POST http://localhost:5001/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"your-email@gmail.com","password":"test123"}'
```

---

## 🎉 Success Indicators

You'll know everything is working when:

1. **Email/Password:**
   - ✅ OTP email arrives within 10 seconds
   - ✅ OTP verification succeeds
   - ✅ Redirected to /pothole page
   - ✅ JWT token in localStorage

2. **Google OAuth:**
   - ✅ Google consent screen appears
   - ✅ Automatically redirected after granting permissions
   - ✅ Logged in to /pothole page
   - ✅ Profile picture visible (if applicable)

3. **Microsoft OAuth:**
   - ✅ Microsoft sign-in page appears
   - ✅ Automatically redirected after sign-in
   - ✅ Logged in to /pothole page

---

## ⏱️ Total Setup Time: ~7 Minutes

- OAuth credentials: 4 minutes
- Update .env: 1 minute
- Start services: 1 minute
- Test authentication: 1 minute

**You're ready to go! 🚀**

---

**Quick Start Version:** 1.0  
**Last Updated:** November 3, 2025  
**Difficulty:** Easy ⭐
