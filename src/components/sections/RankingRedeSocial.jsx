// src/components/sections/RankingRedeSocial.jsx
import RankingList from './RankingList';

const RankingRedeSocial = ({ rede, dados }) => {
  // Seleciona a coluna específica (ex: pessoa.instagram, pessoa.twitter...)
  const dadosOrdenados = [...dados]
    .filter(p => p[rede.toLowerCase()]) // Ex: pessoa.instagram
    .sort((a, b) => b[rede.toLowerCase()] - a[rede.toLowerCase()]);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ranking de Seguidores no {rede}</h2>
      <RankingList dados={dadosOrdenados} campo={rede.toLowerCase()} />
    </div>
  );
};

export default RankingRedeSocial;
