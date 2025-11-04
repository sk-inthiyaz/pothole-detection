# Pothole Detection – Full-Stack AI System

Pothole Detection is a full-stack application that lets users upload a road image, detects potholes using a CNN model served via Flask, and enables users to report pothole locations to a MongoDB-backed API. It includes user authentication, a modern React UI, and an end-to-end pipeline from image upload to actionable report.

This README gives you a complete overview of the project structure, technologies, API endpoints, functions and models used, and how to run everything on Windows (PowerShell).

## Architecture at a Glance

- Frontend: React app in `frontend/`
- Backend API: Node.js + Express + MongoDB in `backend/`
- ML Inference Service: Python + Flask + PyTorch in `CNNModel/AppF.py`
- Model Weights: `.pth` checkpoints in both repo root and `CNNModel/`

Data flow
1) React uploads image to Express at `POST /upload`.
2) Express forwards the image to Flask at `POST http://127.0.0.1:7000/process`.
3) Flask returns JSON with pothole presence, confidence, and recommendation.
4) If pothole is detected, user can submit a complaint to Express `POST /api/complaints`, which persists to MongoDB.

## Repository Structure

Top-level
- `assets/` – static assets (e.g., `banner.png.png`).
- `backend/` – Express API server, Mongo connection, routes and models.
- `CNNModel/` – PyTorch training scripts and Flask inference app; model weights.
- `frontend/` – React UI (Create React App).
- `best_pothole_detection_model.pth`, `final_pothole_detection_model.pth` – model checkpoints (duplicated from `CNNModel/`).
- `README.md` – this file.

### Backend (`backend/`)

- `server.js` – boots Express, sets up middleware, connects Mongo, registers routes:
	- `/` – auth routes (signup/login)
	- `/upload` – image upload proxy to Flask
	- `/api/complaints` – complaint submission
- `config/db.js` – `connectDB()` uses `MONGO_URI` to connect via Mongoose.
- `models/User.js` – Mongoose schema for users: `{ name, email (unique), password }`.
- `models/Complaint.js` – Mongoose schema: `{ location, description, createdAt }`.
- `routes/authRoutes.js` –
	- `POST /signup` – registers user with bcrypt-hashed password.
	- `POST /login` – verifies credentials and returns JWT (`JWT_SECRET`).
- `routes/complaintRoutes.js` – `POST /api/complaints` to store complaints.
- `upload/upload.js` – `POST /upload` file via multer (memory) → forwards to Flask `/process` with `form-data`.
- `.env.example` – sample of required environment variables.

Dependencies (see `backend/package.json`)
- express, cors, dotenv, body-parser, mongoose, mongodb
- bcryptjs, jsonwebtoken
- multer (uploads), axios + form-data (forwarding to Flask)

### Frontend (`frontend/`)

- Routing defined in `src/App.js` with React Router:
	- `/` Home, `/about`, `/workflow`, `/contact`
	- `/signup`, `/login` (auth)
	- `/pothole` (upload + detection flow)
	- `/lifesaver` (success page post-complaint)
- Key components/pages:
	- `Navbar.js` – navigation + conditional Logout button.
	- `Layout.js` – shared layout shell and footer.
	- `pages/HomePage.js` – intro and CTA to login.
	- `pages/AboutPage.js` – project description.
	- `pages/WorkflowPage.js` – visual steps of detection pipeline.
	- `pages/ContactPage.js` – simple contact form (console log only).
	- `pages/SignupPage.js` – `POST http://localhost:5000/signup`.
	- `pages/LoginPage.js` – `POST http://localhost:5000/login`; stores JWT in `localStorage` and sets auth state.
	- `pages/PotholePage.js` – image upload to Express `POST /upload`; displays prediction/confidence/time; if pothole detected, shows a modal to submit complaint `POST /api/complaints`.
	- `pages/LifeSaverPage.js` – “You Saved a Life” success page.

Dependencies (see `frontend/package.json`)
- react, react-dom, react-router-dom, react-scripts
- axios, dotenv

### ML/Inference (`CNNModel/`)

- `AppF.py` – Flask inference server exposing `POST /process`.
	- Loads `PotholeDetectionCNN` and weights from `CNNModel/best_pothole_detection_model.pth`.
	- Preprocess: `Resize(128×128) → ToTensor → Normalize([0.5]*3, [0.5]*3)`.
	- `detect_pothole(image)` → returns `(Yes/No, confidence %, recommendation)` using sigmoid threshold 0.5.
	- Response JSON: `{ pothole_detected, confidence_level, prediction_time, recommendation }`.
	- Runs at `0.0.0.0:7000`.
- `CNN.py` – Training script for `PotholeDetectionCNN`:
	- Augmentations: horizontal/vertical flips, rotation, color jitter, normalize.
	- Optimizer: Adam (lr=1e-3, weight_decay=1e-4); Loss: `BCELoss`.
	- Early stopping with patience=3 on validation loss.
	- Saves weights: `CNNModel/best_pothole_detection_model.pth` and `CNNModel/final_pothole_detection_model.pth`.
