'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import { StockMetrics as StockMetricsType } from '@/types'

interface StockMetricsProps {
  metrics: StockMetricsType
  className?: string
}

export function StockMetrics({ metrics, className }: StockMetricsProps) {
  const getMetricColor = (value: number, type: 'positive' | 'negative' | 'neutral' = 'neutral') => {
    if (type === 'positive') {
      return value > 0 ? 'text-success' : 'text-error'
    } else if (type === 'negative') {
      return value < 0 ? 'text-success' : 'text-error'
    }
    return 'text-foreground'
  }

  const getMetricBadgeVariant = (value: number, type: 'positive' | 'negative' | 'neutral' = 'neutral') => {
    if (type === 'positive') {
      return value > 0 ? 'success' : 'destructive'
    } else if (type === 'negative') {
      return value < 0 ? 'success' : 'destructive'
    }
    return 'secondary'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Valuation Metrics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Valuation
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Cap</span>
                <span className="font-medium">{formatNumber(metrics.marketCap)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">P/E Ratio</span>
                <span className="font-medium">{metrics.pe?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PEG Ratio</span>
                <span className="font-medium">{metrics.peg?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">EPS</span>
                <span className="font-medium">{formatCurrency(metrics.eps)}</span>
              </div>
            </div>
          </div>

          {/* Profitability Metrics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Profitability
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">ROE</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formatPercentage(metrics.roe)}</span>
                  <Badge variant={getMetricBadgeVariant(metrics.roe, 'positive')} className="text-xs">
                    {metrics.roe > 15 ? 'Good' : metrics.roe > 10 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ROA</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formatPercentage(metrics.roa)}</span>
                  <Badge variant={getMetricBadgeVariant(metrics.roa, 'positive')} className="text-xs">
                    {metrics.roa > 5 ? 'Good' : metrics.roa > 3 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Health */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Financial Health
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Ratio</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{metrics.currentRatio?.toFixed(2) || 'N/A'}</span>
                  <Badge variant={getMetricBadgeVariant(metrics.currentRatio - 2, 'positive')} className="text-xs">
                    {metrics.currentRatio > 2 ? 'Strong' : metrics.currentRatio > 1 ? 'Good' : 'Weak'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Debt-to-Equity</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{metrics.debtToEquity?.toFixed(2) || 'N/A'}</span>
                  <Badge variant={getMetricBadgeVariant(0.5 - metrics.debtToEquity, 'positive')} className="text-xs">
                    {metrics.debtToEquity < 0.3 ? 'Low' : metrics.debtToEquity < 0.6 ? 'Moderate' : 'High'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Risk & Performance */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Risk & Performance
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Beta</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{metrics.beta?.toFixed(2) || 'N/A'}</span>
                  <Badge variant={getMetricBadgeVariant(1 - metrics.beta, 'neutral')} className="text-xs">
                    {metrics.beta < 0.8 ? 'Low Risk' : metrics.beta < 1.2 ? 'Market Risk' : 'High Risk'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sharpe Ratio</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{metrics.sharpeRatio?.toFixed(2) || 'N/A'}</span>
                  <Badge variant={getMetricBadgeVariant(metrics.sharpeRatio - 1, 'positive')} className="text-xs">
                    {metrics.sharpeRatio > 1 ? 'Excellent' : metrics.sharpeRatio > 0.5 ? 'Good' : 'Poor'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Volatility</span>
                <span className="font-medium">{formatPercentage(metrics.volatility)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dividend Yield</span>
                <span className="font-medium">{formatPercentage(metrics.dividendYield)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

