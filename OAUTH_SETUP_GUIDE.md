# OAuth Setup Guide - Google & Microsoft Authentication

## 📋 Overview
This guide will help you set up Google and Microsoft OAuth 2.0 authentication for the Pothole Detection application.

---

## 🔵 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select an existing project
3. Name your project: **"Pothole Detection"**
4. Click **"Create"**

### Step 2: Enable Google+ API

1. In the left sidebar, click **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Click **"Create"**

**Fill in the required fields:**
- **App name**: Pothole Detection
- **User support email**: your-email@gmail.com
- **Developer contact email**: your-email@gmail.com
- **App logo** (optional): Upload your app logo
- **Application home page**: http://localhost:3000
- **Authorized domains**: localhost (for development)

4. Click **"Save and Continue"**

**Scopes:**
- Add scopes: `userinfo.email` and `userinfo.profile`
- Click **"Save and Continue"**

**Test users (for development):**
- Add your email address and any test accounts
- Click **"Save and Continue"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Select **"Web application"**

**Configure:**
- **Name**: Pothole Detection Web Client
- **Authorized JavaScript origins**:
  ```
  http://localhost:3000
  http://localhost:5001
  ```
- **Authorized redirect URIs**:
  ```
  http://localhost:5001/auth/google/callback
  ```

4. Click **"Create"**
5. **Copy the Client ID and Client Secret**
6. Click **"OK"**

### Step 5: Update .env File

Open `backend/.env` and add:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
```

---

## 🔷 Microsoft OAuth Setup

### Step 1: Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account
3. Search for **"Azure Active Directory"** or **"Microsoft Entra ID"**
4. Click **"App registrations"** in the left menu
5. Click **"+ New registration"**

### Step 2: Configure Application

**Fill in the registration form:**
- **Name**: Pothole Detection
- **Supported account types**: 
  - Select **"Accounts in any organizational directory and personal Microsoft accounts"**
- **Redirect URI**:
  - Platform: **Web**
  - URI: `http://localhost:5001/auth/microsoft/callback`

Click **"Register"**

### Step 3: Copy Application (client) ID

On the **Overview** page:
- Copy the **Application (client) ID** - you'll need this

### Step 4: Create Client Secret

