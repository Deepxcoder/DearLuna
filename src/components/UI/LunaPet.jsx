import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LunaPet - A high-fidelity, animated companion for DearLuna.
 * @param {string} state - The current animation state ('idle', 'happy', 'drinking', 'writing', 'sparkle')
 * @param {string} className - Additional CSS classes
 */
const LunaPet = ({ state = 'idle', className = '', size = 'medium' }) => {
  const isBigger = size === 'large';
  
  // Animation Variants
  const bodyVariants = {
    idle: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    happy: {
      scale: [1, 1.15, 1],
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.8, ease: "backOut" }
    },
    drinking: {
      scale: [1, 1.05, 1],
      y: [0, 5, 0],
      transition: { duration: 0.5, repeat: 4 }
    },
    writing: {
      rotate: [0, -3, 3, 0],
      x: [0, 2, -2, 0],
      transition: { duration: 0.4, repeat: Infinity }
    },
    sparkle: {
      scale: [1, 1.1, 1],
      rotate: [0, 360],
      transition: { duration: 1.2, ease: "circInOut" }
    }
  };

  const earVariants = {
    idle: { rotate: [0, 5, 0], transition: { duration: 4, repeat: Infinity } },
    happy: { rotate: [0, 15, -15, 0], transition: { duration: 0.4, repeat: 2 } }
  };

  const eyeVariants = {
    idle: { scaleY: [1, 1, 0.1, 1, 1], transition: { duration: 4, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] } },
    happy: { scale: 1.2, transition: { duration: 0.2 } },
    drinking: { scaleY: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ 
      width: isBigger ? '240px' : '160px', 
      height: isBigger ? '240px' : '160px',
      perspective: '1000px'
    }}>
      {/* Aura/Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-kawaii-pink to-kawaii-lilac rounded-full blur-3xl"
      />

      {/* Main Body Container */}
      <motion.div
        variants={bodyVariants}
        animate={state}
        className="relative w-full h-full flex items-center justify-center p-4 drop-shadow-2xl"
      >
        {/* The Bear Body */}
        <div className="relative w-full h-full bg-gradient-to-b from-[#FFF5F8] to-[#F3E5F5] rounded-[45%] border-[3px] border-white/60 shadow-inner overflow-hidden">
          {/* Belly Glassmorphism */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-white/40 blur-sm rounded-[50%]" />
          
          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {/* Eyes */}
            <div className="flex gap-8 mb-2">
              <motion.div variants={eyeVariants} animate={state} className="w-3 h-3 bg-kawaii-earth rounded-full shadow-sm" />
              <motion.div variants={eyeVariants} animate={state} className="w-3 h-3 bg-kawaii-earth rounded-full shadow-sm" />
            </div>
            {/* Muzzle */}
            <div className="relative w-10 h-8 bg-white/80 rounded-full flex flex-col items-center justify-center pt-1 border border-white/40">
              <div className="w-4 h-2.5 bg-[#4A3525] rounded-full" />
              <div className="w-4 h-1.5 border-b-[2px] border-[#4A3525] rounded-[50%] opacity-40 mt-0.5" />
            </div>
            {/* Blush */}
            <div className="absolute w-full flex justify-between px-6 top-[55%]">
              <div className="w-5 h-2 bg-kawaii-pink/30 rounded-full blur-[2px]" />
              <div className="w-5 h-2 bg-kawaii-pink/30 rounded-full blur-[2px]" />
            </div>
          </div>
        </div>

        {/* Ears */}
        <motion.div variants={earVariants} animate={state} className="absolute -top-2 left-4 w-12 h-12 bg-[#FFF5F8] border-[3px] border-white/60 rounded-full shadow-md -z-10 overflow-hidden">
           <div className="absolute inset-2 bg-kawaii-pink/20 rounded-full" />
        </motion.div>
        <motion.div variants={earVariants} animate={state} className="absolute -top-2 right-4 w-12 h-12 bg-[#FFF5F8] border-[3px] border-white/60 rounded-full shadow-md -z-10 overflow-hidden">
           <div className="absolute inset-2 bg-kawaii-pink/20 rounded-full" />
        </motion.div>

        {/* Floating Props based on state */}
        <AnimatePresence>
          {state === 'drinking' && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              className="absolute -right-4 top-1/2 text-4xl"
            >
              💧
            </motion.div>
          )}
          {state === 'writing' && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, x: -10 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0, x: -10 }}
              className="absolute -left-6 top-1/2 text-4xl"
            >
              ✍️
            </motion.div>
          )}
          {state === 'sparkle' && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1, scale: [1, 1.5, 1] }}
                className="absolute top-0 right-0 text-2xl"
              >✨</motion.div>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1, scale: [1, 1.2, 1] }} 
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-0 text-xl"
              >⭐</motion.div>
            </>
          )}
          {state === 'happy' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [1, 1.2, 1] }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl"
            >
              💖
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black/5 rounded-full blur-md" />
    </div>
  );
};

export default LunaPet;
