# 🧪 Post-Deployment Testing Checklist

**Project:** Pothole Detection System  
**Date:** _____________  
**Deployed By:** _____________

---

## 📋 Deployment URLs

Fill in after deployment:

```
✅ Frontend:  https://__________________________________.vercel.app
✅ Backend:   https://__________________________________.onrender.com
✅ AI Service: https://__________________________________.onrender.com
✅ MongoDB:   mongodb+srv://cluster0.psuc0.mongodb.net/potholeDB
```

---

## 1️⃣ Infrastructure Tests

### 1.1 Service Health Checks

- [ ] **Frontend loads successfully**
  - Visit frontend URL
  - Check for no console errors (F12 → Console)
  - Check all CSS/images load properly
  - **Expected:** Clean homepage with no 404 errors

- [ ] **Backend responds to health check**
  ```bash
  curl https://your-backend-url.onrender.com/
  ```
  - **Expected:** `{"message":"Welcome to Pothole Detection API"}`

- [ ] **AI Service responds to health check**
  ```bash
  curl https://your-ai-service-url.onrender.com/
  ```
  - **Expected:** Flask development server message or 404 on root (normal)

### 1.2 HTTPS/SSL Verification

- [ ] **Frontend uses HTTPS**
  - Check for 🔒 lock icon in browser
  - Certificate should be valid (not self-signed)

- [ ] **Backend uses HTTPS**
  - Check for 🔒 lock icon when visiting backend URL
  - Certificate auto-provided by Render

- [ ] **AI Service uses HTTPS**
  - Certificate auto-provided by Render

### 1.3 CORS Configuration

- [ ] **Browser can connect to backend from frontend**
  - Open frontend in browser
  - Open DevTools (F12) → Network tab
  - Try any action that calls backend (e.g., load homepage)
  - **Expected:** No CORS errors in console

---

## 2️⃣ Authentication & Security Tests

### 2.1 User Registration

- [ ] **Sign up with valid email**
  - Navigate to `/signup` page
  - Enter: Email, Password, Name
  - **Expected:** Success message + OTP sent email

- [ ] **Receive OTP email**
  - Check email inbox (and spam folder)
  - **Expected:** Email with 6-digit OTP code
  - Time limit: Within 2 minutes

- [ ] **Verify OTP code**
  - Enter OTP code from email
  - **Expected:** Redirect to login page with success message

- [ ] **Sign up validation works**
  - Try invalid email format → Should show error
  - Try weak password → Should show error
  - Try duplicate email → Should show error

### 2.2 User Login

- [ ] **Login with valid credentials**
  - Email + Password from signup
  - **Expected:** Redirect to dashboard/home
  - JWT token stored in localStorage

- [ ] **Login validation works**
  - Wrong password → Should show error
  - Non-existent email → Should show error
  - Empty fields → Should show error

- [ ] **JWT persists across page refresh**
  - Login successfully
  - Refresh page (F5)
  - **Expected:** Still logged in (no redirect to login)

- [ ] **Logout works**
  - Click logout button
  - **Expected:** Redirect to login page
  - JWT token cleared from localStorage

### 2.3 OAuth Login (Google)

- [ ] **"Login with Google" button visible**
  - Check login page has Google OAuth button

- [ ] **Google OAuth redirect works**
  - Click "Login with Google"
  - **Expected:** Redirect to Google login page

- [ ] **Google OAuth callback works**
  - Complete Google login
  - **Expected:** Redirect back to app, logged in
  - User data saved in MongoDB

- [ ] **Google OAuth error handling**
  - Try canceling Google login
  - **Expected:** Redirect back with error message (not crash)

### 2.4 Microsoft OAuth (If Implemented)

- [ ] **"Login with Microsoft" button visible**
- [ ] **Microsoft OAuth redirect works**
- [ ] **Microsoft OAuth callback works**
- [ ] **Microsoft OAuth error handling**

### 2.5 Rate Limiting

- [ ] **Auth rate limiting works**
  - Try logging in 6 times quickly with wrong password
  - **Expected:** After 5 attempts, get "Too many requests" error
  - Wait 15 minutes and try again → Should work

- [ ] **API rate limiting works**
  - Make 101 API requests quickly (e.g., upload images in loop)
  - **Expected:** After 100 requests, get 429 status code

---

## 3️⃣ Core Functionality Tests

### 3.1 Image Upload (Pothole Detection)

- [ ] **Upload valid pothole image**
  - Navigate to pothole detection page
  - Upload JPG/PNG image (< 5MB)
  - **Expected:** Loading indicator → Result displayed
  - Result includes: Detection (Yes/No), Confidence %, Recommendation

