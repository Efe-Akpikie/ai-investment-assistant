'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { StockChart } from '@/components/stocks/StockChart'
import { StockMetrics } from '@/components/stocks/StockMetrics'
import { GradeBadge } from '@/components/stocks/GradeBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TrendingUp, TrendingDown, Plus, MessageSquare } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import { Stock, ChartData, StockMetrics as StockMetricsType } from '@/types'

export default function StockAnalysisPage() {
  const params = useParams()
  const symbol = params.symbol as string
  
  const [stock, setStock] = useState<Stock | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/stocks/${symbol}?includeChart=true&timeframe=1M`)
        const data = await response.json()
        
        if (data.success) {
          setStock(data.data)
          setChartData(data.data.chartData)
        } else {
          setError('Stock not found')
        }
      } catch (err) {
        setError('Failed to fetch stock data')
        console.error('Error fetching stock data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchStockData()
    }
  }, [symbol])

  const handleAddToPortfolio = () => {
    // TODO: Implement add to portfolio functionality
    console.log('Add to portfolio:', symbol)
  }

  const handleChatWithAI = () => {
    // TODO: Navigate to chat with stock context
    window.location.href = `/advisor?symbol=${symbol}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-secondary rounded w-1/2 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stock) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Stock Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The stock symbol "{symbol}" could not be found.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const isPositive = stock.change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold">{stock.symbol}</h1>
            {stock.grade && (
              <GradeBadge grade={stock.grade} score={stock.score} showScore />
            )}
          </div>
          <p className="text-lg text-muted-foreground">{stock.companyName}</p>
          <p className="text-sm text-muted-foreground">{stock.sector}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleAddToPortfolio}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Portfolio
          </Button>
          <Button onClick={handleChatWithAI}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with AI
          </Button>
        </div>
      </div>

      {/* Price and Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Current Price</div>
            <div className="text-2xl font-bold">{formatCurrency(stock.currentPrice)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Change</div>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-lg font-semibold">
                {formatPercentage(stock.changePercent)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
            <div className="text-lg font-semibold">{formatNumber(stock.marketCap)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">P/E Ratio</div>
            <div className="text-lg font-semibold">{stock.pe?.toFixed(2) || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Chart */}
        <div>
          {chartData && (
            <StockChart data={chartData} symbol={symbol} />
          )}
        </div>

        {/* Right Column - Metrics */}
        <div>
          {stock.metrics && (
            <StockMetrics metrics={stock.metrics} />
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">52-Week High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatCurrency(stock.high52Week)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">52-Week Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatCurrency(stock.low52Week)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatNumber(stock.volume)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dividend Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatPercentage(stock.dividendYield)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Score Breakdown */}
      {stock.score && (
        <Card>
          <CardHeader>
            <CardTitle>Investment Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Score</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{stock.score}/100</span>
                  <Badge variant="grade" className={stock.grade}>
                    {stock.grade}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stock.score}%` }}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                This score is calculated using a 5-factor model including Sharpe Ratio, ROE, PEG Ratio, Current Ratio, and Debt-to-Equity ratio.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

