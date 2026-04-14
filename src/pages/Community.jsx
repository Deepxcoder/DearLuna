import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { UsersThree, Heart } from '@phosphor-icons/react';

const Community = () => {
    return (
        <div className="flex flex-col h-full gap-6">
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
            >
                <div className="flex items-center gap-3 mb-1">
                    <UsersThree weight="duotone" className="text-kawaii-sakura w-8 h-8" />
                    <h1 className="text-3xl font-sticker font-bold text-gray-800 tracking-tight">
                        Safe Space
                    </h1>
                </div>
            </motion.header>

            <GlassCard delay={0.1} className="flex flex-col items-center justify-center p-12 text-center !bg-kawaii-cream/40 border-white/60">
                <div className="w-24 h-24 rounded-full bg-white sticker-border flex items-center justify-center mb-6">
                    <Heart weight="duotone" className="w-12 h-12 text-kawaii-sakura" />
                </div>
                <h2 className="text-2xl font-sticker font-bold text-gray-800 mb-2">You aren't alone!</h2>
                <p className="text-gray-600 max-w-sm">
                    This module is currently in development. Soon you'll be able to connect with loved ones or others on similar journeys.
                </p>
                <button className="mt-8 bg-white text-kawaii-sakura font-bold py-3 px-6 rounded-ultra sticker-border hover:scale-105 transition-all">
                    Enable Anonymous Sharing
                </button>
            </GlassCard>
        </div>
    );
};

export default Community;
