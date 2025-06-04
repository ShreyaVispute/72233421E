import React, { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Box } from "@mui/material";

export default function StockPage() {
  const [timeInterval, setTimeInterval] = useState(15); // default last 15 minutes
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
   
    const mockData = [
      { time: "10:00", price: 100 },
      { time: "10:05", price: 105 },
      { time: "10:10", price: 102 },
      { time: "10:15", price: 108 },
    ];
    setStockData(mockData);
  }, [timeInterval]);

  const handleIntervalChange = (event) => {
    setTimeInterval(event.target.value);
  };

 
  const avgPrice =
    stockData.reduce((sum, d) => sum + d.price, 0) / stockData.length || 0;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Stock Prices (Last {timeInterval} minutes)
      </Typography>

      <Select value={timeInterval} onChange={handleIntervalChange} sx={{ mb: 2 }}>
        <MenuItem value={5}>Last 5 minutes</MenuItem>
        <MenuItem value={15}>Last 15 minutes</MenuItem>
        <MenuItem value={30}>Last 30 minutes</MenuItem>
        <MenuItem value={60}>Last 60 minutes</MenuItem>
      </Select>

      <Box>
        {/* Replace this with your chart component, here just showing data */}
        {stockData.length === 0 ? (
          <Typography>No data available</Typography>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Time</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((d, i) => (
                <tr key={i} style={{ backgroundColor: d.price === avgPrice ? "#cfe8fc" : "transparent" }}>
                  <td>{d.time}</td>
                  <td>{d.price.toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold" }}>
                <td>Average Price</td>
                <td>{avgPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Box>
    </Box>
  );
}
