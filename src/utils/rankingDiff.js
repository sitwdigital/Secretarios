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
  const ordered = [...list].sort((a, b) => (getScore(b) - getScore(a)));
  const posMap = new Map();
  ordered.forEach((p, i) => posMap.set(slugifyNome(p.nome), i + 1));
  return { ordered, posMap };
}


export function computeDelta(prevPosMap, currPosMap) {
  const deltaMap = new Map();
  for (const [slug, currPos] of currPosMap.entries()) {
    const prevPos = prevPosMap?.get(slug);
    const delta = prevPos ? (prevPos - currPos) : 0; // se não existia, 0
    deltaMap.set(slug, delta);
  }
  return deltaMap;
}

// aplica a propriedade "variacao" no array de pessoas de acordo com deltaMap (por slug)
export function applyDelta(list, deltaMap) {
  return list.map((p) => {
    const slug = slugifyNome(p.nome);
    return { ...p, variacao: deltaMap.get(slug) ?? 0 };
  });
}