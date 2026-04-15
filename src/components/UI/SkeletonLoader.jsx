import React from 'react';
import { motion } from 'framer-motion';

/**
 * SkeletonLoader - A premium shimmering loader for data-heavy components.
 * Matches the DearLuna aesthetic with soft gradients and fluid motion.
 */
const SkeletonLoader = ({ 
  width = '100%', 
  height = '100%', 
  borderRadius = '24px',
  className = '',
}) => {
  return (
    <div 
      className={`relative overflow-hidden bg-white/30 backdrop-blur-sm border border-white/40 ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius,
      }}
    >
      {/* Shimmer effect */}
      <motion.div
        animate={{
          x: ['-100%', '200%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-[50%]"
      />
      
      {/* Pulsing base */}
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-kawaii-pink/10 to-kawaii-lilac/10"
      />
    </div>
  );
};

export default SkeletonLoader;
