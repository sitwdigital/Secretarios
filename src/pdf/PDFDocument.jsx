// src/pdf/PDFDocument.jsx
import React from "react";
import { Page, Document, Image, StyleSheet } from "@react-pdf/renderer";

// import da página de Instagram
import RankingInstagramPDF from "./RankingInstagramPDF";
// (depois você cria também: RankingGanhoPDF, RankingFacebookPDF, RankingTwitterPDF)

const styles = StyleSheet.create({
  fullPage: { width: "100%", height: "100%" },
});

// ====== DOCUMENTO PDF ======
const PDFDocument = ({ dados = {} }) => (
  <Document>
    {/* Página 1: Capa */}
    <Page size="A4" orientation="landscape">
      <Image src="/pdf-assets/cover_Relatorio.png" style={styles.fullPage} />
    </Page>

    {/* Página 2: Ranking Ganho de Seguidores (futuro) */}
    {/* <RankingGanhoPDF dados={dados.rankingGanho} /> */}

    {/* Página 3: Instagram (Top 33) */}
    <RankingInstagramPDF dados={dados.instagram} />

    {/* Página 4: Instagram (34–66) -> duplicar depois */}
    {/* <RankingInstagramPDF dados={dados.instagram.slice(33, 66)} /> */}

    {/* Página 5: Facebook (futuro) */}
    {/* <RankingFacebookPDF dados={dados.facebook} /> */}

    {/* Página 6: Twitter (futuro) */}
    {/* <RankingTwitterPDF dados={dados.twitter} /> */}

    {/* Página 7: Endpage */}
    <Page size="A4" orientation="landscape">
      <Image src="/pdf-assets/endpage_Relatorio.png" style={styles.fullPage} />
    </Page>
  </Document>
);

export default PDFDocument;
