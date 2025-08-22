import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const headerImg = "/pdf-assets/header_Relatorio_Facebook.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const legendaImg = "/pdf-assets/LEGENDA.png";

// ícones de status
const iconesStatus = {
  ganhou: "/pdf-assets/GANHOU.png",
  perdeu: "/pdf-assets/PERDEU.png",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingBottom: 0,
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
  gridContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 60,
    marginTop: 10,
    paddingBottom: 60,
  },
  gridLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  posicao: { fontSize: 9, fontWeight: "semibold", marginRight: 6 },
  foto: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    objectFit: "cover",
  },
  nomeCargo: { flexDirection: "column", maxWidth: 90 },
  nome: { fontSize: 8, fontWeight: "semibold" },
  cargo: { fontSize: 6, color: "gray" },
  seguidoresContainer: {
    borderRadius: 20,
    minWidth: 55,
    height: 22, 
    justifyContent: "center",
    alignItems: "center",
  },
  seguidoresText: {
    fontSize: 9,
    fontWeight: "semibold",
    color: "white",
    textAlign: "center",
    marginTop: 2, 
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
      {/* Nome + Foto */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.posicao}>{posicao}º</Text>
        {pessoa.foto && <Image src={pessoa.foto} style={styles.foto} />}
        <View style={styles.nomeCargo}>
          <Text style={styles.nome}>{pessoa.nome}</Text>
          {pessoa.cargo && <Text style={styles.cargo}>{pessoa.cargo}</Text>}
        </View>
      </View>

      {/* Seguidores */}
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

// ====== Ranking Facebook
const RankingFacebookPDF = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  const dadosComStatus = dados.map((p) => ({
    ...p,
    status: p.variacao > 0 ? "ganhou" : p.variacao < 0 ? "perdeu" : null,
  }));

  const ordenados = [...dadosComStatus].sort(
    (a, b) => (b?.seguidores ?? 0) - (a?.seguidores ?? 0)
  );

  // blocos de 24 
  const blocos = [];
  for (let i = 0; i < ordenados.length; i += 24) {
    blocos.push(ordenados.slice(i, i + 24));
  }

  return (
    <>
      {blocos.map((bloco, pageIndex) => {
        const col1 = bloco.slice(0, 8);
        const col2 = bloco.slice(8, 16);
        const col3 = bloco.slice(16, 24);

        const linhas = Array.from({ length: 8 }, (_, i) => ({
          esquerda: col1[i],
          centro: col2[i],
          direita: col3[i],
        }));

        return (
          <Page
            key={pageIndex}
            size="A4"
            orientation="landscape"
            style={styles.page}
          >
            <Image src={headerImg} style={styles.header} />

            {/* Grid centralizado */}
            <View style={styles.gridContainer}>
              {linhas.map((linha, i) => {
                const posBase = pageIndex * 24;
                return (
                  <View key={i} style={styles.gridLinha}>
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
                        posicao={posBase + i + 9}
                      />
                    ) : (
                      <View style={{ width: "40%" }} />
                    )}

                    {linha.direita ? (
                      <CardPessoaPDF
                        pessoa={linha.direita}
                        posicao={posBase + i + 17}
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
              <Image src={legendaImg} style={{ height: 20 }} />
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
