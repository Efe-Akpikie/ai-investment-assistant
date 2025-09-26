'use client'

import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { ChartData, PriceData } from '@/types'

interface StockChartProps {
  data: ChartData
  symbol: string
  className?: string
}

const timeframes = [
  { label: '1D', value: '1D' as const },
  { label: '1W', value: '1W' as const },
  { label: '1M', value: '1M' as const },
  { label: '3M', value: '3M' as const },
  { label: '1Y', value: '1Y' as const },
  { label: '5Y', value: '5Y' as const },
]

export function StockChart({ data, symbol, className }: StockChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(data.timeframe)

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem)
    if (selectedTimeframe === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (selectedTimeframe === '1W' || selectedTimeframe === '1M') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }
  }

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">
            {formatTooltipLabel(label)}
          </p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Price: </span>
              <span className="font-medium">{formatCurrency(data.close)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Volume: </span>
              <span className="font-medium">{formatNumber(data.volume)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">High: </span>
              <span className="font-medium">{formatCurrency(data.high)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Low: </span>
              <span className="font-medium">{formatCurrency(data.low)}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Calculate price change for the selected timeframe
  const priceChange = data.data.length > 0 
    ? data.data[data.data.length - 1].close - data.data[0].close
    : 0
  const priceChangePercent = data.data.length > 0 && data.data[0].close > 0
    ? (priceChange / data.data[0].close) * 100
    : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{symbol} Price Chart</CardTitle>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-error'}`}>
              {priceChange >= 0 ? '+' : ''}{formatCurrency(priceChange)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        {/* Timeframe selector */}
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.value}
              variant={selectedTimeframe === timeframe.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe.value)}
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

