'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Trash2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import { Portfolio, PortfolioHolding } from '@/types'

interface HoldingsTableProps {
  portfolio: Portfolio
  onRemoveHolding?: (symbol: string) => void
  onAddHolding?: () => void
}

export function HoldingsTable({ portfolio, onRemoveHolding, onAddHolding }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<keyof PortfolioHolding>('marketValue')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof PortfolioHolding) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedHoldings = [...portfolio.holdings].sort((a, b) => {
    const aValue = a[sortField] as number
    const bValue = b[sortField] as number
    
    if (sortDirection === 'desc') {
      return bValue - aValue
    } else {
      return aValue - bValue
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Holdings - Optimal Holdings Based on S&P Universe</CardTitle>
          <Button onClick={onAddHolding} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Symbol
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('shares')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Shares
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('averageCost')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Avg Cost
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('currentPrice')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Current Price
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('marketValue')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Market Value
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('gain')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Gain/Loss
                  </button>
                </th>
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('allocation')}
                    className="font-medium hover:text-foreground transition-colors"
                  >
                    Allocation
                  </button>
                </th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((holding) => {
                const isPositive = holding.gain >= 0
                const TrendIcon = isPositive ? TrendingUp : TrendingDown

                return (
                  <tr
                    key={holding.symbol}
                    className="border-b border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-semibold">{holding.symbol}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatNumber(holding.shares)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatCurrency(holding.averageCost)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatCurrency(holding.currentPrice)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatCurrency(holding.marketValue)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          {formatCurrency(holding.gain)}
                        </span>
                        <span className="text-xs">
                          ({formatPercentage(holding.gainPercent)})
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {formatPercentage(holding.allocation)}
                        </span>
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${holding.allocation}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = `/stocks/${holding.symbol}`}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveHolding?.(holding.symbol)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {portfolio.holdings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No holdings in your portfolio</p>
            <Button onClick={onAddHolding}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Stock
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

