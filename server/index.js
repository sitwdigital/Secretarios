// server/index.js
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4000;

// ==== Necessário para pegar caminho absoluto (quando buildado) ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔓 Libera CORS para qualquer origem
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ===== Proxy para imagens do Google Drive =====
app.get("/proxy", async (req, res) => {
  try {
    const url = req.query.url; // Ex: ?url=https://drive.google.com/uc?id=ID
    if (!url) return res.status(400).send("URL obrigatória");

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Erro ao buscar imagem");
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    );

    response.body.pipe(res);
  } catch (err) {
    console.error("Erro no proxy:", err);
    res.status(500).send("Erro no proxy");
  }
});

// ===== Servir os arquivos do React buildado (dist/) =====
app.use(express.static(path.join(__dirname, "../dist")));

// Para qualquer rota do React Router -> retorna index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT} `);
});