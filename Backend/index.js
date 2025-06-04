require("dotenv").config();
const express = require("express");
const stockService = require("./stockService");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("✅ Stock Price Aggregation API is running");
});


app.get("/stocks/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const { minutes, aggregation } = req.query;

  if (!minutes || aggregation !== "average") {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  try {
    const result = await stockService.getAverageStockPrice(ticker, Number(minutes));
    res.json({
      averageStockPrice: result.averagePrice,
      priceHistory: result.priceHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});


app.get("/stockcorrelation", async (req, res) => {
  const { minutes, ticker } = req.query;

  let tickers = ticker;
  if (!tickers) {
    return res.status(400).json({ error: "Tickers query param required" });
  }
  if (!Array.isArray(tickers)) {
    tickers = [tickers];
  }

  if (!minutes || tickers.length !== 2) {
    return res.status(400).json({ error: "Exactly two tickers and minutes required" });
  }

  try {
    const result = await stockService.getCorrelation(tickers, Number(minutes));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate correlation" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
