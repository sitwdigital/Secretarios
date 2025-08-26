// server/index.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;

// 🔓 Libera CORS para qualquer origem
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy para imagens do Google Drive
app.get("/proxy", async (req, res) => {
  try {
    const url = req.query.url; // Ex: ?url=https://drive.google.com/uc?id=ID
    if (!url) return res.status(400).send("URL obrigatória");

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Erro ao buscar imagem");
    }

    // passa o content-type (image/jpeg, image/png etc)
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");

    // envia direto o stream da imagem
    response.body.pipe(res);
  } catch (err) {
    console.error("Erro no proxy:", err);
    res.status(500).send("Erro no proxy");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy rodando em http://localhost:${PORT}`);
});