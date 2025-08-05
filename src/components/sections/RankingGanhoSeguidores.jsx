import { Award } from 'lucide-react';

const RankingGanhoSeguidores = ({ dados }) => (
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Ranking de Ganho de Seguidores</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dados.map((pessoa, index) => (
        <div
          key={pessoa.nome}
          className="bg-white p-5 rounded-xl shadow flex items-center justify-between hover:scale-[1.01] transition duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <Award size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold">{index + 1}º {pessoa.nome}</p>
              <p className="text-sm text-gray-500">{pessoa.cargo || 'Cargo não informado'}</p>
            </div>
          </div>
          <p className="text-xl font-bold">{pessoa.ganho.toLocaleString()} seguidores</p>
        </div>
      ))}
    </div>
  </div>
);

export default RankingGanhoSeguidores;
