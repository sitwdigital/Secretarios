// src/components/common/ExportPDFButton.jsx
import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../../pdf/PDFDocument";
import { imgToBase64 } from "../../utils/imgToBase64";

const ExportPDFButton = ({ dados: dadosProp }) => {
  const [dadosProntos, setDadosProntos] = useState(null);

  // Prioridade: dados via prop > localStorage
  const local = localStorage.getItem("relatorioSecretarias");
  const dadosBase = dadosProp || (local ? JSON.parse(local) : null);
  const dataRelatorio = new Date().toLocaleDateString("pt-BR");

  useEffect(() => {
    const prepararDados = async () => {
      if (!dadosBase) return;

      console.log("🚀 Iniciando preparação do PDF...");
      const copia = { ...dadosBase };

      if (Array.isArray(copia.publicacoesEngajadas)) {
        const results = [];
        copia.publicacoesEngajadas = await Promise.all(
          copia.publicacoesEngajadas.map(async (p, idx) => {
            if (p.FOTO && (p.FOTO.includes("drive.google.com") || p.FOTO.includes("http"))) {
              const base64 = await imgToBase64(p.FOTO);
              
              const status = base64 ? "Sucesso (Base64)" : "Falha (Mantendo Original)";
              results.push({ Item: idx + 1, Nome: p.NOME, Status: status });

              // 🔥 NUNCA sobrescreve com null. Se falhar, mantém o link original.
              return { ...p, FOTO: base64 || p.FOTO };
            }
            results.push({ Item: idx + 1, Nome: p.NOME, Status: "Sem Foto ou Link Direto" });
            return p;
          })
        );
        
        console.log("📊 Resumo da conversão de imagens para PDF:");
        console.table(results);
      }

      setDadosProntos(copia);
    };

    prepararDados();
  }, [dadosBase]);

  if (!dadosBase) {
    return (
      <div className="flex justify-center my-6">
        <p className="text-red-600 font-semibold">
          Nenhum dado encontrado para gerar o PDF.
        </p>
      </div>
    );
  }

  if (!dadosProntos) {
    return (
      <div className="flex justify-center my-6 text-blue-600 font-semibold animate-pulse">
        ⏳ Preparando imagens e processando relatório...
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6">
      <PDFDownloadLink
        document={<PDFDocument dados={dadosProntos} dataRelatorio={dataRelatorio} />}
        fileName={`Relatorio_Secretarias_${new Date().getTime()}.pdf`}
        className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        {({ loading }) =>
          loading ? "Gerando arquivo..." : (
            <>
              <span className="text-xl">📄</span> 
              Exportar Relatório em PDF
            </>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

export default ExportPDFButton;