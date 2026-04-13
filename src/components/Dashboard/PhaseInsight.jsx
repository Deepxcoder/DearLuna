import React from 'react';
import GlassCard from '../UI/GlassCard';
import { Drop } from '@phosphor-icons/react';

const PhaseInsight = ({ delay = 0 }) => {
  return (
    <GlassCard delay={delay} className="col-span-full xl:col-span-1 !bg-kawaii-bg flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-kawaii-lilac/30 p-2 rounded-full">
               <Drop weight="duotone" className="text-kawaii-lilac w-6 h-6" />
           </div>
           <h3 className="font-sticker font-bold text-xl text-gray-800">Luteal Phase</h3>
        </div>
        
        <p className="text-gray-600 font-medium leading-relaxed">
           Your energy may be lower today. Prioritize rest and nourishing meals.
        </p>

        <div className="mt-6 flex justify-between items-end">
            <span className="text-xs font-bold text-kawaii-mint uppercase tracking-wider">Days Left</span>
            <span className="font-sticker text-4xl font-bold text-gray-800">5</span>
        </div>
    </GlassCard>
  );
};

export default PhaseInsight;
