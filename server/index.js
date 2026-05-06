// server/index.js
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4000;

// ==== Caminho absoluto ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔓 Libera CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ===== Proxy para imagens do Google Drive =====
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).send("URL obrigatória");
  }

  try {
    console.log(`[Proxy Local] Buscando: ${targetUrl.substring(0, 80)}...`);
    
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      console.error(`[Proxy Local] Erro na resposta: ${response.status} ${response.statusText}`);
      return res.status(response.status).send(`Erro ao buscar imagem: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    console.log(`[Proxy Local] Content-Type: ${contentType}`);

    // Garante que o cabeçalho de tipo de conteúdo seja repassado
    res.setHeader("Content-Type", contentType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache de 1 dia

    response.body.pipe(res);
  } catch (err) {
    console.error("[Proxy Local] Erro fatal:", err.message);
    res.status(500).send("Erro interno no proxy");
  }
});

// ===== Servir React buildado (dist/) =====
app.use(express.static(path.join(__dirname, "../dist")));

// 🔥 Catch-all para React Router, mas sem afetar o /proxy
app.get(/^(?!\/proxy).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT} `);
});