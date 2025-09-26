'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, PieChart, MessageSquare, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileTabs = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Stocks',
    href: '/stocks',
    icon: TrendingUp,
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: PieChart,
  },
  {
    name: 'Chat',
    href: '/advisor',
    icon: MessageSquare,
  },
  {
    name: 'More',
    href: '/more',
    icon: MoreHorizontal,
  },
]

export function MobileBottomTabs() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {mobileTabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive && "text-primary"
              )} />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

