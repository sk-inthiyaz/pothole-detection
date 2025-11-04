# ⚡ Quick Checklist: Why Google OAuth Shows "400 Error"

## The Problem

When you click "Continue with Google", you get:
```
400. That's an error.
The server cannot process the request because it is malformed.
```

## The Root Cause

Your `backend/.env` file has **placeholder values** instead of **real credentials**:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here  ❌ PLACEHOLDER
GOOGLE_CLIENT_SECRET=your_google_client_secret_here  ❌ PLACEHOLDER
```

Google doesn't recognize these fake credentials, so it returns a 400 error.

---

## ✅ Quick Fix (3 Steps)

### **Step 1: Get Real Credentials**
- Go to: https://console.cloud.google.com/
- Create project → Enable Google+ API → Create OAuth credentials
- Copy your real Client ID and Secret

### **Step 2: Update .env**
Replace in `backend/.env`:
```env
GOOGLE_CLIENT_ID=YOUR_REAL_CLIENT_ID  ✅
GOOGLE_CLIENT_SECRET=YOUR_REAL_SECRET  ✅
```

### **Step 3: Restart Backend**
```powershell
Stop-Process -Name node -Force
cd backend && npm start
```

---

## 🔍 Verify It Works

Visit: http://localhost:5001/auth/config-status

Look for:
```
"configured": true  ✅
"clientId": "✓ Set"  ✅
"clientSecret": "✓ Set"  ✅
```

---

## That's It! 🎉

Now "Continue with Google" will work!

