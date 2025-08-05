import { useState } from 'react';
import UploadRedes from '../components/common/UploadRedes';
import RankingTop10 from '../components/sections/RankingTop10';
import RankingRedeSocial from '../components/sections/RankingRedeSocial';
import ExportPDFButton from '../components/common/ExportPDFButton';

const DashboardSocial = () => {
  const [dados, setDados] = useState([]);

  return (
    <div className="p-6">
      <UploadRedes setDados={setDados} />

      {dados.length > 0 && (
        <div id="relatorio" className="bg-white p-6 rounded shadow mt-6 space-y-8">
          <RankingTop10 dados={dados} />
          <RankingRedeSocial rede="Instagram" dados={dados} />
          <RankingRedeSocial rede="Facebook" dados={dados} />
          <RankingRedeSocial rede="Twitter" dados={dados} />
          <ExportPDFButton />
        </div>
      )}
    </div>
  );
};

export default DashboardSocial;
