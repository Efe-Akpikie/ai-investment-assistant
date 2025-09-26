'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink, Clock } from 'lucide-react'
import { NewsItem } from '@/types'

interface NewsFeedProps {
  news: NewsItem[]
}

export function NewsFeed({ news }: NewsFeedProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success'
      case 'negative':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm leading-tight flex-1 pr-2">
                  {item.title}
                </h4>
                {item.sentiment && (
                  <Badge variant={getSentimentColor(item.sentiment)} className="text-xs">
                    {item.sentiment}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(item.publishedAt)}</span>
                  <span>•</span>
                  <span>{item.source}</span>
                </div>
                
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Read more</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              {item.relatedSymbols && item.relatedSymbols.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.relatedSymbols.slice(0, 3).map((symbol) => (
                    <Badge key={symbol} variant="outline" className="text-xs">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

