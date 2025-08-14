// server/index.js
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// importa o mesmo módulo usado no front
import { aplicarVariacoesEmTudo } from '../src/shared/calcVariacao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 4000;

// URL do front (sem ?preview=1 pra não aplicar scale)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173/print';

// ---- armazenamento simples em arquivo (último snapshot) ----
const DATA_DIR      = path.join(__dirname, 'data');
const SNAPSHOT_PATH = path.join(DATA_DIR, 'lastSnapshot.json');

async function ensureDataDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch (_) {}
}

async function readSnapshot() {
  try {
    const buf  = await fs.readFile(SNAPSHOT_PATH, 'utf-8');
    const json = JSON.parse(buf);
    const stat = await fs.stat(SNAPSHOT_PATH);
    return { ok: true, data: json, updatedAt: stat.mtime };
  } catch {
    return { ok: false, error: 'SNAPSHOT_NOT_FOUND' };
  }
}

async function writeSnapshot(obj) {
  await ensureDataDir();
  const json = JSON.stringify(obj, null, 2);
  await fs.writeFile(SNAPSHOT_PATH, json, 'utf-8');
  const stat = await fs.stat(SNAPSHOT_PATH);
  return { ok: true, updatedAt: stat.mtime };
}

async function deleteSnapshot() {
  try {
    await fs.unlink(SNAPSHOT_PATH);
    return { ok: true };
  } catch {
    return { ok: false, error: 'SNAPSHOT_NOT_FOUND' };
  }
}

// ------------------------------------------------------------

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Se você também “builda” o front em ../dist, isto serve os arquivos estáticos:
app.use(express.static(path.join(__dirname, '..', 'dist')));

// ---------- Health ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'secretarios-server', time: new Date().toISOString() });
});

// ---------- Snapshot API ----------
app.get('/api/last-snapshot', async (_req, res) => {
  const result = await readSnapshot();
  if (!result.ok) return res.status(204).send(); // no content
  res.json({ ok: true, snapshot: result.data, updatedAt: result.updatedAt });
});

app.post('/api/last-snapshot', async (req, res) => {
  try {
    // o corpo é o snapshot inteiro (instagram/facebook/twitter/rankingGanho etc.)
    const result = await writeSnapshot(req.body);
    res.json({ ok: true, updatedAt: result.updatedAt });
  } catch (err) {
    console.error('Erro ao salvar snapshot:', err);
    res.status(500).json({ ok: false, error: 'WRITE_FAILED' });
  }
});

app.delete('/api/last-snapshot', async (_req, res) => {
  const result = await deleteSnapshot();
  if (!result.ok) return res.status(404).json({ ok: false, error: result.error });
  res.json({ ok: true });
});

// ---------- PDF ----------
app.post('/gerar-pdf', async (req, res) => {
  let browser;
  try {
    // 1) Carrega o snapshot anterior e aplica a MESMA lógica de variação do front
    const prev = await readSnapshot();
    const snapshotAnterior = prev.ok ? prev.data : null;

    // req.body deve conter o payload atual (instagram/facebook/twitter/rankingGanho)
    // enriquecemos com "variacao" aqui no servidor
    const dadosComVariacao = aplicarVariacoesEmTudo(req.body, snapshotAnterior);

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

    // 2) Injeta os dados COM variação + o snapshot anterior no contexto da página
    await page.evaluateOnNewDocument((dados, snap) => {
      try {
        // payload atual para o /print
        localStorage.setItem('relatorioRedes', JSON.stringify(dados));
        localStorage.setItem('relatorioSecretarias', JSON.stringify(dados));

        // snapshot anterior: sempre grava (vazio se null) para o Print.jsx poder recalcular
        localStorage.setItem('lastSnapshot', JSON.stringify(snap || {}));

        // também expõe globalmente (facilita debug e fallback)
        window.__dadosPDF = dados;
        window.__lastSnapshot = snap || null;
        window._lastSnapshot  = snap || null; // compat com código antigo
      } catch (e) {}
    }, dadosComVariacao, snapshotAnterior);

    console.log('🌐 Acessando:', FRONTEND_URL);
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 60000 });

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
      preferCSSPageSize: true, // respeita @page do CSS
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      format: 'A4',
      landscape: true,
    };

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