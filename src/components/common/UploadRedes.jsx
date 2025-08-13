import { useState } from 'react';
import * as XLSX from 'xlsx';
import processarRedes from '../../utils/processarRedes';
import { fotoPorNome } from '../../utils/fotoCatalog';

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

// ---------- cálculo de movimento (delta de posição) ----------
/**
 * Calcula variação de posição entre duas listas ordenadas por ranking.
 * @param {Array<{nome: string}>} prevList - lista anterior, já ordenada (1º, 2º, 3º...)
 * @param {Array<{nome: string}>} nextList - lista nova, já ordenada
 * @returns {Map<string, number>} map nome -> delta (positivo = subiu, negativo = desceu)
 */
function calculaMovimento(prevList = [], nextList = []) {
  const posPrev = new Map();
  prevList.forEach((p, i) => posPrev.set(p?.nome ?? '', i)); // 0-based
  const deltas = new Map();
  nextList.forEach((p, i) => {
    const nome = p?.nome ?? '';
    if (!nome) return deltas.set(nome, 0);
    if (!posPrev.has(nome)) {
      // novo nome: trate como 0 (ou +1, se quiser destacar)
      return deltas.set(nome, 0);
    }
    const prev = posPrev.get(nome);
    // delta = posAnterior - posAtual (se positivo, subiu)
    deltas.set(nome, prev - i);
  });
  return deltas;
}

/**
 * Atribui em-place a variacao (delta) nos itens da lista de base,
 * usando um Map de nome->delta.
 */
function aplicaDeltaNaLista(baseList = [], deltasMap = new Map()) {
  baseList.forEach((item) => {
    const nome = item?.nome ?? '';
    item.variacao = deltasMap.get(nome) ?? 0;
  });
}

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
            // "variacao" será substituído pelo delta de ranking
            variacao: 0,
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
              variacao: 0, // será delta de ranking
              foto: fotoPorNome(nome) || '',
              cargo: '',
            };
          })
          .filter((p) => p.seguidores > 0);

        // Processa para montar objeto final (top10, etc.)
        const resultado = processarRedes(instagram, facebook, twitter, planilha4);

        // Garante que as listas expostas são as "com fotos"
        resultado.instagram = instagram;
        resultado.facebook  = facebook;
        resultado.twitter   = twitter;

        // ============== MOVIMENTO DE RANKING (vs snapshot anterior) ==============
        const snapshotAnterior = await getLastSnapshot();

        // --- Ranking de ganho (planilha4 -> resultado.rankingGanho) ---
        // nova ordem (desc por ganho)
        const ganhoAtualOrdenado = [...(resultado.rankingGanho || [])]
          .sort((a, b) => (b.ganho ?? 0) - (a.ganho ?? 0));
        // anterior (se houver)
        const ganhoAnteriorOrdenado = snapshotAnterior?.rankingGanho
          ? [...snapshotAnterior.rankingGanho].sort((a, b) => (b.ganho ?? 0) - (a.ganho ?? 0))
          : [];

        const deltaGanho = calculaMovimento(ganhoAnteriorOrdenado, ganhoAtualOrdenado);
        aplicaDeltaNaLista(resultado.rankingGanho, deltaGanho);

        // --- Instagram (desc por seguidores) ---
        const igAtualOrdenado = [...instagram].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0));
        const igAnteriorOrdenado = snapshotAnterior?.instagram
          ? [...snapshotAnterior.instagram].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0))
          : [];
        const deltaIG = calculaMovimento(igAnteriorOrdenado, igAtualOrdenado);
        aplicaDeltaNaLista(instagram, deltaIG);

        // --- Facebook ---
        const fbAtualOrdenado = [...facebook].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0));
        const fbAnteriorOrdenado = snapshotAnterior?.facebook
          ? [...snapshotAnterior.facebook].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0))
          : [];
        const deltaFB = calculaMovimento(fbAnteriorOrdenado, fbAtualOrdenado);
        aplicaDeltaNaLista(facebook, deltaFB);

        // --- Twitter ---
        const twAtualOrdenado = [...twitter].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0));
        const twAnteriorOrdenado = snapshotAnterior?.twitter
          ? [...snapshotAnterior.twitter].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0))
          : [];
        const deltaTW = calculaMovimento(twAnteriorOrdenado, twAtualOrdenado);
        aplicaDeltaNaLista(twitter, deltaTW);

        // =========================================================================

        // Entrega pro app e persiste localmente
        setDados(resultado);
        const json = JSON.stringify(resultado);
        localStorage.setItem('relatorioSecretarias', json);
        localStorage.setItem('relatorioRedes', json);

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