import HeaderTwitterImage from '/src/assets/header_Relatorio_X.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg';

// ✅ Ícones personalizados
import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const RankingTwitter = ({ dados }) => {
  const getIconeVariacao = (variacao) => {
    if (variacao > 0) return <img src={IconGanhou} alt="Ganhou posição" className="w-5 h-5" />;
    if (variacao < 0) return <img src={IconPerdeu} alt="Perdeu posição" className="w-5 h-5" />;
    return <img src={IconManteve} alt="Manteve posição" className="w-5 h-5" />;
  };

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header específico do Twitter */}
      <div className="w-full">
        <img
          src={HeaderTwitterImage}
          alt="Ranking Twitter Header"
          className="w-full object-cover"
        />
      </div>

      {/* Lista dos cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {dados.map((pessoa, index) => {
          const isPrimeiro = index === 0;

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 shadow hover:scale-[1.01] transition rounded-full ${
                isPrimeiro ? 'bg-[#FEBD11]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Posição */}
                <div className="text-lg font-extrabold w-6 text-right">{index + 1}º</div>

                {/* Foto */}
                <img
                  src={pessoa.foto || '/placeholder.png'}
                  alt={pessoa.nome}
                  className={`rounded-full object-cover border-2 ${
                    isPrimeiro ? 'w-10 h-10 border-[#F7901E]' : 'w-10 h-10 border-white'
                  }`}
                />

                {/* Nome e cargo */}
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

              {/* Seguidores e variação */}
              <div className="flex items-center gap-2">
                {getIconeVariacao(pessoa.variacao)}
                <div
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    isPrimeiro ? 'bg-[#F7901E] text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  {(pessoa.seguidores ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda visual com imagem */}
      <div className="max-w-7xl mx-auto flex justify-center mt-12">
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

export default RankingTwitter;