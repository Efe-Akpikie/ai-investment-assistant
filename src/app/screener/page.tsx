'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '@/components/stocks/StockTable'
import { ScreenerFilters } from '@/components/screener/ScreenerFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Filter, Download } from 'lucide-react'
import { Stock, ScreenerFilters as ScreenerFiltersType } from '@/types'

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ScreenerFiltersType>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/stocks/sp500?limit=100')
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
  }, [])

  useEffect(() => {
    let filtered = [...stocks]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply screener filters
    if (filters.minGrade) {
      const gradeOrder = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }
      const minGradeValue = gradeOrder[filters.minGrade as keyof typeof gradeOrder]
      filtered = filtered.filter(stock => {
        if (!stock.grade) return false
        const stockGradeValue = gradeOrder[stock.grade as keyof typeof gradeOrder]
        return stockGradeValue >= minGradeValue
      })
    }

    if (filters.maxGrade) {
      const gradeOrder = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }
      const maxGradeValue = gradeOrder[filters.maxGrade as keyof typeof gradeOrder]
      filtered = filtered.filter(stock => {
        if (!stock.grade) return false
        const stockGradeValue = gradeOrder[stock.grade as keyof typeof gradeOrder]
        return stockGradeValue <= maxGradeValue
      })
    }

    if (filters.minMarketCap) {
      filtered = filtered.filter(stock => stock.marketCap >= filters.minMarketCap! * 1e9)
    }

    if (filters.maxMarketCap) {
      filtered = filtered.filter(stock => stock.marketCap <= filters.maxMarketCap! * 1e9)
    }

    if (filters.minPe) {
      filtered = filtered.filter(stock => stock.pe && stock.pe >= filters.minPe!)
    }

    if (filters.maxPe) {
      filtered = filtered.filter(stock => stock.pe && stock.pe <= filters.maxPe!)
    }

    if (filters.minDividendYield) {
      filtered = filtered.filter(stock => stock.dividendYield >= filters.minDividendYield!)
    }

    if (filters.maxDividendYield) {
      filtered = filtered.filter(stock => stock.dividendYield <= filters.maxDividendYield!)
    }

    if (filters.minScore) {
      filtered = filtered.filter(stock => stock.score && stock.score >= filters.minScore!)
    }

    if (filters.maxScore) {
      filtered = filtered.filter(stock => stock.score && stock.score <= filters.maxScore!)
    }

    if (filters.sectors && filters.sectors.length > 0) {
      filtered = filtered.filter(stock => filters.sectors!.includes(stock.sector))
    }

    setFilteredStocks(filtered)
  }, [stocks, searchQuery, filters])

  const handleStockClick = (stock: Stock) => {
    window.location.href = `/stocks/${stock.symbol}`
  }

  const handleFiltersChange = (newFilters: ScreenerFiltersType) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    // Filters are applied automatically via useEffect
    setShowFilters(false)
  }

  const handleResetFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const handleExportResults = () => {
    const csvContent = [
      ['Symbol', 'Company', 'Sector', 'Price', 'Change%', 'Market Cap', 'P/E', 'Grade', 'Score'].join(','),
      ...filteredStocks.map(stock => [
        stock.symbol,
        stock.companyName,
        stock.sector,
        stock.currentPrice,
        stock.changePercent,
        stock.marketCap,
        stock.pe || 'N/A',
        stock.grade || 'N/A',
        stock.score || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'screener_results.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-secondary rounded w-1/2 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 animate-pulse">
            <div className="h-96 bg-secondary rounded"></div>
          </div>
          <div className="lg:col-span-3 animate-pulse">
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
          <h1 className="text-3xl font-bold mb-2">Stock Screener</h1>
          <p className="text-muted-foreground">
            Find S&P 500 stocks that match your investment criteria
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by symbol, company name, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <ScreenerFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Results */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredStocks.length} of {stocks.length} stocks
            </p>
            <div className="text-sm text-muted-foreground">
              {Object.keys(filters).length > 0 && 'Filters applied'}
            </div>
          </div>

          {/* Stocks Table */}
          <StockTable
            stocks={filteredStocks}
            onStockClick={handleStockClick}
            title="Screener Results"
          />

          {/* No Results */}
          {filteredStocks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStocks.length}</div>
            <p className="text-xs text-muted-foreground">Stocks found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStocks.length > 0 ? 
                (() => {
                  const gradeOrder = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }
                  const avgGrade = filteredStocks
                    .filter(s => s.grade)
                    .reduce((sum, s) => sum + gradeOrder[s.grade as keyof typeof gradeOrder], 0) / 
                    filteredStocks.filter(s => s.grade).length
                  return Object.keys(gradeOrder)[Math.round(avgGrade) - 1] || 'N/A'
                })() : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Investment grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average P/E</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStocks.length > 0 ? 
                (filteredStocks
                  .filter(s => s.pe)
                  .reduce((sum, s) => sum + s.pe!, 0) / 
                  filteredStocks.filter(s => s.pe).length).toFixed(1) : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Price-to-earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStocks.length > 0 ? 
                (() => {
                  const sectorCounts = filteredStocks.reduce((acc, stock) => {
                    acc[stock.sector] = (acc[stock.sector] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                  return Object.entries(sectorCounts)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
                })() : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Most common</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