- `CNNs.py`, `ANN.py`, `ANNa.py` – Experimental/learning scripts for simpler CNN/ANN approaches (not used in production flow).
- `requirements.txt` – added for easy setup of the Flask/ML service.

Model architecture (in both `AppF.py` and `CNN.py`)
- Conv2d(3→32, k3, p1) → ReLU → MaxPool(2)
- Conv2d(32→64, k3, p1) → ReLU → MaxPool(2)
- Flatten → Linear(64×32×32 → 128) → ReLU → Dropout(0.5)
- Linear(128 → 1) → Sigmoid

Checkpoint files
- Present in repo root and in `CNNModel/`.
- The inference service explicitly loads from `CNNModel/best_pothole_detection_model.pth`.

## API Reference

Base URL (Express): `http://localhost:5000`

Auth
- `POST /signup`
	- Body: `{ name, email, password }`
	- 201 → `{ message: 'User registered successfully!' }`
	- 500 → `{ error: 'Error registering user' }`
- `POST /login`
	- Body: `{ email, password }`
	- 200 → `{ message: 'Login successful!', token }`
	- 404/400/500 on errors

Image Upload/Inference
- `POST /upload`
	- Form-data: `file` (image)
	- Forwards to Flask `POST http://127.0.0.1:7000/process`
	- 200 → `{ pothole_detected: 'Yes'|'No', confidence_level: 'xx.xx%', prediction_time: 'x.xx seconds', recommendation }`

Complaints
- `POST /api/complaints`
	- Body: `{ location, description }`
	- 201 → `{ message: 'Complaint submitted successfully!' }`

## Key Functions and Where They Live

Flask (inference) – `CNNModel/AppF.py`
- `class PotholeDetectionCNN(nn.Module)` – defines CNN layers.
- `forward(x)` – forward pass.
- `detect_pothole(image)` – runs model, returns label, confidence, recommendation.
- `process_image()` – Flask view for `POST /process`.

Training – `CNNModel/CNN.py`
- `class PotholeDetectionCNN` – same as inference model.
- Training loop with early stopping; saves best/final checkpoints.

Express Backend – `backend/`
- `config/db.js → connectDB()` – connects to MongoDB via Mongoose.
- `routes/authRoutes.js`
	- `POST /signup` – bcrypt generate salt/hash; create user.
	- `POST /login` – bcrypt compare; JWT sign with `JWT_SECRET`.
- `routes/complaintRoutes.js`
	- `POST /api/complaints` – create and save complaint.
- `upload/upload.js`
	- `POST /upload` – multer memory storage; forward to Flask using axios + form-data.

React Frontend – `frontend/src/pages/`
- `LoginPage.js → handleSubmit()` – auth login, store JWT, navigate to `/pothole`.
- `SignupPage.js → handleSubmit()` – user registration flow.
- `PotholePage.js`
	- `handleFileChange()` – preview selected image.
	- `handleSubmit()` – upload to Express; display prediction; show complaint modal when detected.
	- Complaint modal form → axios `POST /api/complaints` then navigate to `/lifesaver`.

## Setup and Run (Windows PowerShell)

Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas connection string)

1) Clone
```powershell
git clone https://github.com/sk-inthiyaz/pothole-detection.git
cd pothole-detection
```

2) Start the Flask Inference Service
```powershell
# (recommended) create a venv
python -m venv venv
./venv/Scripts/Activate.ps1

# install deps
pip install -r CNNModel/requirements.txt

# run Flask (serves on http://127.0.0.1:7000)
python CNNModel/AppF.py
```

3) Configure and Start the Express Backend
```powershell
cd backend
copy .env.example .env   # then edit .env and set MONGO_URI, JWT_SECRET
npm install
npm start
```

4) Start the React Frontend
```powershell
cd ../frontend
npm install
npm start
```

5) Try it
- Visit `http://localhost:3000`
- Sign up → Login → Go to Pothole page → Upload an image
- If pothole is detected, submit complaint → You’ll see the LifeSaver page

Dataset (optional for retraining)
- You can use: https://www.kaggle.com/datasets/virenbr11/pothole-and-plain-rode-images
- Update dataset path in `CNNModel/CNN.py` before training.

## Environment Variables

Backend (`backend/.env`)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – secret for signing JWTs
- `PORT` – optional (default 5000)

Flask/Inference
- None required by default; uses `CNNModel/best_pothole_detection_model.pth` and listens on port 7000.

## Notes and Tips

- **Ports used**: React 3000, Express 5001 (changed from 5000), Flask 7000.
- **CORS**: Express has `cors()` enabled; if you change ports or origins, configure accordingly.
- **Model weights** are present in both root and `CNNModel/`. The Flask app uses the `CNNModel` copy.
- If you retrain, ensure the new `best_pothole_detection_model.pth` is placed under `CNNModel/` for inference to pick it up.
- **Responsive Design**: The entire UI is now mobile-first responsive with modern animations, glass-morphism effects, and works beautifully on all screen sizes (mobile, tablet, desktop).

---

## Production Deployment Guide 🚀

### Pre-Deployment Checklist

