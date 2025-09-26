'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatNumber, formatPercentage, getGradeColor } from '@/lib/utils'
import { Stock } from '@/types'

interface StockTableProps {
  stocks: Stock[]
  onStockClick?: (stock: Stock) => void
  title?: string
}

type SortField = 'symbol' | 'currentPrice' | 'changePercent' | 'marketCap' | 'pe' | 'grade' | 'score'
type SortDirection = 'asc' | 'desc'

export function StockTable({ stocks, onStockClick, title = "Stocks" }: StockTableProps) {
  const [sortField, setSortField] = useState<SortField>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Handle special cases
    if (sortField === 'grade') {
      const gradeOrder = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }
      aValue = gradeOrder[a.grade as keyof typeof gradeOrder] || 0
      bValue = gradeOrder[b.grade as keyof typeof gradeOrder] || 0
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </Button>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3">
                  <SortButton field="symbol">Symbol</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="currentPrice">Price</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="changePercent">Change</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="marketCap">Market Cap</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="pe">P/E</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="grade">Grade</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="score">Score</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock) => {
                const isPositive = stock.change >= 0
                const TrendIcon = isPositive ? TrendingUp : TrendingDown

                return (
                  <tr
                    key={stock.symbol}
                    className="border-b border-border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => onStockClick?.(stock)}
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                          {stock.companyName}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatCurrency(stock.currentPrice)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          {formatPercentage(stock.changePercent)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {formatNumber(stock.marketCap)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {stock.pe?.toFixed(2) || 'N/A'}
                      </div>
                    </td>
                    <td className="p-3">
                      {stock.grade && (
                        <Badge variant="grade" className={getGradeColor(stock.grade)}>
                          {stock.grade}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      {stock.score && (
                        <div className="text-sm font-medium">
                          {stock.score}/100
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