- [ ] **Test with actual pothole image**
  - Upload image with visible pothole
  - **Expected:** "Pothole Detected: Yes" with high confidence (>70%)

- [ ] **Test with non-pothole image**
  - Upload image of clean road
  - **Expected:** "Pothole Detected: No" with low confidence

- [ ] **File size validation**
  - Try uploading 6MB image
  - **Expected:** Error "File size exceeds 5MB limit"

- [ ] **File type validation**
  - Try uploading .pdf, .txt, .gif file
  - **Expected:** Error "Invalid file type. Only JPEG/PNG allowed"

- [ ] **No file selected error**
  - Click upload without selecting file
  - **Expected:** Error "No file selected"

### 3.2 Email Notifications

- [ ] **Welcome email after signup**
  - Sign up with new email
  - **Expected:** Welcome email within 2 minutes

- [ ] **OTP email for verification**
  - Request OTP during signup
  - **Expected:** OTP email within 2 minutes

- [ ] **Complaint confirmation email** (if implemented)
  - Submit pothole complaint
  - **Expected:** Confirmation email

### 3.3 Complaint Submission (If Implemented)

- [ ] **Submit pothole complaint**
  - Fill complaint form (location, description, severity)
  - Upload image
  - **Expected:** Success message + saved in database

- [ ] **View submitted complaints**
  - Navigate to "My Complaints" page
  - **Expected:** List of previously submitted complaints

---

## 4️⃣ Database Tests

### 4.1 MongoDB Connection

- [ ] **Backend connects to MongoDB Atlas**
  - Check Render backend logs
  - **Expected:** "Connected to MongoDB" log message
  - No "MongoNetworkError" or connection failures

- [ ] **User data persists**
  - Sign up new user
  - Check MongoDB Atlas → Collections → users
  - **Expected:** New user document created

- [ ] **Complaint data persists** (if implemented)
  - Submit complaint
  - Check MongoDB Atlas → Collections → complaints
  - **Expected:** New complaint document created

### 4.2 MongoDB Atlas Monitoring

- [ ] **Check Atlas metrics**
  - Atlas Dashboard → Clusters → Metrics
  - **Expected:** 
    - Connections: < 100
    - Network: < 10 MB/hour
    - Operations: Normal read/write activity

- [ ] **Network access configured**
  - Atlas → Network Access
  - **Expected:** IP allowlist includes `0.0.0.0/0` (all IPs) or Render IPs

---

## 5️⃣ Performance Tests

### 5.1 Page Load Speed

- [ ] **Frontend loads in < 3 seconds**
  - Use Chrome DevTools → Lighthouse
  - **Expected:** Performance score > 70

- [ ] **Backend API responds in < 500ms**
  - Check Network tab for API call times
  - **Expected:** Most requests < 500ms

- [ ] **AI prediction completes in < 5 seconds**
  - Upload test image
  - Time from click to result
  - **Expected:** < 5 seconds (first request may be slower due to cold start)

### 5.2 Cold Start Handling (Render Free Tier)

- [ ] **First request after 15 min inactivity**
  - Wait 20 minutes without accessing site
  - Visit frontend and try action
  - **Expected:** 
    - Backend: 30-60 second delay on first request
    - AI Service: 30-60 second delay on first prediction
    - User sees loading indicator (not error)

---

## 6️⃣ Security Tests

### 6.1 Exposed Secrets Check

- [ ] **No secrets in frontend source code**
  - View page source (Ctrl+U)
  - Search for: "mongodb", "jwt_secret", "password", "api_key"
  - **Expected:** None found (only frontend env vars like REACT_APP_BACKEND_URL)

- [ ] **No .env file accessible**
  - Try accessing: `https://your-frontend-url.vercel.app/.env`
  - **Expected:** 404 Not Found

- [ ] **Backend .env not exposed**
  - Try accessing: `https://your-backend-url.onrender.com/.env`
  - **Expected:** 404 Not Found

### 6.2 Helmet Security Headers

- [ ] **Security headers present**
  - Open DevTools → Network → Select any API request
  - Check Response Headers
  - **Expected:** 
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`
    - `Strict-Transport-Security: max-age=...`

### 6.3 Input Validation

- [ ] **SQL injection prevention** (NoSQL injection)
  - Try email: `test@test.com'; DROP TABLE users; --`
  - **Expected:** Treated as literal string, no error

- [ ] **XSS prevention**
  - Try name: `<script>alert('XSS')</script>`
  - **Expected:** Escaped/sanitized, no alert popup

### 6.4 Authentication Bypass Attempts

- [ ] **Cannot access protected routes without login**
  - Try accessing dashboard without JWT token
  - **Expected:** Redirect to login page or 401 Unauthorized

- [ ] **Cannot use expired JWT tokens**
  - Login, wait 24+ hours
  - Try accessing protected route
  - **Expected:** Redirect to login or 401 Unauthorized

---

## 7️⃣ Mobile Responsiveness

- [ ] **Test on mobile viewport**
  - Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
  - Test on: iPhone 12, iPad, Samsung Galaxy S20
  - **Expected:** All elements visible, buttons clickable, no horizontal scroll

- [ ] **Test on actual mobile device** (recommended)
  - Visit site on real smartphone
  - Test signup, login, image upload
  - **Expected:** Everything works smoothly

---

## 8️⃣ Error Handling

### 8.1 Network Errors

- [ ] **Backend unreachable**
  - Simulate: Stop backend service temporarily
  - Try logging in from frontend
  - **Expected:** User-friendly error message "Service temporarily unavailable"

- [ ] **AI service unreachable**
  - Simulate: Stop AI service temporarily
  - Try uploading image
  - **Expected:** Error "ML service unavailable. Please try again later."

### 8.2 User Errors

- [ ] **Invalid email format**
  - Try: "notanemail"
  - **Expected:** "Invalid email format"

- [ ] **Weak password**
  - Try: "123"
  - **Expected:** "Password must be at least 8 characters"

- [ ] **File too large**
  - Upload > 5MB image
  - **Expected:** "File size exceeds 5MB limit"

---

## 9️⃣ Browser Compatibility

- [ ] **Chrome (latest)**
- [ ] **Firefox (latest)**
- [ ] **Safari (latest)** (if on Mac)
- [ ] **Edge (latest)**
- [ ] **Chrome Mobile** (Android)
- [ ] **Safari Mobile** (iOS)

---

## 🔟 Logs & Monitoring

### 10.1 Check Render Logs

- [ ] **Backend logs clean**
  - Render Dashboard → Backend Service → Logs
  - **Expected:** No ERROR or CRITICAL messages
  - INFO logs show normal operation

- [ ] **AI service logs clean**
  - Render Dashboard → AI Service → Logs
  - **Expected:** Model loaded successfully, predictions working

### 10.2 Check Vercel Logs

- [ ] **Frontend build successful**
  - Vercel Dashboard → Your Project → Deployments
  - **Expected:** Green checkmark, no build errors

- [ ] **Frontend runtime logs clean**
  - Check function logs (if any)
  - **Expected:** No errors

### 10.3 MongoDB Atlas Logs

- [ ] **No connection errors**
  - Atlas → Clusters → Activity Feed
  - **Expected:** No failed connection attempts

---

## 1️⃣1️⃣ Final Checklist

- [ ] All deployment URLs documented
- [ ] All tests above passing (>90%)
- [ ] Security headers verified
- [ ] Rate limiting working
- [ ] Email notifications working
- [ ] OAuth login working
- [ ] Image detection working end-to-end
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No exposed secrets
- [ ] Logs clean in all services
- [ ] MongoDB Atlas healthy
- [ ] Performance acceptable

---

## 📊 Test Results Summary

| Category | Tests Passed | Tests Failed | Pass Rate |
|----------|--------------|--------------|-----------|
| Infrastructure | __ / 5 | __ / 5 | __% |
| Authentication | __ / 15 | __ / 15 | __% |
| Core Features | __ / 12 | __ / 12 | __% |
| Database | __ / 5 | __ / 5 | __% |
| Performance | __ / 3 | __ / 3 | __% |
| Security | __ / 8 | __ / 8 | __% |
| Mobile | __ / 2 | __ / 2 | __% |
| Error Handling | __ / 5 | __ / 5 | __% |
| Browser Compat | __ / 6 | __ / 6 | __% |
| Monitoring | __ / 4 | __ / 4 | __% |
| **TOTAL** | **__ / 65** | **__ / 65** | **__%** |

---

## 🚦 Deployment Status

**Pass Criteria:** ≥ 90% tests passing (≥59 / 65)

- [ ] ✅ **READY FOR PRODUCTION** (≥90% passing)
- [ ] ⚠️ **NEEDS FIXES** (70-89% passing)
- [ ] ❌ **NOT READY** (<70% passing)

---

## 📝 Issues Found

Document any issues discovered during testing:

1. **Issue #1:** ________________________________________________
   - **Severity:** Critical / High / Medium / Low
   - **Fix:** ________________________________________________

2. **Issue #2:** ________________________________________________
   - **Severity:** Critical / High / Medium / Low
   - **Fix:** ________________________________________________

---

## ✅ Sign-Off

- **Tested By:** _______________________
- **Date:** _______________________
- **Status:** ✅ Approved / ⚠️ Conditionally Approved / ❌ Rejected
- **Signature:** _______________________

---

**Ready to share on LinkedIn and add to your resume! 🎉**
