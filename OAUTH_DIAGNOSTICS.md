# 🔍 Google OAuth Troubleshooting Guide

## ✅ Step 1: Check Your Configuration

Open this URL in your browser:

```
http://localhost:5001/auth/config-status
```

You should see something like:

```json
{
  "google": {
    "configured": false,
    "clientId": "✗ Missing",
    "clientSecret": "✗ Missing",
    "callbackUrl": "http://localhost:5001/auth/google/callback"
  },
  "microsoft": {
    "configured": false,
    "clientId": "✗ Missing",
    "clientSecret": "✗ Missing",
    "callbackUrl": "http://localhost:5001/auth/microsoft/callback"
  },
  "frontend": {
    "url": "http://localhost:7001"
  }
}
```

---

## 🎯 What This Means

### If You See:
- `"configured": false` → **Google OAuth is NOT configured yet**
- `"clientId": "✗ Missing"` → **You haven't added credentials to .env**
- `"clientSecret": "✗ Missing"` → **Client secret is missing**

### If You See:
- `"configured": true` → ✅ **Credentials are set correctly!**
- `"clientId": "✓ Set"` → ✅ **Client ID is configured**
- `"clientSecret": "✓ Set"` → ✅ **Client secret is configured**

---

## 📋 Steps to Fix the "400 Error"

### **Step 1: Get Google OAuth Credentials**

1. Go to: https://console.cloud.google.com/
2. Create a project called "Pothole Detector"
3. Enable Google+ API
4. Create OAuth credentials (Web application)
5. Add redirect URI: `http://localhost:5001/auth/google/callback`
6. Copy your Client ID and Client Secret

---

### **Step 2: Update Your .env File**

Edit `backend/.env` and replace:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_from_google
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google
```

**Example:**
```env
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

---

### **Step 3: Restart Backend**

```powershell
Stop-Process -Name node -Force
cd backend
npm start
```

---

### **Step 4: Verify Configuration**

Open: http://localhost:5001/auth/config-status

Should now show:
```json
{
  "google": {
    "configured": true,
    "clientId": "✓ Set",
    "clientSecret": "✓ Set"
  }
}
```

---

## ✅ Now Test Google Login

1. Go to: http://localhost:7001/login
2. Click **"Continue with Google"**
3. Should redirect to Google login ✅
4. After login, should be redirected back to app ✅

---

## 🆘 Still Getting "400 Error"?

### Check These:

1. **Did you actually get credentials from Google?**
   - Go to https://console.cloud.google.com/apis/credentials
   - You should see your credentials listed

2. **Did you copy them exactly?**
   - No extra spaces
   - No line breaks
   - Full text including `.apps.googleusercontent.com`

3. **Did you restart backend after updating .env?**
   ```powershell
   Stop-Process -Name node -Force
   cd backend && npm start
   ```

4. **Check if credentials are actually loaded**
   - Visit: http://localhost:5001/auth/config-status
   - Should show `"configured": true`

5. **Clear browser cache**
   - Ctrl + Shift + Delete
   - Or use Incognito/Private window

6. **Check backend logs**
   - Look for error messages in terminal
   - They'll help identify the problem

---

## 💡 Pro Tips

- **Test Account**: Use your own Gmail account
- **Development**: It's normal to see warnings about "Test User" - that's expected
- **Callback URL**: Must match exactly: `http://localhost:5001/auth/google/callback`
- **Credentials**: Keep them private - never share with anyone!

---

## 🎉 Success Indicators

✅ Config status shows `"configured": true`  
✅ Clicking "Continue with Google" redirects to Google login  
✅ Can login with Gmail account  
✅ Redirects back to app after login  
✅ Logged in successfully!

---

**Everything is configured on the backend! Now you just need to add your Google credentials to `.env` file.** 🚀
