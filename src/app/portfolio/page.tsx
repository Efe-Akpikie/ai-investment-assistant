'use client'

import { useState, useEffect } from 'react'
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { AllocationChart } from '@/components/portfolio/AllocationChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, TrendingUp, PieChart, BarChart3 } from 'lucide-react'
import { Portfolio } from '@/types'

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/portfolio?userId=user-123')
        const data = await response.json()
        
        if (data.success) {
          setPortfolio(data.data)
        } else {
          setError('Failed to fetch portfolio')
        }
      } catch (err) {
        setError('Failed to fetch portfolio')
        console.error('Error fetching portfolio:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  const handleAddHolding = () => {
    // TODO: Implement add holding functionality
    console.log('Add holding')
  }

  const handleRemoveHolding = async (symbol: string) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-123',
          action: 'remove',
          symbol
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setPortfolio(data.data)
      } else {
        console.error('Failed to remove holding')
      }
    } catch (error) {
      console.error('Error removing holding:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-secondary rounded w-1/2 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-secondary rounded"></div>
            </div>
          ))}
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

  if (error || !portfolio) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || 'Unable to load your portfolio.'}
        </p>
        <Button onClick={handleAddHolding}>
          <Plus className="h-4 w-4 mr-2" />
          Create Portfolio
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio - Optimal Holdings Based on S&P Universe</h1>
          <p className="text-muted-foreground">
            {portfolio.name} • Last updated {new Date(portfolio.updatedAt).toLocaleDateString()}
          </p>
        </div>
        
        <Button onClick={handleAddHolding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary portfolio={portfolio} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-1">
          <HoldingsTable
            portfolio={portfolio}
            onAddHolding={handleAddHolding}
            onRemoveHolding={handleRemoveHolding}
          />
        </div>

        {/* Allocation Chart */}
        <div className="lg:col-span-1">
          <AllocationChart holdings={portfolio.holdings} />
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Performer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.holdings.length > 0 ? (
              (() => {
                const topPerformer = portfolio.holdings.reduce((prev, current) => 
                  (prev.gainPercent > current.gainPercent) ? prev : current
                )
                return (
                  <div>
                    <div className="text-2xl font-bold">{topPerformer.symbol}</div>
                    <div className="text-success text-lg font-semibold">
                      +{topPerformer.gainPercent.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {topPerformer.shares} shares
                    </div>
                  </div>
                )
              })()
            ) : (
              <div className="text-muted-foreground">No holdings</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Diversification</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolio.holdings.length}</div>
            <div className="text-sm text-muted-foreground">Different stocks</div>
            <div className="text-sm text-muted-foreground mt-2">
              {portfolio.holdings.length >= 10 ? 'Well diversified' : 'Consider adding more stocks'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Risk Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolio.holdings.length >= 15 ? 'Low' : 
               portfolio.holdings.length >= 8 ? 'Medium' : 'High'}
            </div>
            <div className="text-sm text-muted-foreground">Portfolio risk</div>
            <div className="text-sm text-muted-foreground mt-2">
              {portfolio.holdings.length >= 15 ? 'Well balanced' : 
               portfolio.holdings.length >= 8 ? 'Moderate risk' : 'High concentration risk'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleAddHolding}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Stock
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/advisor'}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Get AI Advice
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/screener'}>
              <PieChart className="h-4 w-4 mr-2" />
              Find Stocks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

