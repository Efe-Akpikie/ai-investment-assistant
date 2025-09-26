'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Filter, X, RotateCcw } from 'lucide-react'
import { ScreenerFilters as ScreenerFiltersType } from '@/types'

interface ScreenerFiltersProps {
  filters: ScreenerFiltersType
  onFiltersChange: (filters: ScreenerFiltersType) => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

const sectors = [
  'Technology',
  'Healthcare',
  'Financials',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Industrials',
  'Materials',
  'Real Estate',
  'Utilities',
  'Communication Services'
]

const grades = ['A', 'B', 'C', 'D', 'F']

export function ScreenerFilters({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onResetFilters 
}: ScreenerFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof ScreenerFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const removeFilter = (key: keyof ScreenerFiltersType) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => 
      filters[key as keyof ScreenerFiltersType] !== undefined && 
      filters[key as keyof ScreenerFiltersType] !== ''
    ).length
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value === undefined || value === '') return null
                
                let displayValue = value
                if (key === 'sectors' && Array.isArray(value)) {
                  displayValue = value.join(', ')
                }
                
                return (
                  <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                    <span>{key}: {displayValue}</span>
                    <button
                      onClick={() => removeFilter(key as keyof ScreenerFiltersType)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'}`}>
          {/* Grade Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Grade Range</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.minGrade || ''}
                onChange={(e) => updateFilter('minGrade', e.target.value || undefined)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">Min Grade</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <select
                value={filters.maxGrade || ''}
                onChange={(e) => updateFilter('maxGrade', e.target.value || undefined)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">Max Grade</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Market Cap Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Market Cap (Billions)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minMarketCap || ''}
                onChange={(e) => updateFilter('minMarketCap', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxMarketCap || ''}
                onChange={(e) => updateFilter('maxMarketCap', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          {/* P/E Ratio Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">P/E Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPe || ''}
                onChange={(e) => updateFilter('minPe', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPe || ''}
                onChange={(e) => updateFilter('maxPe', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          {/* Dividend Yield Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Dividend Yield (%)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minDividendYield || ''}
                onChange={(e) => updateFilter('minDividendYield', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxDividendYield || ''}
                onChange={(e) => updateFilter('maxDividendYield', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          {/* Score Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Investment Score</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minScore || ''}
                onChange={(e) => updateFilter('minScore', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxScore || ''}
                onChange={(e) => updateFilter('maxScore', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>

          {/* Sectors */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sectors</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {sectors.map(sector => (
                <label key={sector} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sectors?.includes(sector) || false}
                    onChange={(e) => {
                      const currentSectors = filters.sectors || []
                      if (e.target.checked) {
                        updateFilter('sectors', [...currentSectors, sector])
                      } else {
                        updateFilter('sectors', currentSectors.filter(s => s !== sector))
                      }
                    }}
                    className="rounded border-input"
                  />
                  <span>{sector}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button onClick={onApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

