// src/utils/processarPublicacoes.js
const processarPublicacoes = (linhas = []) => {
  return linhas.map((linha, i) => ({
    item: linha["ITEM"] ?? i + 1,
    nome: linha["NOME"] ?? "",
    posicao: Number(linha["POSIÇÃO"] ?? 0),
    foto: linha["FOTO"] ?? "", 
  }));
};

export default processarPublicacoes;
