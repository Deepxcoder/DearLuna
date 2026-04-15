import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StickerCard = ({ children, className = '', onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    // Visual pop trigger
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: [-2, 2, -2] }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative cursor-pointer transition-all ${className}`}
    >
      {/* Visual Ripple Pop Overlay */}
      {isAnimating && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white rounded-inherit pointer-events-none z-50 mix-blend-overlay"
        />
      )}
      {children}
    </motion.div>
  );
};

export default StickerCard;
