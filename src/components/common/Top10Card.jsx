// src/components/common/Top10Card.jsx
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const Top10Card = ({ pessoa, posicao }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: posicao * 0.05 }}
    className="bg-white p-5 rounded-xl shadow flex items-center justify-between hover:scale-[1.01] transition"
  >
    <div className="flex items-center gap-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        <Award size={20} />
      </div>
      <div>
        <p className="text-lg font-semibold">{posicao}º {pessoa.nome}</p>
        <p className="text-sm text-gray-500">{pessoa.cargo || 'Cargo não informado'}</p>
      </div>
    </div>
    <p className="text-xl font-bold">{pessoa.totalSeguidores.toLocaleString()} seguidores</p>
  </motion.div>
);

export default Top10Card;
