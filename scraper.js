//////////////////////////////////////
//      Variable Set Up
//////////////////////////////////////
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const twilioNumber = process.env.TWILIOPHONENUMBER;
const phoneNumber = process.env.PHONENUMBER;
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const cryptoFileName = './top-crypto-coins.txt';
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

//////////////////////////////////////
//      Twilio Send Text Message
//////////////////////////////////////
function sendTextMessage() {
    const msg = require(cryptoFileName);
    client.messages
        .create({
            body: msg,
            from: twilioNumber,
            to: phoneNumber
        })
        .then(message => console.log(message));
}

//////////////////////////////////////
//      Web Scraper
//////////////////////////////////////
axios.get('https://coinmarketcap.com/').then((res) => {
    const $ = cheerio.load(res.data);
    const coinTitles = $('.sc-1yv6u5n-0 .cmc-table__table-wrapper-outer thead').last().find('tr th');
    const coinInformation = $('.sc-1yv6u5n-0 .cmc-table__table-wrapper-outer tbody').last().find('tr');

    // Looping through column titles
    let coinTitleArray = []; //controls how many columns you show from the homepage
    let finalShownCoins = [];

    for(let i = 0; i <= coinTitles.length - 2; i++) { //populates coinTitleArray with the columns you want to pull
        const title = coinTitles.eq([i]).html();
        coinTitleArray.push(title);
    }

    //using topCoins and for loop to get the top n crypto currencies.
    let topCoins = 20;
    for(let i = 0; i < topCoins; i++) {
        const coinContent = coinInformation.eq([i]).find('td');
        let coinsToShow = {};

        coinTitleArray.forEach((el, j) => { coinsToShow[el] = coinContent.eq([j]).text();})
        finalShownCoins.push(coinsToShow);
    }

    //creating/updating file to send text message
    function setUpData() {
        fs.writeFile(cryptoFileName, '', function(err) {if (err) console.log(err);});
        
        // Titles are here
        // coinTitleArray.forEach(el => {
        //     if(el == "Rank") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
        //     if(el == "Name") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
        //     if(el == "Price") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
        //     if(el == "Change (24h)") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
        // })

        finalShownCoins.forEach(el => {
            fs.appendFileSync(cryptoFileName, '\n' + el.Rank + ' ' + el.Name + ' ' + el.Price + ' ' + el['Change (24h)'] + ',' + '\n', function(err) {if (err) console.log(err);});
        })
        sendTextMessage();
    }
    setUpData();
    })
    .catch(err => {
        console.log(err)
    })