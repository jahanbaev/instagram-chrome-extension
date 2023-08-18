import technicalIndicators from 'technicalindicators';
import axios from 'axios';
import fetch from 'node-fetch';

async function calculateBB(symbol, interval, period) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`;
  const response = await fetch(url);
  const data = await response.json();
  const closePrices = data.map(d => parseFloat(d[4]));
  const bb = technicalIndicators.BollingerBands.calculate({
    values: closePrices,
    period: period,
    stdDev: 2
  });
  return bb;
}

// Example usage:
calculateBB('BTCUSDT', '1d', 20).then(bb => console.log(bb));
