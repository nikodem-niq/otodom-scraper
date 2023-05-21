const puppeteer = require('puppeteer'),
config = require('./config'),
fs = require('fs').promises,
fetch = require('node-fetch'),
{ log } = require('./middlewares/logger'),
cheerio = require('cheerio');


(async () => {
    //Initialization

    const browser = await puppeteer.launch({headless: false})
    const mainPage = await browser.newPage()
    await mainPage.goto(`${config.BASE_URL}${config.EXTENDED_EXAMPLE_URL}`, {waitUntil: 'domcontentloaded'})
    const currentUrl = mainPage.url()
    // Cookies
    const cookies = await mainPage.waitForSelector('#onetrust-accept-btn-handler')
    await cookies.click();
    //Find max page
    let paginationEl = await mainPage.$('nav[role="navigation"]');
    let valueOfPaginationEl = await mainPage.evaluate(el => el.textContent, paginationEl)
    let endPage = valueOfPaginationEl.slice(valueOfPaginationEl.indexOf(".")+3, valueOfPaginationEl.length+1)
    let URLs = []
    for(let i=1; i<=endPage; i++) {
        URLs.push(`${currentUrl}&page=${i}`)
    }

    // Fetch pages
    const offerLinks = [];
    URLs.forEach((val, index) => {
        setTimeout(async () => {
            const data = await fetch(val)
            const body = await data.text()
            const $ = cheerio.load(body);
            const aTagItems = $('a').toArray();
            for(const aItem of aTagItems) {
                if($(aItem).attr('href').startsWith(`/pl/oferta/`)) {
                    offerLinks.push($(aItem).attr('href'))
                }
            }
            console.log(links)
        }, 100 * index)
    })
    await browser.close()
})();
