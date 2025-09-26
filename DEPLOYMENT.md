# 🚀 Deployment Guide - AI Investment Assistant

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)
**Best for**: Frontend + API routes, automatic deployments, free tier

#### Steps:
1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Deploy!

3. **Set Environment Variables** in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_key
   DATABASE_URL=your_postgres_url
   REDIS_URL=your_redis_url
   PYTHON_SERVICE_URL=your_python_service_url
   ```

### Option 2: Railway (Full Stack)
**Best for**: Full-stack apps with databases

#### Steps:
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add services:
   - **Web Service** (Next.js app)
   - **PostgreSQL Database**
   - **Redis Cache**
   - **Python Service** (FastAPI)

### Option 3: Render (Free Tier Friendly)
**Best for**: Budget-conscious deployment

#### Steps:
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add PostgreSQL and Redis services

## 🗄️ Database Setup

### PostgreSQL (Required)
```bash
# Option 1: Supabase (Free tier)
# Go to supabase.com, create project, get connection string

# Option 2: Railway PostgreSQL
# Add PostgreSQL service in Railway dashboard

# Option 3: Neon (Free tier)
# Go to neon.tech, create database
```

### Redis (Required)
```bash
# Option 1: Upstash Redis (Free tier)
# Go to upstash.com, create Redis database

# Option 2: Railway Redis
# Add Redis service in Railway dashboard

# Option 3: Redis Cloud
# Go to redis.com, create free database
```

## 🐍 Python Service Deployment

### Option 1: Railway
1. Add Python service in Railway
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 2: Render
1. Create Python Web Service
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 3: Heroku
1. Create new Heroku app
2. Add Python buildpack
3. Deploy with Git

## 🔧 Environment Variables

Create these in your deployment platform:

```bash
# Required
OPENAI_API_KEY=sk-your-openai-key
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://user:pass@host:port

# Optional (for Python service)
PYTHON_SERVICE_URL=https://your-python-service.railway.app
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
```

## 📋 Pre-Deployment Checklist

- [ ] Push code to GitHub
- [ ] Set up PostgreSQL database
- [ ] Set up Redis cache
- [ ] Get OpenAI API key
- [ ] Deploy Python service (optional)
- [ ] Set environment variables
- [ ] Test deployment

## 🚀 Quick Start Commands

```bash
# 1. Build and test locally
npm run build

# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Deploy to Vercel (if using Vercel CLI)
npx vercel --prod
```

## 🔍 Troubleshooting

### Common Issues:
1. **Build Errors**: Check Node.js version (18+)
2. **API Errors**: Verify environment variables
3. **Database Errors**: Check connection strings
4. **Image Upload**: Ensure file size limits

### Debug Commands:
```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check environment variables
echo $OPENAI_API_KEY
```

## 📊 Monitoring

After deployment:
1. Check application logs
2. Monitor API usage
3. Set up error tracking (Sentry)
4. Monitor database performance

## 💰 Cost Estimation

### Free Tier Options:
- **Vercel**: Free for personal projects
- **Railway**: $5/month after free credits
- **Render**: Free tier available
- **Supabase**: Free tier (500MB)
- **Upstash Redis**: Free tier (10K requests/day)

### Paid Options:
- **Vercel Pro**: $20/month
- **Railway**: $5-20/month
- **Render**: $7-25/month

## 🎯 Recommended Setup

For **best experience**:
1. **Frontend**: Vercel (free, fast, easy)
2. **Database**: Supabase PostgreSQL (free tier)
3. **Cache**: Upstash Redis (free tier)
4. **Python Service**: Railway (free tier)

Total cost: **$0/month** on free tiers!
