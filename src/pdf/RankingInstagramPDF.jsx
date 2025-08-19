// src/pdf/RankingInstagramPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Insta.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f3f4f6",
    paddingBottom: 0,
    position: "relative", // necessário para fixar o footer
  },
  header: { width: "100%" }, 
  footer: { 
    width: "100%", 
    position: "absolute", // fixa no fim da página
    bottom: 0, 
    left: 0 
  },
  legenda: { 
    width: "100%", 
    alignItems: "center", 
    marginVertical: -32
  },

  gridLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingHorizontal: 150, // margem lateral só nos cards
  },

  // 🔽 Cards mais estreitos
  card: {
    width: "32%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 3,
    borderRadius: 18,
    marginHorizontal: 2,
  },
  posicao: { fontSize: 9, fontWeight: "bold", marginRight: 4 },
  foto: { width: 22, height: 22, borderRadius: 11, marginRight: 4 },
  nomeCargo: { flexDirection: "column", maxWidth: 90 },
  nome: { fontSize: 7, },
  cargo: { fontSize: 6, color: "gray" },
  seguidoresBox: {
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: "center",
  },
});

// ====== Card
const CardPessoaPDF = ({ pessoa, posicao }) => {
  if (!pessoa) return null;
  const isPrimeiro = posicao === 1;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isPrimeiro ? "#FEBD11" : "white" },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.posicao}>{posicao}º</Text>
        {pessoa.foto && <Image src={pessoa.foto} style={styles.foto} />}
        <View style={styles.nomeCargo}>
          <Text style={styles.nome}>{pessoa.nome}</Text>
          {pessoa.cargo && <Text style={styles.cargo}>{pessoa.cargo}</Text>}
        </View>
      </View>
      <Text
        style={[
          styles.seguidoresBox,
          {
            backgroundColor: isPrimeiro ? "#F7901E" : "#d1d5db",
            color: isPrimeiro ? "white" : "black",
          },
        ]}
      >
        {(pessoa?.seguidores ?? 0).toLocaleString("pt-BR")}
      </Text>
    </View>
  );
};

// ====== Página Ranking Instagram
const RankingInstagramPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const top33 = [...dados]
    .sort((a, b) => (b?.seguidores ?? 0) - (a?.seguidores ?? 0))
    .slice(0, 33);

  const col1 = top33.slice(0, 11);
  const col2 = top33.slice(11, 22);
  const col3 = top33.slice(22, 33);

  const linhas = Array.from({ length: 11 }, (_, i) => ({
    esquerda: col1[i],
    centro: col2[i],
    direita: col3[i],
  }));

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <Image src={headerImg} style={styles.header} />

      {/* Cards */}
      <View style={{ marginTop: 8, marginBottom: 40 /* reserva espaço pro footer */ }}>
        {linhas.map((linha, i) => (
          <View key={i} style={styles.gridLinha}>
            <CardPessoaPDF pessoa={linha.esquerda} posicao={i + 1} />
            <CardPessoaPDF pessoa={linha.centro} posicao={i + 12} />
            <CardPessoaPDF pessoa={linha.direita} posicao={i + 23} />
          </View>
        ))}
      </View>

      {/* Legenda */}
      <View style={styles.legenda}>
        <Image src={legendaImg} style={{ height: 15 }} />
      </View>

      {/* Footer fixo */}
      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingInstagramPDF;
