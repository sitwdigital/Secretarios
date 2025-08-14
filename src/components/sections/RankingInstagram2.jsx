import { useEffect, useMemo } from 'react';

import HeaderInstagramImage from '/src/assets/header_Relatorio_Insta.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg';

import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const LS_KEY = 'rankingInstagram2_prev';

const RankingInstagram2 = ({ dados = [], modoPrint = false }) => {
  if (!dados.length) return null;

  const segundaMetade = useMemo(
    () => [...dados].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0)).slice(33, 66),
    [dados]
  );

  const nomesAtuais = useMemo(() => segundaMetade.map(p => p.nome), [segundaMetade]);

  const prevOrder = useMemo(() => {
    if (modoPrint) return [];
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }, [modoPrint]);

  const prevPos = useMemo(() => {
    const m = new Map();
    prevOrder.forEach((nome, i) => m.set(nome, i + 34));
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
      <div className="w-full">
        <img src={HeaderInstagramImage} alt="Ranking Instagram Header 2" className="w-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-3 px-4 sm:grid-cols-1">
        {linhas.map((linha, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {linha.esquerda && <CardPessoa pessoa={linha.esquerda} posicao={i + 34} getIcone={getIcone} />}
            {linha.centro   && <CardPessoa pessoa={linha.centro}   posicao={i + 45} getIcone={getIcone} />}
            {linha.direita  && <CardPessoa pessoa={linha.direita}  posicao={i + 56} getIcone={getIcone} />}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex justify-center mt-12">
        <img src={LegendaImage} alt="Legenda" className="h-10 w-auto" />
      </div>

      <div className="w-full">
        <img src={FooterRankingImage} alt="Ranking Footer 2" className="w-full object-cover" />
      </div>
    </div>
  );
};

const CardPessoa = ({ pessoa, posicao, getIcone }) => (
  <div className="bg-white rounded-full flex items-center justify-between p-3 shadow hover:scale-[1.01] transition">
    <div className="flex items-center gap-3">
      <div className="text-lg font-extrabold w-6 text-right">{posicao}º</div>
      <img
        src={pessoa.foto || '/placeholder.png'}
        alt={pessoa.nome}
        className="w-10 h-10 rounded-full object-cover border-2 border-white"
      />
      <div>
        <p className="font-semibold text-sm max-w-[160px] whitespace-normal break-words leading-tight">{pessoa.nome}</p>
        {pessoa.cargo && <p className="text-xs text-gray-500 max-w-[160px] whitespace-normal break-words leading-tight">{pessoa.cargo}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {getIcone(pessoa, posicao)}
      <div className="bg-gray-300 text-black text-sm font-bold px-3 py-1 rounded-full">
        {(pessoa.seguidores ?? 0).toLocaleString()}
      </div>
    </div>
  </div>
);

export default RankingInstagram2;