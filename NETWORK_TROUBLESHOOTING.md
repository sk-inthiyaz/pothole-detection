# 🔧 Network Troubleshooting Guide - Google OAuth Connection Issue

## The Problem

You're getting this error:
```
Failed to obtain access token
ECONNRESET: Client network socket disconnected from www.googleapis.com:443
```

**This means:** Your backend server **cannot reach Google's servers** to exchange the authorization code for an access token.

---

## 🔍 Diagnosis Steps

### Step 1: Test Direct Connection to Google
Run this in PowerShell to check if you can reach Google:

```powershell
# Test connection to Google OAuth servers
Test-NetConnection -ComputerName www.googleapis.com -Port 443 -InformationLevel Detailed
```

**Expected result:** Should show `TcpTestSucceeded : True`

### Step 2: Check Windows Firewall
```powershell
# Check Windows Firewall status
Get-NetFirewallProfile

# View all firewall rules for HTTPS
Get-NetFirewallRule -Direction Outbound -Action Allow | Where-Object {$_.Name -like '*https*'}
```

### Step 3: Check if Node.js is blocked
Node.js might be blocked from making outbound HTTPS connections:

```powershell
# Check Windows Firewall rules for Node
Get-NetFirewallRule -DisplayName "*Node*"
Get-NetFirewallRule -DisplayName "*npm*"
```

---

## 🔐 Solutions to Try (In Order)

### **Solution 1: Add Node.js to Windows Firewall Exceptions**

1. Open **Windows Defender Firewall** → **Allow an app through firewall**
2. Click **Change settings** (may need admin)
3. Click **Allow another app**
4. Browse to: `C:\Program Files\nodejs\node.exe`
5. Click **Add** and make sure both **Private** and **Public** are checked
6. Click **OK**

**Then restart your backend:**
```powershell
# Stop current process
Stop-Process -Name "node" -Force

# Restart backend
cd backend
npm start
```

---

### **Solution 2: Temporarily Disable Windows Firewall (Testing Only)**

**⚠️ DO NOT leave this permanent - re-enable after testing!**

```powershell
# Run as Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $False

# Test if Google OAuth works now
# Then RE-ENABLE:
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $True
```

---

### **Solution 3: Check for Corporate Proxy/VPN**

If you're behind a corporate network:

1. Check if you're connected to VPN
2. Disconnect VPN and try again
3. Ask your IT department if they're blocking `www.googleapis.com:443`

---

### **Solution 4: Verify Google Cloud Console Configuration**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. **VERIFY these are set correctly:**
   - ✅ Authorized redirect URIs: `http://localhost:5001/auth/google/callback`
   - ✅ Client ID matches `.env` GOOGLE_CLIENT_ID
   - ✅ Client Secret is **exactly** the same (no extra spaces)

4. **Check if API is enabled:**
   - Go to APIs & Services → Enabled APIs
   - Verify **Google+ API** shows as "Enabled"

---

### **Solution 5: Test with curl**

```powershell
# Test if you can reach Google from your system
curl -v https://www.googleapis.com/

# Test with a sample OAuth request
$clientId = "YOUR_GOOGLE_CLIENT_ID"
$redirectUri = "http://localhost:5001/auth/google/callback"
$authUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=$clientId&redirect_uri=$redirectUri&response_type=code&scope=profile%20email"

Write-Host "Open this URL in browser:"
Write-Host $authUrl
```

---

## 📊 Email Service Configuration Error

You also have a Gmail SMTP TLS error:

```
Email service configuration error: Error: Client network socket disconnected before secure TLS connection was established
```

This suggests the same network issue. **Gmail SMTP is also being blocked.**

### Fix for Gmail:

1. **Update your `.env`** to use TLS instead of SSL:

```properties
EMAIL_USER=skinthiyaz777@gmail.com
EMAIL_PASS=eudg phps xcbj ucba
# Make sure these settings are in your nodemailer config
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
# Instead of 465 with SSL
```

2. **Check `backend/server.js` or `backend/config/email.js`** and ensure port 587 with TLS is used instead of 465 with SSL.

---

## ✅ Quick Checklist

- [ ] Ran `Test-NetConnection` - Got `TcpTestSucceeded: True`
- [ ] Added Node.js to Windows Firewall exceptions
- [ ] Verified GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env`
- [ ] Verified Google Cloud Console has correct Redirect URI
- [ ] Verified Google+ API is enabled in Google Cloud Console
- [ ] Restarted backend after each fix
- [ ] Tried on different network (mobile hotspot) to rule out corporate firewall

---

## 🆘 Still Not Working?

If none of these work, run this diagnostic and share the output:

```powershell
# Run as Administrator
Write-Host "=== Network Diagnostics ==="

# 1. Google connectivity
Write-Host "`n1. Testing Google..."
Test-NetConnection -ComputerName www.googleapis.com -Port 443 -InformationLevel Detailed

# 2. Gmail SMTP connectivity
Write-Host "`n2. Testing Gmail..."
Test-NetConnection -ComputerName smtp.gmail.com -Port 587 -InformationLevel Detailed

# 3. Firewall profile
Write-Host "`n3. Firewall Status:"
Get-NetFirewallProfile

# 4. Node firewall rules
Write-Host "`n4. Node.js Firewall Rules:"
Get-NetFirewallRule -DisplayName "*Node*" | Format-Table Name, Enabled, Direction, Action
```

---

## 📝 Common Causes Summary

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNRESET from www.googleapis.com:443` | Windows Firewall blocking Node.js HTTPS | Add Node.js to firewall exceptions |
| Same error | Corporate proxy blocking external HTTPS | Disconnect VPN or contact IT |
| Same error | ISP/Router blocking Google | Try different network (mobile hotspot) |
| TLS connection error on port 465 | Gmail SMTP blocked | Use port 587 with TLS instead |
| TLS connection error on port 587 | Gmail SMTP blocked | Same - Windows Firewall or ISP |

