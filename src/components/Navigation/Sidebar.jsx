import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SquaresFour, Drop, CalendarBlank, Sparkle, ChartBar, GearSix, SignOut } from '@phosphor-icons/react';
import Sticker from '../UI/Sticker';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: SquaresFour },
    { name: 'Cycle', path: '/cycle', icon: Drop },
    { name: 'Calendar', path: '/calendar', icon: CalendarBlank },
    { name: 'Analytics', path: '/analytics', icon: ChartBar },
    { name: 'Habits', path: '/habits', icon: Sparkle },
    { name: 'Settings', path: '/settings', icon: GearSix },
  ];

  return (
    <div className="w-[280px] h-[calc(100vh-2rem)] bg-white rounded-[40px] m-4 p-8 flex flex-col relative shadow-soft border-2 border-white/50 backdrop-blur-xl shrink-0 z-20">
      
      {/* Decorative Stickers */}
      <Sticker emoji="🌙" className="-top-3 right-6" rotate={15} style={{ fontSize: '1.5rem', padding: '0.4rem' }} />
      <Sticker emoji="✨" className="top-16 -right-4" rotate={-10} style={{ fontSize: '1rem', padding: '0.2rem' }} />
      <Sticker emoji="🤍" className="top-40 -right-6" rotate={20} style={{ fontSize: '1.2rem' }} />
      <Sticker emoji="🤍" className="top-48 -right-3" rotate={-15} style={{ fontSize: '0.8rem' }} />
      <Sticker emoji="🐻" className="bottom-40 -right-4" rotate={-25} style={{ fontSize: '1.8rem', padding: '0.5rem' }} />
      <Sticker emoji="💤" className="bottom-60 -left-4" rotate={10} style={{ fontSize: '1.2rem' }} />
      <Sticker emoji="🤍" className="bottom-16 -right-2" rotate={15} style={{ fontSize: '1rem' }} />
      <Sticker emoji="🤎" className="bottom-8 -right-5" rotate={-10} style={{ fontSize: '1.4rem' }} />

      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-12 relative z-10">
        <div className="w-12 h-12 rounded-full bg-kawaii-pink flex items-center justify-center shrink-0">
           <span className="text-xl">🌅</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-sticker text-kawaii-earth leading-none">Dear Luna</h1>
          <p className="text-[10px] font-bold tracking-widest text-kawaii-earthLight uppercase mt-1">Your Daily Glow</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 relative z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-kawaii-pink text-kawaii-earth shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] border border-white/50' 
                  : 'text-kawaii-earthLight hover:bg-kawaii-bg'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  weight={isActive ? "fill" : "regular"} 
                  className={`text-xl ${isActive ? 'text-kawaii-earth' : 'text-kawaii-earthLight'}`} 
                />
                <span className="text-base">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-8 pt-6 border-t border-kawaii-bg flex items-center gap-4 relative z-10">
        <div className="relative">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=E0BBE4" 
            alt="Alex Rivera" 
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <span className="text-sm font-bold text-kawaii-earth">Alex Rivera</span>
          <span className="text-xs text-kawaii-earthLight font-medium">Pro Member</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="p-2 text-kawaii-earthLight hover:bg-kawaii-bg rounded-full transition-colors"
          title="Sign Out"
        >
          <SignOut className="text-xl" />
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
