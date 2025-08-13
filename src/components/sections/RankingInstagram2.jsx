// Remova esses ícones antigos:
// import {
//   ArrowUpRight,
//   ArrowDownRight,
//   Minus,
// } from 'lucide-react';

import HeaderInstagramImage from '/src/assets/header_Relatorio_Insta.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg';

// ✅ Novos ícones personalizados
import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const RankingInstagram2 = ({ dados }) => {
  const getIconeVariacao = (variacao) => {
    if (variacao > 0) return <img src={IconGanhou} alt="Ganhou posição" className="w-5 h-5" />;
    if (variacao < 0) return <img src={IconPerdeu} alt="Perdeu posição" className="w-5 h-5" />;
    return <img src={IconManteve} alt="Manteve posição" className="w-5 h-5" />;
  };

  if (!dados || dados.length === 0) return null;

  const dadosOrdenados = [...dados].sort((a, b) => b.seguidores - a.seguidores);
  const segundaMetade = dadosOrdenados.slice(33, 66);

  const col1 = segundaMetade.slice(0, 11);
  const col2 = segundaMetade.slice(11, 22);
  const col3 = segundaMetade.slice(22, 33);

  const linhas = Array.from({ length: 11 }, (_, i) => ({
    esquerda: col1[i],
    centro: col2[i],
    direita: col3[i],
  }));

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img
          src={HeaderInstagramImage}
          alt="Ranking Instagram Header 2"
          className="w-full object-cover"
        />
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-3 px-4 sm:grid-cols-1">
        {linhas.map((linha, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {linha.esquerda && (
              <CardPessoa pessoa={linha.esquerda} posicao={i + 34} getIconeVariacao={getIconeVariacao} />
            )}
            {linha.centro && (
              <CardPessoa pessoa={linha.centro} posicao={i + 45} getIconeVariacao={getIconeVariacao} />
            )}
            {linha.direita && (
              <CardPessoa pessoa={linha.direita} posicao={i + 56} getIconeVariacao={getIconeVariacao} />
            )}
          </div>
        ))}
      </div>

      {/* Legenda com imagem */}
      <div className="max-w-7xl mx-auto flex justify-center mt-12">
        <img src={LegendaImage} alt="Legenda" className="h-10 w-auto" />
      </div>

      {/* Footer */}
      <div className="w-full">
        <img
          src={FooterRankingImage}
          alt="Ranking Footer 2"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

const CardPessoa = ({ pessoa, posicao, getIconeVariacao }) => (
  <div className="bg-white rounded-full flex items-center justify-between p-3 shadow hover:scale-[1.01] transition">
    <div className="flex items-center gap-3">
      <div className="text-lg font-extrabold w-6 text-right">{posicao}º</div>
      <img
        src={pessoa.foto || '/placeholder.png'}
        alt={pessoa.nome}
        className="w-10 h-10 rounded-full object-cover border-2 border-white"
      />
      <div>
        <p className="font-semibold text-sm max-w-[160px] whitespace-normal break-words leading-tight">
          {pessoa.nome}
        </p>
        {pessoa.cargo && (
          <p className="text-xs text-gray-500 max-w-[160px] whitespace-normal break-words leading-tight">
            {pessoa.cargo}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {getIconeVariacao(pessoa.variacao || 1)}
      <div className="bg-gray-300 text-black text-sm font-bold px-3 py-1 rounded-full">
        {pessoa.seguidores.toLocaleString()}
      </div>
    </div>
  </div>
);

export default RankingInstagram2;