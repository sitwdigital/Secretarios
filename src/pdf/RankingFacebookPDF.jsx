// src/pdf/RankingFacebookPDF.jsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Facebook.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA.png";

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
    paddingBottom: 0,
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
    marginVertical: -32,
  },
  gridLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingHorizontal: 60,
  },
  gridLinhaCentro: {
    flexDirection: "row",
    justifyContent: "center", // 🔥 centralizar quando tiver 1–2 colunas
    marginBottom: 5,
    paddingHorizontal: 60,
  },
  card: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 18,
    marginHorizontal: 2,
  },
  posicao: { fontSize: 9, fontWeight: "bold", marginRight: 6 },
  foto: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    objectFit: "cover",
  },
  nomeCargo: { flexDirection: "column", maxWidth: 90 },
  nome: { fontSize: 8 },
  cargo: { fontSize: 6, color: "gray" },

  seguidoresContainer: {
    borderRadius: 20,
    minWidth: 55,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  seguidoresText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
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
            style={{ width: 10, height: 10, marginRight: 4 }}
          />
        )}
        <View
          style={[
            styles.seguidoresContainer,
            { backgroundColor: isPrimeiro ? "#F7901E" : "#52586E" },
          ]}
        >
          <Text style={styles.seguidoresText}>
            {(pessoa?.seguidores ?? 0).toLocaleString("pt-BR")}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ====== Páginas do Ranking Facebook
const RankingFacebookPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  // adicionar status
  const dadosComStatus = dados.map((p) => ({
    ...p,
    status: p.variacao > 0 ? "ganhou" : p.variacao < 0 ? "perdeu" : "manteve",
  }));

  // ordenar por seguidores
  const ordenados = [...dadosComStatus].sort(
    (a, b) => (b?.seguidores ?? 0) - (a?.seguidores ?? 0)
  );

  // dividir em blocos de 33 (11x3 por página)
  const blocos = [];
  for (let i = 0; i < ordenados.length; i += 33) {
    blocos.push(ordenados.slice(i, i + 33));
  }

  return (
    <>
      {blocos.map((grupo, pageIndex) => {
        const col1 = grupo.slice(0, 11);
        const col2 = grupo.slice(11, 22);
        const col3 = grupo.slice(22, 33);

        const linhas = Array.from({ length: 11 }, (_, i) => {
          const esquerda = col1[i];
          const centro = col2[i];
          const direita = col3[i];

          const qtdColunas = [esquerda, centro, direita].filter(Boolean).length;

          return { esquerda, centro, direita, qtdColunas };
        });

        return (
          <Page
            key={pageIndex}
            size="A4"
            orientation="landscape"
            style={styles.page}
          >
            {/* Header */}
            <Image src={headerImg} style={styles.header} />

            {/* Cards */}
            <View style={{ marginTop: 8, marginBottom: 40 }}>
              {linhas.map((linha, i) => {
                const posBase = pageIndex * 33;
                const containerStyle =
                  linha.qtdColunas < 3
                    ? styles.gridLinhaCentro
                    : styles.gridLinha;

                return (
                  <View key={i} style={containerStyle}>
                    {linha.esquerda ? (
                      <CardPessoaPDF
                        pessoa={linha.esquerda}
                        posicao={posBase + i + 1}
                      />
                    ) : (
                      <View style={{ width: "40%" }} />
                    )}

                    {linha.centro ? (
                      <CardPessoaPDF
                        pessoa={linha.centro}
                        posicao={posBase + i + 12}
                      />
                    ) : (
                      <View style={{ width: "40%" }} />
                    )}

                    {linha.direita ? (
                      <CardPessoaPDF
                        pessoa={linha.direita}
                        posicao={posBase + i + 23}
                      />
                    ) : (
                      <View style={{ width: "40%" }} />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Legenda */}
            <View style={styles.legenda}>
              <Image src={legendaImg} style={{ height: 15 }} />
            </View>

            {/* Footer */}
            <Image src={footerImg} style={styles.footer} />
          </Page>
        );
      })}
    </>
  );
};

export default RankingFacebookPDF;
