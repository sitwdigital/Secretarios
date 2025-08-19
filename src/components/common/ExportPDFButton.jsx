import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from '../../pdf/PDFDocument';

const ExportPDFButton = () => {
  // Recupera os dados salvos no localStorage
  const local = localStorage.getItem('relatorioSecretarias');
  const dados = local ? JSON.parse(local) : null;

  if (!dados) {
    return (
      <div className="flex justify-center my-6">
        <p className="text-red-600 font-semibold">
          Nenhum relatório encontrado no localStorage.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6">
      <PDFDownloadLink
        document={<PDFDocument dados={dados} />}
        fileName="Relatorio_Secretarias.pdf"
        className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
      >
        {({ loading }) =>
          loading ? 'Gerando PDF...' : '📄 Exportar PDF com Qualidade Profissional'
        }
      </PDFDownloadLink>
    </div>
  );
};

export default ExportPDFButton;
