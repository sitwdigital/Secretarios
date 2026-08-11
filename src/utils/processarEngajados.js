import { corrigirNome } from './nomeHelper';

export default function processarEngajados(dados = []) {
  return dados
    .map((row, i) => {
      const nome = corrigirNome(String(row['NOME'] || row['SECRETÁRIO'] || row['SECRETÁRIOS'] || row['SECRETARIO'] || "").trim());
      const engajamentoRaw = row['ENGAJAMENTO'] || row['ENGAJAMENTO%'] || row['TAXA DE ENGAJAMENTO'] || row['TAXA'];
      if (!nome || engajamentoRaw === undefined) return null;

      const engajamentoStr = String(engajamentoRaw).replace("%", "").trim();
      const engajamento = parseFloat(engajamentoStr.replace(",", ".")) / (engajamentoStr.includes("%") ? 100 : 1); 

      return {
        id: i + 1,
        nome,
        engajamento: isNaN(engajamento) ? 0 : engajamento,
        foto: row['FOTO'] || null,  
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.engajamento - a.engajamento);
}
