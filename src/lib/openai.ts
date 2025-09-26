import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export { openai }

export async function generateInvestmentAdvice(
  symbol: string,
  stockData: any,
  userQuestion: string
): Promise<string> {
  try {
    const prompt = `
You are a professional investment advisor AI. Provide helpful, accurate, and responsible investment advice based on the following stock data:

Stock Symbol: ${symbol}
Current Price: $${stockData.currentPrice}
Change: ${stockData.changePercent}%
Market Cap: $${stockData.marketCap}
P/E Ratio: ${stockData.pe}
Sector: ${stockData.sector}
Grade: ${stockData.grade || 'N/A'}
Score: ${stockData.score || 'N/A'}/100

User Question: ${userQuestion}

Please provide:
1. A direct answer to the user's question
2. Relevant analysis based on the stock data
3. Important risks and considerations
4. A disclaimer that this is not personalized financial advice

Keep your response concise, professional, and educational. Focus on helping the user understand the investment landscape.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional investment advisor AI. Provide helpful, accurate, and responsible investment advice. Always include appropriate disclaimers about not providing personalized financial advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || 'I apologize, but I cannot provide investment advice at this time.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate investment advice')
  }
}

export async function analyzeChartPattern(
  symbol: string,
  chartData: any[],
  userQuestion: string
): Promise<string> {
  try {
    const recentData = chartData.slice(-20) // Last 20 data points
    const priceTrend = recentData.map(d => d.close)
    const volumeTrend = recentData.map(d => d.volume)
    
    const prompt = `
You are a technical analysis expert. Analyze the following chart data and provide insights:

Stock Symbol: ${symbol}
Recent Price Trend: ${priceTrend.join(', ')}
Recent Volume Trend: ${volumeTrend.join(', ')}

User Question: ${userQuestion}

Please provide:
1. Technical analysis of the price and volume patterns
2. Key support and resistance levels
3. Trend analysis
4. Volume analysis
5. Important technical indicators to watch

Keep your response focused on technical analysis and educational content. Include appropriate disclaimers.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a technical analysis expert. Provide educational technical analysis insights. Always include appropriate disclaimers about not providing personalized financial advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || 'I apologize, but I cannot provide technical analysis at this time.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to analyze chart pattern')
  }
}

export async function analyzeImage(
  imageFile: File,
  userQuestion: string,
  symbol?: string,
  context?: any
): Promise<string> {
  try {
    // Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = imageFile.type

    const prompt = `
You are a professional investment advisor AI with expertise in analyzing financial charts, graphs, and investment-related images.

${symbol ? `Stock Symbol: ${symbol}` : ''}
${context?.stockData ? `Current Stock Data: ${JSON.stringify(context.stockData)}` : ''}

User Question: ${userQuestion || 'Please analyze this image'}

Please analyze the uploaded image and provide:
1. Description of what you see in the image
2. If it's a financial chart/graph, provide technical analysis
3. If it's a company logo or document, provide relevant insights
4. Investment-related observations and insights
5. Important considerations and risks

Keep your response educational and include appropriate disclaimers about not providing personalized financial advice.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional investment advisor AI with expertise in analyzing financial charts, graphs, and investment-related images. Provide educational insights and always include appropriate disclaimers about not providing personalized financial advice.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 600,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || 'I apologize, but I cannot analyze this image at this time.'
  } catch (error) {
    console.error('OpenAI Vision API error:', error)
    throw new Error('Failed to analyze image')
  }
}

