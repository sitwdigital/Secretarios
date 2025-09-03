// src/components/sections/RankingGanhoSeguidores.jsx
import React, { useEffect, useMemo } from 'react';

import HeaderRankingImage from '/src/assets/header_Relatorio_Ranking.svg';
import FooterRankingImage from '/src/assets/footer_Relatorio.svg';
import LegendaImage from '/src/assets/LEGENDA_2.svg';

import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

import { fotoPorNome } from '../../utils/fotoCatalog';

const LS_KEY = 'rankingGanho_prev'; // lista de nomes em ordem (1..10)

const RankingGanhoSeguidores = ({ dados = [], modoPrint = false }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  // nomes na ordem atual (assumindo que 'dados' já vem ordenado por ganho desc)
  const nomesAtuais = useMemo(() => dados.map(d => d?.nome ?? ''), [dados]);

  // ordem anterior só quando NÃO estiver em modo print
  const prevOrder = useMemo(() => {
    if (modoPrint) return [];
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
      return [];
    }
  }, [modoPrint]);

  // mapa nome -> posição anterior (1-based)
  const prevPos = useMemo(() => {
    const m = new Map();
    prevOrder.forEach((nome, i) => m.set(nome, i + 1));
    return m;
  }, [prevOrder]);

  // fallback legado por posição
  const deltaPosFallback = (nome, posAtual) => {
    const posAnterior = prevPos.get(nome);
    if (!posAnterior) return 0;
    const diff = posAnterior - posAtual; // positivo => subiu
    if (diff > 0) return 1;
    if (diff < 0) return -1;
    return 0;
  };

  // resolve delta priorizando o campo "variacao" já calculado (servidor/print)
  const resolveDelta = (pessoa, posAtual) => {
    // 👇 prioridade: se for novo, sempre ganha
    if (pessoa?.novo) return 1;

    const v = pessoa?.variacao;
    if (typeof v === 'number' && Number.isFinite(v)) {
      const s = Math.sign(v);
      return s === 0 ? 0 : s > 0 ? 1 : -1;
    }
    return deltaPosFallback(pessoa?.nome, posAtual);
  };

  const getIcone = (pessoa, posAtual) => {
    const d = resolveDelta(pessoa, posAtual);
    if (d > 0) return <img src={IconGanhou} alt="Ganhou posição" className="w-5 h-5" />;
    if (d < 0) return <img src={IconPerdeu} alt="Perdeu posição" className="w-5 h-5" />;
    return <img src={IconManteve} alt="Manteve posição" className="w-5 h-5" />;
  };

  const resolveFoto = (pessoa) =>
    pessoa?.foto || fotoPorNome(pessoa?.nome) || '/placeholder.png';

  // salva ordem atual somente quando não estiver imprimindo
  useEffect(() => {
    if (modoPrint) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(nomesAtuais));
    } catch {}
  }, [nomesAtuais, modoPrint]);

  // duas colunas (1–5) (6–10)
  const esquerda = useMemo(() => dados.slice(0, 5), [dados]);
  const direita  = useMemo(() => dados.slice(5, 10), [dados]);

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img src={HeaderRankingImage} alt="Ranking Header" className="w-full object-cover" />
      </div>

      {/* Título */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <h3 className="text-[25px] font-bold text-center">Soma de seguidores nas redes</h3>
      </div>

      {/* Grid 2 colunas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 mt-8 md:grid-cols-2 gap-4 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="contents" key={i}>
            {/* 1..5 */}
            {esquerda[i] && (
              <div className="bg-white rounded-full flex items-center justify-between p-4 shadow hover:scale-[1.01] transition">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-extrabold w-8 text-right">{i + 1}º</div>
                  <img
                    src={resolveFoto(esquerda[i])}
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
                  {getIcone(esquerda[i], i + 1)}
                  <div className="bg-gray-300 text-black text-sm font-bold px-4 py-2 rounded-full">
                    {Number(esquerda[i].ganho || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* 6..10 */}
            {direita[i] && (
              <div className="bg-white rounded-full flex items-center justify-between p-4 shadow hover:scale-[1.01] transition">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-extrabold w-8 text-right">{i + 6}º</div>
                  <img
                    src={resolveFoto(direita[i])}
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
                  {getIcone(direita[i], i + 6)}
                  <div className="bg-gray-300 text-black text-sm font-bold px-4 py-2 rounded-full">
                    {Number(direita[i].ganho || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="max-w-7xl mx-auto flex justify-center mt-12 mb-6">
        <img src={LegendaImage} alt="Legenda" className="h-10 w-auto" />
      </div>

      {/* Footer */}
      <div className="w-full">
        <img src={FooterRankingImage} alt="Ranking Footer" className="w-full object-cover" />
      </div>
    </div>
  );
};

export default RankingGanhoSeguidores;