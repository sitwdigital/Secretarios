// src/components/common/ExportPDFButton.jsx
import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../../pdf/PDFDocument";
import { imgToBase64 } from "../../utils/imgToBase64";

const ExportPDFButton = () => {
  const [dadosProntos, setDadosProntos] = useState(null);

  const local = localStorage.getItem("relatorioSecretarias");
  const dados = local ? JSON.parse(local) : null;
  const dataRelatorio = new Date().toLocaleDateString("pt-BR");

  // 🔥 Prepara os dados automaticamente quando o componente monta
  useEffect(() => {
    const prepararDados = async () => {
      if (!dados) return;

      const copia = { ...dados };

      // 🔹 Converter SOMENTE as imagens das publicações engajadas
      if (Array.isArray(copia.publicacoesEngajadas)) {
        copia.publicacoesEngajadas = await Promise.all(
          copia.publicacoesEngajadas.map(async (p) => {
            if (p.FOTO && p.FOTO.includes("drive.google.com")) {
              const base64 = await imgToBase64(p.FOTO);
              return { ...p, FOTO: base64 };
            }
            return p; // mantém como está se não for link do Drive
          })
        );
      }

      setDadosProntos(copia);
    };

    prepararDados();
  }, [local]);

  if (!dados) {
    return (
      <div className="flex justify-center my-6">
        <p className="text-red-600 font-semibold">
          Nenhum relatório encontrado no localStorage.
        </p>
      </div>
    );
  }

  if (!dadosProntos) {
    return (
      <div className="flex justify-center my-6 text-blue-600 font-semibold">
        ⏳ Preparando imagens para o PDF...
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6">
      <PDFDownloadLink
        document={<PDFDocument dados={dadosProntos} dataRelatorio={dataRelatorio} />}
        fileName="Relatorio_Secretarias.pdf"
        className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
      >
        {({ loading }) =>
          loading ? "Gerando PDF..." : "📄 Exportar PDF com Qualidade Profissional"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default ExportPDFButton;