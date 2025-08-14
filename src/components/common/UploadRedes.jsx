// src/components/common/UploadRedes.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';
import processarRedes from '../../utils/processarRedes';
import { fotoPorNome } from '../../utils/fotoCatalog';
// ✅ usa a MESMA lógica de variação do site/print/servidor
import { aplicarVariacoesEmTudo } from '../../shared/calcVariacao';

// ---------- helpers de parsing ----------
const num = (v) =>
  Number(String(v ?? 0).toString().replace(/\./g, '').replace(',', '.')) || 0;

const lerAba = (wb, nome) =>
  wb.Sheets?.[nome] ? XLSX.utils.sheet_to_json(wb.Sheets[nome]) : [];

const nomeStr = (v) => (v ? String(v).trim() : '');

// ---------- API do snapshot ----------
const API = (import.meta.env?.VITE_API_URL || 'http://localhost:4000') + '/api';

async function getLastSnapshot() {
  try {
    const r = await fetch(`${API}/last-snapshot`);
    if (r.status === 200) {
      const j = await r.json();
      return j?.snapshot ?? null;
    }
  } catch (_) {}
  return null;
}

async function saveSnapshot(data) {
  try {
    await fetch(`${API}/last-snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (_) {}
}

// ---------- cálculo legado (não usado — mantido por compat) ----------
function calculaMovimento(prevList = [], nextList = []) {
  const posPrev = new Map();
  prevList.forEach((p, i) => posPrev.set(p?.nome ?? '', i));
  const deltas = new Map();
  nextList.forEach((p, i) => {
    const nome = p?.nome ?? '';
    if (!nome) return deltas.set(nome, 0);
    if (!posPrev.has(nome)) return deltas.set(nome, 0);
    const prev = posPrev.get(nome);
    deltas.set(nome, prev - i);
  });
  return deltas;
}
function aplicaDeltaNaLista(baseList = [], deltasMap = new Map()) {
  baseList.forEach((item) => {
    const nome = item?.nome ?? '';
    item.variacao = deltasMap.get(nome) ?? 0;
  });
}
// ---------------------------------------------------------------------

const UploadRedes = ({ setDados }) => {
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivoSelecionado(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Ler abas
        const instagramRaw = lerAba(workbook, 'INSTAGRAM');
        const facebookRaw  = lerAba(workbook, 'FACEBOOK');
        const twitterRaw   = lerAba(workbook, 'TWITTER');
        const planilha4    = lerAba(workbook, 'Planilha4');

        // Monta listas base com foto
        const instagram = instagramRaw.map((linha) => {
          const nome = nomeStr(linha['SECRETÁRIO']);
          return {
            nome,
            seguidores: num(linha['SEGUIDORES']),
            foto: fotoPorNome(nome) || '',
            cargo: '',
          };
        });

        const facebook = facebookRaw.map((linha) => {
          const nome = nomeStr(linha['SECRETÁRIO']);
          return {
            nome,
            seguidores: num(linha['SEGUIDORES']),
            foto: fotoPorNome(nome) || '',
            cargo: '',
          };
        });

        const twitter = twitterRaw
          .map((linha) => {
            const nome = nomeStr(linha['SECRETÁRIO']);
            return {
              nome,
              seguidores: num(linha['SEGUIDORES']),
              foto: fotoPorNome(nome) || '',
              cargo: '',
            };
          })
          .filter((p) => p.seguidores > 0);

        // Processa para montar objeto final (top10, etc.)
        const base = processarRedes(instagram, facebook, twitter, planilha4);

        // Garante que as listas expostas são as "com fotos"
        base.instagram = instagram;
        base.facebook  = facebook;
        base.twitter   = twitter;

        // ============== VARIAÇÕES (via módulo compartilhado) ====================
        const snapshotAnterior = await getLastSnapshot(); // pega do backend
        const resultado = aplicarVariacoesEmTudo(base, snapshotAnterior || {});
        // =======================================================================

        // Entrega pro app
        setDados(resultado);

        // Persiste localmente (site e /print usam isto)
        const json = JSON.stringify(resultado);
        localStorage.setItem('relatorioSecretarias', json);
        localStorage.setItem('relatorioRedes', json);
        // 🔸 reforça o snapshot local para o /print
        try {
          localStorage.setItem('lastSnapshot', JSON.stringify(resultado));
        } catch {}

        // Persiste no servidor como "último snapshot"
        saveSnapshot(resultado); // fire-and-forget
      } catch (err) {
        console.error('Erro ao ler o Excel:', err);
        alert('Não foi possível processar o arquivo. Confira os nomes das abas e o formato.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      {!arquivoSelecionado && (
        <input
          type="file"
          accept=".xlsx"
          onChange={handleUpload}
          className="block w-full p-2 border rounded-md shadow-sm"
        />
      )}
    </div>
  );
};

export default UploadRedes;