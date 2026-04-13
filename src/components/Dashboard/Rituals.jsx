import React from 'react';
import GlassCard from '../UI/GlassCard';
import { Drop, Leaf, MoonZ } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const Rituals = ({ delay = 0 }) => {
  return (
    <GlassCard delay={delay} className="col-span-full xl:col-span-1 border-white/80">
      <h3 className="font-sticker font-bold text-lg text-gray-800 mb-4">Daily Rituals</h3>
      
      <div className="flex flex-col gap-3">
        
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-3 flex items-center gap-4 sticker-border cursor-pointer">
          <div className="bg-blue-50 text-blue-400 p-2 rounded-xl">
             <Drop weight="fill" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Hydration</h4>
            <p className="text-xs text-gray-500">2 / 8 glasses logged</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-3 flex items-center gap-4 sticker-border cursor-pointer">
          <div className="bg-kawaii-mint/20 text-kawaii-mint p-2 rounded-xl">
             <Leaf weight="fill" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Mindfulness</h4>
            <p className="text-xs text-gray-500">Evening session pending</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-kawaii-bg rounded-2xl p-3 flex items-center gap-4 sticker-border cursor-pointer">
          <div className="bg-kawaii-lilac/20 text-kawaii-lilac p-2 rounded-xl">
             <MoonZ weight="fill" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Rest Log</h4>
            <p className="text-xs text-kawaii-lilac font-medium">7h 45m achieved</p>
          </div>
        </motion.div>

      </div>
    </GlassCard>
  );
};

export default Rituals;
