import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { BookOpen, PenNib } from '@phosphor-icons/react';

const Journal = () => {
    const [entry, setEntry] = useState('');

    return (
      <div className="flex flex-col h-full gap-6">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="flex items-center gap-3 mb-1">
             <BookOpen weight="duotone" className="text-kawaii-blue w-8 h-8" />
             <h1 className="text-3xl font-sticker font-bold text-gray-800 tracking-tight">
               Dear Diary
             </h1>
          </div>
          <p className="text-gray-500 font-medium">Capture your feelings and tiny moments today.</p>
        </motion.header>

        {/* Input Card */}
        <GlassCard delay={0.1} className="flex-1 flex flex-col !bg-white/60">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                <PenNib weight="fill" className="text-kawaii-pink" /> 
                Reflections
            </h3>

            <textarea 
                className="w-full flex-1 min-h-[300px] resize-none bg-transparent outline-none text-gray-800 placeholder-gray-400 font-body p-2"
                placeholder="I felt really happy when..."
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
            />

            <div className="flex justify-end mt-4">
                <button className="bg-kawaii-mint text-white font-bold px-6 py-2 rounded-xl shadow-md hover:scale-105 transition-transform duration-200">
                    Save Entry
                </button>
            </div>
        </GlassCard>

      </div>
    );
};

export default Journal;
