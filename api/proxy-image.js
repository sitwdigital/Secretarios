// api/proxy-image.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("URL obrigatória");
  }

  try {
    console.log(`[Proxy Vercel] Buscando: ${targetUrl.substring(0, 80)}...`);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      console.error(`[Proxy Vercel] Erro: ${response.status} ${response.statusText}`);
      return res.status(response.status).send(`Erro ao buscar imagem: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    const buffer = await response.buffer();

    res.setHeader("Content-Type", contentType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(buffer);
  } catch (err) {
    console.error("[Proxy Vercel] Erro fatal:", err.message);
    res.status(500).send("Erro interno no proxy");
  }
}
