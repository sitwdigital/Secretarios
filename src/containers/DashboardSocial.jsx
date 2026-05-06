// src/pages/DashboardSocial.jsx
import { useState } from 'react';
import UploadRedes from '../components/common/UploadRedes';
import RankingTop10 from '../components/sections/RankingTop10';
import RankingRedeSocial from '../components/sections/RankingRedeSocial';
import RankingPerfisEngajados from '../components/sections/RankingPerfisEngajados';
import ExportPDFButton from '../components/common/ExportPDFButton';

const DashboardSocial = () => {
  const [dados, setDados] = useState(null);

  // 🔎 Sempre que os dados mudarem, mostramos no console
  if (dados) {
    console.log("📊 Dados recebidos no DashboardSocial:", dados);

    if (dados.perfisEngajados) {
      console.log("🔥 Perfis Engajados detectados:", dados.perfisEngajados);
    } else {
      console.warn("⚠ Nenhum perfil engajado encontrado nos dados!");
    }
  }

  return (
    <div className="p-6">
      {/* Upload do Excel */}
      <UploadRedes
        setDados={(novosDados) => {
          console.log("📥 UploadRedes entregou:", novosDados);
          setDados(novosDados);
        }}
      />

      {/* Renderização do relatório */}
      {dados && (
        <div
          id="relatorio"
          className="bg-white p-6 rounded shadow mt-6 space-y-8"
        >
          {/* Top 10 geral */}
          <RankingTop10 dados={dados} />

          {/* ✅ Seção Perfis Engajados */}
          {dados.perfisEngajados && dados.perfisEngajados.length > 0 ? (
            <RankingPerfisEngajados dados={dados.perfisEngajados} />
          ) : (
            <p className="text-center text-gray-500 italic">
              Nenhum dado de perfis engajados encontrado.
            </p>
          )}

          {/* Rankings por rede */}
          <RankingRedeSocial rede="Instagram" dados={dados} />
          <RankingRedeSocial rede="Facebook" dados={dados} />
          <RankingRedeSocial rede="Twitter" dados={dados} />

          {/* Botão de exportação PDF */}
          <ExportPDFButton dados={dados} />
        </div>
      )}
    </div>
  );
};

export default DashboardSocial;