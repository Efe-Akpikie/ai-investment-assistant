#!/bin/bash

# 🚀 AI Investment Assistant - Deployment Script
# This script helps you deploy your project to the web

echo "🚀 AI Investment Assistant Deployment Helper"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - AI Investment Assistant"
fi

# Check if code is committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Ready for deployment"
fi

echo ""
echo "🎯 Choose your deployment platform:"
echo "1. Vercel (Recommended - Free, Easy)"
echo "2. Railway (Full-stack with databases)"
echo "3. Render (Free tier friendly)"
echo "4. Manual deployment guide"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        echo "Steps:"
        echo "1. Go to https://vercel.com"
        echo "2. Sign up/login with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Import your GitHub repository"
        echo "5. Set environment variables:"
        echo "   - OPENAI_API_KEY"
        echo "   - DATABASE_URL"
        echo "   - REDIS_URL"
        echo "6. Deploy!"
        echo ""
        echo "📋 Environment Variables needed:"
        echo "OPENAI_API_KEY=sk-your-openai-key"
        echo "DATABASE_URL=postgresql://user:pass@host:port/db"
        echo "REDIS_URL=redis://user:pass@host:port"
        echo ""
        read -p "Push to GitHub now? (y/n): " push_choice
        if [ "$push_choice" = "y" ]; then
            echo "📤 Pushing to GitHub..."
            git push origin main
            echo "✅ Code pushed! Now go to Vercel to deploy."
        fi
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Railway..."
        echo ""
        echo "Steps:"
        echo "1. Go to https://railway.app"
        echo "2. Sign up/login with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Add services:"
        echo "   - Web Service (Next.js)"
        echo "   - PostgreSQL Database"
        echo "   - Redis Cache"
        echo "5. Set environment variables"
        echo "6. Deploy!"
        ;;
    3)
        echo ""
        echo "🚀 Deploying to Render..."
        echo ""
        echo "Steps:"
        echo "1. Go to https://render.com"
        echo "2. Sign up/login with GitHub"
        echo "3. Create new Web Service"
        echo "4. Connect GitHub repository"
        echo "5. Add PostgreSQL and Redis services"
        echo "6. Set environment variables"
        echo "7. Deploy!"
        ;;
    4)
        echo ""
        echo "📖 Manual Deployment Guide:"
        echo ""
        echo "1. Build your project:"
        echo "   npm run build"
        echo ""
        echo "2. Test production build:"
        echo "   npm run start"
        echo ""
        echo "3. Push to GitHub:"
        echo "   git add ."
        echo "   git commit -m 'Ready for deployment'"
        echo "   git push origin main"
        echo ""
        echo "4. Deploy to your chosen platform"
        echo ""
        echo "📋 Required Environment Variables:"
        echo "OPENAI_API_KEY=sk-your-openai-key"
        echo "DATABASE_URL=postgresql://user:pass@host:port/db"
        echo "REDIS_URL=redis://user:pass@host:port"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Set up your databases (PostgreSQL + Redis)"
echo "2. Get your API keys"
echo "3. Deploy your application"
echo "4. Test your deployment"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
