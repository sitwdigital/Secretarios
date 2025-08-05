import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Header from './components/layout/Header';
import Footer from './components/common/Footer';
import UploadRedes from './components/common/UploadRedes';

import RankingGanhoSeguidores from './components/sections/RankingGanhoSeguidores';
import RankingInstagram from './components/sections/RankingInstagram';
import RankingFacebook from './components/sections/RankingFacebook';
import RankingTwitter from './components/sections/RankingTwitter';

import CoverRelatorioImage from './assets/cover_Relatorio.svg';
import EndPageRelatorioImage from './assets/endpage_Relatorio.svg';

const App = () => {
  const [dadosExcel, setDadosExcel] = useState(null);
  const [loading, setLoading] = useState(false);

  const sectionsRef = useRef([]);
  const endPageRef = useRef(null); // ✅ referência para a imagem final

  const handleUpload = (dados) => {
    setLoading(true);
    setTimeout(() => {
      setDadosExcel(dados);
      setLoading(false);
    }, 1000);
  };

  const exportarPDF = async () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = 297;
    const pageHeight = 210;

    // Página 1: Capa
    const coverCanvas = await html2canvas(document.getElementById('cover'), { scale: 2 });
    const coverImgData = coverCanvas.toDataURL('image/png');
    pdf.addImage(coverImgData, 'PNG', 0, 0, pageWidth, pageHeight);

    // Conteúdo principal
    for (let i = 0; i < sectionsRef.current.length; i++) {
      const el = sectionsRef.current[i];
      if (!el) continue;
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    }

    // Página final com imagem do fechamento
    if (endPageRef.current) {
      const canvas = await html2canvas(endPageRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    }

    pdf.save('Relatorio_Secretarias.pdf');
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen">
      {!dadosExcel && !loading && (
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
          {/* Capa do relatório */}
          <div id="cover" className="w-full">
            <img
              src={CoverRelatorioImage}
              alt="Capa do Relatório"
              className="w-full object-cover mb-4"
            />
          </div>

          {/* Conteúdo PDF */}
          <section ref={(el) => (sectionsRef.current[0] = el)} id="ranking-top10" className="py-0">
            <RankingGanhoSeguidores dados={dadosExcel.rankingGanho} />
          </section>

          <section ref={(el) => (sectionsRef.current[1] = el)} id="instagram" className="py-0">
            <RankingInstagram dados={dadosExcel.instagram} />
          </section>

          <section ref={(el) => (sectionsRef.current[2] = el)} id="facebook" className="py-0">
            <RankingFacebook dados={dadosExcel.facebook} />
          </section>

          <section ref={(el) => (sectionsRef.current[3] = el)} id="twitter" className="py-0">
            <RankingTwitter dados={dadosExcel.twitter} />
          </section>

          {/* Imagem final (antes do footer) */}
          <div ref={endPageRef} className="w-full">
            <img
              src={EndPageRelatorioImage}
              alt="Página Final"
              className="w-full object-cover"
            />
          </div>

          {/* Botão de exportar PDF */}
          <div className="py-8 text-center bg-gray-100">
            <button
              onClick={exportarPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition border border-black"
            >
              📄 Exportar Relatório em PDF
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default App;
