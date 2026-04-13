import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CalendarBlank, Drop, UsersThree, Gear } from '@phosphor-icons/react';

const Sidebar = () => {
  const navItems = [
    { name: 'Journal', icon: BookOpen, active: true },
    { name: 'Calendar', icon: CalendarBlank, active: false },
    { name: 'Cycle', icon: Drop, active: false },
    { name: 'Community', icon: UsersThree, active: false },
    { name: 'Settings', icon: Gear, active: false },
  ];

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 p-6 z-20"
    >
      <div className="glass-panel w-full h-full rounded-ultra flex flex-col pt-8 pb-6 px-4">
        
        {/* Brand */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-full bg-kawaii-bg sticker-border flex items-center justify-center mb-3">
             <Drop weight="duotone" className="text-kawaii-mint w-8 h-8" />
          </div>
          <h2 className="font-sticker font-bold text-xl text-gray-800">Dear Luna</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-3">
          {navItems.map((item) => (
            <button 
              key={item.name}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                item.active 
                  ? 'bg-white shadow-sticker text-kawaii-mint' 
                  : 'text-gray-500 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              <item.icon weight={item.active ? "duotone" : "regular"} className="w-6 h-6" />
              <span className="font-semibold text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Bottom User Area */}
        <div className="mt-auto bg-white/60 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-kawaii-sakura/30 overflow-hidden">
             {/* cute generic avatar placeholder */}
             <div className="w-full h-full bg-kawaii-sakura flex items-center justify-center">
                 <span className="text-white font-bold">L</span>
             </div>
          </div>
          <div className="text-left flex-1 min-w-0">
             <p className="text-sm font-bold text-gray-800 truncate">Luna</p>
             <p className="text-xs text-gray-500 truncate">Free Plan</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Sidebar;
