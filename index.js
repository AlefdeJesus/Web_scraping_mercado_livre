const pup = require('puppeteer'); // Importa a biblioteca Puppeteer

const url = 'https://lista.mercadolivre.com.br/'; // URL base do Mercado Livre
const searchFor = 'macbook'; // Termo de busca

let contatorLiks = 0; // Contador de links visitados
const listaDeObjetos = []; // Lista para armazenar os objetos de produtos

(async () => {
    // Inicia o navegador (não headless para visualizar a automação)
    const browser = await pup.launch({headless:false});
    // Abre uma nova página/aba no navegador
    const page = await browser.newPage();
    console.log('Site acessado')
    // Acessa a URL definida
    await page.goto(url);
    console.log('acesso finalizado')

    // Aguarda o campo de busca aparecer na página
    await page.waitForSelector('#cb1-edit');
    // Digita o termo de busca no campo de busca
    await page.type('#cb1-edit', searchFor)

    // Aguarda o carregamento da página de resultados após clicar no botão de busca
    //Isso resolve o problema de carregamento da página, que será recarregado após a busca
    await Promise.all([
        page.waitForNavigation(),
        page.click('.nav-search-btn')
    ]);
   
    //esse comando basicamente roda o comando querySelectorAll na pagina
   const links = await page.$$eval('.poly-component__title-wrapper > a', element => element.map(link => link.href));
   for(const link of links) {
    if(contatorLiks >= 5) continue;
        console.log("Página visitada:", contatorLiks)
       await page.goto(link);
        await page.waitForSelector('.ui-pdp-title'); // Aguarda o título do produto aparecer

       const title = await page.$eval('.ui-pdp-title', element => element.innerText);
       const preco = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

        const seller = await page.evaluate(() => {
            const button = document.querySelector('.ui-pdp-seller__link-trigger-button');
            if(!button) return null;
            const spans = button.querySelectorAll('span');
            return spans.length > 1 ? spans[1].innerText.trim() : null;
        });

         const object = {};
         object.title = title;
         object.preco = preco;
         (seller ? object.seller = seller : '');
         object.link = link;

         listaDeObjetos.push(object); // Adiciona o objeto à lista
        

       contatorLiks++;
    }
    console.log(listaDeObjetos)

    // Aguarda 3 segundos (útil para visualizar o resultado antes de fechar)
    await page.waitForTimeout(3000);
    // Fecha o navegador
    await browser.close();

})();