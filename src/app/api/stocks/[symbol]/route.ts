import { NextRequest, NextResponse } from 'next/server'

// Mock stock data for development
const mockStockData = {
  AAPL: {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    sector: 'Technology',
    marketCap: 3000000000000,
    currentPrice: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45000000,
    pe: 28.5,
    eps: 6.15,
    dividend: 0.96,
    dividendYield: 0.55,
    high52Week: 198.23,
    low52Week: 124.17,
    grade: 'A',
    score: 87,
    metrics: {
      symbol: 'AAPL',
      marketCap: 3000000000000,
      pe: 28.5,
      peg: 1.2,
      eps: 6.15,
      roe: 18.5,
      roa: 12.3,
      currentRatio: 2.1,
      debtToEquity: 0.3,
      dividendYield: 0.55,
      beta: 1.2,
      sharpeRatio: 1.8,
      volatility: 25.4
    }
  },
  MSFT: {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    sector: 'Technology',
    marketCap: 2800000000000,
    currentPrice: 378.85,
    change: -1.25,
    changePercent: -0.33,
    volume: 25000000,
    pe: 32.1,
    eps: 11.8,
    dividend: 3.0,
    dividendYield: 0.79,
    high52Week: 384.30,
    low52Week: 309.45,
    grade: 'A',
    score: 89,
    metrics: {
      symbol: 'MSFT',
      marketCap: 2800000000000,
      pe: 32.1,
      peg: 1.1,
      eps: 11.8,
      roe: 22.1,
      roa: 15.7,
      currentRatio: 2.8,
      debtToEquity: 0.2,
      dividendYield: 0.79,
      beta: 0.9,
      sharpeRatio: 2.1,
      volatility: 22.1
    }
  }
}

// Mock chart data
const generateMockChartData = (symbol: string, timeframe: string) => {
  const data = []
  const now = new Date()
  const intervals = {
    '1D': 1, // 1 minute
    '1W': 60, // 1 hour
    '1M': 1440, // 1 day
    '3M': 1440, // 1 day
    '1Y': 10080, // 1 week
    '5Y': 43200 // 1 month
  }
  
  const interval = intervals[timeframe as keyof typeof intervals] || 1440
  const basePrice = mockStockData[symbol as keyof typeof mockStockData]?.currentPrice || 100
  
  for (let i = 100; i >= 0; i--) {
    const date = new Date(now.getTime() - i * interval * 60000)
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1
    const volume = Math.floor(Math.random() * 10000000) + 1000000
    
    data.push({
      date: date.toISOString(),
      open: price + (Math.random() - 0.5) * 2,
      high: price + Math.random() * 3,
      low: price - Math.random() * 3,
      close: price,
      volume
    })
  }
  
  return data
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '1M'
    const includeChart = searchParams.get('includeChart') === 'true'

    const stockData = mockStockData[symbol.toUpperCase() as keyof typeof mockStockData]
    
    if (!stockData) {
      return NextResponse.json(
        { success: false, error: 'Stock not found' },
        { status: 404 }
      )
    }

    const result: any = { ...stockData }
    
    if (includeChart) {
      result.chartData = {
        symbol: symbol.toUpperCase(),
        timeframe,
        data: generateMockChartData(symbol.toUpperCase(), timeframe)
      }
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error(`Error fetching stock data for ${params.symbol}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}

