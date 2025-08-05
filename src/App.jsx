import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/common/Footer';
import UploadRedes from './components/common/UploadRedes';
import RankingGanhoSeguidores from './components/sections/RankingGanhoSeguidores';
import RankingRedeSocial from './components/sections/RankingRedeSocial';

const App = () => {
  const [dadosExcel, setDadosExcel] = useState(null);

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      <Header />

      <section className="py-8">
        <UploadRedes setDados={setDadosExcel} />
      </section>

      {dadosExcel && (
        <>
          <section id="ranking-top10" className="py-8">
            <RankingGanhoSeguidores dados={dadosExcel.rankingGanho} />
          </section>

          <section id="instagram" className="py-8 bg-white">
            <RankingRedeSocial rede="Instagram" dados={dadosExcel.instagram} />
          </section>

          <section id="facebook" className="py-8">
            <RankingRedeSocial rede="Facebook" dados={dadosExcel.facebook} />
          </section>

          <section id="twitter" className="py-8 bg-white">
            <RankingRedeSocial rede="Twitter" dados={dadosExcel.twitter} />
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default App;
