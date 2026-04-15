import React from 'react';
import { motion } from 'framer-motion';

const Sticker = ({ emoji, className = "", style = {}, rotate = 0 }) => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, rotate: rotate - 15 }}
      animate={{ scale: 1, opacity: 1, rotate: rotate }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`absolute bg-white flex items-center justify-center rounded-full pointer-events-none z-10 ${className}`}
      style={{
        border: '3px solid white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
        padding: '0.2rem',
        ...style
      }}
    >
      <span className="leading-none text-2xl">{emoji}</span>
    </motion.div>
  );
};

export default Sticker;
