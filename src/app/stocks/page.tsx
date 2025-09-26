'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '@/components/stocks/StockTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Filter } from 'lucide-react'
import { Stock } from '@/types'

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('marketCap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/stocks/sp500?limit=50&sortBy=${sortBy}&sortOrder=${sortOrder}`)
        const data = await response.json()
        
        if (data.success) {
          setStocks(data.data)
          setFilteredStocks(data.data)
        }
      } catch (error) {
        console.error('Error fetching stocks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [sortBy, sortOrder])

  useEffect(() => {
    if (searchQuery) {
      const filtered = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredStocks(filtered)
    } else {
      setFilteredStocks(stocks)
    }
  }, [searchQuery, stocks])

  const handleStockClick = (stock: Stock) => {
    window.location.href = `/stocks/${stock.symbol}`
  }

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-secondary rounded w-1/2 mb-8"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-secondary rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">S&P 500 Stocks</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of S&P 500 companies with AI-powered insights
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by symbol, company name, or sector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={sortBy === 'marketCap' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('marketCap')}
              >
                Market Cap
              </Button>
              <Button
                variant={sortBy === 'changePercent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('changePercent')}
              >
                Performance
              </Button>
              <Button
                variant={sortBy === 'grade' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('grade')}
              >
                Grade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredStocks.length} of {stocks.length} stocks
        </p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Sort by: {sortBy}</span>
          <span>•</span>
          <span>Order: {sortOrder}</span>
        </div>
      </div>

      {/* Stocks Table */}
      <StockTable
        stocks={filteredStocks}
        onStockClick={handleStockClick}
        title="S&P 500 Companies"
      />

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Companies</span>
                <span className="font-semibold">500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average P/E</span>
                <span className="font-semibold">24.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Market Cap</span>
                <span className="font-semibold">$45.2T</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade A</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade B</span>
                <span className="font-semibold">120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade C</span>
                <span className="font-semibold">200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade D</span>
                <span className="font-semibold">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade F</span>
                <span className="font-semibold">35</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Technology</span>
                <span className="font-semibold">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Healthcare</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Financials</span>
                <span className="font-semibold">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Consumer Discretionary</span>
                <span className="font-semibold">11%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Others</span>
                <span className="font-semibold">34%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

