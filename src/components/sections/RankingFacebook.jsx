import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

import HeaderFacebookImage from '/src/assets/header_Relatorio_Facebook.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';

const RankingFacebook = ({ dados }) => {
  const getIconeVariacao = (variacao) => {
    if (variacao > 0) return <ArrowUpRight className="text-green-600" size={20} />;
    if (variacao < 0) return <ArrowDownRight className="text-red-600" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header específico do Facebook */}
      <div className="w-full">
        <img
          src={HeaderFacebookImage}
          alt="Ranking Facebook Header"
          className="w-full object-cover"
        />
      </div>

      {/* Título abaixo do header */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-4">
        <h3 className="text-xl font-bold text-center">Ranking de Seguidores no Facebook</h3>
      </div>

      {/* Lista dos cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {dados.map((pessoa, index) => (
          <div
            key={index}
            className="bg-white rounded-full flex items-center justify-between p-4 shadow hover:scale-[1.01] transition"
          >
            <div className="flex items-center gap-3">
              {/* Posição */}
              <div className="text-xl font-extrabold w-8 text-right">{index + 1}º</div>

              {/* Foto */}
              <img
                src={pessoa.foto || '/placeholder.png'}
                alt={pessoa.nome}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />

              {/* Nome e cargo */}
              <div>
                <p className="font-semibold text-sm">{pessoa.nome}</p>
                <p className="text-xs text-gray-500">{pessoa.cargo || 'Cargo não informado'}</p>
              </div>
            </div>

            {/* Seguidores */}
            <div className="flex items-center gap-2">
              {getIconeVariacao(pessoa.variacao)}
              <div className="bg-gray-300 text-black text-sm font-bold px-4 py-2 rounded-full">
                {(pessoa.seguidores ?? 0).toLocaleString()}
              </div>
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

      {/* Footer */}
      <div className="w-full">
        <img
          src={FooterRankingImage}
          alt="Ranking Footer"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default RankingFacebook;
