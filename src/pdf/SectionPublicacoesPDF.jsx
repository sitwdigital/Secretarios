// src/pdf/SectionPublicacoesPDF.jsx
import { Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer";

// header/footer
const headerImg = "/pdf-assets/header_Relatorio_Melhores.png";
const footerImg = "/pdf-assets/footer_Relatorio.png";
const seloVerificado = "/pdf-assets/verificado.png"; // 🔹 selo azul

Font.register({
  family: "AMSIPRO",
  src: "/fonts/AMSIPRO-SEMIBOLD.ttf",
});

// Lista de verificados
const verificados = [
  "Fábio Gentil","Yuri Arruda","Orleans Brandão","França do Macaquinho",
  "Abigail Cunha", "Karen Barros","Adriano Sarney","Tiago Fernandes",
  "Cricielle Muniz","Sebastião Madeira","Maurício Martins","Junior Marreca",
  "Coronel Célio Roberto","Gabriel Tenorio","Diego Rolim","Cassiano Pereira",
  "Rubens Pereira","Pedro Chagas","Natassia Weba","Sérgio Macedo",
  "Zé Reinaldo Tavares","Marcello Dualibe","Anderson Ferreira",
  "Vinícius Ferro","Cauê Aragão","Alberto Bastos","Washington Oliveira",
  "Paulo Case Fernandes","Bira do Pindaré","Raul Cancian","Celso Dias",  
  "Leandro Costa"
];

// Função utilitária: transforma nome em slug -> arquivo
const nomeParaArquivo = (nome) => {
  if (!nome) return null;
  return "/fotos_secretarios/" +
    nome
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toLowerCase()
      .replace(/\s+/g, "-") +
    ".jpg";
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "AMSIPRO", // 🔹 mesmo do RankingPerfisEngajados
    paddingBottom: 40,
  },
  header: { width: "100%" },
  footer: { width: "100%", position: "absolute", bottom: 0, left: 0 },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
    fontWeight: "bold",
    marginTop: 10,
  },
  blocao: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 30,
    marginTop: 25,
    padding: 10,
    borderRadius: 8,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    width: "18%", // ~20% pra caber 5 lado a lado
    marginHorizontal: 4,
  },
  perfilContainer: {
    position: "relative",
    marginBottom: 4,
  },
  perfilFoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    objectFit: "cover",
  },
  selo: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 12,
    height: 12,
  },
  nome: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  posicao: {
    fontSize: 9,
    color: "#555",
    marginBottom: 6,
    textAlign: "center",
  },
  fotoContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 6,
    overflow: "hidden",
  },
  foto: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dataOverlay: {
    position: "absolute",
    bottom: 4,
    left: 6,
    fontSize: 8,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 3,
    borderRadius: 3,
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
      {/*  Título */}
      <Text style={styles.title}>Publicações mais engajadas no Instagram</Text>

      <View style={styles.blocao}>
        {dadosOrdenados.slice(0, 5).map((item, index) => {
          const perfilFoto = nomeParaArquivo(item?.NOME);
          const isVerificado = verificados.includes(item?.NOME);

          return (
            <View key={index} style={styles.item}>
              <View style={styles.perfilContainer}>
                <Image src={perfilFoto || "/placeholder.png"} style={styles.perfilFoto} />
                {isVerificado && (
                  <Image src={seloVerificado} style={styles.selo} />
                )}
              </View>

              <Text style={styles.nome}>
                {index + 1}º {item?.NOME}
              </Text>

              <View style={styles.fotoContainer}>
                <Image src={item?.FOTO || "/placeholder.png"} style={styles.foto} />
                {item?.DATA && (
                  <Text style={styles.dataOverlay}>{item.DATA}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <Image src={footerImg} style={styles.footer} />
    </Page>
  );
};

export default SectionPublicacoesPDF;