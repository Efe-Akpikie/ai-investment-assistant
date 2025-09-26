# AI Investment Assistant

A professional AI-powered investment assistant web application that analyzes S&P 500 stocks, provides investment advice, and offers portfolio optimization tools.

![AI Investment Assistant](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

## 🚀 Features

### 📊 Stock Analysis
- **Real-time S&P 500 data** with interactive charts
- **AI-powered grading system** using 5-factor analysis
- **Comprehensive metrics** including P/E, ROE, Sharpe ratio, and more
- **Technical analysis** with multiple timeframes (1D, 1W, 1M, 1Y, 5Y)

### 🤖 AI Investment Advisor
- **ChatGPT integration** for personalized investment advice
- **Context-aware responses** based on specific stock data
- **Chart pattern analysis** and technical insights
- **Risk assessment** and portfolio recommendations

### 💼 Portfolio Management
- **Portfolio tracking** with real-time performance metrics
- **Allocation visualization** with interactive pie charts
- **Gain/loss tracking** with detailed breakdowns
- **Optimization suggestions** based on AI analysis

### 🔍 Stock Screener
- **Advanced filtering** by grade, sector, market cap, P/E ratio
- **Custom criteria** for finding investment opportunities
- **Export functionality** for further analysis
- **Real-time results** with instant updates

### 📱 Responsive Design
- **Mobile-first approach** with touch-friendly interactions
- **Desktop sidebar navigation** and mobile bottom tabs
- **Dark theme** optimized for financial data visualization
- **Accessibility features** with proper ARIA labels

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend:** Next.js API routes, Python FastAPI microservice
- **Database:** PostgreSQL, Redis (caching)
- **APIs:** yfinance, OpenAI API, Alpha Vantage
- **UI Components:** Radix UI, Lucide React icons
- **Deployment:** Vercel, Railway, Supabase, Upstash

## 🏗️ Architecture

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-investment-assistant
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

4. **Set up the database**
   ```bash
   # Start PostgreSQL and Redis
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:13
   docker run -d -p 6379:6379 redis:alpine
   
   # Run the database schema (see NOTES.md for SQL commands)
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[NOTES.md](./NOTES.md)** - Comprehensive setup guide and API documentation
- **[API Documentation](./docs/api.md)** - API endpoints and usage
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for chat functionality | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key (backup) | No |
| `PYTHON_SERVICE_URL` | Python microservice URL | No |

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

## 🎯 Usage

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

### AI Chat
1. Click on **AI Advisor** in the navigation
2. Ask questions about specific stocks
3. Get personalized investment advice
4. Analyze chart patterns and trends

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t ai-investment-assistant .
docker run -p 3000:3000 ai-investment-assistant
```

### Manual Deployment
See [NOTES.md](./NOTES.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for educational and informational purposes only. It does not constitute financial advice. Always consult with a licensed financial advisor before making investment decisions. Past performance does not guarantee future results.

## 🆘 Support

- **Documentation:** [NOTES.md](./NOTES.md)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [OpenAI](https://openai.com/) for the GPT API
- [yfinance](https://github.com/ranaroussi/yfinance) for stock data
- [Recharts](https://recharts.org/) for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ for the investment community**
