import fetch from 'node-fetch';
import WebSocket from 'ws';
import main from './min_max.js'

const coinTrades = {
  sum_sells: 0,
  buy: 0,
  sell: 0,
  summary: 0,
  min_period_changes: 0,

}


const coin = {
  amount:0,
  cost_buy:0,
  
}

setInterval(()=>{
  coinTrades.buy = 0;
  coinTrades.sell = 0;
  coinTrades.summary = 0;
},5*1000*60)

const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

ws.on('message', function incoming(data) {
  let message = data.toString();
  let valueJson = JSON.parse(message);
  if(!valueJson.m){
    coinTrades.buy += valueJson.q * valueJson.p 
    coinTrades.summary += valueJson.q * valueJson.p;
    coinTrades.sum_sells += valueJson.q * valueJson.p;
   
    console.log("valueJson.p", valueJson.q * valueJson.p)
  }else {
    coinTrades.sell += valueJson.q * valueJson.p;
    coinTrades.summary -= valueJson.q * valueJson.p;
    coinTrades.sum_sells -= valueJson.q * valueJson.p;
    console.log("valueJson.p", valueJson.q * valueJson.p)
  }
  
});


main()

