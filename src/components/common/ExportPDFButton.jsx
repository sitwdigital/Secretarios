const ExportPDFButton = () => {
  const exportarComPuppeteer = async () => {
    try {
      // Recupera os dados corretamente do localStorage
      const local = localStorage.getItem('relatorioSecretarias');
      if (!local) {
        alert('Dados do relatório não encontrados no localStorage.');
        return;
      }

      // Faz a requisição para o backend (Puppeteer)
      const response = await fetch('http://localhost:4000/gerar-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: local, // envia os dados do relatório
      });

      // Se a resposta não for OK, lança erro
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao gerar PDF: ${errorText}`);
      }

      // Converte a resposta para blob e força o download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'Relatorio_Secretarias.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar com Puppeteer:', error);
      alert('Erro ao gerar o PDF. Verifique se o servidor está rodando e acessível.');
    }
  };

  return (
    <div className="flex justify-center my-6">
      <button
        onClick={exportarComPuppeteer}
        className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
      >
        📄 Exportar PDF com Qualidade Profissional
      </button>
    </div>
  );
};

export default ExportPDFButton;
