# Credential Rotation Guide for Production

## 🔐 When to Rotate Credentials

**Rotate ALL credentials immediately if:**
- You suspect a security breach
- Credentials were accidentally committed to Git
- An employee with access leaves the team
- You're deploying to production for the first time

**Regular rotation schedule:**
- Every 90 days (recommended)
- After any security incident
- Before major releases

---

## 📋 Step-by-Step Rotation Instructions

### 1. MongoDB Atlas Password

**Current credential location:** `MONGO_URI` in `.env`

**Steps to rotate:**
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Database Access** in the left sidebar
3. Find user `skinthiyaz777` and click **Edit**
4. Click **Edit Password** → **Autogenerate Secure Password**
5. Copy the new password
6. Click **Update User**
7. Update your connection string in `.env`:
   ```
   MONGO_URI=mongodb+srv://skinthiyaz777:NEW_PASSWORD_HERE@cluster0.psuc0.mongodb.net/potholeDB?retryWrites=true&w=majority&appName=Cluster0
   ```
8. Restart your backend server
9. Test database connection

**Rollback:** Keep the old password for 24 hours in case of issues

---

### 2. Gmail App Password

**Current credential location:** `EMAIL_PASS` in `.env`

**Steps to rotate:**
1. Log in to your Google Account: https://myaccount.google.com/
2. Go to **Security** → **2-Step Verification** (must be enabled)
3. Scroll down to **App passwords**
4. Click the app password named "pothole-detection" or similar
5. Click **Remove** to revoke the old password
6. Click **Create new app password**
7. Select **Mail** and **Other (Custom name)**
8. Name it: "Pothole Detection Backend - Nov 2025"
9. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
10. Update `.env`:
    ```
    EMAIL_PASS=xxxx xxxx xxxx xxxx
    ```
11. Restart backend server
12. Test by triggering an email (signup or complaint)

**Important:** If you disable 2FA, all app passwords are automatically revoked.

---

### 3. Google OAuth Credentials

**Current credential location:** `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

**Steps to rotate CLIENT_SECRET:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project
3. Find your OAuth 2.0 Client ID (the one with ID starting with `271656434122-...`)
4. Click the **pencil icon** to edit
5. Scroll down and click **"Add secret"** under "Client secrets"
6. Click **"Create new secret"**
7. Copy the new secret immediately (you can't view it again!)
8. Update `.env`:
   ```
   GOOGLE_CLIENT_SECRET=GOCSPX-new_secret_here
   ```
9. **DO NOT delete the old secret yet** - wait 24-48 hours
10. Restart backend server
11. Test Google login flow
12. After confirming it works, delete the old secret

**Note:** Google allows multiple active secrets simultaneously for zero-downtime rotation.

---

### 4. Microsoft OAuth Credentials

**Current credential location:** `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` in `.env`

**Steps to rotate CLIENT_SECRET:**
1. Go to [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Find your app registration
3. Click **Certificates & secrets** in left sidebar
4. Under **Client secrets**, click **+ New client secret**
5. Add description: "Pothole Detection - Nov 2025"
6. Set expiration (24 months recommended)
7. Click **Add**
8. **Copy the VALUE immediately** (not the Secret ID!)
9. Update `.env`:
   ```
   MICROSOFT_CLIENT_SECRET=new_value_here
   ```
10. **Keep old secret active** for 24-48 hours
11. Restart backend server
12. Test Microsoft login flow
13. After confirming it works, delete the old secret

**Important:** Microsoft secrets expire automatically. Set calendar reminders!

---

### 5. JWT & Session Secrets

**Current credential location:** `JWT_SECRET` and `SESSION_SECRET` in `.env`

**Steps to rotate:**
1. Generate new secrets:
   ```bash
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
   node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Update `.env` with new values
3. **⚠️ WARNING:** This will invalidate ALL existing user sessions and JWT tokens
4. Users will need to log in again
5. Schedule rotation during low-traffic hours
6. Consider implementing a grace period (accept both old + new secrets for 24h)
7. Announce planned maintenance to users

**Best practice:** Rotate these every 90 days or after any suspected breach.

---

## 🚀 Production Deployment Credential Checklist

Before deploying to production, ensure you have:

- [ ] **New MongoDB Atlas cluster** for production (don't use dev database!)
- [ ] **Separate Gmail account** or SMTP service for production emails
- [ ] **Production OAuth credentials** with production callback URLs registered
- [ ] **New JWT/SESSION secrets** (never reuse dev secrets in production!)
- [ ] **Environment variables set** in hosting platform (Heroku, AWS, etc.)
- [ ] **IP whitelist updated** in MongoDB Atlas for production server IPs
- [ ] **Backup of all credentials** stored securely (password manager)

---

## 🔒 Secure Credential Storage

### Local Development
- Use `.env` file (already in `.gitignore`)
- Never commit credentials to Git
- Use a password manager (1Password, LastPass, Bitwarden)

### Production Hosting
- **Heroku:** Use Config Vars (Settings → Config Vars)
- **AWS:** Use AWS Secrets Manager or Systems Manager Parameter Store
- **Azure:** Use Azure Key Vault
- **DigitalOcean:** Use App Platform environment variables
- **Vercel/Netlify:** Use Environment Variables in dashboard

### Team Sharing
- **DO NOT** share via email, Slack, or messaging apps
- **USE** encrypted password managers with team vaults
- Limit access to only necessary team members
- Use role-based access control (RBAC)

---

## 📞 Emergency Response

**If credentials are compromised:**

1. **Immediate actions (within 1 hour):**
   - Rotate ALL credentials immediately
   - Review MongoDB Atlas access logs
   - Check email sent from your account
   - Disable compromised OAuth apps
   - Force logout all users (rotate JWT_SECRET)

2. **Investigation (within 24 hours):**
   - Review Git commit history
   - Check for unauthorized database changes
   - Audit recent login attempts
   - Review application logs for suspicious activity

3. **Post-incident (within 1 week):**
   - Document what happened
   - Update security procedures
   - Implement additional monitoring
   - Consider security audit

---

## 📝 Rotation Log Template

Keep a log of credential rotations:

```
Date: YYYY-MM-DD
Credential: MongoDB Password
Reason: Scheduled 90-day rotation
Rotated by: [Your Name]
Tested: ✅ Yes
Issues: None
Next rotation due: YYYY-MM-DD
```

---

## ✅ Post-Rotation Testing Checklist

After rotating any credential, test:

- [ ] Backend server starts without errors
- [ ] Database connection successful
- [ ] User signup with OTP email delivery
- [ ] User login (local credentials)
- [ ] Google OAuth login
- [ ] Microsoft OAuth login
- [ ] Pothole complaint submission with email
- [ ] All API endpoints respond correctly
- [ ] Check logs for authentication errors

---

**Questions?** Review MongoDB Atlas docs, Google Cloud docs, or Azure docs for detailed provider-specific instructions.
