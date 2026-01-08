# AI Investment Assistant


## Features

### Stock Analysis
- **Real-time S&P 500 data** with interactive charts
- **AI-powered grading system** using 5-factor analysis
- **Comprehensive metrics** including P/E, ROE, Sharpe ratio, and more
- **Technical analysis** with multiple timeframes (1D, 1W, 1M, 1Y, 5Y)

### AI Investment Advisor
- **ChatGPT integration** for personalized investment advice
- **Context-aware responses** based on specific stock data
- **Chart pattern analysis** and technical insights
- **Risk assessment** and portfolio recommendations

### Portfolio Management
- **Portfolio tracking** with real-time performance metrics
- **Allocation visualization** with interactive pie charts
- **Gain/loss tracking** with detailed breakdowns
- **Optimization suggestions** based on AI analysis

### Stock Screener
- **Advanced filtering** by grade, sector, market cap, P/E ratio
- **Custom criteria** for finding investment opportunities
- **Export functionality** for further analysis
- **Real-time results** with instant updates

### Responsive Design
- **Mobile-first approach** with touch-friendly interactions
- **Desktop sidebar navigation** and mobile bottom tabs
- **Dark theme** optimized for financial data visualization
- **Accessibility features** with proper ARIA labels

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend:** Next.js API routes, Python FastAPI microservice
- **Database:** PostgreSQL, Redis (caching) (not implemented yet)
- **APIs:** yfinance, OpenAI API(will use gemini instead), Alpha Vantage
- **UI Components:** Radix UI, Lucide React icons
- **Deployment:** Vercel, Railway, Supabase, Upstash

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Python Service │    │   PostgreSQL    │
│                 │    │                 │    │                 │
│ • Frontend      │◄──►│ • Stock Data    │◄──►│ • Stock Data    │
│ • API Routes    │    │ • AI Analysis   │    │ • Portfolios    │
│ • Chat Interface│    │ • Grading       │    │ • Chat History  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Redis       │    │   OpenAI API    │    │   yfinance      │
│                 │    │                 │    │                 │
│ • Caching       │    │ • Chat GPT      │    │ • Stock Data    │
│ • Session Data  │    │ • Investment    │    │ • Real-time     │
│ • Performance   │    │   Advice        │    │   Updates       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```


2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key-here
   DATABASE_URL=postgresql://username:password@localhost:5432/ai_investment_db
   REDIS_URL=redis://localhost:6379
   ```


### Stock Grading Formula

The AI uses a 5-factor grading system:

```
Final Score = (Sharpe Ratio × 25%) + (ROE × 20%) + (PEG Ratio × 20%) + (Current Ratio × 15%) + (Debt-to-Equity × 20%)
```

**Grade Scale:**
- **A (85-100):** Excellent investment opportunity
- **B (70-84):** Good investment with moderate risk
- **C (55-69):** Average investment, consider carefully
- **D (40-54):** Below average, high risk
- **F (<40):** Poor investment, avoid

## Usage

### Stock Analysis
1. Navigate to the **Stocks** page
2. Click on any stock to view detailed analysis
3. Use the **AI Advisor** for personalized insights
4. View charts and metrics for different timeframes

### Portfolio Management
1. Go to the **Portfolio** page
2. Add stocks to track your investments
3. Monitor performance and allocation
4. Get AI-powered optimization suggestions

### Stock Screening
1. Visit the **Screener** page
2. Apply filters based on your criteria
3. Export results for further analysis
4. Find investment opportunities

### AI Chat (not fully implemented yet)
1. Click on **AI Advisor** in the navigation
2. Ask questions about specific stocks
3. Get personalized investment advice
4. Analyze chart patterns and trends


