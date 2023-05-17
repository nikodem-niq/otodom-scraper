const puppeteer = require('puppeteer');
const config = require('./config');
const request = require('request');
const superagent = require('superagent');
const fs = require('fs');
const fetch = require('node-fetch');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const mainPage = await browser.newPage();
    await mainPage.goto(`${config.BASE_URL}${config.EXTENDED_EXAMPLE_URL}`, {waitUntil: 'domcontentloaded'});
    const currentUrl = mainPage.url();
    // Cookies
    const cookies = await mainPage.waitForSelector('#onetrust-accept-btn-handler');
    await cookies.click();
    //Find max page
    const html = await mainPage.content();
    let paginationEl = await mainPage.$('nav[role="navigation"]');
    let valueOfPaginationEl = await mainPage.evaluate(el => el.textContent, paginationEl)
    let endPage = valueOfPaginationEl.slice(valueOfPaginationEl.indexOf(".")+3, valueOfPaginationEl.length+1);
    let URLs = [];
    for(let i=1; i<=endPage; i++) {
        URLs.push(`${currentUrl}&page=${i}`);
    }
    // Fetch URLs
    URLs.forEach((val, index) => {
        setTimeout(async () => {
            const data = await fetch(val);
            const body = await data.text();
            fs.writeFileSync(`./pages/page${index+1}.html`, body, (err, succes) => {
                console.log('done')
            });
        }, 100 * index)
    })
        // await mainPage.goto(`${config.BASE_URL}${config.EXTENDED_EXAMPLE_URL}&page=${i}`, {waitUntil: 'domcontentloaded'});
        // await mainPage.waitForNavigation({waitUntil: 'networkidle2'});
        // await mainPage.waitForSelector('script[type="application/ld+json"');
        // let jsonHousesResults = await mainPage.$('script[type="application/ld+json"');
        // let valueOfResulsts = await mainPage.evaluate(el => el.textContent, jsonHousesResults);
        // fs.writeFile(`./page${i}.json`, JSON.stringify(JSON.parse(valueOfResulsts),null,4), (err, succes) => {
        //     console.log('done')
        // });
    await browser.close();
})();
