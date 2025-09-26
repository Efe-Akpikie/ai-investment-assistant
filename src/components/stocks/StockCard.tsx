'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatNumber, formatPercentage, getGradeColor } from '@/lib/utils'
import { Stock } from '@/types'

interface StockCardProps {
  stock: Stock
  onClick?: () => void
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{stock.symbol}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[120px]">
              {stock.companyName}
            </p>
          </div>
          {stock.grade && (
            <Badge variant="grade" className={getGradeColor(stock.grade)}>
              {stock.grade}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {formatCurrency(stock.currentPrice)}
            </span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatPercentage(stock.changePercent)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Market Cap</span>
              <p className="font-medium">{formatNumber(stock.marketCap)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">P/E</span>
              <p className="font-medium">{stock.pe?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Volume</span>
              <p className="font-medium">{formatNumber(stock.volume)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Sector</span>
              <p className="font-medium truncate">{stock.sector}</p>
            </div>
          </div>

          {stock.score && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Investment Score</span>
                <span className="font-medium">{stock.score}/100</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-1">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stock.score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

