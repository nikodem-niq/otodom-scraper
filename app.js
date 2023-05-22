const { fetchURLs } = require("./actions/fetchFlats");
const { scrapeFlat } = require("./actions/scrapeFlat");

(async () => {
    const URLs = await fetchURLs();
    // const info = await scrapeFlat(['/pl/oferta/mieszkanie-2-pok-rozklad-zdrowa-ID4dLMA','/pl/oferta/mieszkanie-2-pokojowe-i-najem-ul-miedziana-ID4lu1b','/pl/oferta/mieszkanie-2-pokojowe-ogrody-hallera-ID4lqbM']);
    // await scrapeFlat(URLs);

})()