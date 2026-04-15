import React from 'react';
import { motion } from 'framer-motion';

const Sticker = ({ emoji, className = "", style = {}, rotate = 0 }) => {
  const isInteractive = typeof style?.pointerEvents !== 'undefined' || className.includes('cursor-pointer');
  return (
    <motion.div 
      data-sticker="true"
      initial={{ scale: 0.8, opacity: 0, rotate: rotate - 15 }}
      animate={{ scale: 1, opacity: 1, rotate: rotate }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`sticker-chip absolute flex items-center justify-center rounded-full border-2 border-white/80 shadow-sm ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none'} z-10 ${className}`}
      style={{
        padding: '0.2rem',
        ...style
      }}
    >
      <span className="leading-none text-2xl">{emoji}</span>
    </motion.div>
  );
};

export default Sticker;
