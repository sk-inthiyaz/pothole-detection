# 🚀 Brevo API Key Setup (2 Minutes)

## Why Brevo API Instead of SMTP?

**Problem:** Render's free tier blocks SMTP ports (587, 465, 25)
**Solution:** Brevo API uses HTTPS (port 443) which is never blocked

---

## Step 1: Get Your Brevo API Key

1. **Login to Brevo:** https://app.brevo.com/
2. **Navigate:** Top right → Your name → SMTP & API
3. **Create API key:**
   - Click "Create a new API key"
   - Name it: `Pothole Detection Production`
   - Copy the key (starts with `xkeysib-...`)

**Screenshot location:** Settings → SMTP & API → API Keys tab

---

## Step 2: Add to Render Environment

Go to: **Render Dashboard → pothole-detection-backend → Environment**

**Add NEW variable:**
```
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx
```

**Keep existing variables:**
```
EMAIL_FROM="Pothole Detection <no-reply@yourdomain.com>"
EMAIL_USER=your-brevo-email@example.com
```

**You can REMOVE these (SMTP not needed anymore):**
```
SMTP_HOST
SMTP_PORT
SMTP_SECURE
EMAIL_PASS
SMTP_POOL
```

**Click:** Save Changes (Render will auto-redeploy)

---

## Step 3: Verify It Works

**Wait 2-3 minutes** for Render to redeploy, then check logs:

**✅ Success looks like:**
```
✓ Brevo API email service initialized
Server running on port 5001
```

**Test email sending:**
```bash
curl -X POST https://pothole-detection-backend.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-real-email@gmail.com",
    "password": "test123456"
  }'
```

Check your inbox (and spam) for OTP email!

---

## What Changed in Your Code?

### Before (SMTP - blocked on Render)
```javascript
// Used nodemailer with SMTP ports 587/465
// ❌ Render blocks these ports → ETIMEDOUT
```

### After (HTTP API - works everywhere)
```javascript
// Uses Brevo HTTP API on port 443 (HTTPS)
// ✅ Never blocked on any hosting platform
// Falls back to SMTP if API key not set (dev mode)
```

---

## Benefits of Brevo API

| Feature | SMTP | Brevo API |
|---------|------|-----------|
| **Port used** | 587/465 (often blocked) | 443 (HTTPS, never blocked) |
| **Setup time** | 5 min | 2 min |
| **Reliability on Render** | ❌ Fails | ✅ Always works |
| **Free tier** | 300 emails/day | 300 emails/day |
| **Email analytics** | No | ✅ Yes (dashboard) |
| **Delivery tracking** | No | ✅ Yes (opens, clicks) |

---

## Troubleshooting

### "Brevo API failed: Invalid API key"
❌ **Problem:** Wrong API key or typo  
✅ **Fix:** Copy-paste key again from Brevo dashboard (no extra spaces)

### "Brevo API failed: Unauthorized sender"
❌ **Problem:** `EMAIL_FROM` email not verified in Brevo  
✅ **Fix:** Either:
1. Use Brevo's default sender: `no-reply@your-account.brevo.com`
2. OR verify your domain in Brevo: Settings → Senders, Domains & Dedicated IPs

### Still seeing "SMTP unavailable" in logs
✅ **This is OK!** The app tries SMTP first, then falls back to API. As long as you see "Brevo API email service initialized", emails will work.

### Email received but in spam
✅ **Mark as "Not Spam"** once, future emails will go to inbox
✅ **Better solution:** Set up domain authentication (SPF/DKIM) in Brevo settings

---

## Development vs Production

### Local Development (.env file)
```bash
# Option 1: Use Brevo API (recommended)
BREVO_API_KEY=xkeysib-xxxxx...
EMAIL_FROM="Pothole Detection <no-reply@yourdomain.com>"
EMAIL_USER=your-brevo-email@example.com

# Option 2: Use Gmail SMTP (works locally)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
```

### Production (Render)
```bash
# Always use Brevo API in production
BREVO_API_KEY=xkeysib-xxxxx...
EMAIL_FROM="Pothole Detection <no-reply@yourdomain.com>"
EMAIL_USER=your-brevo-email@example.com
```

---

## Email Sending Priority

The app tries email delivery in this order:

1. **Brevo API** (if `BREVO_API_KEY` is set) ← **Recommended**
2. **SMTP** (if `EMAIL_USER` and `EMAIL_PASS` are set) ← Fallback
3. **Log to console** (if both fail) ← Dev mode

Set `BREVO_API_KEY` in production for 100% reliability!

---

## Quick Reference

| Task | Command/Link |
|------|--------------|
| Get API key | https://app.brevo.com/ → Settings → SMTP & API |
| Test signup | `curl -X POST .../signup -d '{"name":"Test","email":"...","password":"..."}` |
| View logs | Render Dashboard → Service → Logs |
| Check email stats | https://app.brevo.com/ → Statistics → Email |
| Dev OTP endpoint | `GET /dev/otp/:email` (non-production only) |

---

## ✅ Checklist

Before marking this as complete:

- [ ] Brevo account created
- [ ] API key generated and copied
- [ ] `BREVO_API_KEY` added to Render environment
- [ ] Render service redeployed (auto after env change)
- [ ] Logs show "Brevo API email service initialized"
- [ ] Test email sent and received
- [ ] Checked spam folder and marked as safe
- [ ] Removed old SMTP variables (optional cleanup)

---

**Estimated time:** 2 minutes  
**Result:** Emails will work reliably on Render and any other hosting platform!
