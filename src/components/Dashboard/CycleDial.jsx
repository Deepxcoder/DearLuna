import React from 'react';
import { motion } from 'framer-motion';
import { Heartbeat, Drop, Sparkle } from '@phosphor-icons/react';

const CycleDial = ({ phase, daysLeft, nextPredicted }) => {
  const getPhaseIcon = () => {
    switch(phase) {
      case 'Menstrual': return <Drop weight="duotone" className="text-kawaii-sakura w-10 h-10" />;
      case 'Ovulation': return <Sparkle weight="duotone" className="text-kawaii-mint w-10 h-10" />;
      default: return <Heartbeat weight="duotone" className="text-kawaii-lilac w-10 h-10" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      
      {/* Visual Dial (Sticker Aesthetic) */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 300 }
        }}
        className="w-48 h-48 rounded-full bg-white sticker-border flex flex-col items-center justify-center mb-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-kawaii-cream/50 to-kawaii-bg/50 z-0"></div>
        
        <div className="z-10 bg-white/80 p-3 rounded-full mb-2">
            {getPhaseIcon()}
        </div>
        
        <div className="z-10 text-center">
            <span className="text-4xl font-sticker font-bold text-gray-800">{daysLeft}</span>
            <span className="block text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Days Left</span>
        </div>
      </motion.div>

      {/* Info Readout */}
      <div className="text-center w-full bg-white/50 rounded-2xl py-3 px-4 border border-white/60">
        <p className="text-gray-500 font-medium text-sm">Next Cycle Date</p>
        <p className="font-sticker text-xl font-bold text-kawaii-mint">{nextPredicted}</p>
        <div className="mt-2 text-xs bg-kawaii-sakura/20 text-kawaii-sakura px-3 py-1 rounded-full inline-block font-semibold">
           Current: {phase}
        </div>
      </div>

    </div>
  );
};

export default CycleDial;
