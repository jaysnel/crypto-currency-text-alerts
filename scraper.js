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
    for(let i = 0; i < 5; i++) {
        const coinContent = coinInformation.eq([i]).find('td');
        let finalObject = {};

        coinTitleArray.forEach((el, j) => { finalObject[el] = coinContent.eq([j]).text();})
        finalShownCoins.push(finalObject);
    }
    
    // adding data to a .json file
    function prettyData(arr) {
        fs.writeFile('coin-titles.json', '', function(err) {if (err) console.log(err);});
        arr.forEach(el => {
            let stringify = JSON.stringify(el);
            fs.appendFileSync('coin-titles.json', stringify + '\n', function(err) {if (err) console.log(err);});
        })
    }
    prettyData(finalShownCoins);
})
.catch(err => {
    console.log(err)
})