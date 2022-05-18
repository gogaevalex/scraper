const cheerio = require('cheerio');
const queryString = require('query-string');

export const getDataHTML = (html) => {
    const data = [];
    const $ = cheerio.load(html);
    $('.item_table-description').each((index, elem) => {
        const price = $(elem).children('.snippet-price-row').children('.snippet-price').text();
        const link = $(elem).children('.snippet-title-row').children('.snippet-title').children('.snippet-link').attr('href');
        const time = $(elem).children('.snippet-date-row').children('.snippet-date-info').text();
        const plug1 = $(elem).children('.snippet-price-row').children('.snippet-price-vas').hasClass('snippet-price-vas');
        const plug2 = $(elem).children('.snippet-price-row').children('.snippet-price-lower').hasClass('snippet-price-lower');

        const resultPlug = plug1 || plug2;
        const resultTitle = link.replace(/_/g, '');
        const resultPrice = Number((price.match(/[0-9]/g) || []).join(''));
        const resultTime = time.replace(/[\n\r]* */g, '');
        let postQuest = 0;
        for(let i=0; i<link.length; i+=1) {
            if(link[i] === '?') {
                postQuest = i;
            }
        }
        let linkShort = link;
        if (postQuest !== 0) {
            let outQuest = link.slice(0, postQuest);
            let inQuest = link.slice(postQuest, link.length);
            let getParam = queryString.parse(inQuest);
            delete getParam.slocation
            let resultGet = queryString.stringify(getParam);
            if(resultGet.length) {
                linkShort = `${outQuest}?${resultGet}`;
            } else {
                linkShort = outQuest;
            }
        }

        const resultLink = `https://m.avito.ru${linkShort}`;
        const times = {
            '1минутуназад': true,
            '2минутыназад': true,
            '3минутыназад': true,
            '4минутыназад': true,
            '5минутназад': true,
            'Несколькосекундназад': true,
            'Толькочто': true,
        }
        if (!resultPlug && times[resultTime]) {
            data.push({
                resultLink,
                resultTitle,
                resultPrice,
            });
        }
    }); 
    return data;
}