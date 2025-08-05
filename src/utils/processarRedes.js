export default function processarRedes(insta, face, tw, planilha4 = []) {
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

  const rankingGanho = planilha4
    .filter(row => row['GANHO DE SEGUIDORES']) // somente linhas válidas
    .map(row => ({
      nome: row['SECRETÁRIO']?.trim(),
      ganho: parseFloat(row['GANHO DE SEGUIDORES']) || 0,
      cargo: '', // você pode popular com outro campo se quiser
    }))
    .sort((a, b) => b.ganho - a.ganho)
    .slice(0, 10); // pega os 10 maiores

  return {
    top10: [...lista].sort((a, b) => b.total - a.total).slice(0, 10),
    instagram: [...lista].sort((a, b) => b.instagram - a.instagram).reverse(),
    facebook: [...lista].sort((a, b) => b.facebook - a.facebook).reverse(),
    twitter: [...lista].sort((a, b) => b.twitter - a.twitter).reverse(),
    rankingGanho,
  };
}
