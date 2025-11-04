# Authentication API Documentation

## 🔐 Authentication System Overview

The Pothole Detection application now supports three authentication methods:
1. **Email/Password** with OTP verification
2. **Google OAuth 2.0**
3. **Microsoft OAuth 2.0**

---

## API Endpoints

### Base URL
```
http://localhost:5001
```

Production: `https://your-backend-domain.com`

---

## 📧 Email/Password Authentication

### 1. Sign Up

**Endpoint:** `POST /signup`

**Description:** Register a new user with email and password. Sends OTP verification email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully! Please check your email for OTP verification.",
  "email": "john@example.com",
  "requiresVerification": true
}
```

**Error Responses:**

400 - Missing fields:
```json
{
  "error": "Name, email, and password are required."
}
```

400 - Invalid email:
```json
{
  "error": "Invalid email format."
}
```

400 - Weak password:
```json
{
  "error": "Password must be at least 6 characters long."
}
```

409 - Email exists (unverified):
```json
{
  "error": "Email already registered but not verified. Please verify your email or request a new OTP.",
  "needsVerification": true
}
```

409 - Email exists (verified):
```json
{
  "error": "Email already registered and verified."
}
```

500 - Email sending failed:
```json
{
  "error": "Failed to send verification email. Please try again."
}
```

---

### 2. Verify OTP

**Endpoint:** `POST /verify-otp`

**Description:** Verify email address using OTP sent via email.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "verified": true
  }
}
```

**Error Responses:**

400 - Missing fields:
```json
{
  "error": "Email and OTP are required."
}
```

400 - Invalid/expired OTP:
```json
{
  "error": "Invalid or expired OTP."
}
```

400 - Already verified:
```json
{
  "error": "Email already verified."
}
```

404 - User not found:
```json
{
  "error": "User not found."
}
```

---

### 3. Resend OTP

**Endpoint:** `POST /resend-otp`

**Description:** Request a new OTP if the previous one expired or was lost.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "New OTP sent successfully! Please check your email."
}
```

**Error Responses:**

400 - Missing email:
```json
{
  "error": "Email is required."
}
```

400 - Already verified:
```json
{
  "error": "Email already verified."
}
```

404 - User not found:
```json
{
  "error": "User not found."
}
```

---

### 4. Login

**Endpoint:** `POST /login`

**Description:** Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "verified": true,
    "authProvider": "local",
    "profilePicture": null
  }
}
```

**Error Responses:**

400 - Missing fields:
```json
{
  "error": "Email and password are required."
}
```

400 - OAuth account:
```json
{
  "error": "This account was created using google. Please use google login."
}
```

403 - Not verified:
```json
{
  "error": "Please verify your email before logging in.",
  "needsVerification": true,
  "email": "john@example.com"
}
```

401 - Invalid credentials:
```json
{
  "error": "Invalid credentials"
}
```

404 - User not found:
```json
{
  "error": "User not found"
}
```

---

## 🔵 Google OAuth 2.0

### 1. Initiate Google OAuth

**Endpoint:** `GET /auth/google`

**Description:** Redirects user to Google OAuth consent screen.

**Usage:**
```javascript
window.location.href = 'http://localhost:5001/auth/google';
```

### 2. Google OAuth Callback

**Endpoint:** `GET /auth/google/callback`

**Description:** Handles Google OAuth callback. Automatically creates or links user account.

**Success Redirect:**
```
http://localhost:3000/auth/callback?token=JWT_TOKEN&provider=google&name=John%20Doe&email=john@gmail.com
```

**Error Redirect:**
```
http://localhost:3000/login?error=oauth_failed
```

---

## 🔷 Microsoft OAuth 2.0

### 1. Initiate Microsoft OAuth

**Endpoint:** `GET /auth/microsoft`

**Description:** Redirects user to Microsoft OAuth consent screen.

**Usage:**
```javascript
window.location.href = 'http://localhost:5001/auth/microsoft';
```

### 2. Microsoft OAuth Callback

**Endpoint:** `GET /auth/microsoft/callback`

**Description:** Handles Microsoft OAuth callback. Automatically creates or links user account.

**Success Redirect:**
```
http://localhost:3000/auth/callback?token=JWT_TOKEN&provider=microsoft&name=John%20Doe&email=john@outlook.com
```

**Error Redirect:**
```
http://localhost:3000/login?error=oauth_failed
```

---

## 🔒 Protected Routes

### Get Current User

**Endpoint:** `GET /auth/current-user`

**Description:** Get currently authenticated user info (requires session).

**Success Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "verified": true,
    "authProvider": "google",
    "profilePicture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error Response (401):**
```json
{
  "error": "Not authenticated"
}
```

---

### Logout

**Endpoint:** `GET /logout`

