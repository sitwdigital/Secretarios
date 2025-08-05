import { Link } from 'react-scroll';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white shadow sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo ou Título */}
        <h1 className="text-2xl font-bold text-blue-600">Ranking de Seguidores</h1>

        {/* Navegação */}
        <nav className="flex flex-wrap gap-4 mt-4 md:mt-0">
          {[
            { nome: 'Top 10', id: 'ranking-top10' },
            { nome: 'Instagram', id: 'instagram' },
            { nome: 'Facebook', id: 'facebook' },
            { nome: 'Twitter', id: 'twitter' },
          ].map((secao) => (
            <Link
              key={secao.id}
              to={secao.id}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition"
            >
              {secao.nome}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
