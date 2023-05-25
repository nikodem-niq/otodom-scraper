const { fetchURLs } = require("./actions/fetchFlats");
const { scrapeFlat } = require("./actions/scrapeFlat");

(async () => {
    const URLs = await fetchURLs();
    // scrapeFlat(['/pl/oferta/mieszkanie-2-pok-rozklad-zdrowa-ID4dLMA','/pl/oferta/mieszkanie-2-pokojowe-i-najem-ul-miedziana-ID4lu1b','/pl/oferta/mieszkanie-2-pokojowe-ogrody-hallera-ID4lqbM']).then(result => console.log('Done, check file.')).catch(error => console.log(error));
    scrapeFlat(URLs).then(result => console.log('Done, check file!')).catch(error => console.log(error));

})()