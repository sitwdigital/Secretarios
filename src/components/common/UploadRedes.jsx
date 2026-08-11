// src/components/common/UploadRedes.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';
import processarRedes from '../../utils/processarRedes';
import { fotoPorNome } from '../../utils/fotoCatalog';
import { aplicarVariacoesEmTudo } from '../../shared/calcVariacao';
import processarEngajados from '../../utils/processarEngajados';
import { corrigirNome } from '../../utils/nomeHelper';

// ---------- helpers ----------
const num = (v) =>
  Number(String(v ?? 0).toString().replace(/\./g, '').replace(',', '.')) || 0;

const lerAbaComAlternativas = (wb, nomesEsperados) => {
  const normEsperados = nomesEsperados.map(n => 
    n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  );
  
  const sheets = Object.keys(wb.Sheets || {});
  for (const sheet of sheets) {
    const sheetNorm = sheet.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (normEsperados.includes(sheetNorm)) {
      return XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
    }
  }
  return [];
};

const encontrarValor = (linha, chavesPossiveis) => {
  if (!linha) return undefined;
  const chavesNorm = chavesPossiveis.map(c => 
    c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  );
  
  for (const k of Object.keys(linha)) {
    const kNorm = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (chavesNorm.includes(kNorm)) {
      return linha[k];
    }
  }
  return undefined;
};

const nomeStr = (v) => {
  const nomeVal = v ? String(v).trim() : '';
  return corrigirNome(nomeVal);
};

// ---------- Snapshot ----------
function getLastSnapshot() {
  try {
    const snapRaw = localStorage.getItem('lastSnapshot');
    return snapRaw ? JSON.parse(snapRaw) : null;
  } catch {
    return null;
  }
}

function saveSnapshot(resultado) {
  try {
    const minified = {
      instagram: (resultado.instagram || []).map(p => ({ nome: p.nome, seguidores: p.seguidores })),
      facebook: (resultado.facebook || []).map(p => ({ nome: p.nome, seguidores: p.seguidores })),
      twitter: (resultado.twitter || []).map(p => ({ nome: p.nome, seguidores: p.seguidores })),
      rankingGanho: (resultado.rankingGanho || []).map(p => ({ nome: p.nome, ganho: p.ganho }))
    };
    localStorage.setItem('lastSnapshot', JSON.stringify(minified));
  } catch (e) {
    console.warn('Erro ao salvar lastSnapshot:', e);
  }
}

// ---------------------------------------------------------------------

