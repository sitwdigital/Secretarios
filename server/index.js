// server/index.js
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import db from "./db.js";

// Carrega variáveis do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// ==== Caminho absoluto ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Habilita JSON parse para payloads grandes (planilhas de secretários)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔓 Libera CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ===== Endpoints do Banco de Dados =====

// Buscar último relatório salvo
app.get("/api/latest", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM relatorios ORDER BY data_upload DESC LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ error: "Nenhum relatório encontrado" });
    }
    const report = {
      id: rows[0].id,
      data_upload: rows[0].data_upload,
      ...JSON.parse(rows[0].dados)
    };
    res.json(report);
  } catch (err) {
    console.error("[API] Erro ao buscar último relatório:", err.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Salvar novo relatório processado
app.post("/api/upload", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "Dados inválidos" });
    }
    const dadosStr = JSON.stringify(payload);
    const [result] = await db.query("INSERT INTO relatorios (dados) VALUES (?)", [dadosStr]);
    res.status(201).json({ id: result.insertId, message: "Relatório salvo com sucesso!" });
  } catch (err) {
    console.error("[API] Erro ao salvar relatório:", err.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar histórico de envios
app.get("/api/history", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, data_upload FROM relatorios ORDER BY data_upload DESC");
    res.json(rows);
  } catch (err) {
    console.error("[API] Erro ao buscar histórico:", err.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Buscar relatório por ID específico
app.get("/api/report/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM relatorios WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Relatório não encontrado" });
    }
    const report = {
      id: rows[0].id,
      data_upload: rows[0].data_upload,
      ...JSON.parse(rows[0].dados)
    };
    res.json(report);
  } catch (err) {
    console.error(`[API] Erro ao buscar relatório ${id}:`, err.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
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

// 🔥 Catch-all para React Router, sem afetar /proxy e /api
app.get(/^(?!\/proxy|\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});