**Description:** End user session and clear cookies.

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🧪 Testing Examples

### Using cURL

**1. Sign Up:**
```bash
curl -X POST http://localhost:5001/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**2. Verify OTP:**
```bash
curl -X POST http://localhost:5001/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

**3. Login:**
```bash
curl -X POST http://localhost:5001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**4. Resend OTP:**
```bash
curl -X POST http://localhost:5001/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Using JavaScript (Frontend)

**Sign Up:**
```javascript
const response = await fetch('http://localhost:5001/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepass123'
  })
});
const data = await response.json();
console.log(data);
```

**Verify OTP:**
```javascript
const response = await fetch('http://localhost:5001/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    otp: '123456'
  })
});
const data = await response.json();
if (response.ok) {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

**Google Login:**
```javascript
// Redirect to Google OAuth
window.location.href = 'http://localhost:5001/auth/google';
```

**Microsoft Login:**
```javascript
// Redirect to Microsoft OAuth
window.location.href = 'http://localhost:5001/auth/microsoft';
```

---

## 📊 User Database Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required for local auth),
  verified: Boolean (default: false),
  verificationToken: String,
  googleId: String (unique, sparse),
  microsoftId: String (unique, sparse),
  authProvider: String (enum: ['local', 'google', 'microsoft'], default: 'local'),
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 OTP Database Schema

```javascript
{
  _id: ObjectId,
  email: String (required, indexed),
  otp: String (required),
  createdAt: Date (default: Date.now, expires after 600 seconds)
}
```

**Note:** OTPs automatically expire after 10 minutes via MongoDB TTL index.

---

## 🎯 Authentication Flow Diagrams

### Email/Password Flow:
```
1. User fills signup form
2. POST /signup → Backend validates input
3. Backend creates unverified user in DB
4. Backend generates 6-digit OTP
5. OTP saved to OTP collection (10 min TTL)
6. Email sent with OTP
7. User receives email, enters OTP
8. POST /verify-otp → Backend validates OTP
9. User marked as verified in DB
10. JWT token generated and returned
11. User redirected to app
```

### Google OAuth Flow:
```
1. User clicks "Continue with Google"
2. Redirected to /auth/google
3. Backend redirects to Google OAuth consent
4. User grants permissions
5. Google redirects to /auth/google/callback with code
6. Backend exchanges code for user profile
7. Backend creates/links user account (auto-verified)
8. JWT token generated
9. User redirected to /auth/callback with token
10. Frontend stores token and redirects to app
```

### Microsoft OAuth Flow:
```
1. User clicks "Continue with Microsoft"
2. Redirected to /auth/microsoft
3. Backend redirects to Microsoft OAuth consent
4. User grants permissions
5. Microsoft redirects to /auth/microsoft/callback
6. Backend exchanges token for user profile
7. Backend creates/links user account (auto-verified)
8. JWT token generated
9. User redirected to /auth/callback with token
10. Frontend stores token and redirects to app
```

---

## 🛠️ Environment Variables Required

```env
# Email Service
EMAIL_USER=skinthiyaz777@gmail.com
EMAIL_PASS=eudg phps xcbj ucba

# JWT & Sessions
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback

# OAuth - Microsoft
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_CALLBACK_URL=http://localhost:5001/auth/microsoft/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Testing Checklist

- [ ] Sign up with email/password
- [ ] Receive OTP email
- [ ] Verify OTP successfully
- [ ] Login with verified account
- [ ] Resend OTP if expired
- [ ] Try to login without verification (should fail)
- [ ] Sign up with Google OAuth
- [ ] Sign up with Microsoft OAuth
- [ ] Link existing email account with OAuth
- [ ] Logout functionality
- [ ] JWT token persistence
- [ ] Protected routes with valid token
- [ ] Error handling for all scenarios

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solution:** Use Gmail App Password instead of regular password. See OAUTH_SETUP_GUIDE.md

### Issue: "Redirect URI mismatch"
**Solution:** Ensure callback URLs in .env match exactly with Google/Azure console

### Issue: "OTP not received"
**Solution:** 
1. Check spam folder
2. Verify EMAIL_USER and EMAIL_PASS are correct
3. Check backend console for email errors

### Issue: "Invalid or expired OTP"
**Solution:** OTPs expire after 10 minutes. Request new OTP using /resend-otp

### Issue: "This account was created using google"
**Solution:** User must use the same OAuth provider they signed up with

---

## 📚 Additional Resources

- [Complete OAuth Setup Guide](./OAUTH_SETUP_GUIDE.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Deployment Guide](./README.md#production-deployment-guide)

---

**Last Updated:** November 3, 2025  
**API Version:** 2.0  
**Authentication:** JWT + OAuth 2.0
