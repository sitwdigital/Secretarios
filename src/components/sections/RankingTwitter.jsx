import { useEffect, useMemo } from 'react';

import HeaderTwitterImage from '/src/assets/header_Relatorio_X.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg';

import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const LS_KEY = 'rankingTwitter_prev'; // lista de nomes (ordem 1..N)

const RankingTwitter = ({ dados = [] }) => {
  // Ordena por seguidores (desc) para definir o ranking atual
  const dadosOrdenados = useMemo(
    () => [...dados].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0)),
    [dados]
  );

  // Nomes na ordem atual
  const nomesAtuais = useMemo(() => dadosOrdenados.map(p => p.nome), [dadosOrdenados]);

  // Carrega ordem anterior do localStorage (se houver)
  const prevOrder = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }, []);

  // Mapa nome -> posição anterior (1-based)
  const prevPos = useMemo(() => {
    const m = new Map();
    prevOrder.forEach((nome, i) => m.set(nome, i + 1));
    return m;
  }, [prevOrder]);

  // +1 subiu | -1 desceu | 0 manteve
  const deltaPos = (nome, posAtual) => {
    const posAnterior = prevPos.get(nome);
    if (!posAnterior) return 0;                 // sem histórico
    const diff = posAnterior - posAtual;        // positivo = posição menor (subiu)
    if (diff > 0) return 1;
    if (diff < 0) return -1;
    return 0;
  };

  const getIcone = (nome, posAtual) => {
    const d = deltaPos(nome, posAtual);
    if (d > 0) return <img src={IconGanhou} alt="Ganhou posição" className="w-5 h-5" />;
    if (d < 0) return <img src={IconPerdeu} alt="Perdeu posição" className="w-5 h-5" />;
    return <img src={IconManteve} alt="Manteve posição" className="w-5 h-5" />;
  };

  // Depois que renderizar, salva a ordem atual para a próxima comparação
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(nomesAtuais)); } catch {}
  }, [nomesAtuais]);

  if (!dadosOrdenados.length) return null;

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img src={HeaderTwitterImage} alt="Ranking Twitter Header" className="w-full object-cover" />
      </div>

      {/* Lista dos cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {dadosOrdenados.map((pessoa, index) => {
          const pos = index + 1;
          const isPrimeiro = index === 0;

          return (
            <div
              key={`${pessoa.nome}-${index}`}
              className={`flex items-center justify-between p-3 shadow hover:scale-[1.01] transition rounded-full ${
                isPrimeiro ? 'bg-[#FEBD11]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Posição */}
                <div className="text-lg font-extrabold w-6 text-right">{pos}º</div>

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
                {getIcone(pessoa.nome, pos)}
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

      {/* Legenda */}
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

export default RankingTwitter;