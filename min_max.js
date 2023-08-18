


async function getMinMaxPrice(symbol, interval, startTime, endTime) {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=365`);
    const data = await response.json();
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    for (const candle of data) {
      const high = parseFloat(candle[2]);
      const low = parseFloat(candle[3]);
      if (high > maxPrice) {
        maxPrice = high;
      }
      if (low < minPrice) {
        minPrice = low;
      }
    }
    return { minPrice, maxPrice };
  }
  
  const main = async () => {

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
   

    const symbol = 'BTCUSDT';
    const interval = '1d';
    const startTime = 365;
    const endTime = new Date(formattedDate).getTime();
    const { minPrice, maxPrice } = await getMinMaxPrice(symbol, interval, startTime, endTime);

    console.log(`Minimum price: ${minPrice}`);
    console.log(`Maximum price: ${maxPrice}`);
  }

  main()
  
  export default main
  