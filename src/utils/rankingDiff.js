// src/utils/rankingDiff.js

export function slugifyNome(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function orderAndIndex(list, getScore) {
  const ordered = [...list].sort((a, b) => getScore(b) - getScore(a));
  const posMap = new Map();
  ordered.forEach((p, i) => posMap.set(slugifyNome(p.nome), i + 1));
  return { ordered, posMap };
}

export function computeDelta(prevPosMap, currPosMap) {
  const deltaMap = new Map();
  for (const [slug, currPos] of currPosMap.entries()) {
    const prevPos = prevPosMap?.get(slug);

    if (prevPos !== undefined) {
      // candidato já existia → calcula diferença de posição
      deltaMap.set(slug, prevPos - currPos);
    } else {
      // candidato novo → marca como null
      deltaMap.set(slug, null);
    }
  }
  return deltaMap;
}

// aplica variacao + flag "novo"
export function applyDelta(list, deltaMap) {
  return list.map((p) => {
    const slug = slugifyNome(p.nome);
    const delta = deltaMap.get(slug);

    return {
      ...p,
      variacao: delta ?? 0,   // diferença de posição
      novo: delta === null,   // flag para candidatos novos
    };
  });
}