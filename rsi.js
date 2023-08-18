import technicalIndicators from 'technicalindicators';
import axios from 'axios';

async function calculateRSI(symbol, interval, period) {
  // Get historical data from Binance API
  const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`);
  const data = response.data;

  // Extract closing prices
  const closePrices = data.map(candle => parseFloat(candle[4]));

  // Calculate RSI
  const rsi = technicalIndicators.RSI.calculate({
    values: closePrices,
    period: period
  });

  return {rsi, closePrices};
}

// Example usage
calculateRSI('BTCUSDT', '1h', 14).then(rsi => {
  console.log(rsi)
  // Example usage
  let rsiValues = rsi.rsi;
  let overboughtLevel = 70;
  let oversoldLevel = 30;
  let signals = calculateRSISignals(rsiValues, rsi.closePrices, overboughtLevel, oversoldLevel);
  console.log(signals.slice(-1)[0]);
});


function calculateRSISignals(rsiValues, priceValues, overboughtLevel, oversoldLevel) {
  let signals = [];
  let previousRSI = rsiValues[0];
  let previousPrice = priceValues[0];
  let previousDivergence = null;
  let trendLineStartIndex = null;
  let trendLineEndIndex = null;

  for (let i = 1; i < rsiValues.length; i++) {
    let currentRSI = rsiValues[i];
    let currentPrice = priceValues[i];
    let currentSignal = 'HOLD';
    let currentDivergence = null;

    // Check for overbought/oversold signals
    if (currentRSI > overboughtLevel && previousRSI <= overboughtLevel) {
      currentSignal = 'SELL';
    } else if (currentRSI < oversoldLevel && previousRSI >= oversoldLevel) {
      currentSignal = 'BUY';
    }

    // Check for bullish divergence
    if (currentRSI > previousRSI && currentPrice < previousPrice) {
      currentDivergence = 'BULLISH';
      if (previousDivergence === 'BULLISH') {
        currentSignal = 'BUY';
      }
    }

    // Check for bearish divergence
    if (currentRSI < previousRSI && currentPrice > previousPrice) {
      currentDivergence = 'BEARISH';
      if (previousDivergence === 'BEARISH') {
        currentSignal = 'SELL';
      }
    }

    // Check for trend line breakouts
    if (trendLineStartIndex !== null && trendLineEndIndex !== null) {
      let slope = (rsiValues[trendLineEndIndex] - rsiValues[trendLineStartIndex]) / (trendLineEndIndex - trendLineStartIndex);
      let projectedRSI = rsiValues[trendLineStartIndex] + slope * (i - trendLineStartIndex);
      if ((slope > 0 && currentRSI > projectedRSI) || (slope < 0 && currentRSI < projectedRSI)) {
        currentSignal = slope > 0 ? 'BUY' : 'SELL';
        trendLineStartIndex = null;
        trendLineEndIndex = null;
      }
    }

    // Update trend line
    if (trendLineStartIndex === null) {
      trendLineStartIndex = i;
    } else if (trendLineEndIndex === null) {
      if ((currentRSI > rsiValues[trendLineStartIndex] && currentRSI > previousRSI) || (currentRSI < rsiValues[trendLineStartIndex] && currentRSI < previousRSI)) {
        trendLineEndIndex = i;
      }
    } else {
      let slope = (rsiValues[trendLineEndIndex] - rsiValues[trendLineStartIndex]) / (trendLineEndIndex - trendLineStartIndex);
      let projectedRSI = rsiValues[trendLineStartIndex] + slope * (i - trendLineStartIndex);
      if ((slope > 0 && currentRSI > projectedRSI) || (slope < 0 && currentRSI < projectedRSI)) {
        trendLineStartIndex = trendLineEndIndex;
        trendLineEndIndex = i;
      }
    }

    signals.push(currentSignal);
    previousRSI = currentRSI;
    previousPrice = currentPrice;
    previousDivergence = currentDivergence;
  }

  return signals;
}