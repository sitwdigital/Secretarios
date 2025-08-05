import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

import HeaderInstagramImage from '/src/assets/header_Relatorio_Insta.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';

const RankingInstagram = ({ dados }) => {
  const getIconeVariacao = (variacao) => {
    if (variacao > 0) return <ArrowUpRight className="text-green-600" size={20} />;
    if (variacao < 0) return <ArrowDownRight className="text-red-600" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  if (!dados || dados.length === 0) return null;

  const primeiraMetade = dados.slice(0, 33);
  const segundaMetade = dados.slice(33, 66);

  const renderSecao = (lista, numeroSecao) => (
    <div className="w-full bg-gray-100 pb-0">
      {/* SVG Header do Instagram */}
      <div className="w-full">
        <img
          src={HeaderInstagramImage}
          alt={`Ranking Instagram Header ${numeroSecao}`}
          className="w-full object-cover" 
        />
      </div>

      {/* Título abaixo do header */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-4">
        <h3 className="text-xl font-bold text-center">Ranking de Seguidores no Instagram</h3>
      </div>

      {/* Lista dos cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {lista.map((pessoa, index) => (
          <div
            key={index}
            className="bg-white rounded-full flex items-center justify-between p-3 shadow hover:scale-[1.01] transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-lg font-extrabold w-6 text-right">
                {numeroSecao === 1 ? index + 1 : index + 34}º
              </div>
              <img
                src={pessoa.foto || '/placeholder.png'}
                alt={pessoa.nome}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div>
                <p className="font-semibold text-sm truncate max-w-[120px]">{pessoa.nome}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{pessoa.cargo || 'Cargo não informado'}</p>
              </div>
            </div>
            <div className="bg-gray-300 text-black text-sm font-bold px-3 py-1 rounded-full">
              {pessoa.seguidores.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda de variações */}
      <div className="max-w-7xl mx-auto flex justify-center gap-6 items-center mt-8 mb-6 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="text-green-600" size={16} /> Ganhou posição
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="text-red-600" size={16} /> Perdeu posição
        </div>
        <div className="flex items-center gap-2">
          <Minus className="text-gray-400" size={16} /> Manteve a posição
        </div>
      </div>

      {/* SVG Footer */}
      <div className="w-full">
        <img
          src={FooterRankingImage}
          alt={`Ranking Footer ${numeroSecao} `}
          className="w-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <>
      {renderSecao(primeiraMetade, 1)}
      {renderSecao(segundaMetade, 2)}
    </>
  );
};

export default RankingInstagram;    