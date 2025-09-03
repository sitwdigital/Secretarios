// src/shared/calcVariacao.js

// --- helpers de ordenação/delta --------------------------------------------
export function slugifyNome(str = '') {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Cria um Map nome->posição (1-based) com base na lista ordenada por scoreFn.
 * Também devolve a lista já ordenada.
 */
export function orderAndIndex(list = [], scoreFn = () => 0) {
  const ordered = [...(list || [])].sort((a, b) => (scoreFn(b) - scoreFn(a)));
  const posMap = new Map();
  ordered.forEach((p, i) => posMap.set(slugifyNome(p?.nome ?? ''), i + 1));
  return { ordered, posMap };
}

/**
 * Compara posições de dois mapas (prevPosMap e currPosMap) e devolve Map slug->delta.
 * delta = posAnterior - posAtual (positivo = subiu; negativo = desceu).
 * Se não existia antes → marca como null (novo candidato).
 */
export function computeDelta(prevPosMap = new Map(), currPosMap = new Map()) {
  const deltaMap = new Map();
  for (const [slug, currPos] of currPosMap.entries()) {
    const prevPos = prevPosMap.get(slug);
    if (prevPos) {
      deltaMap.set(slug, prevPos - currPos); // existente → delta normal
    } else {
      deltaMap.set(slug, null); // 👈 novo candidato
    }
  }
  return deltaMap;
}

/**
 * Aplica (in-place) a propriedade "variacao" e a flag "novo"
 * na lista base, usando um Map slug->delta.
 */
export function applyDeltaInPlace(list = [], deltaMap = new Map()) {
  list.forEach((p) => {
    const slug = slugifyNome(p?.nome ?? "");
    const delta = deltaMap.get(slug);

    p.variacao = delta ?? 0;
    p.novo = delta === null; // 👈 flag para novos candidatos
  });
}

/**
 * Aplica variações em todos os blocos de dados (ganho, instagram, facebook, twitter).
 */
export function aplicarVariacoesEmTudo(dadosAtuais = {}, snapshotAnterior = {}) {
  const {
    rankingGanho = [],
    instagram = [],
    facebook  = [],
    twitter   = [],
  } = dadosAtuais;

  const {
    rankingGanho: prevGanho = [],
    instagram:    prevIG    = [],
    facebook:     prevFB    = [],
    twitter:      prevTW    = [],
  } = snapshotAnterior || {};

  // ---- Ranking de ganho -----------------------------------------------------
  const { posMap: currGanhoPos } = orderAndIndex(rankingGanho, x => Number(x?.ganho ?? 0));
  const { posMap: prevGanhoPos } = orderAndIndex(prevGanho,    x => Number(x?.ganho ?? 0));
  const deltaGanho = computeDelta(prevGanhoPos, currGanhoPos);
  applyDeltaInPlace(rankingGanho, deltaGanho);

  // ---- Instagram ------------------------------------------------------------
  const { posMap: currIGPos } = orderAndIndex(instagram, x => Number(x?.seguidores ?? 0));
  const { posMap: prevIGPos } = orderAndIndex(prevIG,    x => Number(x?.seguidores ?? 0));
  const deltaIG = computeDelta(prevIGPos, currIGPos);
  applyDeltaInPlace(instagram, deltaIG);

  // ---- Facebook -------------------------------------------------------------
  const { posMap: currFBPos } = orderAndIndex(facebook, x => Number(x?.seguidores ?? 0));
  const { posMap: prevFBPos } = orderAndIndex(prevFB,   x => Number(x?.seguidores ?? 0));
  const deltaFB = computeDelta(prevFBPos, currFBPos);
  applyDeltaInPlace(facebook, deltaFB);

  // ---- Twitter --------------------------------------------------------------
  const { posMap: currTWPos } = orderAndIndex(twitter, x => Number(x?.seguidores ?? 0));
  const { posMap: prevTWPos } = orderAndIndex(prevTW,  x => Number(x?.seguidores ?? 0));
  const deltaTW = computeDelta(prevTWPos, currTWPos);
  applyDeltaInPlace(twitter, deltaTW);

  return dadosAtuais;
}