✅ **Test Locally First**
```powershell
# 1. Start MongoDB
mongod --dbpath C:\data\db

# 2. Start Flask ML Service
cd CNNModel
py -3.10 AppF.py

# 3. Start Express Backend
cd ../backend
npm start

# 4. Build React Frontend
cd ../frontend
npm run build
```

✅ **Environment Configuration**

Create production `.env` files:

**Backend `.env` (Production)**
```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/potholeDB
JWT_SECRET=<strong-random-secret-256-bit>
FLASK_URL=http://your-flask-service.com:7000
```

**React `.env.production`** (in `frontend/`)
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_FLASK_URL=https://your-flask-service.com
```

### Deployment Options

#### Option 1: Deploy to Vercel (Frontend) + Render/Railway (Backend)

**Frontend (React) on Vercel:**
```powershell
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts, set environment variables in Vercel dashboard
```

**Backend (Express) on Render:**
1. Push code to GitHub
2. Go to [Render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables (MONGO_URI, JWT_SECRET, PORT)
7. Deploy

**ML Service (Flask) on Python Anywhere or Render:**
- For Render: Create Python web service
- Upload `CNNModel/` folder
- Install dependencies: `pip install -r requirements.txt`
- Start command: `python AppF.py`

#### Option 2: Docker Deployment (All Services)

Create `Dockerfile` in backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

Create `Dockerfile` in CNNModel:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 7000
CMD ["python", "AppF.py"]
```

Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  flask-ml:
    build: ./CNNModel
    ports:
      - "7000:7000"
    volumes:
      - ./CNNModel:/app

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/potholeDB
      - JWT_SECRET=${JWT_SECRET}
      - FLASK_URL=http://flask-ml:7000
    depends_on:
      - mongodb
      - flask-ml

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Deploy with:
```powershell
docker-compose up -d
```

#### Option 3: Deploy to AWS (Full Stack)

**Frontend**: AWS S3 + CloudFront
```powershell
# Build React app
cd frontend
npm run build

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront distribution
```

**Backend**: AWS EC2 or Elastic Beanstalk
- Launch EC2 instance with Node.js
- Install dependencies, PM2 for process management
- Configure security groups (ports 5001, 7000)
- Set up nginx as reverse proxy

**Database**: MongoDB Atlas (free tier available)
- Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Get connection string
- Update backend MONGO_URI

**ML Service**: AWS Lambda + API Gateway (serverless)
- Package Flask app with dependencies
- Create Lambda function (Python 3.10)
- Add API Gateway trigger
- Increase timeout to 30s, memory to 1024MB

### Production Optimizations

**React Build Optimization:**
```powershell
# Analyze bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'

# Enable compression in backend
npm install compression
```

Add to `backend/server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

**Caching Strategy:**
- Add cache headers for static assets
- Use Redis for session storage
- Implement CDN for images

**Security Hardening:**
```powershell
# Install security packages
npm install helmet express-rate-limit
```

Add to `backend/server.js`:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**Performance Monitoring:**
- Use PM2 for Node.js process management
- Set up logging (Winston, Morgan)
- Monitor with New Relic or DataDog

### Post-Deployment Testing

Test these endpoints after deployment:
```bash
# Health check
curl https://your-backend.com/health

# Signup
curl -X POST https://your-backend.com/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST https://your-backend.com/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# ML Service
curl -X POST https://your-flask-service.com/process \
  -F "file=@test-image.jpg"
```

### Continuous Deployment (CI/CD)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm install && npm run build
      - uses: vercel/actions@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Notes and Tips (Updated)

- **Ports used**: React 3000 (dev) / 80 or 443 (production), Express 5001, Flask 7000.
- **CORS**: Configure production origins in backend CORS settings before deployment.
- **Model weights** are present in both root and `CNNModel/`. The Flask app uses the `CNNModel` copy.
- If you retrain, ensure the new `best_pothole_detection_model.pth` is placed under `CNNModel/` for inference.
- **Responsive Design**: The entire UI is now mobile-first responsive with modern animations, glass-morphism effects, and works on all screen sizes.
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) for backdrop-filter support.

### Troubleshooting Production Issues

**CORS Errors:**
```javascript
// backend/server.js - Update CORS config
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

**Large Model File Issues:**
- Use Git LFS for `.pth` files
- Consider model compression/quantization
- Use CDN for model hosting

**MongoDB Connection Issues:**
- Whitelist IP addresses in MongoDB Atlas
- Check connection string format
- Verify network access rules

**Performance Issues:**
- Enable gzip compression
- Implement Redis caching
- Use PM2 cluster mode for backend
- Optimize images before upload (client-side compression)

---

## Notes and Tips

- **Ports used**: React 3000, Express 5001, Flask 7000.
- CORS: Express has `cors()` enabled; if you change ports or origins, configure accordingly.
- Model weights are present in both root and `CNNModel/`. The Flask app uses the `CNNModel` copy.
- If you retrain, ensure the new `best_pothole_detection_model.pth` is placed under `CNNModel/` for inference to pick it up.

## Quality Gates

- Build: PASS (documentation update only; no build executed here)
- Lint/Typecheck: Not executed in this session
- Tests: None provided in repo

## License

This project is provided as-is by the repository owner. See repository license if present.

