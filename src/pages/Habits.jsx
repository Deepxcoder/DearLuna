import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Plus, Check } from '@phosphor-icons/react';
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { getCalendarGrid } from '../utils/dateUtils';
import { useUserProfile } from '../context/UserProfileContext';

const Habits = () => {
  const { profile, updateProfile, dailyLog, updateDailyLog, currentDate, setCurrentDate, loading } = useUserProfile();
  const [view, setView] = React.useState('Day'); // 'Day' | 'Month' | 'Year'

  if (loading || !profile || !dailyLog) return <div className="p-8 text-kawaii-earth">Growing your garden...</div>;

  const handlePrev = () => {
    const d = new Date(currentDate);
    let next;
    if (view === 'Day') next = subDays(d, 1);
    else if (view === 'Month') next = subMonths(d, 1);
    else if (view === 'Year') next = subYears(d, 1);
    setCurrentDate(format(next, 'yyyy-MM-dd'));
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    let next;
    if (view === 'Day') next = addDays(d, 1);
    else if (view === 'Month') next = addMonths(d, 1);
    else if (view === 'Year') next = addYears(d, 1);
    setCurrentDate(format(next, 'yyyy-MM-dd'));
  };

  const getLabel = () => {
    const d = new Date(currentDate);
    if (view === 'Day') return format(d, 'MMMM do');
    if (view === 'Month') return format(d, 'MMMM yyyy');
    return format(d, 'yyyy');
  };

  const habits = dailyLog.habits || {};
  const rituals = dailyLog.rituals || {};

  const toggleHabit = (h) => {
    const nextVal = !habits[h];
    updateDailyLog({ habits: { ...habits, [h]: nextVal } });
    
    // Simple Pet XP Logic
    if (nextVal) {
      let nextXp = profile.pet.xp + 10;
      let nextLevel = profile.pet.level;
      if (nextXp >= 100) {
        nextXp = 0;
        nextLevel += 1;
      }
      updateProfile({ pet: { ...profile.pet, xp: nextXp, level: nextLevel } });
    }
  };

  const monthsOfYear = eachMonthOfInterval({
    start: startOfYear(new Date(currentDate)),
    end: endOfYear(new Date(currentDate))
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center max-w-6xl mx-auto p-8 font-body relative lg:pl-16"
    >
      <div className="flex flex-col w-full">
        {/* HEADER CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 w-full">
          <h2 className="text-4xl font-extrabold text-kawaii-earth tracking-tight">Habits</h2>

          <div className="flex gap-6 items-center w-full lg:w-auto overflow-hidden">
             <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm shrink-0">
               <CaretLeft weight="bold" onClick={handlePrev} className="text-kawaii-earthLight cursor-pointer hover:text-kawaii-earth hover:scale-125 transition-transform" />
               <span className="font-bold text-kawaii-earth min-w-[140px] text-center">{getLabel()}</span>
               <CaretRight weight="bold" onClick={handleNext} className="text-kawaii-earthLight cursor-pointer hover:text-kawaii-earth hover:scale-125 transition-transform" />
             </div>

             <div className="flex bg-white/40 backdrop-blur-md rounded-full border border-white/60 p-1 shadow-inner shrink-0">
               {['Day', 'Month', 'Year'].map(v => (
                 <button key={v} onClick={() => setView(v)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${view === v ? 'bg-[#7A593E]/80 text-white shadow-md' : 'text-kawaii-earth/60 hover:text-kawaii-earth'}`}>{v}</button>
               ))}
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
            <div className="flex-[2] flex flex-col gap-6 relative">
              <AnimatePresence mode="wait">
                 {view === 'Day' && (
                   <motion.div key="day" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 w-full">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <HabitCard emoji="🧴" title="Skincare" isActive={habits.skincare} onClick={() => toggleHabit('skincare')} color="bg-blue-100" />
                        <HabitCard emoji="📖" title="Journaling" isActive={habits.journaling} onClick={() => toggleHabit('journaling')} color="bg-pink-100" rotate={15} />
                        <HabitCard emoji="📚" title="Reading" isActive={habits.reading} onClick={() => toggleHabit('reading')} color="bg-orange-100" rotate={-5} />
                        <HabitCard emoji="☁️" title="Sleep" isActive={habits.sleep} onClick={() => toggleHabit('sleep')} color="bg-purple-100" rotate={5} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="bg-yellow-100 rounded-[8px] p-6 shadow-sm relative transform -rotate-1 min-h-[160px]" style={{ borderBottomRightRadius: '32px' }}>
                           <h4 className="font-bold text-kawaii-earth text-lg mb-1">Daily Reflection</h4>
                           <textarea 
                             value={dailyLog.reflection || ''}
                             onChange={(e) => updateDailyLog({ reflection: e.target.value })}
                             className="w-full h-16 bg-white/60 rounded-md border border-white p-2 text-xs outline-none focus:bg-white transition-colors" 
                             placeholder="How are you feeling today?"
                           />
                           <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-yellow-200 to-transparent rounded-tl-xl border-t border-l border-white/40"></div>
                        </div>
                        <div className="flex flex-col">
                           <h4 className="font-bold text-kawaii-earth text-lg mb-4">Water Tracker</h4>
                           <div className="flex flex-wrap gap-2">
                               {[...Array(10)].map((_, i) => (
                                 <Sticker 
                                   key={i} 
                                   emoji="💧" 
                                   onClick={() => updateDailyLog({ rituals: { ...rituals, water: (i+1)*200 } })}
                                   className="hover:scale-110 transition-transform cursor-pointer" 
                                   rotate={i%2===0?5:-5} 
                                   style={{ 
                                     fontSize: '1.8rem', padding: 0.1, 
                                     background: rituals.water >= (i+1)*200 ? '#93C5FD' : '#EFF6FF', 
                                     border: 'none', boxShadow: 'none' 
                                   }} 
                                 />
                               ))}
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 )}

                 {/* MONTH/YEAR VIEWS COULD BE ENHANCED LATER BUT KEEPING STRUCTURE */}
              </AnimatePresence>
            </div>

            {/* PET GROWTH SIDEBAR */}
            <div className="flex-[1] flex flex-col gap-6 w-full lg:w-80">
               <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 shadow-sm border border-white flex flex-col items-center relative text-center min-h-[360px]">
                  <div className="w-full flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-kawaii-earth">Pet Growth</h3>
                     <span className="text-sm font-bold text-kawaii-earthLight">Level {profile.pet.level}</span>
                  </div>
                  <div className="relative w-full flex justify-center mb-8 h-40 items-center">
                     <Sticker emoji="🐻" rotate={0} style={{ fontSize: '5rem', border: 'none', boxShadow: 'none', background: 'transparent' }} />
                  </div>
                  <div className="w-full mt-auto">
                     <div className="flex justify-between w-full mb-2 uppercase text-[10px] font-black tracking-widest text-kawaii-earthLight">
                        <span>Happiness</span>
                        <span>{profile.pet.xp}% XP</span>
                     </div>
                     <div className="w-full h-3 bg-white/80 rounded-full border border-gray-100 overflow-hidden flex shadow-inner">
                        <div className="h-full bg-gradient-to-r from-kawaii-earthLight to-kawaii-pink transition-all duration-500" style={{ width: `${profile.pet.xp}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const HabitCard = ({ emoji, title, isActive, onClick, color, rotate = 0 }) => (
  <div 
    onClick={onClick}
    className={`${color} rounded-[24px] p-6 shadow-sm border border-white relative flex flex-col h-40 cursor-pointer hover:brightness-95 transition-all
    ${isActive ? 'ring-4 ring-white shadow-lg brightness-105' : 'opacity-80'}`}
  >
     <Sticker emoji={emoji} className="absolute top-4 left-4" rotate={rotate} style={{ fontSize: '3rem' }} />
     <div className="absolute top-4 right-6 text-right">
        <h4 className="font-extrabold text-kawaii-earth text-lg">{title}</h4>
        {isActive && <Check size={28} className="text-[#A85A6B] inline-block mt-2" weight="bold" />}
     </div>
  </div>
);

export default Habits;
