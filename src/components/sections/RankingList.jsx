// src/components/.../RankingList.jsx
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, UserRound } from 'lucide-react';

// Ícones de variação
import IconGanhou from '/src/assets/GANHOU.svg';
import IconPerdeu from '/src/assets/PERDEU.svg';
import IconManteve from '/src/assets/MANTEVE.svg';

const icones = {
  instagram: <Instagram size={20} className="text-pink-500" />,
  facebook:  <Facebook  size={20} className="text-blue-600" />,
  twitter:   <Twitter   size={20} className="text-sky-500" />,
};

function VariaIcon({ variacao }) {
  if (typeof variacao !== 'number' || variacao === 0) {
    return <img src={IconManteve} alt="Manteve posição" className="w-5 h-5" />;
  }
  if (variacao > 0) {
    return <img src={IconGanhou} alt="Ganhou posição" className="w-5 h-5" />;
  }
  return <img src={IconPerdeu} alt="Perdeu posição" className="w-5 h-5" />;
}

/**
 * RankingList
 * - Usa pessoa.variacao quando presente
 * - Fallback: compara ordem atual vs ordem anterior salva no localStorage (fora do modoPrint)
 */
const RankingList = ({ dados = [], campo = '', modoPrint = false }) => {
  const LS_KEY = useMemo(() => `rankingList_prev_${campo || 'geral'}, [campo]`);

  // Ordem atual (nomes), na sequência recebida (presume-se já ordenado pelo pai)
  const nomesAtuais = useMemo(() => dados.map(p => p?.nome ?? ''), [dados]);

  // Ordem anterior salva (apenas se não for modoPrint)
  const prevOrder = useMemo(() => {
    if (modoPrint) return [];
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }, [LS_KEY, modoPrint]);

  // Mapa nome -> posição anterior (1-based)
  const prevPos = useMemo(() => {
    const m = new Map();
    prevOrder.forEach((nome, i) => m.set(nome, i + 1));
    return m;
  }, [prevOrder]);

  // Assina o fallback de variação (+1, -1, 0) quando não vier pessoa.variacao
  const deltaPosFallback = (nome, posAtual) => {
    const posAnterior = prevPos.get(nome);
    if (!posAnterior) return 0;
    const diff = posAnterior - posAtual; // positivo = subiu
    return diff > 0 ? 1 : diff < 0 ? -1 : 0;
  };

  // Salva a ordem atual para a próxima comparação (somente fora do /print)
  useEffect(() => {
    if (modoPrint) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(nomesAtuais)); } catch {}
  }, [nomesAtuais, LS_KEY, modoPrint]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dados.map((pessoa, index) => {
        const valor = pessoa?.[campo] ?? 0;

        // 1) Preferir pessoa.variacao (server/UploadRedes)
        // 2) Fallback: calcular pelo histórico salvo
        const variacao =
          Number.isFinite(pessoa?.variacao)
            ? Math.sign(pessoa.variacao)
            : deltaPosFallback(pessoa?.nome ?? '', index + 1);

        return (
          <motion.div
            key={`${pessoa?.nome ?? 'p'}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white p-5 rounded-xl shadow flex items-center justify-between hover:scale-[1.01] transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 text-gray-700 p-2 rounded-full">
                {icones[campo] || <UserRound size={20} />}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {index + 1}º {pessoa?.nome}
                </p>
                <p className="text-sm text-gray-500">
                  {pessoa?.cargo || 'Cargo não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <VariaIcon variacao={variacao} />
              <p className="text-xl font-bold">
                {Number(valor).toLocaleString()}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RankingList;