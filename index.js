import {getDataHTML} from './helpers/getDataHTML';
import {getPageContent} from './helpers/getPageContent';
import {SITE} from './helpers/static';
import {params} from './helpers/static';

global.count = {
    iphone: 1,
    // samsung: 1,
    // onePlus: 1,
    // macBookPro: 1,
};
global.mainObj = {
    iphone: {},
    // samsung: {},
    // onePlus: {},
    // macBookPro: {},
};


const TelegramBot = require('node-telegram-bot-api');
const token = 'Пишите свой';
const bot = new TelegramBot(token, {polling: true});

function main() {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'СТАРТУЕМ!!!');
        periodProm(chatId);
    })
};
main();

async function periodProm(chatId) {
    await setup(chatId);
    periodProm(chatId);
}

const loadOne = (chatId, siteKey) => new Promise((resolve, reject) => {
    setTimeout(() => {
        initial(chatId, siteKey);
        resolve(siteKey);
    }, 8000)
})

async function setup(chatId) {
    for (let siteKey in SITE) {
        try {
            await loadOne(chatId, siteKey);
        } catch (err) {
            console.log(err);
        }
    };

    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, 8000);
    })
}

async function initial(chatId, siteKey) {
    try {
        // return array link
        const pageContent = await getPageContent(SITE[siteKey]);
        const data = getDataHTML(pageContent.data);
        const resultData = [];
        data.forEach((item) => {
            let foundItem = false;
            // test for filter
            if (params[siteKey].length) {
                params[siteKey].forEach((param) => {
                    param.names.forEach((name) => {
                        const reg = new RegExp(name);
                        if(reg.test(item.resultTitle)) {
                            if(item.resultPrice >= param.start && item.resultPrice <= param.finish) {
                                if (!foundItem) {
                                    resultData.push({
                                        link: item.resultLink
                                    })
                                    foundItem = true;
                                }
                            }
                        }
                    })
                })
            } else {
                resultData.push({
                    link: item.resultLink
                })
            }
    
        })
    
        // send 
        resultData.forEach((item) => {
            if (!global.mainObj[siteKey].hasOwnProperty(item.link)) {
                if (global.count[siteKey] !== 1) {
                    console.log(`NEWWWW: ${item.link}`);
                    bot.sendMessage(chatId, item.link);
                }
                global.mainObj[siteKey][item.link] = true;
            }
        })
    
        // clean object link
        let lengthMainObj = 0;
        for (let key in global.mainObj[siteKey]) {
            lengthMainObj += 1;

        }
        let whileDelete = 0;
        for (let key in global.mainObj[siteKey]) {
            if (lengthMainObj > 70 && whileDelete < 20) {
                delete global.mainObj[siteKey][key];
            }
            whileDelete += 1;
        }
        global.count[siteKey] += 1;
    }
    catch(error) {
        console.log(error.message);
    }
}