'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '@/components/stocks/StockTable'
import { MarketOverview } from '@/components/dashboard/MarketOverview'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { NewsFeed } from '@/components/dashboard/NewsFeed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Stock, MarketIndex, NewsItem } from '@/types'

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use static mock data for faster loading
        const mockStocks = [
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
          }
        ]
        setStocks(mockStocks)

        // Mock market indices data
        setMarketIndices([
          {
            symbol: 'SPY',
            name: 'S&P 500',
            price: 4456.78,
            change: 12.34,
            changePercent: 0.28
          },
          {
            symbol: 'QQQ',
            name: 'NASDAQ 100',
            price: 3789.45,
            change: -8.92,
            changePercent: -0.23
          },
          {
            symbol: 'DIA',
            name: 'Dow Jones',
            price: 34256.78,
            change: 45.67,
            changePercent: 0.13
          }
        ])

        // Mock news data
        setNews([
          {
            id: '1',
            title: 'Federal Reserve Maintains Interest Rates Amid Economic Uncertainty',
            summary: 'The Federal Reserve kept interest rates unchanged at 5.25-5.50% as policymakers assess the economic outlook and inflation trends.',
            url: '#',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: 'Reuters',
            sentiment: 'neutral',
            relatedSymbols: ['SPY', 'QQQ', 'DIA']
          },
          {
            id: '2',
            title: 'Tech Stocks Rally on Strong Earnings Reports',
            summary: 'Major technology companies reported better-than-expected quarterly earnings, driving the NASDAQ to new highs.',
            url: '#',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            source: 'Bloomberg',
            sentiment: 'positive',
            relatedSymbols: ['AAPL', 'MSFT', 'GOOGL', 'NVDA']
          },
          {
            id: '3',
            title: 'Energy Sector Faces Headwinds as Oil Prices Decline',
            summary: 'Energy stocks underperformed as crude oil prices fell due to concerns about global demand and supply dynamics.',
            url: '#',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            source: 'MarketWatch',
            sentiment: 'negative',
            relatedSymbols: ['XOM', 'CVX', 'COP']
          }
        ])

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    // Use setTimeout to simulate faster loading
    setTimeout(fetchData, 100)
  }, [])

  const handleStockClick = (stock: Stock) => {
    // Navigate to stock detail page
    window.location.href = `/stocks/${stock.symbol}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top S&P 500 Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-secondary rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-32 bg-secondary rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-48 bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Top S&P 500 Stocks */}
        <div className="lg:col-span-2">
          <StockTable
            stocks={stocks}
            onStockClick={handleStockClick}
            title="Top S&P 500 Stocks"
          />
        </div>

        {/* Right Column - Market Overview, Quick Actions */}
        <div className="space-y-6">
          <MarketOverview indices={marketIndices} />
          <QuickActions />
        </div>
      </div>

      {/* Market News Section - Full Width Under Stocks */}
      <div className="lg:col-span-2">
        <NewsFeed news={news} />
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45.2T</div>
            <p className="text-sm text-muted-foreground">S&P 500 Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average P/E Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8</div>
            <p className="text-sm text-muted-foreground">Market Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500+</div>
            <p className="text-sm text-muted-foreground">Stocks Analyzed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
