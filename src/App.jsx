import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Header from './components/layout/Header';
import Footer from './components/common/Footer';
import UploadRedes from './components/common/UploadRedes';

import RankingGanhoSeguidores from './components/sections/RankingGanhoSeguidores';
import RankingInstagram from './components/sections/RankingInstagram';
import RankingInstagram2 from './components/sections/RankingInstagram2';
import RankingFacebook from './components/sections/RankingFacebook';
import RankingTwitter from './components/sections/RankingTwitter';

import CoverRelatorioImage from './assets/cover_Relatorio.svg';
import EndPageRelatorioImage from './assets/endpage_Relatorio.svg';

const App = ({ modoPrint = false }) => {
  const [dadosExcel, setDadosExcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataUpload, setDataUpload] = useState(null);

  const sectionsRef = useRef([]);
  const endPageRef = useRef(null);

  // 🔄 Ao fazer upload
  const handleUpload = (dados) => {
    setLoading(true);
    setTimeout(() => {
      setDadosExcel(dados);
      setDataUpload(new Date());
      setLoading(false);
    }, 1000);
  };

  // 🖨️ Exportar com Puppeteer
  const exportarComPuppeteer = async () => {
    try {
      const local = localStorage.getItem('relatorioSecretarias');
      if (!local) {
        alert('Dados do relatório não encontrados no localStorage.');
        return;
      }

      const response = await fetch('http://localhost:4000/gerar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: local,
      });

      if (!response.ok) throw new Error('Erro ao gerar PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'Relatorio_Secretarias.pdf';
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar com Puppeteer:', error);
      alert('Erro ao gerar o PDF. Verifique se o servidor está rodando.');
    }
  };

  // 🔄 Salvar dados no localStorage após upload (modo normal)
  useEffect(() => {
    if (!modoPrint && dadosExcel) {
      const dados = JSON.stringify(dadosExcel);
      localStorage.setItem('relatorioRedes', dados);
      localStorage.setItem('relatorioSecretarias', dados);
    }
  }, [dadosExcel, modoPrint]);

  // 🖨️ Carregar dados no modoPrint (lido via Puppeteer)
  useEffect(() => {
    if (modoPrint) {
      const dadosSalvos = localStorage.getItem('relatorioRedes');
      if (dadosSalvos) {
        const parsed = JSON.parse(dadosSalvos);
        setDadosExcel(parsed);
        setDataUpload(new Date()); // ou salve a data junto se quiser fixar
      }
    }
  }, [modoPrint]);

  // ⏳ Evitar render antes de carregar os dados no modoPrint
  if (modoPrint && !dadosExcel) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Carregando relatório...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen">
      {!modoPrint && !dadosExcel && !loading && (
        <>
          <Header />
          <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Faça o upload do arquivo Excel (.xlsx) para ver o ranking
            </h1>
            <div className="w-full max-w-md">
              <UploadRedes setDados={handleUpload} />
            </div>
          </main>
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen text-blue-700">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <p className="text-lg font-semibold animate-pulse">Carregando dados...</p>
        </div>
      )}

      {!loading && dadosExcel && (
        <>
          {!modoPrint && <Header />}

          {/* CAPA */}
          <div id="cover" className="relative w-full">
            <img
              src={CoverRelatorioImage}
              alt="Capa do Relatório"
              className="w-full object-cover mb-4"
            />
            {dataUpload && (
              <div className="absolute top-[500px] left-[80px] text-[30px] font-semibold text-[#0F1120]">
                {dataUpload.toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>

          {/* SEÇÕES */}
          <section ref={(el) => (sectionsRef.current[0] = el)} id="ranking-top10" className="py-0">
            <RankingGanhoSeguidores dados={dadosExcel.rankingGanho} />
          </section>

          <section ref={(el) => (sectionsRef.current[1] = el)} id="instagram1" className="py-0">
            <RankingInstagram dados={dadosExcel.instagram} />
          </section>

          <section ref={(el) => (sectionsRef.current[2] = el)} id="instagram2" className="py-0">
            <RankingInstagram2 dados={dadosExcel.instagram} />
          </section>

          <section ref={(el) => (sectionsRef.current[3] = el)} id="facebook" className="py-0">
            <RankingFacebook dados={dadosExcel.facebook} />
          </section>

          <section ref={(el) => (sectionsRef.current[4] = el)} id="twitter" className="py-0">
            <RankingTwitter dados={dadosExcel.twitter} />
          </section>

          {/* ÚLTIMA PÁGINA */}
          <div ref={endPageRef} className="w-full">
            <img
              src={EndPageRelatorioImage}
              alt="Página Final"
              className="w-full object-cover"
            />
          </div>

          {/* SINALIZADOR PARA O PUPPETEER */}
          {modoPrint && dadosExcel && (
            <div id="pdf-ready" className="hidden" />
          )}

          {/* BOTÃO DE EXPORTAÇÃO */}
          {!modoPrint && (
            <div className="py-8 text-center bg-gray-100">
              <button
                onClick={exportarComPuppeteer}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-full transition border border-black"
              >
                📄 Exportar Relatório em PDF (Alta Qualidade)
              </button>
            </div>
          )}

          {!modoPrint && <Footer />}
        </>
      )}
    </div>
  );
};

export default App;
