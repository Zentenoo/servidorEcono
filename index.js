const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { webkit } = require('playwright'); // Ajuste de importación

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let browser; 
async function startBrowser() {
    if (!browser) {
        browser = await webkit.launch({ headless: true });
    }
}

app.get('/', (req, res) => {
    res.send('Hola Cejon!');
});

app.get('/compraBob', async (req, res) => {
    try {
        await startBrowser();
        const page = await browser.newPage();
        await page.goto('https://p2p.binance.com/trade/all-payments/USDT?fiat=BOB');
        await page.waitForSelector('.headline5.mr-4xs.text-primaryText', { state: 'visible' });
        const products = await page.$$eval(
            '.headline5.mr-4xs.text-primaryText', 
            (results) => results.map((el) => {
                const precio = el.innerText;
                return { precio };
            })
        );
        await page.close();
        res.json(products); 
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        res.status(500).send('Error al hacer scraping');
    }
});

app.get('/ventaArs', async (req, res) => {
    try {
        await startBrowser();
        const page = await browser.newPage();
        await page.goto('https://p2p.binance.com/trade/sell/USDT?fiat=ARS&payment=all-payments');
        await page.waitForSelector('.headline5.mr-4xs.text-primaryText', { state: 'visible' });
        const products = await page.$$eval(
            '.headline5.mr-4xs.text-primaryText', 
            (results) => results.map((el) => {
                const precio = el.innerText;
                return { precio };
            })
        );
        await page.close();
        res.json(products); 
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        res.status(500).send('Error al hacer scraping');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});