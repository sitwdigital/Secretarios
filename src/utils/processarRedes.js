// src/utils/processarRedes.js
export default function processarRedes(insta, face, tw, somaSeguidores = []) {
  const mapa = new Map();

  const somar = (arr, rede) => {
    arr.forEach(item => {
      const nome = item['SECRETÁRIO']?.trim();
      const seguidores = parseFloat(item['SEGUIDORES']) || 0;

      if (!mapa.has(nome)) {
        mapa.set(nome, {
          nome,
          instagram: 0,
          facebook: 0,
          twitter: 0,
          total: 0,
        });
      }

      const obj = mapa.get(nome);
      obj[rede] = seguidores;
      obj.total = obj.instagram + obj.facebook + obj.twitter;
    });
  };

  somar(insta, 'instagram');
  somar(face, 'facebook');
  somar(tw, 'twitter');

  const lista = Array.from(mapa.values());

  // ✅ Usa a aba "SOMA SEGUIDORES" com cabeçalho fixo
  const rankingGanho = somaSeguidores
    .filter(row => row['NOME'] && row['SOMA'])
    .map(row => ({
      nome: String(row['NOME']).trim(),
      ganho: parseFloat(row['SOMA']) || 0,
      cargo: '',
    }))
    .sort((a, b) => b.ganho - a.ganho)
    .slice(0, 10);

  return {
    top10: [...lista].sort((a, b) => b.total - a.total).slice(0, 10),
    instagram: [...lista].sort((a, b) => b.instagram - a.instagram).reverse(),
    facebook: [...lista].sort((a, b) => b.facebook - a.facebook).reverse(),
    twitter: [...lista].sort((a, b) => b.twitter - a.twitter).reverse(),
    rankingGanho,
  };
}
