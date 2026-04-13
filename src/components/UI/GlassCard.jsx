import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.5, 
        type: 'spring', 
        stiffness: 260, 
        damping: 20 
      }}
      className={`glass-panel rounded-ultra p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
