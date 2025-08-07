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

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'dist')));

// ----------- ROTA GERAR PDF ------------
app.post('/gerar-pdf', async (req, res) => {
  try {
    const htmlUrl = `http://localhost:5173/print`;

    console.log('🚀 Iniciando Puppeteer...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // ✅ Injeta os dados ANTES da navegação para /print
    await page.evaluateOnNewDocument((dados) => {
      localStorage.setItem('relatorioRedes', JSON.stringify(dados));
      localStorage.setItem('relatorioSecretarias', JSON.stringify(dados));
    }, req.body);

    console.log('🌐 Acessando página:', htmlUrl);
    await page.goto(htmlUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    console.log('⏳ Aguardando seletor #pdf-ready...');
    await page.waitForSelector('#pdf-ready', { timeout: 10000 });

    console.log('🖨️ Gerando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    await browser.close();
    console.log('✅ PDF gerado com sucesso!');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=Relatorio_Secretarias.pdf',
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error.message);
    res.status(500).send('Erro ao gerar PDF');
  }
});

// ----------------------------------------

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
});
