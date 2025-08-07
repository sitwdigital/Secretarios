import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.post('/gerar-pdf', async (req, res) => {
  try {
    const htmlUrl = `http://localhost:5173/print`;

    console.log('🚀 Iniciando Puppeteer...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.evaluateOnNewDocument((dados) => {
      localStorage.setItem('relatorioRedes', JSON.stringify(dados));
      localStorage.setItem('relatorioSecretarias', JSON.stringify(dados));
    }, req.body);

    console.log('🌐 Acessando:', htmlUrl);
    await page.goto(htmlUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    console.log('⏳ Esperando #pdf-ready...');
    await page.waitForSelector('#pdf-ready', { timeout: 15000 });

    await new Promise((r) => setTimeout(r, 1000));

    console.log('📄 Gerando PDF...');
    const buffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true, // segue o @page do CSS
    });

    await browser.close();
    console.log('✅ PDF gerado com sucesso!');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=Relatorio_Secretarias.pdf',
    });

    res.send(buffer);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});
