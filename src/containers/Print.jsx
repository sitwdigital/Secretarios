import { useEffect, useState } from 'react';
import RankingGanhoSeguidores from '../components/sections/RankingGanhoSeguidores';
import RankingInstagram from '../components/sections/RankingInstagram';
import RankingInstagram2 from '../components/sections/RankingInstagram2';
import RankingFacebook from '../components/sections/RankingFacebook';
import RankingTwitter from '../components/sections/RankingTwitter';
import CoverRelatorioImage from '../assets/cover_Relatorio.svg';
import EndPageRelatorioImage from '../assets/endpage_Relatorio.svg';

const Print = () => {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');

    if (data) {
      const parsed = JSON.parse(decodeURIComponent(data));
      setDados(parsed);
    } else {
      const local = localStorage.getItem('relatorioRedes');
      if (local) {
        setDados(JSON.parse(local));
      }
    }
  }, []);

  useEffect(() => {
    if (dados) {
      // Aguarda renderização visual
      setTimeout(() => {
        const readyDiv = document.getElementById('pdf-ready');
        if (readyDiv) {
          readyDiv.classList.remove('hidden');
          readyDiv.classList.add('block');
        }
      }, 1000); // 1 segundo após renderizar os dados
    }
  }, [dados]);

  if (!dados) return <p className="text-center mt-10">Carregando relatório...</p>;

  return (
    <div id="pdf-content" className="bg-white text-black">
      <img src={CoverRelatorioImage} alt="Capa" className="w-full mb-4" />
      <RankingGanhoSeguidores dados={dados.rankingGanho} />
      <RankingInstagram dados={dados.instagram} />
      <RankingInstagram2 dados={dados.instagram} />
      <RankingFacebook dados={dados.facebook} />
      <RankingTwitter dados={dados.twitter} />
      <img src={EndPageRelatorioImage} alt="Fim" className="w-full mt-4" />

      {/* Sinalizador de prontidão para o Puppeteer */}
      <div id="pdf-ready" className="hidden" />
    </div>
  );
};

export default Print;
