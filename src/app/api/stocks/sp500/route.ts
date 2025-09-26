import { NextRequest, NextResponse } from 'next/server'

// Mock S&P 500 data for development
const mockSP500Data = [
  {
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
    score: 87
  },
  {
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
    score: 89
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    sector: 'Technology',
    marketCap: 1700000000000,
    currentPrice: 142.56,
    change: 3.42,
    changePercent: 2.46,
    volume: 30000000,
    pe: 25.8,
    eps: 5.52,
    dividend: 0,
    dividendYield: 0,
    high52Week: 151.55,
    low52Week: 102.21,
    grade: 'B',
    score: 78
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    marketCap: 1500000000000,
    currentPrice: 155.23,
    change: 1.87,
    changePercent: 1.22,
    volume: 35000000,
    pe: 45.2,
    eps: 3.43,
    dividend: 0,
    dividendYield: 0,
    high52Week: 170.83,
    low52Week: 101.15,
    grade: 'B',
    score: 72
  },
  {
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    sector: 'Consumer Discretionary',
    marketCap: 800000000000,
    currentPrice: 248.50,
    change: -5.20,
    changePercent: -2.05,
    volume: 60000000,
    pe: 65.3,
    eps: 3.81,
    dividend: 0,
    dividendYield: 0,
    high52Week: 299.29,
    low52Week: 138.80,
    grade: 'C',
    score: 65
  },
  {
    symbol: 'META',
    companyName: 'Meta Platforms Inc.',
    sector: 'Technology',
    marketCap: 900000000000,
    currentPrice: 350.12,
    change: 8.45,
    changePercent: 2.47,
    volume: 20000000,
    pe: 22.4,
    eps: 15.63,
    dividend: 2.0,
    dividendYield: 0.57,
    high52Week: 384.33,
    low52Week: 197.16,
    grade: 'B',
    score: 76
  },
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Technology',
    marketCap: 1200000000000,
    currentPrice: 875.28,
    change: 25.67,
    changePercent: 3.02,
    volume: 40000000,
    pe: 68.9,
    eps: 12.70,
    dividend: 0.16,
    dividendYield: 0.02,
    high52Week: 974.00,
    low52Week: 200.00,
    grade: 'A',
    score: 91
  },
  {
    symbol: 'BRK.B',
    companyName: 'Berkshire Hathaway Inc.',
    sector: 'Financials',
    marketCap: 750000000000,
    currentPrice: 405.67,
    change: 2.34,
    changePercent: 0.58,
    volume: 8000000,
    pe: 22.1,
    eps: 18.35,
    dividend: 0,
    dividendYield: 0,
    high52Week: 420.00,
    low52Week: 340.00,
    grade: 'A',
    score: 85
  },
  {
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    marketCap: 500000000000,
    currentPrice: 185.43,
    change: -1.25,
    changePercent: -0.67,
    volume: 12000000,
    pe: 12.8,
    eps: 14.48,
    dividend: 4.0,
    dividendYield: 2.16,
    high52Week: 200.00,
    low52Week: 135.00,
    grade: 'B',
    score: 74
  },
  {
    symbol: 'JNJ',
    companyName: 'Johnson & Johnson',
    sector: 'Healthcare',
    marketCap: 420000000000,
    currentPrice: 158.92,
    change: 0.85,
    changePercent: 0.54,
    volume: 8000000,
    pe: 15.2,
    eps: 10.45,
    dividend: 4.76,
    dividendYield: 3.0,
    high52Week: 175.00,
    low52Week: 150.00,
    grade: 'A',
    score: 82
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'marketCap'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // For development, return mock data
    // In production, this would fetch from the Python service
    
    // Sort the mock data
    const sortedData = [...mockSP500Data].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] as number
      const bValue = b[sortBy as keyof typeof b] as number
      
      if (sortOrder === 'desc') {
        return bValue - aValue
      } else {
        return aValue - bValue
      }
    })

    // Apply limit
    const data = sortedData.slice(0, limit)

    return NextResponse.json({
      success: true,
      data,
      total: mockSP500Data.length
    })
  } catch (error) {
    console.error('Error fetching S&P 500 data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch S&P 500 data' },
      { status: 500 }
    )
  }
}

