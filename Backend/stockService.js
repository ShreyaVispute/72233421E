const axios = require("axios/index.cts");


async function fetchPrices(ticker, minutes) {
  try {
    const response = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker}`, {
      params: { minutes },
    });

    const stockData = response.data.stock || response.data; 
    if (!stockData || stockData.length === 0) {
      throw new Error("No data for ticker");
    }

  
    const priceHistory = stockData.sort(
      (a, b) => new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt)
    );

    const prices = priceHistory.map((p) => p.price);

   
    const sum = prices.reduce((acc, val) => acc + val, 0);
    const averagePrice = sum / prices.length;

    return { averagePrice, priceHistory };
  } catch (error) {
    throw new Error("Failed to fetch stock data: " + error.message);
  }
}


function computePearson(x, y) {
  const n = x.length;
  if (n === 0 || x.length !== y.length) return null;

  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  let covSum = 0;
  let varXsum = 0;
  let varYsum = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    covSum += diffX * diffY;
    varXsum += diffX * diffX;
    varYsum += diffY * diffY;
  }

  const covariance = covSum / n;
  const stdDevX = Math.sqrt(varXsum / n);
  const stdDevY = Math.sqrt(varYsum / n);

  if (stdDevX === 0 || stdDevY === 0) return null;

  return covariance / (stdDevX * stdDevY);
}


async function getCorrelation(tickers, minutes) {
  if (!Array.isArray(tickers) || tickers.length !== 2) {
    throw new Error("Exactly two tickers are required");
  }

  try {
    const [ticker1, ticker2] = tickers;

   
    const [data1, data2] = await Promise.all([
      fetchPrices(ticker1, minutes),
      fetchPrices(ticker2, minutes),
    ]);

    
    const map2 = new Map(data2.priceHistory.map((p) => [p.lastUpdatedAt, p.price]));

    
    const alignedPrices1 = [];
    const alignedPrices2 = [];

    for (const p1 of data1.priceHistory) {
      const p2Price = map2.get(p1.lastUpdatedAt);
      if (p2Price !== undefined) {
        alignedPrices1.push(p1.price);
        alignedPrices2.push(p2Price);
      }
    }

    if (alignedPrices1.length === 0) {
      throw new Error("No overlapping data points to calculate correlation");
    }

    const correlation = computePearson(alignedPrices1, alignedPrices2);

    return {
      correlation,
      stocks: {
        [ticker1]: {
          averagePrice: data1.averagePrice,
          priceHistory: data1.priceHistory,
        },
        [ticker2]: {
          averagePrice: data2.averagePrice,
          priceHistory: data2.priceHistory,
        },
      },
    };
  } catch (error) {
    throw new Error("Failed to calculate correlation: " + error.message);
  }
}


async function getAverageStockPrice(ticker, minutes) {
  return await fetchPrices(ticker, minutes);
}

module.exports = {
  getAverageStockPrice,
  getCorrelation,
};
