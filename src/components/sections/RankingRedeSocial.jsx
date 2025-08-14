// src/components/.../RankingRedeSocial.jsx
import RankingList from './RankingList';

const RankingRedeSocial = ({ rede = '', dados = [], modoPrint = false }) => {
  const campo = String(rede || '').toLowerCase(); // "instagram" | "facebook" | "twitter"

  // Filtra quem tem o campo como número e ordena desc
  const dadosOrdenados = [...(dados || [])]
    .filter((p) => Number.isFinite(p?.[campo]))
    .sort((a, b) => (b?.[campo] ?? 0) - (a?.[campo] ?? 0));

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Ranking de Seguidores no {rede}
      </h2>
      <RankingList dados={dadosOrdenados} campo={campo} modoPrint={modoPrint} />
    </div>
  );
};

export default RankingRedeSocial;