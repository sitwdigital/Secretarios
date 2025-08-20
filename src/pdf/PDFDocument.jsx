// src/pdf/PDFDocument.jsx
import React from "react";
import { Page, Document, Image, StyleSheet, Text, View } from "@react-pdf/renderer";

// import das páginas
import RankingGanhoSeguidoresPDF from "./RankingGanhoSeguidoresPDF";
import RankingInstagramPDF from "./RankingInstagramPDF";
import RankingFacebookPDF from "./RankingFacebookPDF";
import RankingTwitterPDF from "./RankingTwitterPDF";

const styles = StyleSheet.create({
  fullPage: { width: "100%", height: "100%" },
  overlayContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  dataOverlay: {
    position: "absolute",
    left: 60,   // ajuste horizontal
    top: 370,   // ajuste vertical
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
});

// Função para adicionar fotos ao ranking de ganho
const enrichRankingGanho = (rankingGanho, instagram, facebook, twitter) => {
  const todos = [...(instagram || []), ...(facebook || []), ...(twitter || [])];

  return rankingGanho.map((p) => {
    const match = todos.find((x) => x.nome === p.nome);
    return {
      ...p,
      foto: match?.foto || null,
    };
  });
};

const PDFDocument = ({ dados = {}, dataRelatorio }) => {
  const rankingGanhoEnriquecido = Array.isArray(dados.rankingGanho)
    ? enrichRankingGanho(dados.rankingGanho, dados.instagram, dados.facebook, dados.twitter)
    : [];

  return (
    <Document>
      {/* Página 1: Capa com data sobreposta */}
      <Page size="A4" orientation="landscape">
        <View style={styles.overlayContainer}>
          <Image src="/pdf-assets/cover_Relatorio.png" style={styles.fullPage} />
          {dataRelatorio && <Text style={styles.dataOverlay}>{dataRelatorio}</Text>}
        </View>
      </Page>

      {/* Página 2: Ranking Ganho de Seguidores */}
      {rankingGanhoEnriquecido.length > 0 && (
        <RankingGanhoSeguidoresPDF dados={rankingGanhoEnriquecido} />
      )}

      {/* Instagram */}
      {Array.isArray(dados.instagram) && dados.instagram.length > 0 && (
        <RankingInstagramPDF dados={dados.instagram} />
      )}

      {/* Facebook */}
      {Array.isArray(dados.facebook) && dados.facebook.length > 0 && (
        <RankingFacebookPDF dados={dados.facebook} />
      )}

      {/* Twitter */}
      {Array.isArray(dados.twitter) && dados.twitter.length > 0 && (
        <RankingTwitterPDF dados={dados.twitter} />
      )}

      {/* Página final: Endpage */}
      <Page size="A4" orientation="landscape">
        <Image src="/pdf-assets/endpage_Relatorio.png" style={styles.fullPage} />
      </Page>
    </Document>
  );
};

export default PDFDocument;
