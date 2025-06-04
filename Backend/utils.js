function computePearson(x, y) {
  const n = x.length;
  if (n === 0 || x.length !== y.length) return null;

  // Calculate means
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  // Calculate covariance
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance += (x[i] - meanX) * (y[i] - meanY);
  }
  covariance = covariance / n;

  // Calculate standard deviations
  let varianceX = 0;
  let varianceY = 0;
  for (let i = 0; i < n; i++) {
    varianceX += Math.pow(x[i] - meanX, 2);
    varianceY += Math.pow(y[i] - meanY, 2);
  }
  varianceX = varianceX / n;
  varianceY = varianceY / n;

  const stdDevX = Math.sqrt(varianceX);
  const stdDevY = Math.sqrt(varianceY);

  // Pearson correlation coefficient formula
  if (stdDevX === 0 || stdDevY === 0) return null;

  const correlation = covariance / (stdDevX * stdDevY);
  return correlation;
}

module.exports = { computePearson };
