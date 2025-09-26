import { NextRequest, NextResponse } from 'next/server'
import { generateInvestmentAdvice, analyzeChartPattern, analyzeImage } from '@/lib/openai'
import { getCacheWithFallback } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const message = formData.get('message') as string
    const symbol = formData.get('symbol') as string
    const contextStr = formData.get('context') as string
    const image = formData.get('image') as File | null

    if (!message && !image) {
      return NextResponse.json(
        { success: false, error: 'Message or image is required' },
        { status: 400 }
      )
    }

    let context = null
    if (contextStr) {
      try {
        context = JSON.parse(contextStr)
      } catch (e) {
        console.error('Failed to parse context:', e)
      }
    }

    // Handle image analysis
    if (image) {
      const cacheKey = `chat:image:${symbol || 'general'}:${message?.slice(0, 50) || 'image'}`
      
      const response = await getCacheWithFallback(
        cacheKey,
        async () => {
          return await analyzeImage(image, message, symbol, context)
        },
        1800 // 30 minutes cache
      )

      return NextResponse.json({
        success: true,
        data: {
          message: response,
          type: 'image_analysis',
          symbol: symbol || undefined
        }
      })
    }

    // Check if this is a chart analysis request
    if (context?.chartData && symbol) {
      const cacheKey = `chat:chart:${symbol}:${message.slice(0, 50)}`
      
      const response = await getCacheWithFallback(
        cacheKey,
        async () => {
          return await analyzeChartPattern(symbol, context.chartData, message)
        },
        1800 // 30 minutes cache
      )

      return NextResponse.json({
        success: true,
        data: {
          message: response,
          type: 'chart_analysis',
          symbol
        }
      })
    }

    // Regular investment advice
    if (symbol && context?.stockData) {
      const cacheKey = `chat:advice:${symbol}:${message.slice(0, 50)}`
      
      const response = await getCacheWithFallback(
        cacheKey,
        async () => {
          return await generateInvestmentAdvice(symbol, context.stockData, message)
        },
        1800 // 30 minutes cache
      )

      return NextResponse.json({
        success: true,
        data: {
          message: response,
          type: 'investment_advice',
          symbol
        }
      })
    }

    // General investment question
    const cacheKey = `chat:general:${message.slice(0, 50)}`
    
    const response = await getCacheWithFallback(
      cacheKey,
      async () => {
        // For general questions, provide educational content
        return `I'm here to help with investment-related questions! However, for the most accurate and personalized advice, I recommend:

1. **Consulting with a licensed financial advisor** who can assess your specific situation
2. **Researching specific stocks** using our stock analysis tools
3. **Learning about investment fundamentals** through our educational resources

For specific stock analysis, please search for a stock symbol and ask questions about that particular company. I can provide insights about:
- Company fundamentals and financial health
- Technical analysis and chart patterns
- Market trends and sector analysis
- Risk assessment and portfolio considerations

What specific stock or investment topic would you like to explore?`
      },
      3600 // 1 hour cache
    )

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        type: 'general_advice'
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

