'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp, 
  PieChart, 
  MessageSquare, 
  Filter,
  Plus,
  Search
} from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const actions = [
    {
      title: 'Analyze Stock',
      description: 'Get detailed analysis for any S&P 500 stock',
      icon: TrendingUp,
      href: '/stocks',
      color: 'bg-blue-500/10 text-blue-400 border-blue-400/20'
    },
    {
      title: 'Portfolio',
      description: 'View and manage your investment portfolio',
      icon: PieChart,
      href: '/portfolio',
      color: 'bg-green-500/10 text-green-400 border-green-400/20'
    },
    {
      title: 'AI Advisor',
      description: 'Chat with our AI investment advisor',
      icon: MessageSquare,
      href: '/advisor',
      color: 'bg-blue-500/10 text-blue-500 border-blue-400/20'
    },
    {
      title: 'Stock Screener',
      description: 'Find stocks matching your criteria',
      icon: Filter,
      href: '/screener',
      color: 'bg-orange-500/10 text-orange-400 border-orange-400/20'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <div className={`p-4 rounded-lg border ${action.color} hover:opacity-80 transition-opacity cursor-pointer`}>
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{action.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search Stocks
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add to Portfolio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