1. In the left menu, click **"Certificates & secrets"**
2. Click **"+ New client secret"**
3. **Description**: Pothole Detection Secret
4. **Expires**: Choose 24 months (or your preference)
5. Click **"Add"**
6. **⚠️ IMPORTANT**: Copy the **Value** immediately (it won't be shown again)

### Step 5: Configure API Permissions

1. Click **"API permissions"** in the left menu
2. You should see **Microsoft Graph** > **User.Read** (delegated) - this is added by default
3. If not, click **"+ Add a permission"**:
   - Select **Microsoft Graph**
   - Select **Delegated permissions**
   - Check **User.Read**
   - Click **"Add permissions"**

### Step 6: Configure Authentication Settings

1. Click **"Authentication"** in the left menu
2. Under **"Implicit grant and hybrid flows"**, enable:
   - ✅ **ID tokens** (used for implicit and hybrid flows)
3. Under **"Supported account types"**, ensure:
   - **Accounts in any organizational directory and personal Microsoft accounts** is selected
4. Click **"Save"**

### Step 7: Update .env File

Open `backend/.env` and add:
```env
MICROSOFT_CLIENT_ID=your_application_client_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_value_here
MICROSOFT_CALLBACK_URL=http://localhost:5001/auth/microsoft/callback
```

---

## 🧪 Testing OAuth Setup

### Test Google OAuth:

1. Start your backend server:
```powershell
cd backend
npm start
```

2. Open browser and navigate to:
```
http://localhost:5001/auth/google
```

3. You should be redirected to Google login
4. After successful login, check the redirect URL contains a token

### Test Microsoft OAuth:

1. Navigate to:
```
http://localhost:5001/auth/microsoft
```

2. Sign in with your Microsoft account
3. Grant permissions
4. Check redirect URL contains a token

---

## 🚀 Production Deployment

### For Production URLs:

#### Google Cloud Console:
1. Go to **Credentials** > Edit OAuth 2.0 Client
2. Add production URLs to:
   - **Authorized JavaScript origins**:
     ```
     https://your-frontend-domain.com
     https://your-backend-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://your-backend-domain.com/auth/google/callback
     ```

#### Azure Portal:
1. Go to **App registrations** > Your app > **Authentication**
2. Add redirect URI:
   ```
   https://your-backend-domain.com/auth/microsoft/callback
   ```

#### Update Production .env:
```env
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/auth/google/callback
MICROSOFT_CALLBACK_URL=https://your-backend-domain.com/auth/microsoft/callback
```

---

## 🔐 Security Best Practices

1. **Never commit .env file** - Add it to `.gitignore`
2. **Use environment variables** in production (Azure App Service, Vercel, etc.)
3. **Rotate secrets regularly** - Update client secrets every 6-12 months
4. **Enable HTTPS** in production - OAuth requires secure connections
5. **Restrict redirect URIs** - Only add necessary domains
6. **Monitor OAuth usage** - Check logs in Google/Azure dashboards

---

## 🐛 Troubleshooting

### Common Issues:

#### "Redirect URI mismatch"
- Ensure the callback URL in .env matches exactly with the one registered in Google/Azure
- Check for trailing slashes
- Verify the protocol (http vs https)

#### "Invalid client"
- Double-check CLIENT_ID and CLIENT_SECRET in .env
- Make sure there are no extra spaces
- Verify credentials haven't expired

#### "Access blocked: This app's request is invalid"
- Your OAuth consent screen may not be configured
- Add your email as a test user in Google Cloud Console

#### "AADSTS50011: The reply URL specified in the request does not match"
- Verify redirect URI in Azure Portal matches your .env
- Check the app registration is not deleted

#### Email service not working:
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:**
1. Enable "Less secure app access" in Gmail (not recommended)
2. **Better**: Use Gmail App Passwords:
   - Go to Google Account > Security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use that password in EMAIL_PASS

---

## 📧 Email Configuration Notes

### Gmail App Password Setup:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Generate password
6. Copy the 16-character password (without spaces)
7. Use this in your .env:
```env
EMAIL_PASS=your_16_character_app_password
```

### Why use App Passwords?
- More secure than your main password
- Can be revoked without changing your main password
- Required when 2FA is enabled

---

## ✅ Verification Checklist

Before going live:

### Backend:
- [ ] All environment variables set in .env
- [ ] OAuth credentials are valid and not expired
- [ ] Email service is working (test OTP email)
- [ ] Redirect URIs match exactly
- [ ] CORS is configured for frontend URL
- [ ] Session secret is strong and unique

### Google OAuth:
- [ ] Project created in Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI added and matches .env
- [ ] Test user added (for development)
- [ ] Google+ API enabled

### Microsoft OAuth:
- [ ] App registered in Azure Portal
- [ ] Client secret created and copied
- [ ] Redirect URI added and matches .env
- [ ] API permissions configured (User.Read)
- [ ] Supported account types set correctly

### Testing:
- [ ] Can sign up with email and receive OTP
- [ ] Can verify OTP and activate account
- [ ] Can login with Google account
- [ ] Can login with Microsoft account
- [ ] OAuth redirects work correctly
- [ ] JWT tokens are generated
- [ ] User data is saved to MongoDB

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Nodemailer Documentation](https://nodemailer.com/about/)

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all credentials are correct
3. Check backend console logs for errors
4. Test each OAuth provider separately
5. Ensure MongoDB is running
6. Verify email service is configured correctly

For OAuth-specific issues:
- Google: Check [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- Microsoft: Check [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)

---

**Setup completed!** Your application now supports:
- ✅ Email/Password authentication with OTP verification
- ✅ Google OAuth 2.0
- ✅ Microsoft OAuth 2.0
