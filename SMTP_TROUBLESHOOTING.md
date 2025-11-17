# 📧 SMTP Troubleshooting Guide

## Current Issue: ETIMEDOUT on Render

The `ETIMEDOUT` error occurs when the hosting provider (Render) blocks outbound SMTP connections on ports 25, 465, or 587.

## ✅ Solutions Implemented

### 1. **Graceful Degradation**
The email service now handles SMTP failures gracefully:
- Logs email details instead of crashing
- User signup/OTP flows continue working
- Non-blocking for critical operations

### 2. **Development OTP Lookup Endpoint**
For testing when SMTP is unavailable:

```bash
# Get the OTP for an email (development only)
GET https://your-backend.onrender.com/dev/otp/user@example.com
```

**Response:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "createdAt": "2025-11-17T10:30:00.000Z",
  "expiresAt": "2025-11-17T10:40:00.000Z",
  "warning": "This endpoint is for development only"
}
```

⚠️ **Security Note:** This endpoint is disabled in production unless `ALLOW_OTP_LOOKUP=true` is set.

---

## 🔧 Recommended Solutions for Production

### Option 1: Use Brevo (Sendinblue) SMTP ✅ **RECOMMENDED**

Brevo's SMTP relay is more reliable on hosting platforms:

**Environment Variables:**
```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-brevo-login-email@example.com
EMAIL_PASS=your-brevo-smtp-key
EMAIL_FROM="Pothole Detection <no-reply@yourdomain.com>"
```

**Get Brevo SMTP credentials:**
1. Sign up: https://www.brevo.com/
2. Go to: Settings → SMTP & API
3. Create SMTP key
4. Copy credentials to Render env vars

**Why Brevo?**
- ✅ Free tier: 300 emails/day
- ✅ Reliable on Render/Railway/Vercel
- ✅ No port blocking issues
- ✅ Built-in deliverability features
- ✅ Email analytics dashboard

---

### Option 2: Use Resend (Modern Alternative)

**Switch to Resend API** (no SMTP, pure HTTP):

```bash
npm install resend
```

**Update `emailService.js`:**
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function deliver(mailOptions) {
  const { data, error } = await resend.emails.send({
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.html,
  });
  
  if (error) throw error;
  return { success: true, messageId: data.id };
}
```

**Environment Variables:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev  # or your verified domain
```

**Get Resend API key:**
1. Sign up: https://resend.com/
2. Get API key from dashboard
3. Free tier: 3,000 emails/month

---

### Option 3: Gmail SMTP (Less Reliable on Render)

Gmail often blocks cloud hosting IPs. If you must use it:

**Environment Variables:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

**Generate App Password:**
1. https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other"
3. Copy 16-character password

⚠️ **Limitations:**
- May still timeout on Render
- Daily sending limit: 500 emails
- Requires 2FA enabled

---

### Option 4: SendGrid HTTP API (You removed this)

If you want to re-add SendGrid (via HTTP, not SMTP):

```bash
npm install @sendgrid/mail
```

**Environment Variables:**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=verified-sender@yourdomain.com
```

**Pros:**
- No SMTP ports needed (pure HTTP)
- 100 emails/day free tier
- Enterprise-grade deliverability

---

## 🧪 Testing Email Configuration

### Test 1: Verify SMTP Connection
```bash
# Check if SMTP is reachable
curl -v telnet://smtp-relay.brevo.com:587
```

### Test 2: Send Test Email via Backend
```bash
# Signup a test user
curl -X POST https://your-backend.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test 3: Check Render Logs
```bash
# Look for email service logs
# Render Dashboard → Your Service → Logs
# Search for: "Email SMTP service is ready" or "SMTP unavailable"
```

---

## 📊 Current Behavior Matrix

| Scenario | SMTP Working | SMTP Blocked |
|----------|--------------|--------------|
| User Signup | ✅ Email sent | ⚠️ OTP logged, use `/dev/otp` |
| OTP Verification | ✅ Works | ✅ Works (OTP in DB) |
| Welcome Email | ✅ Sent | ⚠️ Skipped (non-critical) |
| Password Reset | ✅ Works | ⚠️ Use `/dev/otp` |
| Complaint Confirm | ✅ Sent | ⚠️ Skipped (complaint saved) |

---

## 🚀 Quick Migration to Brevo

1. **Sign up for Brevo** (5 minutes)
2. **Get SMTP credentials** from Settings → SMTP & API
3. **Update Render environment variables:**
   ```
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   EMAIL_USER=your-brevo-email@example.com
   EMAIL_PASS=your-brevo-smtp-key
   ```
4. **Redeploy service** (Render auto-redeploys on env change)
5. **Test signup flow** with real email
6. **Verify logs:** Should see "✓ Email SMTP service is ready"

---

## 🔍 Debugging Checklist

If emails still don't work after configuration:

- [ ] Confirmed `SMTP_HOST` is correct (no typos)
- [ ] Confirmed `SMTP_PORT` is 587 (not 465 or 25)
- [ ] Confirmed `SMTP_SECURE=false` for port 587
- [ ] Confirmed `EMAIL_USER` is full login email
- [ ] Confirmed `EMAIL_PASS` is SMTP key, not account password
- [ ] Checked Render logs for connection errors
- [ ] Verified Brevo account is active (not suspended)
- [ ] Checked spam folder in recipient inbox
- [ ] Tested with different email provider (Gmail vs Outlook)

---

## 📝 Environment Variable Reference

**Minimum required for Brevo:**
```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-brevo-login@example.com
EMAIL_PASS=your-brevo-smtp-key
EMAIL_FROM="Pothole Detection <no-reply@yourdomain.com>"
```

**Optional optimizations:**
```bash
SMTP_POOL=true              # Enable connection pooling
SMTP_MAX_CONNECTIONS=5       # Max concurrent connections
SMTP_MAX_MESSAGES=100        # Max messages per connection
EMAIL_DISABLE=false          # Set true to disable all emails
LOG_OTP=true                 # Log OTPs to console (dev only)
ALLOW_OTP_LOOKUP=true        # Enable /dev/otp endpoint (dev only)
```

---

## 🆘 Still Having Issues?

**Check these common mistakes:**

1. **Wrong SMTP credentials**
   - Double-check copy-paste from Brevo dashboard
   - Ensure no extra spaces in env vars

2. **Firewall rules**
   - Render generally allows port 587
   - Some regions may have restrictions

3. **Email provider blocking**
   - Brevo/Resend rarely have issues
   - Gmail frequently blocks cloud IPs

4. **Domain authentication**
   - Not required for basic sending
   - Improves deliverability if configured

**Need help?**
- Brevo support: https://help.brevo.com/
- Render support: https://render.com/docs
- GitHub issues: Post logs and env config (redact credentials)

---

## ✅ Best Practice: Production Setup

1. **Use Brevo or Resend** (not Gmail)
2. **Set up domain authentication** (SPF, DKIM, DMARC)
3. **Monitor email logs** in Brevo dashboard
4. **Set up custom domain** for `EMAIL_FROM`
5. **Test deliverability** with Mail-Tester: https://www.mail-tester.com/
6. **Disable dev endpoints** (`ALLOW_OTP_LOOKUP=false` in production)
7. **Set up email templates** in Brevo (optional)
8. **Configure webhooks** for bounce tracking (optional)

---

Made with 🔧 to fix SMTP timeouts on Render.
