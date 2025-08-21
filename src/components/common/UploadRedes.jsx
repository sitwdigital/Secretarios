  // src/components/common/UploadRedes.jsx
  import { useState } from 'react';
  import * as XLSX from 'xlsx';
  import processarRedes from '../../utils/processarRedes';
  import { fotoPorNome } from '../../utils/fotoCatalog';
  import { aplicarVariacoesEmTudo } from '../../shared/calcVariacao';

  // ---------- helpers de parsing ----------
  const num = (v) =>
    Number(String(v ?? 0).toString().replace(/\./g, '').replace(',', '.')) || 0;

  const lerAba = (wb, nome) =>
    wb.Sheets?.[nome] ? XLSX.utils.sheet_to_json(wb.Sheets[nome]) : [];

  const nomeStr = (v) => (v ? String(v).trim() : '');

  // ---------- Snapshot (agora só localStorage) ----------
  function getLastSnapshot() {
    try {
      const snapRaw = localStorage.getItem('lastSnapshot');
      return snapRaw ? JSON.parse(snapRaw) : null;
    } catch {
      return null;
    }
  }

  function saveSnapshot(data) {
    try {
      localStorage.setItem('lastSnapshot', JSON.stringify(data));
    } catch {}
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
          // 🔥 agora puxa da aba "SOMA SEGUIDORES"
          const somaSeguidores = lerAba(workbook, 'SOMA SEGUIDORES');

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
          const base = processarRedes(instagram, facebook, twitter, somaSeguidores);

          // Garante que as listas expostas são as "com fotos"
          base.instagram = instagram;
          base.facebook  = facebook;
          base.twitter   = twitter;

          // ============== VARIAÇÕES ====================
          const snapshotAnterior = getLastSnapshot();
          const resultado = aplicarVariacoesEmTudo(base, snapshotAnterior || {});

          // Entrega pro app
          setDados(resultado);

          // Persiste localmente (para exportação /print)
          const json = JSON.stringify(resultado);
          localStorage.setItem('relatorioSecretarias', json);
          localStorage.setItem('relatorioRedes', json);

          // Atualiza lastSnapshot
          saveSnapshot(resultado);

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

  export default UploadRedes;
