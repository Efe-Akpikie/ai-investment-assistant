# AI Investment Assistant - Setup Guide

## Overview
This is a professional AI-powered investment assistant web application that analyzes S&P 500 stocks, provides investment advice, and offers portfolio optimization tools.

## Tech Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + Recharts
- **Backend:** Next.js API routes + Python FastAPI microservice
- **Database:** PostgreSQL + Redis (caching)
- **APIs:** yfinance, OpenAI API, Alpha Vantage (backup)

## API Keys Required

### 1. OpenAI API Key
**Purpose:** AI chat functionality and investment advice
**Where to get:** https://platform.openai.com/api-keys
**Cost:** Pay-per-use (approximately $0.002 per 1K tokens)
**Environment Variable:** `OPENAI_API_KEY`

**Setup Steps:**
1. Go to https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)
6. Add to your environment variables

### 2. Alpha Vantage API Key (Optional - Backup)
**Purpose:** Backup stock data source
**Where to get:** https://www.alphavantage.co/support/#api-key
**Cost:** Free tier available (5 API calls per minute, 500 calls per day)
**Environment Variable:** `ALPHA_VANTAGE_API_KEY`

**Setup Steps:**
1. Go to https://www.alphavantage.co
2. Sign up for free account
3. Get your API key from the dashboard
4. Add to your environment variables

### 3. yfinance (Free)
**Purpose:** Primary stock data source
**Cost:** Free
**No API key required**

## Environment Variables Setup

### Next.js Application (.env.local)
```bash
# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Alpha Vantage (optional)
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key-here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_investment_db

# Redis Cache
REDIS_URL=redis://localhost:6379

# Python Service (when deployed)
PYTHON_SERVICE_URL=https://your-python-service.railway.app

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Python Service (.env)
```bash
# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_investment_db

# Redis Cache
REDIS_URL=redis://localhost:6379

# Alpha Vantage (optional)
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key-here
```

## Database Setup

### PostgreSQL Database Schema
Run these SQL commands in your PostgreSQL database:

```sql
-- Create database
CREATE DATABASE ai_investment_db;

-- Connect to the database
\c ai_investment_db;

-- Create stocks table
CREATE TABLE stocks (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  sector VARCHAR(100),
  market_cap BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create stock_grades table
CREATE TABLE stock_grades (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) REFERENCES stocks(symbol),
  sharpe_ratio DECIMAL(10,4),
  roe DECIMAL(10,4),
  peg_ratio DECIMAL(10,4),
  current_ratio DECIMAL(10,4),
  debt_equity DECIMAL(10,4),
  final_score INTEGER,
  grade CHAR(1),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  holdings JSONB,
  total_value DECIMAL(15,2),
  total_cost DECIMAL(15,2),
  total_gain DECIMAL(15,2),
  total_gain_percent DECIMAL(10,4),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  symbol VARCHAR(10),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_stock_grades_symbol ON stock_grades(symbol);
CREATE INDEX idx_stock_grades_grade ON stock_grades(grade);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_timestamp ON chat_history(timestamp);
```

## Local Development Setup

### 1. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (for the microservice)
cd python-service
pip install -r requirements.txt
```

### 2. Start Redis (Required for caching)
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
# macOS: brew install redis
# Ubuntu: sudo apt-get install redis-server
# Windows: Download from https://redis.io/download
```

### 3. Start PostgreSQL
```bash
# Using Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:13

# Or install PostgreSQL locally
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Download from https://www.postgresql.org/download/
```

### 4. Run the Application
```bash
# Start Next.js development server
npm run dev

# Start Python service (in another terminal)
cd python-service
uvicorn main:app --reload --port 8000
```

## Deployment Guide

### Recommended Deployment Stack
- **Frontend/API:** Vercel (seamless Next.js deployment)
- **Python Microservice:** Railway or Render
- **Database:** Supabase (PostgreSQL) or Railway
- **Redis:** Upstash (serverless Redis)

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### 2. Deploy Python Service to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

### 3. Set up Supabase Database
1. Go to https://supabase.com
2. Create a new project
3. Run the SQL schema commands above
4. Get the connection string from Settings > Database

### 4. Set up Upstash Redis
1. Go to https://upstash.com
2. Create a new Redis database
3. Get the connection string from the dashboard

## Rate Limiting Considerations

### OpenAI API Limits
- **Free tier:** $5 credit (expires after 3 months)
- **Paid tier:** $20 minimum deposit
- **Rate limits:** 3,500 requests per minute for paid accounts
- **Cost:** ~$0.002 per 1K tokens for GPT-3.5-turbo

### Alpha Vantage Limits
- **Free tier:** 5 API calls per minute, 500 calls per day
- **Premium:** $49.99/month for 1,200 calls per minute
- **Cost:** Free tier should be sufficient for development

### yfinance Limits
- **No official rate limits**
- **Recommended:** 1-2 requests per second to avoid being blocked
- **Free to use**

## Performance Optimizations

### Caching Strategy
- **Stock data:** 15 minutes
- **S&P 500 list:** 1 hour
- **Calculated grades:** 30 minutes
- **Chat responses:** 30 minutes

### Database Optimization
- Use connection pooling (max 20 connections)
- Add proper indexes on frequently queried columns
- Use Redis for frequently accessed data

### API Optimization
- Implement request debouncing
- Use React Query or SWR for data fetching
- Implement proper error boundaries

## Security Checklist

- [ ] All API keys in environment variables
- [ ] Database connection strings secured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] HTTPS enforced in production
- [ ] No sensitive data in client-side code

## Monitoring & Logging

### Recommended Tools
- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics
- **Uptime Monitoring:** Uptime Robot
- **Logging:** Structured logging with Winston

### Setup Sentry
```bash
npm install @sentry/nextjs
```

Add to `next.config.ts`:
```typescript
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  // your existing config
};

export default withSentryConfig(nextConfig, {
  org: 'your-org',
  project: 'your-project',
});
```

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key is correct
   - Verify you have sufficient credits
   - Check rate limits

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if PostgreSQL is running
   - Verify database exists

3. **Redis Connection Issues**
   - Check if Redis is running
   - Verify REDIS_URL is correct
   - Check Redis memory usage

4. **Stock Data Issues**
   - yfinance may be temporarily unavailable
   - Check network connectivity
   - Verify stock symbols are valid

### Debug Mode
Set `NODE_ENV=development` to enable debug logging.

## Cost Estimation

### Monthly Costs (Estimated)
- **OpenAI API:** $10-50 (depending on usage)
- **Vercel:** Free tier (100GB bandwidth)
- **Supabase:** Free tier (500MB database)
- **Upstash Redis:** Free tier (10K requests/day)
- **Total:** ~$10-50/month

### Scaling Considerations
- Monitor API usage and costs
- Implement caching to reduce API calls
- Consider upgrading to paid tiers as needed
- Use CDN for static assets

## Support

For issues and questions:
1. Check this documentation first
2. Review the code comments
3. Check the GitHub issues
4. Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- S&P 500 stock analysis
- AI chat functionality
- Portfolio management
- Stock screening
- Responsive design

