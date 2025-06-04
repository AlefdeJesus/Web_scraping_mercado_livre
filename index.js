const pup = require('puppeteer');

const url = 'https://lista.mercadolivre.com.br/';
const seachFor = 'macbook';

(async () => {
    const browser = await pup.launch();
    const page = await browser.newPage();
    console.log('Site acessado')
    await page.goto(url);
    console.log('acesso finalizado')
    await browser.close();

})();