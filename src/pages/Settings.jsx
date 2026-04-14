import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { Gear, Bell, User } from '@phosphor-icons/react';

const Settings = () => {
    return (
        <div className="flex flex-col h-full gap-6">
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
            >
                <div className="flex items-center gap-3 mb-1">
                    <Gear weight="duotone" className="text-gray-600 w-8 h-8" />
                    <h1 className="text-3xl font-sticker font-bold text-gray-800 tracking-tight">
                        Settings
                    </h1>
                </div>
            </motion.header>

            <GlassCard delay={0.1} className="!bg-white/70 flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl sticker-border">
                    <div className="flex items-center gap-4">
                        <User weight="fill" className="text-kawaii-mint w-6 h-6" />
                        <span className="font-bold text-gray-700">Profile Details</span>
                    </div>
                    <button className="text-kawaii-mint font-bold text-sm">Edit</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl sticker-border">
                    <div className="flex items-center gap-4">
                        <Bell weight="fill" className="text-kawaii-blue w-6 h-6" />
                        <span className="font-bold text-gray-700">Push Notifications</span>
                    </div>
                    {/* Fake Toggle */}
                    <div className="w-12 h-6 bg-kawaii-mint rounded-full flex items-center p-1 justify-end cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Settings;
