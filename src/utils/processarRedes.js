export default function processarRedes(insta, face, tw, somaSeguidores = []) {
  const mapa = new Map();

  // Lista fixa de pessoas verificadas
  const verificados = [
    "Orleans Brandão", 
    "Tiago Fernandes",
    "Jandira Dias",
    "Vinícius Ferro",
    "Cricielle Muniz",
    "Rubens Pereira",
    "Yuri Arruda",
    "Fábio Gentil",
    "Abigail Cunha",
    "Bira do Pindaré",
    "Karen Taveira Barros",
    "Adriano Sarney",
    "Sebastião Madeira",
    "Maurício Martins",
    "Junior Marreca",
    "Coronel Célio Roberto",
    "Gabriel Tenorio",
    "Cassiano Pereira",
    "Wolmer Araújo",
    "Natassia Weba",
    "Sérgio Macedo",
    "Raul Cancian",
    "Zé Reinaldo Tavares",
    "Anderson Ferreira",
    "Cauê Aragão",
    "Raysa Maciel",
    "Alberto Bastos",
    "Washigtong Oliveira",
    "Leandro Costa",
  ];

  // Função para acumular seguidores (SECRETÁRIO → Instagram/Facebook/Twitter)
  const somar = (arr, rede) => {
    arr.forEach(item => {
      const nome = String(item['SECRETÁRIO'] || "").trim();
      const seguidores = parseFloat(item['SEGUIDORES']) || 0;
      if (!nome) return;

      if (!mapa.has(nome)) {
        mapa.set(nome, {
          nome,
          instagram: 0,
          facebook: 0,
          twitter: 0,
          total: 0,
          verificado: verificados.includes(nome), // usa SECRETÁRIO
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

  // Ranking de ganho de seguidores (NOME → planilha soma)
  const rankingGanho = somaSeguidores
    .filter(row => row['NOME'] && row['SOMA'])
    .map(row => {
      const nome = String(row['NOME']).trim();
      return {
        nome,
        ganho: parseFloat(row['SOMA']) || 0,
        cargo: '',
        verificado: verificados.includes(nome), // usa NOME
      };
    })
    .sort((a, b) => b.ganho - a.ganho)
    .slice(0, 10);

  return {
    top10: [...lista].sort((a, b) => b.total - a.total).slice(0, 10),

    // rankings por rede → já com campo verificado correto
    instagram: [...lista].sort((a, b) => b.instagram - a.instagram),
    facebook: [...lista].sort((a, b) => b.facebook - a.facebook),
    twitter: [...lista].sort((a, b) => b.twitter - a.twitter),

    rankingGanho,
  };
}