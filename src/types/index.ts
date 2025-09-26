export interface Stock {
  symbol: string
  companyName: string
  sector: string
  marketCap: number
  currentPrice: number
  change: number
  changePercent: number
  volume: number
  pe: number
  eps: number
  dividend: number
  dividendYield: number
  high52Week: number
  low52Week: number
  grade?: string
  score?: number
}

export interface StockGrade {
  symbol: string
  sharpeRatio: number
  roe: number
  pegRatio: number
  currentRatio: number
  debtToEquity: number
  finalScore: number
  grade: string
  updatedAt: string
}

export interface StockMetrics {
  symbol: string
  marketCap: number
  pe: number
  peg: number
  eps: number
  roe: number
  roa: number
  currentRatio: number
  debtToEquity: number
  dividendYield: number
  beta: number
  sharpeRatio: number
  volatility: number
}

export interface PriceData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartData {
  symbol: string
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'
  data: PriceData[]
}

export interface Portfolio {
  id: string
  userId: string
  name: string
  holdings: PortfolioHolding[]
  totalValue: number
  totalCost: number
  totalGain: number
  totalGainPercent: number
  createdAt: string
  updatedAt: string
}

export interface PortfolioHolding {
  symbol: string
  shares: number
  averageCost: number
  currentPrice: number
  marketValue: number
  gain: number
  gainPercent: number
  allocation: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  image?: {
    url: string
    filename: string
  }
  context?: {
    symbol?: string
    chartData?: ChartData
    stockData?: Stock
  }
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ScreenerFilters {
  minGrade?: string
  maxGrade?: string
  minMarketCap?: number
  maxMarketCap?: number
  minPe?: number
  maxPe?: number
  minDividendYield?: number
  maxDividendYield?: number
  sectors?: string[]
  minScore?: number
  maxScore?: number
}

export interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  publishedAt: string
  source: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  relatedSymbols?: string[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OptimizationResult {
  suggestedAllocation: PortfolioHolding[]
  expectedReturn: number
  expectedVolatility: number
  sharpeRatio: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
}

export interface User {
  id: string
  email: string
  name: string
  preferences: {
    riskTolerance: 'low' | 'medium' | 'high'
    investmentGoal: 'growth' | 'income' | 'balanced'
    timeHorizon: 'short' | 'medium' | 'long'
  }
  createdAt: string
  updatedAt: string
}

