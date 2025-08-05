import { motion } from 'framer-motion';
import logo from '/src/assets/logo.svg'; // ajuste o caminho se necessário

const Header = () => {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-[#204181] shadow sticky top-0 z-50"
    >
      <div className="w-full py-4 flex items-center justify-center">
        <img
          src={logo}
          alt="Logo"
          className="h-12 object-contain"
        />
      </div>
    </motion.header>
  );
};

export default Header;