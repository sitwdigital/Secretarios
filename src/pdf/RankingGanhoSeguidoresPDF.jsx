// src/pdf/RankingGanhoSeguidoresPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Ranking.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA_2.png";

// selo de verificação
const seloVerificado = "/pdf-assets/verificado.png";

// ícones de status
const iconesStatus = {
  ganhou: "/pdf-assets/GANHOU.png",
  perdeu: "/pdf-assets/PERDEU.png",
  manteve: "/pdf-assets/MANTEVE.png",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    position: "relative",
    fontFamily: "AMSIPRO",
  },
  header: { width: "100%" },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  legenda: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 90,
  },
  tituloContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 60,
    marginTop: 10,
    marginBottom: 40,
  },
  col: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: "#E1E1E5", // 🔹 sempre cinza, sem amarelo
  },
  posicao: { fontSize: 11, fontWeight: "semibold", marginRight: 6 },
  fotoContainer: {
    position: "relative",
    marginRight: 8,
  },
  foto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    objectFit: "cover",
  },
  selo: {
    position: "absolute",
    bottom: -2,
    marginTop: 60,
    left: -1,
    width: 12,
    height: 12,
  },
  nomeCargo: { flexDirection: "column", maxWidth: 120 },
  nome: { fontSize: 9, fontWeight: "semibold" },
  cargo: { fontSize: 7, color: "gray" },
  seguidoresContainer: {
    borderRadius: 20,
    minWidth: 60,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  seguidoresText: {
    fontSize: 10,
    fontWeight: "semibold",
    color: "white",
    textAlign: "center",
    marginTop: 2,
  },
});

// ====== Card Pessoa
const CardPessoaPDF = ({ pessoa, posicao }) => {
  if (!pessoa) return null;

  // 👉 Lógica para escolher ícone
  let statusKey = "manteve";
  if (pessoa.novo) {
    statusKey = "ganhou"; // candidato novo sempre aparece como ganhou
  } else if (pessoa.variacao > 0) {
    statusKey = "ganhou";
  } else if (pessoa.variacao < 0) {
    statusKey = "perdeu";
  }

  const iconeStatus = iconesStatus[statusKey];

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.posicao}>{posicao}º</Text>

        <View style={styles.fotoContainer}>
          {pessoa.foto && <Image src={pessoa.foto} style={styles.foto} />}
          {pessoa.verificado && (
            <Image src={seloVerificado} style={styles.selo} />
          )}
        </View>

        <View style={styles.nomeCargo}>
          <Text style={styles.nome}>{pessoa.nome}</Text>
          {pessoa.cargo && <Text style={styles.cargo}>{pessoa.cargo}</Text>}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {iconeStatus && (
          <Image
            src={iconeStatus}
            style={{ width: 12, height: 12, marginRight: 4 }}
          />
        )}
        <View
          style={[
            styles.seguidoresContainer,
            { backgroundColor: "#52586E" }, // 🔹 todos iguais
          ]}
        >
          <Text style={styles.seguidoresText}>
            {(pessoa?.ganho ?? pessoa?.seguidores ?? 0).toLocaleString("pt-BR")}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ====== Ranking Ganho Seguidores
const RankingGanhoSeguidoresPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const esquerda = dados.slice(0, 5);
  const direita = dados.slice(5, 10);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={headerImg} style={styles.header} />

      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Soma de seguidores nas redes</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          {esquerda.map((pessoa, i) => (
            <CardPessoaPDF key={i} pessoa={pessoa} posicao={i + 1} />
          ))}
        </View>
        <View style={styles.col}>
          {direita.map((pessoa, i) => (
            <CardPessoaPDF key={i} pessoa={pessoa} posicao={i + 6} />
          ))}
        </View>
      </View>

      <View style={styles.legenda}>
        <Image src={legendaImg} style={{ height: 18 }} />
      </View>

      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingGanhoSeguidoresPDF;