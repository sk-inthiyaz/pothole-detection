# 🎓 Heroku Deployment Guide (GitHub Student Pack)

## Prerequisites
- ✅ GitHub Student Pack activated
- ✅ Heroku account linked to Student Pack
- ✅ $13/month credits available

---

## 1️⃣ Deploy AI Service (Flask) to Heroku

### Step 1.1: Install Heroku CLI

**Windows (PowerShell):**
```powershell
# Download and install from:
https://devcenter.heroku.com/articles/heroku-cli

# Verify installation
heroku --version
```

### Step 1.2: Login to Heroku

```bash
heroku login
# Opens browser for authentication
```

### Step 1.3: Create Heroku App for AI Service

```bash
cd CNNModel

# Create app
heroku create pothole-detection-ai

# Verify
heroku apps:info pothole-detection-ai
```

### Step 1.4: Deploy AI Service

```bash
# Deploy from CNNModel subdirectory
git subtree push --prefix CNNModel heroku main

# OR if that fails, use buildpack:
heroku buildpacks:set heroku/python
git push heroku main
```

### Step 1.5: Check AI Service

```bash
# Open in browser
heroku open

# Check logs
heroku logs --tail

# Test endpoint
curl https://pothole-detection-ai.herokuapp.com/
```

---

## 2️⃣ Deploy Backend (Node.js) to Heroku

### Step 2.1: Create Heroku App for Backend

```bash
cd backend

# Create app
heroku create pothole-detection-backend

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="mongodb+srv://skinthiyaz777:Z9L0mKb7emEBorIp@cluster0.psuc0.mongodb.net/potholeDB"
heroku config:set JWT_SECRET="your-jwt-secret-from-local-env"
heroku config:set SESSION_SECRET="your-session-secret-from-local-env"
heroku config:set EMAIL_USER="your-gmail@gmail.com"
heroku config:set EMAIL_PASS="your-gmail-app-password"
heroku config:set AI_SERVICE_URL="https://pothole-detection-ai.herokuapp.com"
heroku config:set FRONTEND_URL="https://pothole-detection.vercel.app"
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-google-client-secret"
heroku config:set GOOGLE_CALLBACK_URL="https://pothole-detection-backend.herokuapp.com/auth/google/callback"
```

### Step 2.2: Deploy Backend

```bash
# From backend directory
git subtree push --prefix backend heroku main

# Check deployment
heroku logs --tail --app pothole-detection-backend

# Test
curl https://pothole-detection-backend.herokuapp.com/
```

---

## 3️⃣ Deploy Frontend to Vercel (Keep This)

Frontend stays on Vercel (best for React):

```bash
cd login-page

# Update environment variables in Vercel dashboard:
REACT_APP_BACKEND_URL=https://pothole-detection-backend.herokuapp.com
REACT_APP_AI_SERVICE_URL=https://pothole-detection-ai.herokuapp.com
```

---

## 🎯 Simplified Alternative: Deploy from Root

### Create `heroku.yml` for Multi-Service

**For AI Service:**
```bash
# In project root
heroku create pothole-detection-ai
heroku stack:set container
```

**Create `heroku.yml` in CNNModel:**
```yaml
build:
  docker:
    web: Dockerfile
```

**Create `Dockerfile` in CNNModel:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 300 AppF:app
```

---

## 💰 Heroku Pricing with Student Pack

**Your Credits:**
- $13/month for 12 months
- = $156 total value
- **Enough for BOTH services!**

**Hobby Dyno ($7/month each):**
- AI Service: $7/month
- Backend: $7/month
- **Total: $14/month** (but you get $13 FREE!)

**Eco Dyno ($5/month each) - RECOMMENDED:**
- AI Service: $5/month
- Backend: $5/month
- **Total: $10/month** (all covered by credits!)

---

## 🚀 Quick Deploy Commands

```bash
# 1. Login
heroku login

# 2. Create apps
heroku create pothole-detection-ai
heroku create pothole-detection-backend

# 3. Deploy AI service
cd CNNModel
git init
git add .
git commit -m "Deploy AI service"
heroku git:remote -a pothole-detection-ai
git push heroku main

# 4. Deploy backend
cd ../backend
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a pothole-detection-backend
heroku config:set NODE_ENV=production MONGO_URI="..." # (add all env vars)
git push heroku main
```

---

## ✅ Advantages of Heroku Over Render

1. ✅ **FREE for you** (Student Pack credits)
2. ✅ **Better RAM management** (1 GB available)
3. ✅ **No cold starts** on paid dynos
4. ✅ **Better logging** and monitoring
5. ✅ **Add-ons available** (Redis, Postgres, etc.)
6. ✅ **More reliable** uptime
7. ✅ **Easier deployment** (simpler CLI)

---

## 📋 Deployment Checklist

- [ ] Install Heroku CLI
- [ ] Login to Heroku
- [ ] Verify Student Pack credits ($13/month)
- [ ] Create AI service app
- [ ] Deploy AI service to Heroku
- [ ] Test AI service endpoint
- [ ] Create backend app
- [ ] Set all environment variables
- [ ] Deploy backend to Heroku
- [ ] Test backend endpoint
- [ ] Update frontend env vars on Vercel
- [ ] Update OAuth redirect URLs
- [ ] Test full flow

---

**Start with:** `heroku login` and let me know if you need help with any step! 🚀
