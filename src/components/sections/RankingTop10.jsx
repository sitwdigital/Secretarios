import Top10Card from '../common/Top10Card';

const RankingTop10 = ({ dados = [] }) => {
  // Ordena e pega os 10 primeiros por total de seguidores (defensivo)
  const top10 = [...dados]
    .sort((a, b) => (b?.totalSeguidores ?? 0) - (a?.totalSeguidores ?? 0))
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ranking de Ganho de Seguidores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {top10.map((pessoa, index) => (
          <Top10Card
            key={`${pessoa?.nome ?? 'p'}-${index}`}
            pessoa={pessoa}
            posicao={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingTop10;