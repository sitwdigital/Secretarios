import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ExportPDFButton = () => {
  const exportToPDF = async () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const sections = [
        { id: 'cover', title: 'Capa' },
        { id: 'ranking-top10', title: 'Ganho de Seguidores' },
        { id: 'instagram-page-1', title: 'Instagram Parte 1' },
        { id: 'instagram-page-2', title: 'Instagram Parte 2' },
        { id: 'facebook', title: 'Facebook' },
        { id: 'twitter', title: 'Twitter' },
    ];

    for (let i = 0; i < sections.length; i++) {
      const section = document.getElementById(sections[i].id);
      if (!section) continue;

      const canvas = await html2canvas(section, { scale: 3 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      const pageWidth = 210;
      const pageHeight = 297;
      const imgProps = {
        width: pageWidth,
        height: (canvas.height * pageWidth) / canvas.width,
      };

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, imgProps.width, imgProps.height);
    }

    pdf.save('Relatorio_Secretarias.pdf');
  };

  return (
    <div className="flex justify-center my-6">
      <button
        onClick={exportToPDF}
        className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        📄 Exportar Relatório em PDF
      </button>
    </div>
  );
};

export default ExportPDFButton;
