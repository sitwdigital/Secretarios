// src/utils/processarRedes.js
function normalizarNome(nome) {
  return String(nome || "")
    .normalize("NFD")                 // separa acentos (ex.: "é" -> "é")
    .replace(/[\u0300-\u036f]/g, "")  // remove acentos
    .trim()                           // remove espaços extras
    .toLowerCase();                   // tudo minúsculo
}

export default function processarRedes(insta, face, tw, somaSeguidores = []) {
  const mapa = new Map();

  // Lista fixa de verificados (já normalizada)
  const verificados = [
    "Fábio Gentil","Yuri Arruda","Orleans Brandão","França do Macaquinho",
    "Abigail Cunha", "Karen Barros","Adriano Sarney","Tiago Fernandes",
    "Cricielle Muniz","Sebastião Madeira","Maurício Martins","Junior Marreca",
    "Coronel Célio Roberto","Gabriel Tenorio","Diego Rolim","Cassiano Pereira",
    "Rubens Pereira","Pedro Chagas","Natassia Weba","Sérgio Macedo",
    "Zé Reinaldo Tavares","Marcello Dualibe","Anderson Ferreira",
    "Vinícius Ferro","Cauê Aragão","Alberto Bastos","Washington Oliveira"
  ].map(normalizarNome);

  // Função para acumular seguidores (SECRETÁRIO → Instagram/Facebook/Twitter)
  const somar = (arr, rede) => {
    arr.forEach(item => {
      const nomeOriginal = String(item['SECRETÁRIO'] || "").trim();
      const nomeNorm = normalizarNome(nomeOriginal);
      const seguidores = parseFloat(item['SEGUIDORES']) || 0;
      if (!nomeNorm) return;

      if (!mapa.has(nomeNorm)) {
        mapa.set(nomeNorm, {
          nome: nomeOriginal, // mantém original para exibir
          instagram: 0,
          facebook: 0,
          twitter: 0,
          total: 0,
          verificado: verificados.includes(nomeNorm),
        });
      }

      const obj = mapa.get(nomeNorm);
      obj[rede] = seguidores;
      obj.total = obj.instagram + obj.facebook + obj.twitter;
    });
  };

  somar(insta, 'instagram');
  somar(face, 'facebook');
  somar(tw, 'twitter');

  const lista = Array.from(mapa.values());

  // Ranking de ganho de seguidores (planilha SOMA SEGUIDORES → usa coluna NOME)
  const rankingGanho = somaSeguidores
    .filter(row => row['NOME'] && row['SOMA'])
    .map(row => {
      const nomeOriginal = String(row['NOME']).trim();
      const nomeNorm = normalizarNome(nomeOriginal);
      return {
        nome: nomeOriginal,
        ganho: parseFloat(row['SOMA']) || 0,
        cargo: '',
        verificado: verificados.includes(nomeNorm),
      };
    })
    .sort((a, b) => b.ganho - a.ganho)
    .slice(0, 10);

  return {
    top10: [...lista].sort((a, b) => b.total - a.total).slice(0, 10),
    instagram: [...lista].sort((a, b) => b.instagram - a.instagram),
    facebook: [...lista].sort((a, b) => b.facebook - a.facebook),
    twitter: [...lista].sort((a, b) => b.twitter - a.twitter),
    rankingGanho,
  };
}