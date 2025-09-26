'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { StockContextPanel } from '@/components/chat/StockContextPanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, MessageSquare, TrendingUp } from 'lucide-react'
import { Stock } from '@/types'

export default function AdvisorPage() {
  const searchParams = useSearchParams()
  const symbol = searchParams.get('symbol')
  
  const [stock, setStock] = useState<Stock | null>(null)
  const [loading, setLoading] = useState(!!symbol)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (symbol) {
      const fetchStockData = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/stocks/${symbol}?includeChart=true`)
          const data = await response.json()
          
          if (data.success) {
            setStock(data.data)
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

      fetchStockData()
    }
  }, [symbol])

  const handleBackToStocks = () => {
    window.location.href = '/stocks'
  }

  const handleAnalyzeStock = () => {
    if (symbol) {
      window.location.href = `/stocks/${symbol}`
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-secondary rounded w-1/2 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-pulse">
            <div className="h-96 bg-secondary rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Investment Advisor</h1>
          <p className="text-muted-foreground">
            Get personalized investment advice and market insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {symbol && (
            <Button variant="outline" onClick={handleAnalyzeStock}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Stock
            </Button>
          )}
          <Button variant="outline" onClick={handleBackToStocks}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stocks
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat with AI Advisor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <ChatInterface
                stockContext={stock ? {
                  symbol: stock.symbol,
                  stockData: stock,
                  chartData: stock.chartData
                } : undefined}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Stock Context Panel */}
          {stock && (
            <StockContextPanel stock={stock} />
          )}

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Stock Analysis</p>
                    <p className="text-muted-foreground">Detailed fundamental and technical analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Portfolio Optimization</p>
                    <p className="text-muted-foreground">Risk-adjusted portfolio recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Market Insights</p>
                    <p className="text-muted-foreground">Sector trends and market analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Risk Assessment</p>
                    <p className="text-muted-foreground">Investment risk evaluation and mitigation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  This AI advisor provides educational information only and does not constitute personalized financial advice.
                </p>
                <p>
                  Always consult with a licensed financial advisor before making investment decisions.
                </p>
                <p>
                  Past performance does not guarantee future results. All investments carry risk.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleBackToStocks}>
              Return to Stocks
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

