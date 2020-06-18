const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const accountSid = 'AC23accf08ab9a97b00a23d577bf21a7d3';
const authToken = '24ed6f367c4887e3e99bef8d12b0da33';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+17043248153',
     to: '+18106241057'
   })
  .then(message => console.log(message));


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

    // Looping through column content for each coin
    //using number to get the top 10. If you want to get all, change to coinInformation.length
    let finalObject = {};
    let topCoinsIWantToSee = 20;
    for(let i = 0; i < topCoinsIWantToSee; i++) {
        const coinContent = coinInformation.eq([i]).find('td');
        let finalObject = {};

        coinTitleArray.forEach((el, j) => { finalObject[el] = coinContent.eq([j]).text();})
        finalShownCoins.push(finalObject);
    }

    function saveData() {
        fs.writeFile('coin-titles.txt', '', function(err) {if (err) console.log(err);});
        
        coinTitleArray.forEach(el => {
            if(el == "Rank") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
            if(el == "Name") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
            if(el == "Price") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
            if(el == "Change (24h)") fs.appendFileSync('coin-titles.txt', el + ' ', function(err) {if (err) console.log(err);});
        })

        finalShownCoins.forEach(el => {
            fs.appendFileSync('coin-titles.txt', '\n' + el.Rank + ' ' + el.Name + ' ' + el.Price + ' ' + el['Change (24h)'] + ',', function(err) {if (err) console.log(err);});
        })
    }
    saveData();
    })
    .catch(err => {
        console.log(err)
    })