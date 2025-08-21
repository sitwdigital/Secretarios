// src/pdf/RankingGanhoSeguidoresPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Ranking.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA_2.png";

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
    bottom: 90, // 🔥 mesma altura dos outros
  },

  tituloContainer: {
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
  },
  titulo: { fontSize: 14, fontWeight: "semibold" },

  grid: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 60,
    marginTop: 10,
    marginBottom: 40, // 🔥 dá espaço antes da legenda
  },
  col: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },

  // 🔥 NÃO mexi nos estilos dos cards
  card: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: "#E1E1E5",
  },
  posicao: { fontSize: 11, fontWeight: "semibold", marginRight: 6 },
  foto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    objectFit: "cover",
  },
  nomeCargo: { flexDirection: "column", maxWidth: 120 },
  nome: { fontSize: 9, fontWeight: "semibold" },
  cargo: { fontSize: 7, color: "gray" },

  seguidoresContainer: {
    borderRadius: 20,
    minWidth: 60,
    paddingHorizontal: 14,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  seguidoresText: {
    fontSize: 10,
    fontWeight: "semibold",
    color: "white",
    textAlign: "center",
  },
});

const CardPessoaPDF = ({ pessoa, posicao }) => {
  if (!pessoa) return null;
  const isPrimeiro = posicao === 1;
  const iconeStatus = pessoa.status ? iconesStatus[pessoa.status] : null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isPrimeiro ? "#FEBD11" : "#E1E1E5" },
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
            { backgroundColor: isPrimeiro ? "#F7901E" : "#52586E" },
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

const RankingGanhoSeguidoresPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const dadosComStatus = dados.map((p) => ({
    ...p,
    status: p.variacao > 0 ? "ganhou" : p.variacao < 0 ? "perdeu" : "manteve",
  }));

  const esquerda = dadosComStatus.slice(0, 5);
  const direita = dadosComStatus.slice(5, 10);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={headerImg} style={styles.header} />

      {/* título centralizado */}
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Soma de seguidores nas redes</Text>
      </View>

      {/* grid centralizado */}
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

      {/* legenda fixa acima do footer */}
      <View style={styles.legenda}>
        <Image src={legendaImg} style={{ height: 18 }} />
      </View>

      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingGanhoSeguidoresPDF;
