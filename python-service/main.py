from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import numpy as np
from typing import List, Optional
import os
from dotenv import load_dotenv
import redis
import json
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="AI Investment Assistant API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

@app.get("/")
async def root():
    return {"message": "AI Investment Assistant API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/stocks/sp500")
async def get_sp500_stocks(limit: int = 50):
    """Get S&P 500 stocks with basic information"""
    try:
        # Check cache first
        cache_key = f"sp500_stocks_{limit}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        # Get S&P 500 tickers
        sp500_tickers = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B',
            'JPM', 'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS', 'PYPL', 'ADBE',
            'NFLX', 'CRM', 'INTC', 'CMCSA', 'PFE', 'TMO', 'ABT', 'COST', 'PEP',
            'CSCO', 'ACN', 'DHR', 'VZ', 'NKE', 'TXN', 'QCOM', 'NEE', 'WMT',
            'MRK', 'PM', 'UNP', 'HON', 'IBM', 'SPGI', 'LOW', 'AMGN', 'CAT',
            'GS', 'AXP', 'BA', 'MMM', 'GE', 'XOM', 'CVX', 'COP', 'SLB', 'EOG'
        ]
        
        stocks_data = []
        
        for ticker in sp500_tickers[:limit]:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                hist = stock.history(period="1d")
                
                if not hist.empty and info:
                    current_price = hist['Close'].iloc[-1]
                    previous_close = info.get('previousClose', current_price)
                    change = current_price - previous_close
                    change_percent = (change / previous_close) * 100 if previous_close else 0
                    
                    stock_data = {
                        "symbol": ticker,
                        "companyName": info.get('longName', ticker),
                        "sector": info.get('sector', 'Unknown'),
                        "marketCap": info.get('marketCap', 0),
                        "currentPrice": round(current_price, 2),
                        "change": round(change, 2),
                        "changePercent": round(change_percent, 2),
                        "volume": info.get('volume', 0),
                        "pe": info.get('trailingPE'),
                        "eps": info.get('trailingEps'),
                        "dividend": info.get('dividendRate', 0),
                        "dividendYield": info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 0,
                        "high52Week": info.get('fiftyTwoWeekHigh'),
                        "low52Week": info.get('fiftyTwoWeekLow'),
                    }
                    
                    stocks_data.append(stock_data)
                    
            except Exception as e:
                print(f"Error fetching data for {ticker}: {e}")
                continue
        
        # Cache for 15 minutes
        redis_client.setex(cache_key, 900, json.dumps(stocks_data))
        
        return stocks_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching S&P 500 data: {str(e)}")

