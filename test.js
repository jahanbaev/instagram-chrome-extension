import https from 'https';
import coinList from './coinList.js'

function timeElapsed(timestamp) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - timestamp;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes;
}

function getCoinLossesAndGains(symbol, interval, callback) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1500`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const klines = JSON.parse(data);
            const list = klines[0][4];

            const lossesAndGains = klines.map((kline) => {
                const closePrice = kline[4];
                const lastPrice = list.slice(-1)[0].price;
                const change = (closePrice - lastPrice) / lastPrice * 100;
                if (Math.abs(change) > 1 || Math.abs(change) < -1 ) {
                        list.push({time: timeElapsed(kline[6]),price: kline[4], change });
                }
                return null;
            }).filter((item) => item !== null);

            let newList = [list[0]];
            list.map(filter => {
                
                if (newList.slice(-1)[0].change <= 0 && filter.change <= 0 ) {
                    newList[newList - 1] = filter
                }else if (newList.slice(-1)[0].change >= 0 && filter.change >= 0 ) {
                    newList[newList - 1] = filter
                }else{ 
                    newList.push(filter)
                }
                return null
            })
            callback(list, symbol);
        });
    });
}


for (let i = 0; i < coinList.length; i++) {
    getCoinLossesAndGains(coinList[i] + 'USDT', '5m', (lossesAndGains, coin) => {
        console.log(lossesAndGains.slice(-1)[0], coin);
    });
}
