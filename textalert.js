//////////////////////////////////////
//      Global variable Set Up
//////////////////////////////////////
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const fs = require('fs');
const coinMarketApiKey = process.env.COINMARKET_API_KEY;
const twilioNumber = process.env.TWILIOPHONENUMBER;
const phoneNumber = process.env.PHONENUMBER;
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const myOwnedCoins = ['xrp','btc','eth']; //add coins by their symbol that you want to see in your alert
let coinsToSend = [];
let todaysdate = new Date();
let dd = String(todaysdate.getDate()).padStart(2, '0');
let mm = String(todaysdate.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = todaysdate.getFullYear();
let allCoins = null;
todaysdate = mm + '/' + dd + '/' + yyyy;

//////////////////////////////////////
//      Twilio Send Text Message
//////////////////////////////////////
function sendTextMessage() {
    let msg = [];
    coinsToSend.forEach(el => {
        msg.push(`${el.cmc_rank} ${el.symbol} $${el.quote.USD.price.toFixed(2)} ${el.quote.USD.percent_change_24h.toFixed(2)}%`);
    })
    let regex = new RegExp(",", "g");
    client.messages
        .create({
            body: msg.toString().replace(regex, "\n"),
            from: twilioNumber,
            to: phoneNumber
        })
        .then(message => {return message});
}

//////////////////////////////////////
//      Getting data ready for text
//////////////////////////////////////
function getCurrenciesIWant(coins) {
    coins.forEach(el => {
        myOwnedCoins.forEach(el2 => {
            if(el2.toLowerCase() == el.symbol.toLowerCase()) coinsToSend.push(el);
        })
    })
    sendTextMessage();
}

//////////////////////////////////////
//      API call for coins
//////////////////////////////////////
axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
{
    headers: { 'X-CMC_PRO_API_KEY': coinMarketApiKey },
    qs: {'start': '1', 'limit': '5000', 'convert': 'USD' },
})
.then((res) => {
    allCoins = res.data.data;
    getCurrenciesIWant(allCoins);
})
.catch((err) => {
    console.log(err);
});
