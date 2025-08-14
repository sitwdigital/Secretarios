import { useEffect, useMemo } from 'react';

import HeaderTwitterImage from '/src/assets/header_Relatorio_X.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg';

import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const LS_KEY = 'rankingTwitter_prev';

const RankingTwitter = ({ dados = [], modoPrint = false }) => {
  const dadosOrdenados = useMemo(
    () => [...dados].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0)),
    [dados]
  );

  const nomesAtuais = useMemo(() => dadosOrdenados.map(p => p.nome), [dadosOrdenados]);

  const prevOrder = useMemo(() => {
    if (modoPrint) return [];
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }, [modoPrint]);

  const prevPos = useMemo(() => {
    const m = new Map();
    prevOrder.forEach((nome, i) => m.set(nome, i + 1));
    return m;
  }, [prevOrder]);

  const deltaPosFallback = (nome, posAtual) => {
    const posAnterior = prevPos.get(nome);
    if (!posAnterior) return 0;
    const diff = posAnterior - posAtual;
    if (diff > 0) return 1;
    if (diff < 0) return -1;
    return 0;
  };

  const resolveDelta = (pessoa, posAtual) => {
    if (Number.isFinite(pessoa?.variacao)) return Math.sign(pessoa.variacao);
    return deltaPosFallback(pessoa?.nome, posAtual);
  };

  const getIcone = (pessoa, posAtual) => {
    const d = resolveDelta(pessoa, posAtual);
    if (d > 0) return <img src={IconGanhou} alt="Ganhou posição" className="w-5 h-5" />;
    if (d < 0) return <img src={IconPerdeu} alt="Perdeu posição" className="w-5 h-5" />;
    return <img src={IconManteve} alt="Manteve posição" className="w-5 h-5" />;
  };

  useEffect(() => {
    if (modoPrint) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(nomesAtuais)); } catch {}
  }, [nomesAtuais, modoPrint]);

  if (!dadosOrdenados.length) return null;

  return (
    <div className="w-full bg-gray-100 pb-0">
      <div className="w-full">
        <img src={HeaderTwitterImage} alt="Ranking Twitter Header" className="w-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {dadosOrdenados.map((pessoa, index) => {
          const pos = index + 1;
          const isPrimeiro = index === 0;

          return (
            <div
              key={`${pessoa.nome}-${index}`}
              className={`flex items-center justify-between p-3 shadow hover:scale-[1.01] transition rounded-full ${isPrimeiro ? 'bg-[#FEBD11]' : 'bg-white'}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg font-extrabold w-6 text-right">{pos}º</div>
                <img
                  src={pessoa.foto || '/placeholder.png'}
                  alt={pessoa.nome}
                  className={`rounded-full object-cover border-2 ${isPrimeiro ? 'w-10 h-10 border-[#F7901E]' : 'w-10 h-10 border-white'}`}
                />
                <div>
                  <p className="font-semibold text-sm max-w-[160px] whitespace-normal break-words leading-tight">{pessoa.nome}</p>
                  {pessoa.cargo && <p className="text-xs text-gray-500 max-w-[160px] whitespace-normal break-words leading-tight">{pessoa.cargo}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getIcone(pessoa, pos)}
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${isPrimeiro ? 'bg-[#F7901E] text-white' : 'bg-gray-300 text-black'}`}>
                  {(pessoa.seguidores ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto flex justify-center mt-12">
        <img src={LegendaImage} alt="Legenda" className="h-10 w-auto" />
      </div>

      <div className="w-full">
        <img src={FooterRankingImage} alt="Ranking Footer" className="w-full object-cover" />
      </div>
    </div>
  );
};

export default RankingTwitter;