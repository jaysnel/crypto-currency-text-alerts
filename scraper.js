const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

axios.get('https://coinmarketcap.com/').then((res) => {

    const $ = cheerio.load(res.data);
    
    const mainCoinSection = $('.cmc-table__table-wrapper-outer tbody tr td');
    const sectionTitle = $('.sc-1yv6u5n-0 .cmc-table__table-wrapper-outer thead').last().find('tr th');
    const bodyContent = $('.sc-1yv6u5n-0 .cmc-table__table-wrapper-outer tbody').last().find('tr');

    // Looping through column titles
    let myArray = [];
    
    for(let i = 0; i <= sectionTitle.length - 2; i++) {
        const title = sectionTitle.eq([i]).html();
        myArray.push(title);
        console.log(title);
    }

    // Looping through column content for each coin
    for(let i = 0; i < bodyContent.length; i++) {
        const content = bodyContent.find('td').eq([i]).text();
        console.log(content);
    }

    fs.writeFile('coin-titles.txt', myArray.join().replace(/,/g, ' '), function(err) {if (err) console.log(err);});
})
.catch(err => {
    console.log(err)
})