import RankingList from './RankingList';

const RankingRedeSocial = ({ rede = '', dados = [] }) => {
  const campo = String(rede).toLowerCase();

  // Filtra quem tem o campo e ordena desc
  const dadosOrdenados = [...dados]
    .filter((p) => typeof p?.[campo] === 'number')
    .sort((a, b) => (b?.[campo] ?? 0) - (a?.[campo] ?? 0));

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ranking de Seguidores no {rede}</h2>
      <RankingList dados={dadosOrdenados} campo={campo} />
    </div>
  );
};

export default RankingRedeSocial;