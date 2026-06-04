// src/components/common/UploadRedes.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';
import processarRedes from '../../utils/processarRedes';
import { fotoPorNome } from '../../utils/fotoCatalog';
import { aplicarVariacoesEmTudo } from '../../shared/calcVariacao';
import processarEngajados from '../../utils/processarEngajados';

// ---------- helpers ----------
const num = (v) =>
  Number(String(v ?? 0).toString().replace(/\./g, '').replace(',', '.')) || 0;

const lerAba = (wb, nome) =>
  wb.Sheets?.[nome] ? XLSX.utils.sheet_to_json(wb.Sheets[nome]) : [];

const nomeStr = (v) => (v ? String(v).trim() : '');

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
        const somaSeguidores = lerAba(workbook, 'SOMA SEGUIDORES');
        const engajadosRaw   = lerAba(workbook, 'PERFIS ENGAJADOS');
        const publicacoesRaw = lerAba(workbook, 'PUBLICAÇÃO ENGAJADAS'); // 🔥 nova aba

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
          let dataFormatada = "";
          if (linha["DATA"]) {
            if (typeof linha["DATA"] === "number") {
              // Excel serial → Date
              const baseDate = new Date(1900, 0, linha["DATA"] - 1);
              dataFormatada = baseDate.toLocaleDateString("pt-BR");
            } else {
              dataFormatada = String(linha["DATA"]).trim();
            }
          }

          return {
            ITEM: linha['ITEM'],
            NOME: nomeStr(linha['NOME']),
            POSICAO: num(linha['POSIÇÃO']),
            FOTO: linha['FOTO'],
            DATA: dataFormatada,
          };
        });
        base.publicacoesEngajadas = publicacoesEngajadas;

        // ============== VARIAÇÕES ====================
        const snapshotAnterior = getLastSnapshot();
        const resultado = aplicarVariacoesEmTudo(base, snapshotAnterior || {});

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
          const response = await fetch('api/upload', {
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