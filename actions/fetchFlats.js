const puppeteer = require('puppeteer'),
config = require('../config'),
fs = require('fs').promises,
fetch = require('node-fetch'),
{ log } = require('../middlewares/logger'),
cheerio = require('cheerio');

module.exports.fetchURLs = async () => { 
    const browser = await puppeteer.launch({headless: "true"})
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
    for(const [index, value] of URLs.entries()) {
        try {
            // Loading of scrapping
            console.log(`Scraping URLs progress.... ${Math.floor(index/endPage*100)}%`)
            //
            const data = await fetch(value)
            const body = await data.text()
            const $ = cheerio.load(body)
            const jsonData = JSON.parse($('#__NEXT_DATA__').text());
            const { props : { pageProps : { data : { searchAds : { items }}}}} = jsonData
            for(const flatUrl of items) {
                offerLinks.push(`/pl/oferta/${flatUrl.slug}`);
            }
        } catch(error) {
            console.error(`${value} error ${error}`)
        }
    }
    await browser.close()
    console.log(offerLinks.length)
    return offerLinks.flat();
}