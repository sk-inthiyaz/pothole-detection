# 🚀 Quick Fix: SMTP Timeout on Render

## Problem
```
Error: Connection timeout
code: 'ETIMEDOUT'
command: 'CONN'
```

Render blocks Gmail SMTP ports. Your app is trying to send emails but can't connect.

---

## ✅ Solution: Switch to Brevo (5 minutes)

### Step 1: Get Brevo SMTP Credentials

1. **Sign up:** https://www.brevo.com/ (free account)
2. **Navigate:** Settings → SMTP & API
3. **Create SMTP key** → Copy the credentials

You'll get:
- SMTP server: `smtp-relay.brevo.com`
- Port: `587`
- Login: your Brevo account email
- Password: the SMTP key (starts with `xsmtpsib-...`)

---

### Step 2: Update Render Environment Variables

Go to: **Render Dashboard → Your Backend Service → Environment**

**Update these variables:**
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-brevo-email@example.com
EMAIL_PASS=xsmtpsib-xxxxxxxxxxxxxxxxx
```

**Keep these as-is:**
```
EMAIL_FROM="Pothole Detection <no-reply@yourdomain.com>"
SMTP_POOL=true
```

**Click:** Save Changes (Render will auto-redeploy)

---

### Step 3: Verify It Works

Wait 2-3 minutes for deployment, then check logs:

**✅ Success looks like:**
```
✓ Email SMTP service is ready
Server running on port 5001
```

**❌ Still failing looks like:**
```
⚠️ SMTP unavailable (common on some hosting providers): ETIMEDOUT
```

If still failing, double-check credentials from Brevo dashboard.

---

## 🧪 Test Email Sending

### Option 1: Sign up a test user
```bash
curl -X POST https://your-backend.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-real-email@gmail.com",
    "password": "test123456"
  }'
```

Check your inbox for OTP email (check spam too).

### Option 2: Use dev endpoint (if email still fails)
```bash
# Get OTP without email working
curl https://your-backend.onrender.com/dev/otp/your-email@gmail.com
```

Response:
```json
{
  "email": "your-email@gmail.com",
  "otp": "123456",
  "createdAt": "2025-11-17T10:30:00.000Z"
}
```

⚠️ This endpoint is automatically disabled in production.

---

## 🎯 What Changed in Your Code

### 1. Email Service (`emailService.js`)
- ✅ Default SMTP host changed from Gmail to Brevo
- ✅ Graceful failure: app continues if SMTP fails
- ✅ Reduced timeouts (5s connection, 10s socket)
- ✅ Non-blocking verification (async startup)
- ✅ Detailed logging for debugging

### 2. Auth Routes (`authRoutes.js`)
- ✅ Signup continues even if email fails
- ✅ OTP stored in DB regardless of email status
- ✅ Dev endpoint to retrieve OTP: `GET /dev/otp/:email`
- ✅ Better error handling and logging

### 3. User Experience
- ✅ Signup always succeeds (OTP in DB)
- ✅ Email failure logged but doesn't block users
- ✅ Frontend spam warnings guide users
- ✅ Dev mode: can test without working email

---

## 📊 Current Behavior

| Action | SMTP Working | SMTP Blocked |
|--------|--------------|--------------|
| User signup | ✅ Email sent | ✅ OTP in DB, use `/dev/otp` |
| OTP verify | ✅ Works | ✅ Works (OTP from DB) |
| Welcome email | ✅ Sent | ⚠️ Skipped (non-critical) |
| Login | ✅ Works | ✅ Works |
| Password reset | ✅ Works | ✅ Use `/dev/otp` |

---

## 🔍 Still Not Working?

### Check Brevo Dashboard
1. Login to Brevo
2. Go to: Statistics → Email
3. Check if emails are being sent but not delivered

### Check Render Logs
```bash
# Look for:
"✓ Email SMTP service is ready"  # ← Good!
"⚠️ SMTP unavailable"              # ← Still blocked
"✓ OTP email sent"                 # ← Email working
```

### Check Spam Folder
Brevo emails sometimes land in spam initially. Mark as "Not Spam" to train filters.

### Verify Credentials
```bash
# Test SMTP connection manually
telnet smtp-relay.brevo.com 587
# Should connect without timeout
```

---

## 🆘 Alternative Solutions

### Option 1: Resend (Recommended Alternative)
Modern email API (no SMTP, pure HTTP):
- Sign up: https://resend.com/
- Free tier: 3,000 emails/month
- More reliable than SMTP
- Requires code change (see `SMTP_TROUBLESHOOTING.md`)

### Option 2: SendGrid
Re-add SendGrid (removed earlier):
- Sign up: https://sendgrid.com/
- Free tier: 100 emails/day
- Uses HTTP API (no SMTP ports)
- Requires code change (see `SMTP_TROUBLESHOOTING.md`)

### Option 3: Keep Current Setup for Dev
- Leave SMTP failing
- Use `/dev/otp/:email` endpoint
- Good enough for development/testing
- Must fix before real users sign up

---

## 📚 Documentation

See these files for more details:
- **SMTP_TROUBLESHOOTING.md** - Complete troubleshooting guide
- **ENV_VARS_GUIDE.md** - All environment variables
- **backend/services/emailService.js** - Email service code

---

## ✅ Recommended: Production Checklist

Before launching with real users:

- [ ] Brevo SMTP credentials added to Render
- [ ] Test email received successfully
- [ ] Checked spam folder (mark as safe)
- [ ] Set up domain authentication (SPF/DKIM)
- [ ] Disabled `/dev/otp` endpoint (`NODE_ENV=production`)
- [ ] Tested full signup → OTP → login flow
- [ ] Monitored Brevo dashboard for deliverability
- [ ] Added custom domain to `EMAIL_FROM`

---

**Summary:** Your app now handles SMTP failures gracefully. For best results, switch to Brevo SMTP (5 min setup). For dev/testing, use the `/dev/otp` endpoint.
