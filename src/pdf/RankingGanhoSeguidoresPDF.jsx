import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Ranking.png"; // ✅ header específico
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA_2.png"; // ✅ legenda diferente

// Ícones de status
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
    marginTop: 10,
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  col: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
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
    backgroundColor: "#E1E1E5",
  },
  posicao: { fontSize: 11, fontWeight: "bold", marginRight: 6 },
  foto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    objectFit: "cover",
  },
  nomeCargo: { flexDirection: "column", maxWidth: 120 },
  nome: { fontSize: 9, fontWeight: "bold" },
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
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

// ====== Card
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

// ====== Página única Ranking Ganho de Seguidores
const RankingGanhoSeguidoresPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  // status baseado em variacao
  const dadosComStatus = dados.map((p) => ({
    ...p,
    status: p.variacao > 0 ? "ganhou" : p.variacao < 0 ? "perdeu" : "manteve",
  }));

  const esquerda = dadosComStatus.slice(0, 5);
  const direita = dadosComStatus.slice(5, 10);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <Image src={headerImg} style={styles.header} />

      {/* Título */}
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
          Soma de seguidores nas redes
        </Text>
      </View>

      {/* Grid 2 colunas */}
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

      {/* Legenda */}
      <View style={styles.legenda}>
        <Image src={legendaImg} style={{ height: 18 }} />
      </View>

      {/* Footer */}
      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default RankingGanhoSeguidoresPDF;
