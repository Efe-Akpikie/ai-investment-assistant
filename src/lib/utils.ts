import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(2) + 'T'
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B'
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M'
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K'
  }
  return value.toFixed(2)
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-400'
    case 'B':
      return 'text-blue-400'
    case 'C':
      return 'text-yellow-400'
    case 'D':
      return 'text-orange-400'
    case 'F':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

export function getGradeBgColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-400/10 border-green-400/20'
    case 'B':
      return 'bg-blue-400/10 border-blue-400/20'
    case 'C':
      return 'bg-yellow-400/10 border-yellow-400/20'
    case 'D':
      return 'bg-orange-400/10 border-orange-400/20'
    case 'F':
      return 'bg-red-400/10 border-red-400/20'
    default:
      return 'bg-gray-400/10 border-gray-400/20'
  }
}

export function calculateStockGrade(
  sharpeRatio: number,
  roe: number,
  pegRatio: number,
  currentRatio: number,
  debtToEquity: number
): { score: number; grade: string } {
  // Normalize and weight the factors
  const sharpeScore = Math.min(Math.max(sharpeRatio * 10, 0), 100) * 0.25
  const roeScore = Math.min(Math.max(roe * 2, 0), 100) * 0.20
  const pegScore = Math.min(Math.max((1 / Math.max(pegRatio, 0.1)) * 20, 0), 100) * 0.20
  const currentRatioScore = Math.min(Math.max(currentRatio * 10, 0), 100) * 0.15
  const debtScore = Math.min(Math.max((1 / Math.max(debtToEquity, 0.1)) * 20, 0), 100) * 0.20

  const finalScore = sharpeScore + roeScore + pegScore + currentRatioScore + debtScore

  let grade: string
  if (finalScore >= 85) grade = 'A'
  else if (finalScore >= 70) grade = 'B'
  else if (finalScore >= 55) grade = 'C'
  else if (finalScore >= 40) grade = 'D'
  else grade = 'F'

  return { score: Math.round(finalScore), grade }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

