const fetch = require('node-fetch')
const _config = require('../config')
const cheerio = require('cheerio')
const { Parser, parseAsync } = require('json2csv')
const fs = require('fs').promises

module.exports.scrapeFlat = async (urls) => {
    const flatsInfo = []
    for(const [index, value] of urls.entries()) {
        // console log
        console.log(`Scraping flat no. ${index} with url ${value} ..... progress ${index == urls.length-1 ? 100 : Math.ceil(index/urls.length*100)}%`)
        // Fetch HTML of flat
        const response = await fetch(`${_config.BASE_URL}${value}`)
        const html = await response.text()
        const $ = cheerio.load(html);

        // op script
        const dataJson = JSON.parse($('#__NEXT_DATA__').text());
        const { ad: dataSite, ad: { target } } = dataJson.props.pageProps
        if(dataSite && target) {
            // TODO :: MORE PARAMETERS \/
            // ID : number
            const id = dataSite.id
            // Description : string
            const description = dataSite.description
            // Advert Type : public/private
            const advertType = dataSite.advertType
            // Features : [string]
            const features = dataSite.features
            // Area : number
            const area = dataSite.target.Area
            // Build year : number
            const buildYear = dataSite.target.Build_year
            // Construction status : string
            const constructionStatus = dataSite.target.Construction_status
            // Title of flat : string
            const title = dataSite.title
            // Price : number
            let price = 0
            // Rent : number
            let rent = 0;
            // Rooms : number
            let rooms = 0;
            // Deposit : number
            let deposit = 0;
            // CHARACTERISTICS LOOP
            for(characteristic of dataSite.characteristics) {
                switch(characteristic.key) {
                    case 'rooms_num':
                        rooms = characteristic.value;
                        break;
                    case 'deposit':
                        deposit = characteristic.value;
                        break;
                    case 'rent':
                        rent = characteristic.value;
                        break;
                    case 'price':
                        price = characteristic.value;
                        break;
                    default:
                        break;
                }
            }
            // Images : [string (url)]
            const images = dataSite.images;
            // Location : number
            const latitude = dataSite.location.coordinates.latitude
            const longitude = dataSite.location.coordinates.longitude
            // Address : string
            let street = "";
            let district = "";
            if(dataSite.location.address.street) {
                street = dataSite.location.address.street.name
            }
            if(dataSite.location.address.district) {
                district = dataSite.location.address.district.name
            }
            // const district = dataSite.location.address.district.name
            // const city = dataSite.location.address.city.name
            // Contact to owner : string, number
            const nameOfOwner = dataSite.owner.name
            const phoneNumber = dataSite.owner.phones[0]
    
            const flatJson = {
                id,
                title,
                district,
                street,
                phoneNumber: `'${[phoneNumber][0]}'`,
                area,
                price,
                rent,
                deposit,
                rooms,
                url: value
                // description,
                // images
            }
            // console.log(phoneNumber)
            flatsInfo.push(flatJson)
        }
        //  else {
        //     console.log(`Skipping flat... no info provided`)
        //     continue
        // }


    }
    try {
        // console.log(flatsInfo)
        const fields = ['id', 'title', 'district', 'street', 'phoneNumber', 'area', 'price', 'rent', 'deposit', 'rooms', 'url']
        const csv = await parseAsync(flatsInfo, {withBOM: true, fields})
        // await fs.writeFile('./resultsss.json', JSON.stringify(flatsInfo[0], null, 4), "utf-8")
        await fs.writeFile('./results.csv', csv, "utf-8")
        return csv
    } catch(error) {
        console.error(error)
    }
}