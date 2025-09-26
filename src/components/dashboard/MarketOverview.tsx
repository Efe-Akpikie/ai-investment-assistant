'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { MarketIndex } from '@/types'

interface MarketOverviewProps {
  indices: MarketIndex[]
}

export function MarketOverview({ indices }: MarketOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indices.map((index) => {
            const isPositive = index.change >= 0
            const TrendIcon = isPositive ? TrendingUp : TrendingDown

            return (
              <div key={index.symbol} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <h4 className="font-semibold">{index.symbol}</h4>
                  <p className="text-sm text-muted-foreground">{index.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {formatCurrency(index.price)}
                  </div>
                  <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
                    <TrendIcon className="h-3 w-3" />
                    <span className="text-sm font-medium">
                      {formatPercentage(index.changePercent)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