const UploadRedes = ({ setDados, snapshotAnterior }) => {
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
        const instagramRaw = lerAbaComAlternativas(workbook, ['INSTAGRAM', 'INSTA']);
        const facebookRaw  = lerAbaComAlternativas(workbook, ['FACEBOOK', 'FACE']);
        const twitterRaw   = lerAbaComAlternativas(workbook, ['TWITTER', 'TWITTER/X', 'X']);
        const somaSeguidores = lerAbaComAlternativas(workbook, ['SOMA SEGUIDORES', 'SOMA DE SEGUIDORES', 'SOMA']);
        const engajadosRaw   = lerAbaComAlternativas(workbook, ['PERFIS ENGAJADOS', 'PERFIS MAIS ENGAJADOS', 'ENGAJADOS', 'ENGAJAMENTO']);
        const publicacoesRaw = lerAbaComAlternativas(workbook, ['PUBLICAÇÃO ENGAJADAS', 'PUBLICAÇÕES ENGAJADAS', 'PUBLICACOES ENGAJADAS', 'PUBLICAÇÕES', 'POSTS ENGAJADOS']);

        const nomeAliases = ['SECRETÁRIO', 'SECRETÁRIOS', 'SECRETARIO', 'SECRETARIOS', 'NOME', 'NOME DO SECRETÁRIO', 'SECRETARIA', 'PERFIL'];
        const seguidoresAliases = ['SEGUIDORES', 'SEGUIDOR', 'SOMA', 'SEGUIDORES TOTAL'];

        // Monta listas base com foto
        const instagram = instagramRaw.map((linha) => {
          const nome = nomeStr(encontrarValor(linha, nomeAliases));
          return {
            nome,
            seguidores: num(encontrarValor(linha, seguidoresAliases)),
            foto: fotoPorNome(nome) || '',
            cargo: '',
          };
        });

        const facebook = facebookRaw.map((linha) => {
          const nome = nomeStr(encontrarValor(linha, nomeAliases));
          return {
            nome,
            seguidores: num(encontrarValor(linha, seguidoresAliases)),
            foto: fotoPorNome(nome) || '',
            cargo: '',
          };
        });

        const twitter = twitterRaw
          .map((linha) => {
            const nome = nomeStr(encontrarValor(linha, nomeAliases));
            return {
              nome,
              seguidores: num(encontrarValor(linha, seguidoresAliases)),
              foto: fotoPorNome(nome) || '',
              cargo: '',
            };
          })
          .filter((p) => p.seguidores > 0);

        // Processa redes sociais
        const base = processarRedes(instagram, facebook, twitter, somaSeguidores);

        base.instagram = instagram;
        base.facebook  = facebook;
        base.twitter   = twitter;

        // 🔥 Processar perfis engajados
        const engajados = processarEngajados(engajadosRaw);
        base.perfisEngajados = engajados;

        // 🔥 Processar publicações engajadas (nova seção)
        const publicacoesEngajadas = publicacoesRaw.map((linha) => {
          // normaliza DATA
          const dataRaw = encontrarValor(linha, ['DATA', 'DATA DE PUBLICACAO', 'DATA DA POSTAGEM']);
          let dataFormatada = "";
          if (dataRaw) {
            if (typeof dataRaw === "number") {
              // Excel serial → Date
              const baseDate = new Date(1900, 0, dataRaw - 1);
              dataFormatada = baseDate.toLocaleDateString("pt-BR");
            } else {
              dataFormatada = String(dataRaw).trim();
            }
          }

          const itemPos = encontrarValor(linha, ['ITEM', 'POSIÇÃO', 'POSICAO', 'ENGAJAMENTO', 'NÚMERO', 'NUMERO']);
          const nome = nomeStr(encontrarValor(linha, ['NOME', 'SECRETÁRIO', 'SECRETARIO', 'SECRETÁRIOS', 'SECRETARIOS']));
          const posicao = num(encontrarValor(linha, ['POSIÇÃO', 'POSICAO', 'ENGAJAMENTO', 'SEGUIDORES']));
          const foto = encontrarValor(linha, ['FOTO', 'LINK', 'IMAGEM', 'FOTO DA PUBLICACAO']);

          return {
            ITEM: itemPos,
            NOME: nome,
            POSICAO: posicao,
            FOTO: foto,
            DATA: dataFormatada,
          };
        });
        base.publicacoesEngajadas = publicacoesEngajadas;

        // ============== VARIAÇÕES ====================
        const snap = snapshotAnterior || getLastSnapshot();
        const resultado = aplicarVariacoesEmTudo(base, snap || {});

        // garantir que seções extras continuem
        resultado.perfisEngajados = engajados;
        resultado.publicacoesEngajadas = publicacoesEngajadas;

        // Entrega pro app
        setDados(resultado);

        // Persistência
        try {
          const json = JSON.stringify(resultado);
          localStorage.setItem('relatorioRedes', json);
        } catch (e) {
          console.warn('Aviso: Limite do localStorage excedido ao salvar relatorioRedes:', e);
        }

        try {
          saveSnapshot(resultado);
        } catch (e) {
          console.warn('Aviso: Limite do localStorage excedido ao salvar lastSnapshot:', e);
        }

        // Salvar no Banco de Dados da VPS
        try {
          console.log('📤 Enviando dados para o banco de dados...');
          const response = await fetch('/secretarios/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultado),
          });
          if (!response.ok) {
            console.error('Erro ao salvar relatório no banco de dados:', await response.text());
          } else {
            console.log('✅ Relatório gravado com sucesso no Banco de Dados MySQL!');
          }
        } catch (dbErr) {
          console.error('Erro de rede ao conectar com o banco de dados:', dbErr);
        }

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