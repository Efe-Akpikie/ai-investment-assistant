@echo off
echo 🚀 AI Investment Assistant - Deployment Helper
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - AI Investment Assistant"
)

REM Check if code is committed
git status --porcelain > temp_status.txt
if not %errorlevel%==0 (
    echo 📝 Committing changes...
    git add .
    git commit -m "Ready for deployment"
)
del temp_status.txt

echo.
echo 🎯 Choose your deployment platform:
echo 1. Vercel (Recommended - Free, Easy)
echo 2. Railway (Full-stack with databases)
echo 3. Render (Free tier friendly)
echo 4. Manual deployment guide
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Deploying to Vercel...
    echo.
    echo Steps:
    echo 1. Go to https://vercel.com
    echo 2. Sign up/login with GitHub
    echo 3. Click 'New Project'
    echo 4. Import your GitHub repository
    echo 5. Set environment variables:
    echo    - OPENAI_API_KEY
    echo    - DATABASE_URL
    echo    - REDIS_URL
    echo 6. Deploy!
    echo.
    echo 📋 Environment Variables needed:
    echo OPENAI_API_KEY=sk-your-openai-key
    echo DATABASE_URL=postgresql://user:pass@host:port/db
    echo REDIS_URL=redis://user:pass@host:port
    echo.
    set /p push_choice="Push to GitHub now? (y/n): "
    if "%push_choice%"=="y" (
        echo 📤 Pushing to GitHub...
        git push origin main
        echo ✅ Code pushed! Now go to Vercel to deploy.
    )
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Deploying to Railway...
    echo.
    echo Steps:
    echo 1. Go to https://railway.app
    echo 2. Sign up/login with GitHub
    echo 3. Click 'New Project'
    echo 4. Add services:
    echo    - Web Service (Next.js)
    echo    - PostgreSQL Database
    echo    - Redis Cache
    echo 5. Set environment variables
    echo 6. Deploy!
) else if "%choice%"=="3" (
    echo.
    echo 🚀 Deploying to Render...
    echo.
    echo Steps:
    echo 1. Go to https://render.com
    echo 2. Sign up/login with GitHub
    echo 3. Create new Web Service
    echo 4. Connect GitHub repository
    echo 5. Add PostgreSQL and Redis services
    echo 6. Set environment variables
    echo 7. Deploy!
) else if "%choice%"=="4" (
    echo.
    echo 📖 Manual Deployment Guide:
    echo.
    echo 1. Build your project:
    echo    npm run build
    echo.
    echo 2. Test production build:
    echo    npm run start
    echo.
    echo 3. Push to GitHub:
    echo    git add .
    echo    git commit -m "Ready for deployment"
    echo    git push origin main
    echo.
    echo 4. Deploy to your chosen platform
    echo.
    echo 📋 Required Environment Variables:
    echo OPENAI_API_KEY=sk-your-openai-key
    echo DATABASE_URL=postgresql://user:pass@host:port/db
    echo REDIS_URL=redis://user:pass@host:port
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment setup complete!
echo.
echo 📚 Next steps:
echo 1. Set up your databases (PostgreSQL + Redis)
echo 2. Get your API keys
echo 3. Deploy your application
echo 4. Test your deployment
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
pause
