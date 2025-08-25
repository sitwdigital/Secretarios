// src/pdf/RankingPerfisEngajadosPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/Perfismaisengajados.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const iconInsta = "/pdf-assets/instagram.png";

const normalizarNome = (nome) =>
  nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

const getFotoPath = (nome) => `/fotos_secretarios/${normalizarNome(nome)}.jpg`;

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
    marginHorizontal: 40,
    height: 200, // apenas área das barras
    borderLeft: "1pt solid #ccc",
    borderBottom: "1pt solid #ccc",
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 30, // depois do eixo Y
    right: 0,
    height: 1,
    backgroundColor: "#ddd",
  },
  yAxis: {
    width: 30,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 2,
  },
  yLabel: {
    fontSize: 8,
    color: "#444",
  },
  plotArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end", // barras sobem a partir da linha 0%
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  foto: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 3,
    objectFit: "cover",
  },
  bar: {
    width: 24,
    backgroundColor: "#F77737",
    borderRadius: 6,
  },
  nomeRow: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginTop: 4,
  },
  nome: {
    flex: 1,
    fontSize: 8,
    textAlign: "center",
    maxWidth: 60,
  },
});

const RankingPerfisEngajadosPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const engajados = dados.slice(0, 10);
  const max = Math.max(...engajados.map((e) => e.engajamento));
  const ySteps = [0, 0.03, 0.05, 0.07, 0.1];

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={headerImg} style={styles.header} />

      <Text style={styles.title}>Perfis mais engajados no Instagram</Text>

      {/* Gráfico (Eixo Y + Barras) */}
      <View style={styles.chartArea}>
        {/* Eixo Y */}
        <View style={styles.yAxis}>
          {ySteps.slice().reverse().map((y, i) => (
            <Text key={i} style={styles.yLabel}>
              {(y * 100).toFixed(0)}%
            </Text>
          ))}
        </View>

        {/* Área do gráfico */}
        <View style={{ flex: 1, position: "relative" }}>
          {/* Linhas horizontais */}
          {ySteps.map((y, i) => (
            <View
              key={i}
              style={[
                styles.gridLine,
                { bottom: (y / Math.max(...ySteps)) * 180 },
              ]}
            />
          ))}

          {/* Barras (sem nomes aqui) */}
          <View style={styles.plotArea}>
            {engajados.map((p, i) => {
              const fotoPath = getFotoPath(p.nome);
              return (
                <View key={i} style={styles.barWrapper}>
                  <Image src={fotoPath || iconInsta} style={styles.foto} />
                  <View
                    style={[
                      styles.bar,
                      { height: (p.engajamento / max) * 150 },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Nomes fixos abaixo da linha 0% */}
      <View style={styles.nomeRow}>
        {engajados.map((p, i) => (
          <Text key={i} style={styles.nome}>
            {p.nome}
          </Text>
        ))}
      </View>

      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingPerfisEngajadosPDF;