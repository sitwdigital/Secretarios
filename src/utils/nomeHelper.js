// src/utils/nomeHelper.js

/**
 * Corrige o nome do secretário Luís Fernando para Luis Fernando (sem acento)
 * de forma case-insensitive e tolerante a variações de acentuação.
 * @param {string} nome 
 * @returns {string}
 */
export function corrigirNome(nome) {
  if (!nome) return '';
  const nomeStr = String(nome).trim();
  const norm = nomeStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (norm === "luis fernando") {
    return "Luis Fernando";
  }
  return nomeStr;
}
