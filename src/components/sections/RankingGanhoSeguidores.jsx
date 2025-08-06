import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

import HeaderRankingImage from '/src/assets/header_Relatorio_Ranking.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA_2.svg'; 

const RankingGanhoSeguidores = ({ dados }) => {
  const getIconeVariacao = (variacao) => {
    if (variacao > 0) return <ArrowUpRight className="text-green-600" size={20} />;
    if (variacao < 0) return <ArrowDownRight className="text-red-600" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  if (!dados || dados.length === 0) return null;

  const esquerda = dados.slice(0, 5); 
  const direita = dados.slice(5, 10); 

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img
          src={HeaderRankingImage}
          alt="Ranking Header"
          className="w-full object-cover"
        />
      </div>

      {/* Título */}
      <div className="max-w-7xl mx-auto px-4  mb-4">
        <h3 className="text-[25px] font-bold text-center">Soma de seguidores nas redes</h3>
      </div>

      {/* Grid de 2 colunas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 mt-8 md:grid-cols-2 gap-4 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="contents" key={i}>
            {/* Coluna Esquerda */}
            {esquerda[i] && (
              <div className="bg-white rounded-full flex items-center justify-between p-4 shadow hover:scale-[1.01] transition">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-extrabold w-8 text-right">{i + 1}º</div>
                  <img
                    src={esquerda[i].foto || '/placeholder.png'}
                    alt={esquerda[i].nome}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-sm">{esquerda[i].nome}</p>
                    {esquerda[i].cargo && (
                      <p className="text-xs text-gray-500">{esquerda[i].cargo}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getIconeVariacao(esquerda[i].variacao || 1)}
                  <div className="bg-gray-300 text-black text-sm font-bold px-4 py-2 rounded-full">
                    {esquerda[i].ganho.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Coluna Direita */}
            {direita[i] && (
              <div className="bg-white rounded-full flex items-center justify-between p-4 shadow hover:scale-[1.01] transition">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-extrabold w-8 text-right">{i + 6}º</div>
                  <img
                    src={direita[i].foto || '/placeholder.png'}
                    alt={direita[i].nome}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-sm">{direita[i].nome}</p>
                    {direita[i].cargo && (
                      <p className="text-xs text-gray-500">{direita[i].cargo}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getIconeVariacao(direita[i].variacao || 1)}
                  <div className="bg-gray-300 text-black text-sm font-bold px-4 py-2 rounded-full">
                    {direita[i].ganho.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legenda como imagem */}
      <div className="max-w-7xl mx-auto flex justify-center mt-12 mb-6">
        <img src={LegendaImage} alt="Legenda" className="h-10 w-auto" />
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

export default RankingGanhoSeguidores;
