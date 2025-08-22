export default function processarEngajados(dados = []) {
  return dados
    .filter(row => row['NOME'] && row['ENGAJAMENTO'])
    .map((row, i) => {
      const nome = String(row['NOME']).trim();
      const engajamentoStr = String(row['ENGAJAMENTO']).replace("%", "").trim();
      const engajamento = parseFloat(engajamentoStr.replace(",", ".")) / 100; // transforma 9,04% -> 0.0904

      return {
        id: i + 1,
        nome,
        engajamento,
        foto: row['FOTO'] || null,  
      };
    })
    .sort((a, b) => b.engajamento - a.engajamento);
}
