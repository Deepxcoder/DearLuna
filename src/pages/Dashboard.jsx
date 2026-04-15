import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { Drop, Barbell, X, CaretLeft, CaretRight, Check } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import { getCalendarGrid, getDayPhase, formatMonthHeader } from '../utils/dateUtils';
import { useCycleLogic } from '../hooks/useCycleLogic';

const Dashboard = () => {
  const { profile, dailyLog, updateDailyLog, loading } = useUserProfile();
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  
  // Guard for loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-kawaii-bg">
        <div className="text-kawaii-earth font-black text-2xl animate-pulse flex items-center gap-3">
          <span className="text-4xl">🌙</span> Loading your glow...
        </div>
        <p className="mt-4 text-kawaii-earthLight text-xs font-bold uppercase tracking-widest">Checking your stars</p>
      </div>
    );
  }

  // Handle Guest / Missing Profile
  if (!profile) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-8 text-center bg-kawaii-bg">
        <Sticker emoji="✨" className="mb-4" rotate={0} style={{ fontSize: '4rem' }} />
        <h2 className="text-4xl font-black text-kawaii-earth mb-4">Hello, new star!</h2>
        <p className="text-lg text-kawaii-earthLight max-w-md mb-8">
          We couldn't find your profile. If you're new here, please head to **Settings** to set up your cycle!
        </p>
        <button 
           onClick={() => window.location.href = '/settings'}
           className="px-8 py-4 bg-kawaii-pink text-kawaii-earth rounded-full font-bold shadow-soft hover:scale-105 transition-transform"
        >
          Setup My Profile
        </button>
      </div>
    );
  }

  // Ensure dailyLog has defaults
  const activeLog = dailyLog || {
    rituals: { water: 0, meditation: false, exercise: false },
    habits: { skincare: false, reading: false, sleep: false, journaling: false },
    mood: '', energy: '', symptoms: [], reflection: ''
  };

  // Dynamic Cycle Logic
  const cycleData = useCycleLogic(profile.lastPeriodDate);
  const today = new Date();
  const calendarGrid = getCalendarGrid(today);

  const rituals = activeLog.rituals || { water: 0, meditation: false, exercise: false };

  const handleWaterAdd = (amount) => {
    updateDailyLog({
      rituals: { ...rituals, water: Math.min(rituals.water + amount, 2000) }
    });
  };

  const toggleRitual = (name) => {
    updateDailyLog({
      rituals: { ...rituals, [name]: !rituals[name] }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 w-full max-w-6xl mx-auto flex flex-col gap-10 min-h-screen font-body relative lg:pl-16"
    >
      {/* BACKGROUND STICKERS */}
      <Sticker emoji="✨" className="top-8 left-[40%]" rotate={15} style={{ fontSize: '1rem', zIndex: 0 }} />
      <Sticker emoji="💖" className="top-32 left-[10%]" rotate={-15} style={{ fontSize: '1.2rem', zIndex: 0 }} />
      <Sticker emoji="🐻" className="top-24 right-[8%]" rotate={20} style={{ fontSize: '1.8rem', padding: '0.3rem', zIndex: 0 }} />
      <Sticker emoji="⭐" className="top-36 right-[25%]" rotate={-10} style={{ fontSize: '1rem', zIndex: 0 }} />

      {/* HEADER SECTION */}
      <header className="flex justify-between items-end relative z-10 w-full">
        <div>
          <h2 className="font-cursive text-4xl text-kawaii-earthLight font-bold mb-1">Welcome back, {profile.name}!</h2>
          <h1 className="text-5xl font-extrabold text-kawaii-earth tracking-tight">Your Daily Glow</h1>
        </div>
        
        <div className="relative bg-white rounded-3xl rounded-tl-none px-6 py-4 shadow-sm max-w-sm border-2 border-white/40">
          <Sticker emoji="🐾" className="-top-6 -left-6" rotate={-15} style={{ fontSize: '1.5rem', padding: '0.3rem' }} />
          <p className="text-sm italic font-medium text-kawaii-earth leading-relaxed">
            "You are amazing today, {profile.name}! Trust the rhythm of your body."
          </p>
        </div>
      </header>

      {/* MIDDLE SECTION: CYCLE + CALENDAR */}
      <div className="flex flex-col lg:flex-row gap-8 w-full z-10">
        
        {/* CYCLE TRACKER CARD */}
        <div className="flex-[3] bg-white rounded-[40px] p-8 shadow-sm relative flex border-2 border-white/50">
           <Sticker emoji="🐾" className="-top-4 -left-4" rotate={15} style={{ fontSize: '1.5rem' }} />
           
           <div className="w-1/2 flex flex-col justify-center relative">
             <h3 className="text-2xl font-bold text-kawaii-earth flex items-center gap-3">
               Your Cycle 
               <span className="text-xs font-bold uppercase bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full tracking-wider">
                 {cycleData.currentPhase} Phase
               </span>
             </h3>

             <div className="relative mt-8 w-60 h-60 mx-auto">
               <div className="absolute inset-2 border-[12px] border-[#957DAD] rounded-full opacity-20"></div>
               <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                 <circle cx="120" cy="120" r="108" stroke="#FCE4EC" strokeWidth="12" fill="none" />
                 <circle cx="120" cy="120" r="108" stroke="#D291BC" strokeWidth="12" fill="none" strokeDasharray="678" strokeDashoffset={678 - (678 * (28 - cycleData.daysUntilPeriod)/28)} strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl text-kawaii-earth">🌙</span>
                 <span className="text-4xl font-extrabold text-[#4A3525] leading-none mt-1">Day {28 - cycleData.daysUntilPeriod}</span>
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Of 28</span>
               </div>
               <Sticker emoji="🐱" className="-left-6 top-1/2 -translate-y-1/2" rotate={0} style={{ fontSize: '1rem', padding: '0.1rem', border: '2px solid white' }} />
             </div>
           </div>

           <div className="w-1/2 flex flex-col justify-center pl-8">
              <h4 className="text-xs font-bold tracking-widest text-[#7A593E] uppercase pt-8">Next Period In</h4>
              <p className="text-4xl font-black text-kawaii-earth mt-1">{cycleData.daysUntilPeriod} Days</p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-6 bg-[#FFD1DC] rounded-full mt-1"></div>
                  <div>
                    <h5 className="font-bold text-kawaii-earth text-sm">Next Period</h5>
                    <p className="text-xs text-[#7A593E]">{cycleData.nextPeriod}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-6 bg-yellow-100 rounded-full mt-1"></div>
                  <div>
                    <h5 className="font-bold text-kawaii-earth text-sm">Ovulation</h5>
                    <p className="text-xs text-[#7A593E]">{cycleData.ovulationDay}</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* MINI CALENDAR CARD */}
        <div className="flex-[2] bg-white rounded-[40px] p-8 pb-10 shadow-sm relative border-2 border-white/50">
          <Sticker emoji="🐻" className="-top-4 -right-4" rotate={15} style={{ fontSize: '2rem', padding: '0.4rem', border: '4px solid white' }} />
          
          <div className="flex justify-between items-center mb-6">
            <h3 
              onClick={() => navigate('/calendar')}
              className="text-xl font-bold text-kawaii-earth cursor-pointer hover:text-kawaii-pink transition-colors flex items-center gap-2 group"
              title="Go to full calendar"
            >
              {formatMonthHeader(today)}
              <CaretRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-kawaii-earthLight uppercase tracking-widest">Today</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 mb-6">
             {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
               <div key={`col-${i}`} className="text-center text-[10px] font-bold text-[#7A593E] uppercase">{d}</div>
             ))}
             {calendarGrid.slice(0, 21).map((day, i) => {
               const phase = getDayPhase(day.date, profile.lastPeriodDate);
               const isFertile = phase === 'fertile';
               const isPeriod = phase === 'period';
               
               return (
                 <div key={i} className="flex justify-center items-center relative h-8">
                   {isFertile && day.isCurrentMonth && (
                     <div className="absolute inset-x-0 inset-y-1 bg-[#FFD1DC]/30 rounded-full transition-all"></div>
                   )}
                   <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full
                     ${!day.isCurrentMonth ? 'text-gray-300' : 'text-kawaii-earth'} 
                     ${day.isToday ? 'bg-gradient-to-r from-kawaii-pink to-kawaii-lilac text-white shadow-sm' : ''}
                   `}>
                     {isPeriod && day.isCurrentMonth ? <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div> : day.dayNumber}
                   </span>
                 </div>
               )
             })}
          </div>
        </div>
      </div>

      {/* RITUALS SECTION */}
      <div className="flex flex-col relative z-10 w-full mb-12">
         <h3 className="text-2xl font-bold text-kawaii-earth mb-4">Daily Rituals</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <Sticker emoji="💧" className="-top-12 left-[28%]" rotate={-5} style={{ fontSize: '1.5rem', zIndex: 10 }} />
            
            <div 
              onClick={() => setActiveModal('water')}
              className="bg-white rounded-[32px] p-6 flex flex-row items-center justify-between shadow-sm border border-white/50 cursor-pointer hover:scale-[1.02] transition-transform"
            >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center shrink-0">
                  <Drop weight="fill" size={24} />
                </div>
                <div className="flex-1 px-4">
                  <h4 className="text-sm font-bold text-kawaii-earth">Water</h4>
                  <p className="text-xs text-kawaii-earthLight font-medium">{(rituals.water / 1000).toFixed(1)} / 2.0<br/>Liters</p>
                </div>
                <div className="w-12 h-12 relative shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="#F3F4F6" strokeWidth="4" fill="none" />
                    <circle cx="24" cy="24" r="20" stroke="#60A5FA" strokeWidth="4" fill="none" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (rituals.water / 2000))} strokeLinecap="round" />
                  </svg>
                </div>
            </div>

            <div 
              onClick={() => toggleRitual('meditation')}
              className="bg-white rounded-[32px] p-6 flex flex-row items-center justify-between shadow-sm border border-white/50 cursor-pointer hover:scale-[1.02] transition-transform"
            >
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-400 flex items-center justify-center shrink-0">
                  <span className="text-xl">🧘‍♀️</span>
                </div>
                <div className="flex-1 px-4">
                  <h4 className="text-sm font-bold text-kawaii-earth">Meditation</h4>
                  <p className="text-xs text-kawaii-earthLight font-medium">Daily<br/>Session</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${rituals.meditation ? 'bg-purple-100 border-purple-200' : 'bg-gray-50 border-gray-100'}`}>
                  {rituals.meditation && <Check className="text-purple-600 font-bold" size={20} />}
                </div>
            </div>

            <div 
              onClick={() => toggleRitual('exercise')}
              className="bg-white rounded-[32px] p-6 flex flex-row items-center justify-between shadow-sm border border-white/50 cursor-pointer hover:scale-[1.02] transition-transform"
            >
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center shrink-0">
                  <Barbell weight="fill" size={24} />
                </div>
                <div className="flex-1 px-4">
                  <h4 className="text-sm font-bold text-kawaii-earth">Exercise</h4>
                  <p className="text-xs text-kawaii-earthLight font-medium">Completed<br/>Today</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 border-2 ${rituals.exercise ? 'bg-orange-100 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                  {rituals.exercise && <Check className="text-orange-600 font-bold" size={20} />}
                </div>
            </div>
         </div>
      </div>

      {/* DAILY REFLECTION SECTION */}
      <div className="flex flex-col relative z-10 w-full mb-20">
         <h3 className="text-2xl font-bold text-kawaii-earth mb-4">Daily Reflection</h3>
         <div className="bg-yellow-100/60 backdrop-blur-sm rounded-[32px] p-8 border-2 border-white/50 shadow-sm relative overflow-hidden h-48">
            <textarea 
              value={activeLog.reflection || ''}
              onChange={(e) => updateDailyLog({ reflection: e.target.value })}
              className="w-full h-full bg-transparent border-none outline-none text-kawaii-earth font-medium placeholder-kawaii-earthLight/60 resize-none text-lg"
              placeholder="How are you feeling today? Any tiny moments of joy?"
            />
            <Sticker emoji="✍️" className="bottom-4 right-4" rotate={10} style={{ fontSize: '2rem' }} />
         </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal === 'water' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/20 backdrop-blur-md" onClick={() => setActiveModal(null)} />
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative bg-white rounded-[40px] shadow-xl p-8 w-[400px] border-[3px] border-white/60">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} weight="bold" /></button>
                <div className="flex flex-col items-center">
                  <Sticker emoji="💧" style={{ fontSize: '4rem' }} rotate={0} />
                  <h3 className="text-2xl font-bold text-kawaii-earth mt-4 mb-6">Hydration</h3>
                  <div className="flex gap-4 w-full mb-6">
                    <button onClick={() => handleWaterAdd(250)} className="flex-1 py-4 bg-blue-100 rounded-full font-bold text-blue-600">+ 250ml</button>
                    <button onClick={() => handleWaterAdd(500)} className="flex-1 py-4 bg-blue-100 rounded-full font-bold text-blue-600">+ 500ml</button>
                  </div>
                  {rituals.water > 0 && (
                    <button onClick={() => updateDailyLog({ rituals: { ...rituals, water: 0 } })} className="text-xs text-red-400 font-bold uppercase tracking-widest hover:underline">Reset Today</button>
                  )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
