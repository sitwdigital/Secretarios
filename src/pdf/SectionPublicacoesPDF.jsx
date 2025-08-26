// src/pdf/SectionPublicacoesPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Insta.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    paddingBottom: 40,
  },
  header: { width: "100%" },
  footer: { width: "100%", position: "absolute", bottom: 0, left: 0 },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "bold",
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },
  card: {
    width: 120,
    border: "1pt solid #ddd",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  foto: {
    width: "100%",
    height: 80,
    objectFit: "cover",
  },
  nome: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "bold",
  },
  posicao: {
    fontSize: 8,
    textAlign: "center",
    marginBottom: 6,
    color: "#555",
  },
});

const SectionPublicacoesPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const dadosOrdenados = [...dados].sort(
    (a, b) => (b?.POSICAO ?? 0) - (a?.POSICAO ?? 0)
  );

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={headerImg} style={styles.header} />
      <Text style={styles.title}>Publicações mais engajadas no Instagram</Text>

      <View style={styles.cardsRow}>
        {dadosOrdenados.slice(0, 5).map((item, index) => (
          <View key={index} style={styles.card}>
            {/* 🚀 Aqui já vem Base64 pronto (graças ao ExportPDFButton) */}
            <Image src={item?.FOTO || "/placeholder.png"} style={styles.foto} />
            <Text style={styles.nome}>
              {index + 1}º {item?.NOME}
            </Text>
            <Text style={styles.posicao}>Engajamento: {item?.POSICAO}</Text>
          </View>
        ))}
      </View>

      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default SectionPublicacoesPDF;