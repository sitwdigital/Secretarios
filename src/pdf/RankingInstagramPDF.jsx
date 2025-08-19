// src/pdf/RankingInstagramPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Insta.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f3f4f6",
    flex: 1,
    position: "relative", // necessário para usar absolute no footer
  },
  header: { width: "100%" },
  footer: {
    width: "100%",
    position: "absolute", // 🔑 fixo no fim da página
    bottom: 0,
  },
  legenda: {
    width: "100%",
    alignItems: "center",
    marginVertical: 6,
  },

  gridLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  // Cards menores
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 3,
    borderRadius: 18,
    marginHorizontal: 2,
  },
  posicao: { fontSize: 7, fontWeight: "bold", marginRight: 3 },
  foto: { width: 18, height: 18, borderRadius: 9, marginRight: 3 },
  nomeCargo: { flexDirection: "column", maxWidth: 80 },
  nome: { fontSize: 7, fontWeight: "semibold" },
  cargo: { fontSize: 6, color: "gray" },
  seguidoresBox: {
    fontSize: 7,
    fontWeight: "bold",
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 6,
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

      {/* Conteúdo */}
      <View style={{ marginTop: 6, marginBottom: 60 /* deixa espaço pro footer */ }}>
        {linhas.map((linha, i) => (
          <View key={i} style={styles.gridLinha}>
            <CardPessoaPDF pessoa={linha.esquerda} posicao={i + 1} />
            <CardPessoaPDF pessoa={linha.centro} posicao={i + 12} />
            <CardPessoaPDF pessoa={linha.direita} posicao={i + 23} />
          </View>
        ))}

        <View style={styles.legenda}>
          <Image src={legendaImg} style={{ height: 15 }} />
        </View>
      </View>

      {/* Footer fixo */}
      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingInstagramPDF;
