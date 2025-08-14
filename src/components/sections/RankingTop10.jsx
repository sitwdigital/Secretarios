// src/components/.../RankingTop10.jsx
import Top10Card from '../common/Top10Card';

/**
 * RankingTop10
 * - Ordena por chaveOrdenacao (default: "totalSeguidores") e leva os 10 primeiros.
 * - Repasse modoPrint para o card se ele precisar tratar diferenças no /print.
 */
const RankingTop10 = ({
  dados = [],
  chaveOrdenacao = 'totalSeguidores', // você pode passar "ganho" se quiser top10 por ganho
  modoPrint = false,
}) => {
  const lista = Array.isArray(dados) ? dados : [];

  const top10 = [...lista]
    .sort((a, b) => (Number(b?.[chaveOrdenacao]) || 0) - (Number(a?.[chaveOrdenacao]) || 0))
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {chaveOrdenacao === 'ganho'
          ? 'Ranking de Ganho de Seguidores'
          : 'Top 10 por Total de Seguidores'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {top10.map((pessoa, index) => (
          <Top10Card
            key={`${pessoa?.nome ?? 'p'}-${index}`}
            pessoa={pessoa}
            posicao={index + 1}
            modoPrint={modoPrint}
            // opcional: envie a info do valor usado, se o card quiser mostrar
            valorOrdenacao={Number(pessoa?.[chaveOrdenacao]) || 0}
            campoOrdenacao={chaveOrdenacao}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingTop10;