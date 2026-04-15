import React from 'react';
import { motion } from 'framer-motion';
import LunaPet from '../UI/LunaPet';
import { CheckCircle } from '@phosphor-icons/react';

const themes = [
  { 
    id: 'Sakura', 
    name: 'Sakura Dream', 
    desc: 'Soft pinks & cherry blossoms',
    bg: 'bg-[#FFF5F8]', 
    accent: 'text-[#FFB7C5]',
    petState: 'happy'
  },
  { 
    id: 'Midnight', 
    name: 'Midnight Glow', 
    desc: 'Stardust & deep indigo',
    bg: 'bg-[#05071a]', 
    accent: 'text-[#8f6fff]',
    petState: 'sleeping'
  },
  { 
    id: 'Ocean', 
    name: 'Ocean Breeze', 
    desc: 'Cool blues & calm waves',
    bg: 'bg-[#F0F8FA]', 
    accent: 'text-[#82C0CC]',
    petState: 'drinking'
  },
  { 
    id: 'Forest', 
    name: 'Forest Mist', 
    desc: 'Deep greens & earthy tones',
    bg: 'bg-[#F2F4EF]', 
    accent: 'text-[#588157]',
    petState: 'zen'
  },
];

const ThemeSwitcher = ({ currentTheme, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {themes.map((theme) => {
        const isActive = currentTheme === theme.id;
        
        return (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(theme.id)}
            className={`relative group rounded-[32px] p-1 transition-all haptic-press
              ${isActive ? 'bg-gradient-to-br from-kawaii-pink to-kawaii-lilac shadow-lg' : 'bg-white/40 hover:bg-white/60'}
            `}
          >
            <div className={`w-full h-full rounded-[30px] p-6 flex flex-col items-center gap-4 bg-white/90 backdrop-blur-md`}>
              {/* Mini Preview Area */}
              <div className={`w-full aspect-[16/10] ${theme.bg} rounded-2xl relative overflow-hidden border border-white/50 flex items-center justify-center p-2 shadow-inner`}>
                <div className="transform scale-[0.6]">
                   <LunaPet state={theme.petState} size="medium" />
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={24} weight="fill" className="text-kawaii-mint" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <h4 className={`text-sm font-black text-kawaii-earth tracking-tight`}>
                  {theme.name}
                </h4>
                <p className="text-[10px] font-bold text-kawaii-earthLight uppercase tracking-widest mt-1">
                  {theme.desc}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
