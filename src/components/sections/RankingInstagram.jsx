import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

import HeaderInstagramImage from '/src/assets/header_Relatorio_Insta.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg'; // <- ✅ imagem da legenda

const RankingInstagram = ({ dados }) => {
  const getIconeVariacao = (variacao) => {
    if (variacao > 0) return <ArrowUpRight className="text-green-600" size={20} />;
    if (variacao < 0) return <ArrowDownRight className="text-red-600" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  if (!dados || dados.length === 0) return null;

  const dadosOrdenados = [...dados].sort((a, b) => b.seguidores - a.seguidores);

  const col1 = dadosOrdenados.slice(0, 11);
  const col2 = dadosOrdenados.slice(11, 22);
  const col3 = dadosOrdenados.slice(22, 33);

  const linhas = Array.from({ length: 11 }, (_, i) => ({
    esquerda: col1[i],
    centro: col2[i],
    direita: col3[i],
  }));

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img src={HeaderInstagramImage} alt="Ranking Instagram Header" className="w-full object-cover" />
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-3 px-4 sm:grid-cols-1">
        {linhas.map((linha, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {linha.esquerda && (
              <CardPessoa pessoa={linha.esquerda} posicao={i + 1} getIconeVariacao={getIconeVariacao} />
            )}
            {linha.centro && (
              <CardPessoa pessoa={linha.centro} posicao={i + 12} getIconeVariacao={getIconeVariacao} />
            )}
            {linha.direita && (
              <CardPessoa pessoa={linha.direita} posicao={i + 23} getIconeVariacao={getIconeVariacao} />
            )}
          </div>
        ))}
      </div>

      {/* Legenda como imagem */}
      <div className="max-w-7xl mx-auto flex justify-center mt-12">
        <img src={LegendaImage} alt="Legenda" className="h-10 w-auto" />
      </div>

      {/* Footer */}
      <div className="w-full">
        <img src={FooterRankingImage} alt="Ranking Footer" className="w-full object-cover" />
      </div>
    </div>
  );
};

const CardPessoa = ({ pessoa, posicao, getIconeVariacao }) => {
  const isPrimeiro = posicao === 1;

  return (
    <div
      className={`flex items-center justify-between p-3 shadow hover:scale-[1.01] transition rounded-full ${
        isPrimeiro ? 'bg-[#FEBD11]' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-lg font-extrabold w-6 text-right">{posicao}º</div>
        <img
          src={pessoa.foto || '/placeholder.png'}
          alt={pessoa.nome}
          className={`rounded-full object-cover border-2 ${
            isPrimeiro ? 'w-10 h-10 border-[#F7901E]' : 'w-10 h-10 border-white'
          }`}
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
        {getIconeVariacao(pessoa.variacao || 0)}
        <div
          className={`text-sm font-bold px-3 py-1 rounded-full ${
            isPrimeiro ? 'bg-[#F7901E] text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {pessoa.seguidores.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RankingInstagram;
