import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

export default function HeatmapPage() {
  const [timeInterval, setTimeInterval] = useState(15);
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const stocks = ["AAPL", "GOOGL", "MSFT", "AMZN"];

  useEffect(() => {
    
    const mockMatrix = [
      [1, 0.8, 0.4, -0.2],
      [0.8, 1, 0.5, -0.1],
      [0.4, 0.5, 1, 0.3],
      [-0.2, -0.1, 0.3, 1],
    ];
    setCorrelationMatrix(mockMatrix);
  }, [timeInterval]);

  
  const getColor = (value) => {
    if (value > 0) {
      const greenIntensity = Math.floor(value * 255);
      return `rgba(0,${greenIntensity},0,0.7)`;
    } else {
      const redIntensity = Math.floor(-value * 255);
      return `rgba(${redIntensity},0,0,0.7)`;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap (Last {timeInterval} minutes)
      </Typography>

      <table style={{ borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr>
            <th></th>
            {stocks.map((stock) => (
              <th key={stock} style={{ padding: 10 }}>{stock}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {correlationMatrix.map((row, i) => (
            <tr key={i}>
              <td style={{ fontWeight: "bold", padding: 10 }}>{stocks[i]}</td>
              {row.map((val, j) => (
                <td
                  key={j}
                  style={{
                    backgroundColor: getColor(val),
                    padding: 20,
                    color: "white",
                    cursor: "pointer",
                  }}
                  title={`Correlation: ${val.toFixed(2)}`}
                >
                  {val.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Box mt={2}>
        <Typography variant="body2" gutterBottom>
          Color Legend: <span style={{ color: "green" }}>Green</span> = Positive
          Correlation, <span style={{ color: "red" }}>Red</span> = Negative
          Correlation
        </Typography>
      </Box>
    </Box>
  );
}
