import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import PhaseInsight from '../components/Dashboard/PhaseInsight';
import { Drop } from '@phosphor-icons/react';
import { useCycleLogic } from '../hooks/useCycleLogic';

const Cycle = () => {
    // Shared hook
    const { nextPeriod, currentPhase } = useCycleLogic('2026-03-20', 28);

    return (
        <div className="flex flex-col h-full gap-6">
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
            >
                <div className="flex items-center gap-3 mb-1">
                    <Drop weight="duotone" className="text-kawaii-lilac w-8 h-8" />
                    <h1 className="text-3xl font-sticker font-bold text-gray-800 tracking-tight">
                        Cycle Health
                    </h1>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Re-using the PhaseInsight widget */}
                <PhaseInsight delay={0.1} />

                <GlassCard delay={0.2} className="!bg-white/60">
                    <h3 className="font-bold text-gray-700 mb-4">Historical Data</h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm bg-white p-3 rounded-lg sticker-border">
                            <span className="text-gray-500">Last Period</span>
                            <span className="font-bold text-gray-800">March 20th</span>
                        </li>
                        <li className="flex justify-between items-center text-sm bg-white p-3 rounded-lg sticker-border">
                            <span className="text-gray-500">Average Length</span>
                            <span className="font-bold text-gray-800">28 Days</span>
                        </li>
                        <li className="flex justify-between items-center text-sm bg-white p-3 rounded-lg sticker-border">
                            <span className="text-gray-500">Next Estimated</span>
                            <span className="font-bold text-kawaii-mint">{nextPeriod}</span>
                        </li>
                    </ul>
                </GlassCard>
            </div>
        </div>
    );
};

export default Cycle;
