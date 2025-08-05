import html2pdf from 'html2pdf.js';

const ExportPDFButton = () => {
  const handleExport = () => {
    const content = document.getElementById('relatorio');
    html2pdf().from(content).save('relatorio_redes_sociais.pdf');
  };

  return (
    <button onClick={handleExport} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
      Exportar PDF
    </button>
  );
};

export default ExportPDFButton;
