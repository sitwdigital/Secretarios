import { useState } from 'react';
import * as XLSX from 'xlsx';
import processarRedes from '../../utils/processarRedes';

const UploadRedes = ({ setDados }) => {
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArquivoSelecionado(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ler as planilhas
      const instagramRaw = XLSX.utils.sheet_to_json(workbook.Sheets['INSTAGRAM']);
      const facebookRaw = XLSX.utils.sheet_to_json(workbook.Sheets['FACEBOOK']);
      const twitterRaw = XLSX.utils.sheet_to_json(workbook.Sheets['TWITTER']);
      const planilha4 = XLSX.utils.sheet_to_json(workbook.Sheets['Planilha4']);

      // Instagram
      const instagram = instagramRaw.map((linha) => ({
        nome: linha['SECRETÁRIO']?.toString().trim() ?? '',
        seguidores: Number(String(linha['SEGUIDORES']).replace(/\./g, '').replace(',', '.')) || 0,
        foto: '',
        cargo: '',
      }));

      // Facebook
      const facebook = facebookRaw.map((linha) => ({
        nome: linha['SECRETÁRIO']?.toString().trim() ?? '',
        seguidores: Number(String(linha['SEGUIDORES']).replace(/\./g, '').replace(',', '.')) || 0,
        variacao: Number(String(linha['GANHO DE SEGUIDORES']).replace(',', '.')) || 0,
        foto: '',
        cargo: '',
      }));

      // Twitter (com filtro apenas para quem tem seguidores válidos)
      const twitter = twitterRaw
        .map((linha) => ({
          nome: linha['SECRETÁRIO']?.toString().trim() ?? '',
          seguidores: Number(String(linha['SEGUIDORES']).replace(/\./g, '').replace(',', '.')) || 0,
          variacao: Number(String(linha['GANHO DE SEGUIDORES']).replace(',', '.')) || 0,
          foto: '',
          cargo: '',
        }))
        .filter((pessoa) => pessoa.seguidores > 0); // filtra quem realmente tem conta

      // Envia os dados
      const resultado = processarRedes(instagram, facebook, twitter, planilha4);
      resultado.instagram = instagram;
      resultado.facebook = facebook;
      resultado.twitter = twitter;

      setDados(resultado);
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
