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
      setTimeout(() => {
        const readyDiv = document.getElementById('pdf-ready');
        if (readyDiv) {
          readyDiv.classList.remove('hidden');
          readyDiv.classList.add('block');
        }
      }, 1000);
    }
  }, [dados]);

  if (!dados) return <p className="text-center mt-10">Carregando relatório...</p>;

  return (
    <div id="pdf-content" className="bg-white text-black w-full">
      {/* Página 1: Capa */}
      <section className="w-full page-break flex items-center justify-center">
        <img src={CoverRelatorioImage} alt="Capa" className="w-full" />
      </section>

      {/* Página 2: Ganho de seguidores */}
      <section className="w-full page-break">
        <RankingGanhoSeguidores dados={dados.rankingGanho} />
      </section>

      {/* Página 3: Instagram Parte 1 */}
      <section className="w-full page-break">
        <RankingInstagram dados={dados.instagram} />
      </section>

      {/* Página 4: Instagram Parte 2 */}
      <section className="w-full page-break">
        <RankingInstagram2 dados={dados.instagram} />
      </section>

      {/* Página 5: Facebook */}
      <section className="w-full page-break">
        <RankingFacebook dados={dados.facebook} />
      </section>

      {/* Página 6: Twitter */}
      <section className="w-full page-break">
        <RankingTwitter dados={dados.twitter} />
      </section>

      {/* Página 7: Encerramento */}
      <section className="w-full page-break flex items-center justify-center">
        <img src={EndPageRelatorioImage} alt="Fim" className="w-full" />
      </section>

      {/* Sinalizador para Puppeteer */}
      <div id="pdf-ready" className="hidden" />
    </div>
  );
};

export default Print;
