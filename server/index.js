import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// URL do front (sem ?preview=1 pra não aplicar scale)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173/print';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.post('/gerar-pdf', async (req, res) => {
  let browser;
  try {
    const htmlUrl = FRONTEND_URL;

    console.log('🚀 Iniciando Puppeteer...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=medium',
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // Injeta os dados no localStorage ANTES de carregar a página
    await page.evaluateOnNewDocument((dados) => {
      try {
        localStorage.setItem('relatorioRedes', JSON.stringify(dados));
        localStorage.setItem('relatorioSecretarias', JSON.stringify(dados));
      } catch (e) {}
    }, req.body);

    console.log('🌐 Acessando:', htmlUrl);
    await page.goto(htmlUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Usa mídia de impressão (CSS @media print + @page)
    await page.emulateMediaType('print');

    console.log('⏳ Esperando #pdf-ready...');
    await page.waitForSelector('#pdf-ready', { timeout: 30000 });

    // Respiro pro layout estabilizar
    await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
    await page.evaluate(() => window.scrollTo(0, 0));

    console.log('📄 Gerando PDF...');

    // Padrão: A4 landscape. Pode sobrescrever via query (?format=A5, etc.)
    const fmtFromQuery = (req.query.format || '').toUpperCase(); // A4, A5, A6, B5...
    const bodyOpts = (req.body && req.body._pdfOpts) || {};

    const pdfOptions = {
      printBackground: true,
      preferCSSPageSize: true,   // respeita @page do CSS
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    // Default A4 landscape
    pdfOptions.format = 'A4';
    pdfOptions.landscape = true;

    // Overrides (opcional)
    if (fmtFromQuery) {
      pdfOptions.format = fmtFromQuery;
      if (typeof req.query.landscape !== 'undefined') {
        pdfOptions.landscape = String(req.query.landscape).toLowerCase() !== 'false';
      }
    } else if (bodyOpts.format) {
      pdfOptions.format = String(bodyOpts.format).toUpperCase();
      if (typeof bodyOpts.landscape !== 'undefined') {
        pdfOptions.landscape = !!bodyOpts.landscape;
      }
    }

    const buffer = await page.pdf(pdfOptions);

    console.log('✅ PDF gerado com sucesso!');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=Relatorio_Secretarias.pdf',
    });
    res.send(buffer);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF');
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});
