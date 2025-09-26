import { NextRequest, NextResponse } from 'next/server'
import { getCacheWithFallback } from '@/lib/redis'

// Mock portfolio data for development
const mockPortfolio = {
  id: 'user-123',
  userId: 'user-123',
  name: 'My Investment Portfolio',
  holdings: [
    {
      symbol: 'AAPL',
      shares: 100,
      averageCost: 150.00,
      currentPrice: 175.43,
      marketValue: 17543.00,
      gain: 2543.00,
      gainPercent: 16.95,
      allocation: 35.2
    },
    {
      symbol: 'MSFT',
      shares: 50,
      averageCost: 300.00,
      currentPrice: 378.85,
      marketValue: 18942.50,
      gain: 3942.50,
      gainPercent: 26.28,
      allocation: 38.1
    },
    {
      symbol: 'GOOGL',
      shares: 25,
      averageCost: 120.00,
      currentPrice: 142.56,
      marketValue: 3564.00,
      gain: 564.00,
      gainPercent: 18.80,
      allocation: 7.2
    },
    {
      symbol: 'NVDA',
      shares: 10,
      averageCost: 400.00,
      currentPrice: 875.28,
      marketValue: 8752.80,
      gain: 4752.80,
      gainPercent: 118.82,
      allocation: 17.6
    },
    {
      symbol: 'JNJ',
      shares: 30,
      averageCost: 160.00,
      currentPrice: 158.92,
      marketValue: 4767.60,
      gain: -32.40,
      gainPercent: -0.68,
      allocation: 9.6
    }
  ],
  totalValue: 49770.90,
  totalCost: 45000.00,
  totalGain: 4770.90,
  totalGainPercent: 10.60,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-09-26T20:00:00Z'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user-123'

    const cacheKey = `portfolio:${userId}`
    
    const data = await getCacheWithFallback(
      cacheKey,
      async () => {
        return mockPortfolio
      },
      300 // 5 minutes cache
    )

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, symbol, shares, price } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'User ID and action are required' },
        { status: 400 }
      )
    }

    // Mock portfolio update logic
    const cacheKey = `portfolio:${userId}`
    
    // In a real application, this would update the database
    // For now, we'll just return a success response
    const updatedPortfolio = {
      ...mockPortfolio,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedPortfolio,
      message: `Portfolio ${action} successful`
    })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