@app.get("/stocks/{symbol}")
async def get_stock_data(symbol: str, timeframe: str = "1M"):
    """Get detailed stock data for a specific symbol"""
    try:
        cache_key = f"stock_data_{symbol}_{timeframe}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        stock = yf.Ticker(symbol)
        info = stock.info
        
        # Get historical data
        period_map = {
            "1D": "1d",
            "1W": "5d", 
            "1M": "1mo",
            "3M": "3mo",
            "1Y": "1y",
            "5Y": "5y"
        }
        
        period = period_map.get(timeframe, "1mo")
        hist = stock.history(period=period)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock not found")
        
        # Calculate metrics
        current_price = hist['Close'].iloc[-1]
        previous_close = info.get('previousClose', current_price)
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100 if previous_close else 0
        
        # Calculate additional metrics
        roe = info.get('returnOnEquity', 0) * 100 if info.get('returnOnEquity') else 0
        roa = info.get('returnOnAssets', 0) * 100 if info.get('returnOnAssets') else 0
        current_ratio = info.get('currentRatio', 0)
        debt_to_equity = info.get('debtToEquity', 0)
        peg_ratio = info.get('pegRatio', 0)
        beta = info.get('beta', 1)
        
        # Calculate Sharpe ratio (simplified)
        returns = hist['Close'].pct_change().dropna()
        sharpe_ratio = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() > 0 else 0
        
        # Calculate volatility
        volatility = returns.std() * np.sqrt(252) * 100 if not returns.empty else 0
        
        # Calculate grade
        grade_score = calculate_stock_grade(sharpe_ratio, roe, peg_ratio, current_ratio, debt_to_equity)
        
        stock_data = {
            "symbol": symbol,
            "companyName": info.get('longName', symbol),
            "sector": info.get('sector', 'Unknown'),
            "marketCap": info.get('marketCap', 0),
            "currentPrice": round(current_price, 2),
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "volume": info.get('volume', 0),
            "pe": info.get('trailingPE'),
            "eps": info.get('trailingEps'),
            "dividend": info.get('dividendRate', 0),
            "dividendYield": info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 0,
            "high52Week": info.get('fiftyTwoWeekHigh'),
            "low52Week": info.get('fiftyTwoWeekLow'),
            "grade": grade_score["grade"],
            "score": grade_score["score"],
            "metrics": {
                "symbol": symbol,
                "marketCap": info.get('marketCap', 0),
                "pe": info.get('trailingPE'),
                "peg": peg_ratio,
                "eps": info.get('trailingEps'),
                "roe": roe,
                "roa": roa,
                "currentRatio": current_ratio,
                "debtToEquity": debt_to_equity,
                "dividendYield": info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 0,
                "beta": beta,
                "sharpeRatio": round(sharpe_ratio, 2),
                "volatility": round(volatility, 2)
            },
            "chartData": {
                "symbol": symbol,
                "timeframe": timeframe,
                "data": [
                    {
                        "date": date.isoformat(),
                        "open": round(row['Open'], 2),
                        "high": round(row['High'], 2),
                        "low": round(row['Low'], 2),
                        "close": round(row['Close'], 2),
                        "volume": int(row['Volume'])
                    }
                    for date, row in hist.iterrows()
                ]
            }
        }
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(stock_data))
        
        return stock_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")

def calculate_stock_grade(sharpe_ratio: float, roe: float, peg_ratio: float, 
                         current_ratio: float, debt_to_equity: float) -> dict:
    """Calculate stock grade using 5-factor model"""
    
    # Normalize and weight the factors
    sharpe_score = min(max(sharpe_ratio * 10, 0), 100) * 0.25
    roe_score = min(max(roe * 2, 0), 100) * 0.20
    peg_score = min(max((1 / max(peg_ratio, 0.1)) * 20, 0), 100) * 0.20
    current_ratio_score = min(max(current_ratio * 10, 0), 100) * 0.15
    debt_score = min(max((1 / max(debt_to_equity, 0.1)) * 20, 0), 100) * 0.20
    
    final_score = sharpe_score + roe_score + peg_score + current_ratio_score + debt_score
    
    if final_score >= 85:
        grade = 'A'
    elif final_score >= 70:
        grade = 'B'
    elif final_score >= 55:
        grade = 'C'
    elif final_score >= 40:
        grade = 'D'
    else:
        grade = 'F'
    
    return {"score": round(final_score), "grade": grade}

@app.get("/market/indices")
async def get_market_indices():
    """Get major market indices"""
    try:
        cache_key = "market_indices"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        indices = ['^GSPC', '^IXIC', '^DJI']  # S&P 500, NASDAQ, Dow Jones
        indices_data = []
        
        for index in indices:
            try:
                ticker = yf.Ticker(index)
                hist = ticker.history(period="2d")
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    previous_price = hist['Close'].iloc[-2]
                    change = current_price - previous_price
                    change_percent = (change / previous_price) * 100
                    
                    index_name = {
                        '^GSPC': 'S&P 500',
                        '^IXIC': 'NASDAQ 100',
                        '^DJI': 'Dow Jones'
                    }.get(index, index)
                    
                    indices_data.append({
                        "symbol": index,
                        "name": index_name,
                        "price": round(current_price, 2),
                        "change": round(change, 2),
                        "changePercent": round(change_percent, 2)
                    })
                    
            except Exception as e:
                print(f"Error fetching index {index}: {e}")
                continue
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(indices_data))
        
        return indices_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market indices: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

