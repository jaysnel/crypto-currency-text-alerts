const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

axios.get('https://coinmarketcap.com/').then((res) => {

    const $ = cheerio.load(res.data);
    
    const mainCoinSection = $('.cmc-table__table-wrapper-outer tbody tr td');
    const sectionTitle = $('.sc-1yv6u5n-0 .cmc-table__table-wrapper-outer').last().find('tr th');

    let myArray = [];

    for(let i = 0; i <= sectionTitle.length - 2; i++) {
        const title = sectionTitle.eq([i]).html();
        myArray.push(title);
        console.log(title);
    }

    fs.writeFile('coin-titles.txt', myArray.join().replace(/,/g, ' '), function(err) {if (err) console.log(err);});
})
.catch(err => {
    console.log(err)
})