const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

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