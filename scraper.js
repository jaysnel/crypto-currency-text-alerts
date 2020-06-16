const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://coinmarketcap.com/').then((res) => {

    const $ = cheerio.load(res.data);
    
    const mainCoinSection = $('.cmc-table__table-wrapper-outer tbody tr td');
    const mainCoinSection2 = $('.cmc-table__table-wrapper-outer tbody tr');

    console.log(mainCoinSection.html());

    // const pageHeader = $('.page-header');
    // const output = pageHeader.find('h1').text();

    console.log(mainCoinSection2.length);

    $(mainCoinSection2).each((i, el) => {
        el.find('td').each(function() {
            console.log(this.text())
          });   
    })
    
})