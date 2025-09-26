'use client'

import { Badge } from '@/components/ui/Badge'
import { getGradeColor, getGradeBgColor } from '@/lib/utils'

interface GradeBadgeProps {
  grade: string
  score?: number
  showScore?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function GradeBadge({ grade, score, showScore = false, size = 'md' }: GradeBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${getGradeBgColor(grade)} rounded-full border ${sizeClasses[size]}`}>
      <span className={`font-bold ${getGradeColor(grade)}`}>
        {grade}
      </span>
      {showScore && score && (
        <span className="text-muted-foreground text-xs">
          {score}/100
        </span>
      )}
    </div>
  )
}

