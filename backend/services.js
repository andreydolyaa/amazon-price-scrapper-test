const puppteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const { sendEmail } = require('./emailService');


async function getItem(url) {
    const page = await configureBrowser(url);
    var price = 0;
    var title = '';
    var img = '';
    await page.reload();
    var htmlPrice = await page.evaluate(() => document.body.innerHTML);
    $('#priceblock_ourprice', htmlPrice).each(function () {
        var ogPrice = $(this).text();
        price = ogPrice.replace(/\D/g, '').slice(0, -2)
    })
    var htmlTitle = await page.evaluate(() => document.body.innerHTML);
    $('#productTitle', htmlTitle).each(function () {
        title = $(this).text();
    })
    var htmlImg = await page.evaluate(() => document.body.innerHTML);
    $('#imgTagWrapperId', htmlImg).each(function () {
        img = $(this).find('img').attr('src');
    })
    var data = { price, title, img };
    console.log(data);
    return data;

}

async function configureBrowser(url) {
    const browser = await puppteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkPrice(page, data) {
    var expetedPrice = +data.expectedPrice;
    var price = 0;
    var title = '';
    await page.reload();
    var htmlPrice = await page.evaluate(() => document.body.innerHTML);
    $('#priceblock_ourprice', htmlPrice).each(function () {
        var ogPrice = $(this).text();
        price = Number(ogPrice.replace(/[^0-9.-]+/g, ""));
    })
    var htmlTitle = await page.evaluate(() => document.body.innerHTML);
    $('#productTitle', htmlTitle).each(function () {
        title = $(this).text();
    })
    checkIfPriceFits(price, expetedPrice, title, data.page, data.userEmail);
}


function checkIfPriceFits(ogPrice, expectedPrice, itemTitle, page, email) {
    console.log('OG PRICE: :', ogPrice);
    console.log('EXPCTD PRICE:  ',expectedPrice);
    if (ogPrice <= expectedPrice) {
        data = {
            price: expectedPrice,
            currentPrice: ogPrice,
            title: itemTitle,
            link: page,
            email
        }
        sendEmail(data);
    }
    else {
        console.log('The price is not there yet...');
    }
}

async function track(data) {
    if(data === 'unsubscribe'){
        return;
    }
    else if (data !== 'unsubscribe') {
        page = await configureBrowser(data.page);
        let job = new CronJob('*/1 * * * *', function () {
            checkPrice(page, data);
        }, null, true, null, null, true)
        job.start();
    }
    else return;
}

// track();



module.exports = {
    track,
    getItem
}