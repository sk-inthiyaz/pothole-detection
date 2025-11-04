# Production Deployment Quick Start Script
# Run this script to prepare your application for production deployment

Write-Host "🚀 Pothole Detection - Production Deployment Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "✓ Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
Write-Host "✓ Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = py -3.10 --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Python version: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Python 3.10 is not installed. Please install Python 3.10 from https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "✓ Checking MongoDB connection..." -ForegroundColor Yellow
$mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue 2>$null
if ($mongoCheck.TcpTestSucceeded) {
    Write-Host "  MongoDB is running on localhost:27017" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  MongoDB is not running. Please start MongoDB before continuing." -ForegroundColor Yellow
    Write-Host "     Run: mongod --dbpath C:\data\db" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📦 Installing Dependencies..." -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Backend dependencies
Write-Host "1. Installing Backend dependencies..." -ForegroundColor Yellow
Set-Location -Path ".\backend"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ❌ package.json not found in backend/" -ForegroundColor Red
    exit 1
}

# Frontend dependencies
Write-Host ""
Write-Host "2. Installing Frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path "..\login-page"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ❌ package.json not found in login-page/" -ForegroundColor Red
    exit 1
}

# ML Service dependencies
Write-Host ""
Write-Host "3. Installing ML Service dependencies..." -ForegroundColor Yellow
Set-Location -Path "..\CNNModel"
if (Test-Path "requirements.txt") {
    py -3.10 -m pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ ML Service dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to install ML dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ❌ requirements.txt not found in CNNModel/" -ForegroundColor Red
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "🔧 Environment Configuration" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check .env file
if (Test-Path ".\backend\.env") {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env file not found" -ForegroundColor Yellow
    if (Test-Path ".\backend\.env.example") {
        Copy-Item ".\backend\.env.example" -Destination ".\backend\.env"
        Write-Host "   Created .env from .env.example" -ForegroundColor Green
        Write-Host "   ⚠️  Please edit backend/.env and set your MongoDB URI and JWT Secret!" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🏗️  Building Production React App..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path ".\login-page"
Write-Host "Building optimized production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Production build created successfully!" -ForegroundColor Green
    
    # Get build folder size
    $buildSize = (Get-ChildItem -Path ".\build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "❌ Production build failed" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "✅ Production Setup Complete!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure your .env file:" -ForegroundColor White
Write-Host "   Edit: backend\.env" -ForegroundColor Gray
Write-Host "   Set: MONGO_URI, JWT_SECRET, PORT=5001" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start MongoDB:" -ForegroundColor White
Write-Host "   mongod --dbpath C:\data\db" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Flask ML Service:" -ForegroundColor White
Write-Host "   cd CNNModel" -ForegroundColor Gray
Write-Host "   py -3.10 AppF.py" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start Express Backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Serve Production Build (Optional - for local testing):" -ForegroundColor White
Write-Host "   cd login-page" -ForegroundColor Gray
Write-Host "   npx serve -s build" -ForegroundColor Gray
Write-Host ""
Write-Host "6. For development mode:" -ForegroundColor White
Write-Host "   cd login-page" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Deployment Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "- Vercel (Frontend): vercel" -ForegroundColor Gray
Write-Host "- Render (Backend): Push to GitHub and connect" -ForegroundColor Gray
Write-Host "- Docker: docker-compose up -d" -ForegroundColor Gray
Write-Host "- AWS: See README.md Production Deployment Guide" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For detailed deployment instructions, see:" -ForegroundColor Yellow
Write-Host "   README.md - Production Deployment Guide section" -ForegroundColor Gray
Write-Host "   RESPONSIVE_REDESIGN.md - Complete UI/UX documentation" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Happy Deploying!" -ForegroundColor Magenta
