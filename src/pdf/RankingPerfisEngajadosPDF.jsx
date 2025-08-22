// src/pdf/RankingPerfisEngajadosPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/Perfismaisengajados.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const iconInsta = "/pdf-assets/instagram.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "AMSIPRO",
    paddingBottom: 40,
    position: "relative",
  },
  header: { width: "100%" },
  footer: { width: "100%", position: "absolute", bottom: 0, left: 0 },

  title: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "bold",
  },

  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 40,
    height: 220,
    borderLeft: "1pt solid #ccc", // eixo Y
    borderBottom: "1pt solid #ccc", // eixo X
    paddingBottom: 20,
    position: "relative",
  },
  // linhas horizontais de referência
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#ddd",
  },
  yLabel: {
    position: "absolute",
    left: -30,
    fontSize: 8,
    color: "#666",
  },

  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  foto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 3,
  },
  bar: {
    width: 26,
    backgroundColor: "#F77737",
    borderRadius: 6,
  },
  nome: {
    fontSize: 8,
    marginTop: 6,
    textAlign: "center",
    maxWidth: 60,
  },
});

const RankingPerfisEngajadosPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const engajados = dados.slice(0, 10); // top 10
  const max = Math.max(...engajados.map((e) => e.engajamento));

  // pontos de escala do eixo Y
  const ySteps = [0, 0.03, 0.05, 0.07, 0.1];

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <Image src={headerImg} style={styles.header} />

      <Text style={styles.title}>Perfis mais engajados no Instagram</Text>

      {/* Gráfico com linhas e eixo Y */}
      <View style={{ flexDirection: "row", marginHorizontal: 40, height: 240 }}>
        {/* Labels do eixo Y */}
        <View style={{ width: 30, justifyContent: "space-between" }}>
          {ySteps.slice().reverse().map((y, i) => (
            <Text key={i} style={{ fontSize: 8, color: "#444" }}>
              {(y * 100).toFixed(0)}%
            </Text>
          ))}
        </View>

        {/* Área do gráfico */}
        <View style={{ flex: 1, position: "relative" }}>
          {/* linhas horizontais */}
          {ySteps.map((y, i) => (
            <View
              key={i}
              style={[
                styles.gridLine,
                { bottom: (y / Math.max(...ySteps)) * 200 },
              ]}
            />
          ))}

          {/* Barras */}
          <View style={{ flexDirection: "row", alignItems: "flex-end", height: "100%" }}>
            {engajados.map((p, i) => (
              <View key={i} style={styles.barContainer}>
                {/* Foto em cima da barra */}
                {p.foto ? (
                  <Image src={p.foto} style={styles.foto} />
                ) : (
                  <Image src={iconInsta} style={styles.foto} />
                )}

                {/* Barra proporcional */}
                <View
                  style={[
                    styles.bar,
                    { height: (p.engajamento / max) * 160 },
                  ]}
                />

                {/* Nome embaixo */}
                <Text style={styles.nome}>{p.nome}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Footer */}
      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingPerfisEngajadosPDF;
