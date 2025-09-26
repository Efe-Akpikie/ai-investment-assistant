'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Stock } from '@/types'

interface StockContextPanelProps {
  stock: Stock
  className?: string
}

export function StockContextPanel({ stock, className }: StockContextPanelProps) {
  const isPositive = stock.change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Stock Context</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stock Header */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg">{stock.symbol}</h3>
              {stock.grade && (
                <Badge variant="grade" className={stock.grade}>
                  {stock.grade}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{stock.companyName}</p>
            <p className="text-xs text-muted-foreground">{stock.sector}</p>
          </div>

          {/* Current Price */}
          <div>
            <div className="text-2xl font-bold">{formatCurrency(stock.currentPrice)}</div>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="text-sm font-medium">
                {formatPercentage(stock.changePercent)}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Market Cap</span>
              <p className="font-medium">{formatCurrency(stock.marketCap)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">P/E Ratio</span>
              <p className="font-medium">{stock.pe?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Volume</span>
              <p className="font-medium">{formatCurrency(stock.volume)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Dividend Yield</span>
              <p className="font-medium">{formatPercentage(stock.dividendYield)}</p>
            </div>
          </div>

          {/* Investment Score */}
          {stock.score && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Investment Score</span>
                <span className="font-medium">{stock.score}/100</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stock.score}%` }}
                />
              </div>
            </div>
          )}

          {/* 52-Week Range */}
          <div className="text-sm">
            <span className="text-muted-foreground">52-Week Range</span>
            <div className="flex justify-between mt-1">
              <span>{formatCurrency(stock.low52Week)}</span>
              <span>{formatCurrency(stock.high52Week)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

