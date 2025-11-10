const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    console.log('🚀 Iniciando navegador...');
    browser = await puppeteer.launch({
      headless: false, // Mostra a janela do navegador
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // Configurar tamanho da janela
    await page.setViewport({ width: 1280, height: 720 });

    console.log('📄 Abrindo página...');
    await page.goto('http://localhost:10503/paradoxine-40mg-60-doses/p?skuId=1098', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('⏳ Aguardando LeveJunto carregar...');
    await page.waitForSelector('.leve-junto-item', { timeout: 5000 }).catch(() => {
      console.warn('⚠️  LeveJunto não encontrado imediatamente');
    });

    // Tirar screenshot antes de clicar
    console.log('📸 Tirando screenshot inicial...');
    await page.screenshot({
      path: 'leve-junto-before.png',
      fullPage: true
    });
    console.log('✅ Screenshot salvo: leve-junto-before.png');

    // Verificar estado dos checkboxes
    console.log('\n🔍 Verificando estado dos checkboxes...');
    const checkboxStates = await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[name="leve-junto-item"]');
      return Array.from(checkboxes).map((cb, i) => ({
        index: i,
        checked: cb.checked,
        disabled: cb.disabled,
        value: cb.value
      }));
    });
    console.log('Estado dos checkboxes:', JSON.stringify(checkboxStates, null, 2));

    // Clicar no botão de comprar
    console.log('\n🛒 Clicando no botão COMPRAR ITENS SELECIONADOS...');
    const buyButton = await page.$('.leve-junto-buy-btn');
    if (buyButton) {
      await buyButton.click();
      console.log('✅ Botão clicado');
    } else {
      console.error('❌ Botão não encontrado!');
    }

    // Aguardar um pouco para processar
    console.log('⏳ Aguardando processamento...');
    await page.waitForTimeout(3000);

    // Verificar estado dos checkboxes APÓS compra
    console.log('\n🔍 Verificando estado dos checkboxes APÓS compra...');
    const checkboxStatesAfter = await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[name="leve-junto-item"]');
      return Array.from(checkboxes).map((cb, i) => ({
        index: i,
        checked: cb.checked,
        disabled: cb.disabled,
        value: cb.value
      }));
    });
    console.log('Estado dos checkboxes após compra:', JSON.stringify(checkboxStatesAfter, null, 2));

    // Tirar screenshot após compra
    console.log('\n📸 Tirando screenshot após compra...');
    await page.screenshot({
      path: 'leve-junto-after.png',
      fullPage: true
    });
    console.log('✅ Screenshot salvo: leve-junto-after.png');

    // Verificar minicart
    console.log('\n🛍️  Verificando se minicart abriu...');
    const minicartOpen = await page.evaluate(() => {
      const drawer = document.querySelector('input[type="checkbox"][id*="minicart"]');
      return drawer ? drawer.checked : false;
    });
    console.log('Minicart aberto:', minicartOpen ? '✅ SIM' : '❌ NÃO');

    // Verificar console errors
    console.log('\n📋 Monitorando console por 2 segundos...');
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('🔴 ERRO NO CONSOLE:', msg.text());
      } else if (msg.type() === 'warn') {
        console.warn('🟡 WARNING NO CONSOLE:', msg.text());
      } else if (msg.text().includes('LeveJunto')) {
        console.log('📝 LOG DO LEVE JUNTO:', msg.text());
      }
    });

    page.on('error', err => console.error('❌ Erro na página:', err));

    await page.waitForTimeout(2000);

    console.log('\n✅ Teste concluído!');
    console.log('📸 Verifique os screenshots: leve-junto-before.png e leve-junto-after.png');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    if (browser) {
      console.log('\n🔚 Fechando navegador...');
      await browser.close();
    }
  }
})();
