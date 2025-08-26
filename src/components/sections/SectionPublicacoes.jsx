// src/components/sections/SectionPublicacoes.jsx
import HeaderImage from "/src/assets/header_Relatorio_Insta.svg"; 
import FooterImage from "/src/assets/footer_Relatorio.svg";

// 🔧 Função que corrige links do Google Drive
const formatarLinkDrive = (url) => {
  if (!url) return url;

  // Extrai o ID de qualquer formato de link do Drive
  const matchFile = url.match(/\/d\/([^/]+)\//);
  const matchParam = url.match(/id=([^&]+)/);
  const id = matchFile ? matchFile[1] : matchParam ? matchParam[1] : null;

  if (id) {
    // 🔹 Usa thumbnail embed (não força download)
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }

  return url; // fallback
};

const SectionPublicacoes = ({ dados = [] }) => {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  // ordena pelas posições (maior engajamento primeiro)
  const dadosOrdenados = [...dados].sort((a, b) => (b?.POSICAO ?? 0) - (a?.POSICAO ?? 0));

  return (
    <div className="w-full bg-gray-100 pb-0">
      {/* Header */}
      <div className="w-full">
        <img src={HeaderImage} alt="Header Publicações" className="w-full object-cover" />
      </div>

      <h2 className="text-center font-bold text-lg my-4">
        Publicações mais engajadas no Instagram
      </h2>

      {/* Cards */}
      <div className="max-w-7xl mx-auto flex justify-center gap-6 flex-wrap px-4">
        {dadosOrdenados.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="w-48 bg-white shadow rounded-lg overflow-hidden hover:scale-[1.02] transition"
          >
            <img
              src={formatarLinkDrive(item?.FOTO) || "/placeholder.png"}
              alt={item?.NOME}
              className="w-full h-36 object-cover"
            />
            <div className="p-2 text-center">
              <h4 className="font-semibold text-sm">{index + 1}º {item?.NOME}</h4>
              <p className="text-xs text-gray-500">Engajamento: {item?.POSICAO}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="w-full mt-6">
        <img src={FooterImage} alt="Footer Publicações" className="w-full object-cover" />
      </div>
    </div>
  );
};

export default SectionPublicacoes;