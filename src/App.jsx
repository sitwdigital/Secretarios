import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const App = () => {
  const [dadosExcel, setDadosExcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataUpload, setDataUpload] = useState(null); 

  const sectionsRef = useRef([]);
  const endPageRef = useRef(null);

  const handleUpload = (dados) => {
    setLoading(true);
    setTimeout(() => {
      setDadosExcel(dados);
      setDataUpload(new Date()); 
      setLoading(false);
    }, 1000);
  };

  const exportarPDF = async () => {
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = 297;
  const pageHeight = 210;

  const options = {
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: document.body.scrollWidth,
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const renderToPDF = async (element, isFirstPage = false) => {
    await delay(300);
    const canvas = await html2canvas(element, options);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);

    const imgRatio = imgProps.width / imgProps.height;
    const pdfRatio = pageWidth / pageHeight;

    let imgWidth = pageWidth;
    let imgHeight = pageHeight;

    if (imgRatio > pdfRatio) {
      imgHeight = pageWidth / imgRatio;
    } else {
      imgWidth = pageHeight * imgRatio;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    if (!isFirstPage) pdf.addPage();
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  };

  // CAPA
  if (document.getElementById('cover')) {
    await renderToPDF(document.getElementById('cover'), true);
  }

  // SEÇÕES
  for (let i = 0; i < sectionsRef.current.length; i++) {
    if (sectionsRef.current[i]) {
      await renderToPDF(sectionsRef.current[i]);
    }
  }

  // ÚLTIMA PÁGINA
  if (endPageRef.current) {
    await renderToPDF(endPageRef.current);
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
          {/* CAPA DO RELATÓRIO COM DATA */}
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

          {/* BOTÃO DE EXPORTAÇÃO */}
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

export default App;