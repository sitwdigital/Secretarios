import { useEffect, useMemo } from 'react';

import HeaderFacebookImage from '/src/assets/header_Relatorio_Facebook.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA.svg';

import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const LS_KEY = 'rankingFacebook_prev'; // guarda a ordem anterior (lista de nomes 1..N)

const RankingFacebook = ({ dados = [] }) => {
  if (!dados.length) return null;

  // 1) Ordena por seguidores (desc) e corta no top 33
  const dadosOrdenados = useMemo(
    () => [...dados].sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0)).slice(0, 33),
    [dados]
  );

  // 2) Ordem atual (nomes)
  const nomesAtuais = useMemo(() => dadosOrdenados.map(p => p.nome), [dadosOrdenados]);

  // 3) Ordem anterior salva no localStorage
  const prevOrder = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }, []);

  // 4) Mapa nome -> posição anterior (1-based)
  const prevPos = useMemo(() => {
    const m = new Map();
    prevOrder.forEach((nome, i) => m.set(nome, i + 1));
    return m;
  }, [prevOrder]);

  // 5) +1 subiu | -1 desceu | 0 manteve (comparando posições)
  const deltaPos = (nome, posAtual) => {
    const posAnterior = prevPos.get(nome);
    if (!posAnterior) return 0; // sem histórico
    const diff = posAnterior - posAtual; // positivo = posição menor (subiu)
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

  // 6) Depois de montar, salva a ordem atual para a próxima comparação
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(nomesAtuais)); } catch {}
  }, [nomesAtuais]);

  // 7) Quebra em 3 colunas (11 por coluna)
  const col1 = dadosOrdenados.slice(0, 11);
  const col2 = dadosOrdenados.slice(11, 22);
  const col3 = dadosOrdenados.slice(22, 33);

  const linhas = Array.from({ length: 11 }, (_, i) => ({
    esquerda: col1[i],
    centro:   col2[i],
    direita:  col3[i],
  }));

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img src={HeaderFacebookImage} alt="Ranking Facebook Header" className="w-full object-cover" />
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-3 px-4 sm:grid-cols-1">
        {linhas.map((linha, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {linha.esquerda && (
              <CardPessoa
                pessoa={linha.esquerda}
                posicao={i + 1}
                getIcone={getIcone}
              />
            )}
            {linha.centro && (
              <CardPessoa
                pessoa={linha.centro}
                posicao={i + 12}
                getIcone={getIcone}
              />
            )}
            {linha.direita && (
              <CardPessoa
                pessoa={linha.direita}
                posicao={i + 23}
                getIcone={getIcone}
              />
            )}
          </div>
        ))}
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

// Card reutilizável (recebe getIcone(nome, posicao))
const CardPessoa = ({ pessoa, posicao, getIcone }) => {
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
        {getIcone(pessoa.nome, posicao)}
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
};

export default RankingFacebook;