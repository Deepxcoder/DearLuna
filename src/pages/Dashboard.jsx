import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { Drop, Barbell, X, CaretLeft, CaretRight, Check } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import { getCalendarGrid, getDayPhase, formatMonthHeader } from '../utils/dateUtils';
import { useCycleLogic } from '../hooks/useCycleLogic';
import { getShuffledAffirmations, personalise } from '../utils/affirmations';
import { format } from 'date-fns';

const Dashboard = () => {
  const { profile, dailyLog, updateDailyLog, loading, currentDate, setCurrentDate, needsPeriodSetup, setPeriodStartDate } = useUserProfile();
  const [activeModal, setActiveModal] = useState(null);
  const [periodInput, setPeriodInput] = useState('');
  const navigate = useNavigate();

  // ── Rotating Affirmations ──────────────────────────────────────────────────
  const affirmationsRef = useRef(getShuffledAffirmations());
  const [affirmIndex, setAffirmIndex] = useState(0);
  const [affirmVisible, setAffirmVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setAffirmVisible(false);
      setTimeout(() => {
        setAffirmIndex(prev => (prev + 1) % affirmationsRef.current.length);
        setAffirmVisible(true);
      }, 500); // wait for fade-out before switching text
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (needsPeriodSetup) {
      setPeriodInput(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [needsPeriodSetup]);

  const currentAffirmation = personalise(
    affirmationsRef.current[affirmIndex],
    profile?.name
  );
  
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
  const selectedDate = new Date(`${currentDate}T00:00:00`);
  const calendarGrid = getCalendarGrid(selectedDate);
  const cycleLength = profile?.settings?.cycleLength || 28;
  const rawCycleDay = cycleLength - (cycleData.daysUntilPeriod ?? cycleLength);
  const cycleDay = Math.min(cycleLength, Math.max(1, rawCycleDay));
  const ringProgress = cycleDay / cycleLength;
  const ringRadius = 108;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ovulationDay = Math.max(1, cycleLength - 14);
  const fertileStartDay = Math.max(1, ovulationDay - 4);
  const lutealStartDay = Math.min(cycleLength, ovulationDay + 1);
  const daysToFertileStart = fertileStartDay - cycleDay;
  const daysToLuteal = lutealStartDay - cycleDay;
  const fertileHint = daysToFertileStart <= 0
    ? 'Fertility window is active'
    : daysToFertileStart === 1
      ? 'Fertility window starts tomorrow'
      : `Fertility window starts in ${daysToFertileStart} days`;
  const lutealHint = daysToLuteal <= 0
    ? 'Luteal phase has started'
    : `Luteal phase expected in ${daysToLuteal} days`;
  const moonMarkers = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒'];

  const rituals = activeLog.rituals || { water: 0, meditation: false, exercise: false };
  const waterTarget = profile?.settings?.waterTarget || 2000;
  const waterProgress = Math.min(100, ((rituals.water || 0) / waterTarget) * 100);
  const meditationProgress = rituals.meditation ? 100 : 0;
  const exerciseProgress = rituals.exercise ? 100 : 0;

  const handleWaterAdd = (amount) => {
    updateDailyLog({
      rituals: { ...rituals, water: Math.min((rituals.water || 0) + amount, waterTarget) }
    });
  };

  const toggleRitual = (name) => {
    updateDailyLog({
      rituals: { ...rituals, [name]: !rituals[name] }
    });
  };

  const setMeditation = (isDone) => {
    updateDailyLog({
      rituals: { ...rituals, meditation: isDone }
    });
  };

  const setExercise = (isDone) => {
    updateDailyLog({
      rituals: { ...rituals, exercise: isDone }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ui-p lg:pl-[clamp(1.5rem,4vw,3rem)] w-full h-full grid grid-rows-[auto_1fr_auto] ui-gap-4 font-body relative overflow-hidden"
    >
      {/* BACKGROUND STICKERS */}
      <Sticker emoji="✨" className="top-8 left-[40%]" rotate={15} style={{ fontSize: '1rem', zIndex: 0 }} />
      <Sticker emoji="💖" className="top-32 left-[10%]" rotate={-15} style={{ fontSize: '1.2rem', zIndex: 0 }} />
      <Sticker emoji="🐻" className="top-24 right-[8%]" rotate={20} style={{ fontSize: '1.8rem', padding: '0.3rem', zIndex: 0 }} />
      <Sticker emoji="⭐" className="top-36 right-[25%]" rotate={-10} style={{ fontSize: '1rem', zIndex: 0 }} />

      {/* HEADER SECTION */}
      <header className="flex justify-between items-end relative z-10 w-full">
        <div>
          <h2 className="font-cursive ui-text-2xl text-kawaii-earthLight font-bold mb-1">Welcome back, {profile.name}!</h2>
          <h1 className="ui-text-3xl font-extrabold text-kawaii-earth tracking-tight">Your Daily Glow</h1>
        </div>
        
        {/* Rotating Affirmation Bubble */}
        <div className="relative bg-white rounded-3xl rounded-tl-none px-6 py-4 shadow-sm max-w-sm border-2 border-white/40 min-h-[70px] flex items-center">
          <Sticker emoji="🐾" className="-top-6 -left-6" rotate={-15} style={{ fontSize: '1.5rem', padding: '0.3rem' }} />
          <AnimatePresence mode="wait">
            <motion.p
              key={affirmIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: affirmVisible ? 1 : 0, y: affirmVisible ? 0 : -6 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="text-sm italic font-medium text-kawaii-earth leading-relaxed"
            >
              "{currentAffirmation}"
            </motion.p>
          </AnimatePresence>
          {/* Progress dots */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {[0,1,2].map(i => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-kawaii-pink/40"
                style={{ opacity: i === affirmIndex % 3 ? 1 : 0.3 }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* MIDDLE SECTION: CYCLE + CALENDAR */}
      <div className="flex flex-col lg:flex-row gap-6 w-full min-h-0 relative z-10 flex-1">
        
        {/* CYCLE TRACKER CARD */}
        <div className="flex-[3] bg-white ui-rounded ui-p shadow-sm relative flex flex-col lg:flex-row border-2 border-white/50 gap-6">
          <Sticker emoji="🐾" className="-top-4 -left-4" rotate={15} style={{ fontSize: '1.5rem' }} />

          <div className="flex-1 flex flex-col justify-center relative">
            <h3 className="ui-text-xl font-bold text-kawaii-earth flex items-center gap-3">
              Your Cycle
              <span className="ui-text-xs font-bold bg-[#F7F4B6] text-[#6A5A2A] px-3 py-1 rounded-full tracking-wide italic">
                {cycleData.currentPhase} Phase
              </span>
            </h3>

            <div className="relative mt-4 aspect-square mx-auto flex items-center justify-center ui-cycle-dial">
              {moonMarkers.map((moon, idx) => {
                const angle = (idx / moonMarkers.length) * 360 - 90;
                return (
                  <div
                    key={`moon-${idx}`}
                    className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#EADFE4] shadow-sm flex items-center justify-center text-sm"
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(130px) rotate(${-angle}deg)` }}
                  >
                    {moon}
                  </div>
                );
              })}

              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r={ringRadius} stroke="var(--kawaii-yellow)" strokeWidth="11" fill="none" opacity="0.4" />
                <circle
                  cx="120"
                  cy="120"
                  r={ringRadius}
                  stroke="var(--kawaii-pink)"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference - (ringCircumference * ringProgress)}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="ui-text-xl text-kawaii-earth">🌙</span>
                <span className="ui-text-2xl font-extrabold text-kawaii-earth leading-none mt-1">Day {cycleDay}</span>
                <span className="ui-text-xs font-bold text-kawaii-earthLight uppercase tracking-widest mt-1">Of {cycleLength}</span>
              </div>

              <div className="absolute left-[5%] top-[53%] -translate-y-1/2 text-xl">🐱</div>
              <div className="absolute right-[5%] top-[53%] -translate-y-1/2 text-xl">🐱</div>
              <div className="absolute bottom-[2%] left-[36%] text-lg">🐾</div>
              <div className="absolute bottom-[2%] right-[36%] text-lg">🐾</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center lg:pl-4">
            <h4 className="ui-text-xs font-bold tracking-widest text-[#6E5C4F] uppercase">Next Period In</h4>
            <p className="ui-text-3xl font-black text-kawaii-earth mt-1">{cycleData.daysUntilPeriod} Days</p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-4 bg-[#7C4A59] rounded-full mt-1" />
                <p className="text-sm font-semibold text-[#4A3525] leading-tight">{fertileHint}</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-4 bg-[#DAD6DF] rounded-full mt-1" />
                <p className="text-sm font-semibold text-[#4A3525] leading-tight">{lutealHint}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/calendar')}
              className="mt-6 self-start bg-gradient-to-r from-[#DFA3C8] to-[#D19BC0] text-white font-bold px-7 py-3 rounded-full shadow-[0_10px_28px_rgba(198,123,169,0.35)] hover:scale-[1.02] transition-transform"
            >
              Log Symptoms ✨
            </button>
          </div>
        </div>

        {/* MINI CALENDAR CARD */}
        <div className="flex-[2] bg-white ui-rounded ui-p-sm shadow-sm relative border-2 border-white/50 flex flex-col min-h-0">
          <Sticker emoji="🐻" className="-top-4 -right-4" rotate={15} style={{ fontSize: '2rem', padding: '0.4rem', border: '4px solid white' }} />
          
          <div className="flex justify-between items-center mb-6">
            <h3 
              onClick={() => navigate('/calendar')}
              className="ui-text-lg font-bold text-kawaii-earth cursor-pointer hover:text-kawaii-pink transition-colors flex items-center gap-2 group"
              title="Go to full calendar"
            >
              {formatMonthHeader(selectedDate)}
              <CaretRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-kawaii-earthLight uppercase tracking-widest">{currentDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-x-1 gap-y-1 flex-1">
             {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
               <div key={`col-${i}`} className="text-center text-[10px] font-bold text-[#7A593E] uppercase py-1">{d}</div>
             ))}
             {calendarGrid.slice(0, 35).map((day, i) => {
               const phase = getDayPhase(day.date, profile.lastPeriodDate);
               const isFertile = phase === 'fertile';
               const isPeriod = phase === 'period';
               
               return (
                 <div
                   key={i}
                   className="flex justify-center items-center relative h-7 cursor-pointer"
                   onClick={() => day.isCurrentMonth && setCurrentDate(format(day.date, 'yyyy-MM-dd'))}
                 >
                   {isFertile && day.isCurrentMonth && (
                     <div className="absolute inset-0 bg-[#FFD1DC]/30 rounded-full"></div>
                   )}
                   <span className={`relative z-10 text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full
                     ${!day.isCurrentMonth ? 'text-gray-300' : 'text-kawaii-earth'} 
                     ${format(day.date, 'yyyy-MM-dd') === currentDate ? 'bg-gradient-to-br from-kawaii-pink to-kawaii-lilac text-white shadow-sm' : ''}
                   `}>
                     {isPeriod && day.isCurrentMonth
                       ? <span className="block w-1.5 h-1.5 bg-red-400 rounded-full" />
                       : day.dayNumber
                     }
                   </span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: RITUALS + REFLECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 w-full z-10 relative">
        {/* RITUALS */}
        <div className="flex flex-col">
           <h3 className="ui-text-lg font-bold text-kawaii-earth ui-mb-4">Daily Rituals</h3>
           {/* Sticker lives OUTSIDE the grid so it doesn't occupy a grid cell */}
           <div className="relative">
             <Sticker emoji="💧" className="-top-4 left-[33%]" rotate={-5} style={{ fontSize: '1.2rem', zIndex: 10 }} />
             <div className="grid grid-cols-3 gap-4">

               {/* Water */}
               <div
                 onClick={() => setActiveModal('water')}
                 className="bg-white rounded-[32px] p-4 flex flex-row items-center justify-between shadow-sm border border-white/50 cursor-pointer hover:scale-[1.02] transition-transform"
               >
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center shrink-0">
                     <Drop weight="fill" size={20} />
                   </div>
                   <div className="flex-1 px-3">
                     <h4 className="text-sm font-bold text-kawaii-earth">Water</h4>
                     <p className="text-[11px] text-kawaii-earthLight font-medium">{(rituals.water / 1000).toFixed(1)} / 2.0L</p>
                   </div>
                   <div className="w-10 h-10 relative shrink-0">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                       <circle cx="20" cy="20" r="16" stroke="#F3F4F6" strokeWidth="4" fill="none" />
                       <circle cx="20" cy="20" r="16" stroke="#60A5FA" strokeWidth="4" fill="none"
                         strokeDasharray="100.5"
                         strokeDashoffset={100.5 - (100.5 * (rituals.water / 2000))}
                         strokeLinecap="round" />
                     </svg>
                   </div>
               </div>

               {/* Meditation */}
               <div
                 onClick={() => setActiveModal('meditation')}
                 className="bg-white rounded-[32px] p-4 flex flex-row items-center justify-between shadow-sm border border-white/50 cursor-pointer hover:scale-[1.02] transition-transform"
               >
                   <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-400 flex items-center justify-center shrink-0">
                     <span className="text-lg">🧘‍♀️</span>
                   </div>
                   <div className="flex-1 px-3">
                     <h4 className="text-sm font-bold text-kawaii-earth">Meditation</h4>
                     <p className="text-[11px] text-kawaii-earthLight font-medium">{rituals.meditation ? '15 / 15 min' : '0 / 15 min'}</p>
                   </div>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                     rituals.meditation ? 'bg-purple-100 border-purple-200' : 'bg-gray-50 border-gray-100'
                   }`}>
                     {rituals.meditation && <Check className="text-purple-600" size={18} />}
                   </div>
               </div>

               {/* Exercise */}
               <div
                 onClick={() => setActiveModal('exercise')}
                 className="bg-white rounded-[32px] p-4 flex flex-row items-center justify-between shadow-sm border border-white/50 cursor-pointer hover:scale-[1.02] transition-transform"
               >
                   <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center shrink-0">
                     <Barbell weight="fill" size={20} />
                   </div>
                   <div className="flex-1 px-3">
                     <h4 className="text-sm font-bold text-kawaii-earth">Exercise</h4>
                     <p className="text-[11px] text-kawaii-earthLight font-medium">Completed Today</p>
                   </div>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                     rituals.exercise ? 'bg-orange-100 border-orange-200' : 'bg-gray-50 border-gray-100'
                   }`}>
                     {rituals.exercise && <Check className="text-orange-600" size={18} />}
                   </div>
               </div>

             </div>
           </div>
        </div>

        {/* DAILY REFLECTION */}
        <div className="flex flex-col">
           <h3 className="ui-text-lg font-bold text-kawaii-earth ui-mb-4">Reflection</h3>
           <div className="bg-yellow-100/60 backdrop-blur-sm rounded-[32px] p-4 border-2 border-white/50 shadow-sm relative overflow-hidden flex-1 min-h-[100px]">
              <textarea 
                value={activeLog.reflection || ''}
                onChange={(e) => updateDailyLog({ reflection: e.target.value })}
                className="w-full h-full bg-transparent border-none outline-none text-kawaii-earth font-medium placeholder-kawaii-earthLight/60 resize-none text-sm leading-relaxed"
                placeholder="How are you feeling today?"
              />
              <Sticker emoji="✍️" className="bottom-2 right-2" rotate={10} style={{ fontSize: '1.5rem' }} />
           </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {needsPeriodSetup && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-7 border-2 border-white shadow-xl"
            >
              <h3 className="text-2xl font-black text-kawaii-earth mb-2">Set Your Period Start Date</h3>
              <p className="text-sm text-kawaii-earthLight font-semibold mb-5">
                We use this to sync your cycle, daily rituals, symptoms, and notes.
              </p>
              <input
                type="date"
                value={periodInput}
                onChange={(e) => setPeriodInput(e.target.value)}
                className="w-full bg-kawaii-bg border border-white rounded-2xl px-4 py-3 font-bold text-kawaii-earth outline-none"
              />
              <button
                onClick={() => setPeriodStartDate(periodInput)}
                disabled={!periodInput}
                className="mt-5 w-full py-3 rounded-2xl bg-kawaii-pink text-kawaii-earth font-black disabled:opacity-50"
              >
                Save & Continue
              </button>
            </motion.div>
          </div>
        )}
        {activeModal === 'water' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-white/30 backdrop-blur-md"
               onClick={() => setActiveModal(null)}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.85, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.85, y: 20 }}
               className="relative w-full max-w-[420px] bg-gradient-to-br from-white to-[#F9F3FF] rounded-[38px] shadow-[0_24px_80px_rgba(147,93,122,0.26)] p-7 border-[3px] border-white/80"
             >
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <X size={22} weight="bold" />
                </button>
                <div className="flex flex-col items-center">
                  <div className="-mt-16 mb-2 w-28 h-28 rounded-full bg-white border-[5px] border-white shadow-[0_10px_24px_rgba(100,120,220,0.35)] flex items-center justify-center text-6xl">
                    💧
                  </div>

                  <h3 className="text-2xl font-black text-kawaii-earth mb-1">Hydration</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-kawaii-earthLight mb-6">
                    {(rituals.water || 0)}ml / {waterTarget}ml
                  </p>

                  <div className="flex gap-4 w-full mb-5">
                    <button
                      onClick={() => handleWaterAdd(250)}
                      className="flex-1 py-4 rounded-full font-black text-[#7A3C61] text-3xl bg-gradient-to-r from-[#FFC6DD] to-[#D9C9FF] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_6px_14px_rgba(177,123,187,0.35)] hover:scale-[1.02] transition-transform"
                    >
                      +250ml
                    </button>
                    <button
                      onClick={() => handleWaterAdd(500)}
                      className="flex-1 py-4 rounded-full font-black text-[#55316F] text-3xl bg-gradient-to-r from-[#EFD2FF] to-[#C7B7FF] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_6px_14px_rgba(121,97,201,0.35)] hover:scale-[1.02] transition-transform"
                    >
                      +500ml
                    </button>
                  </div>

                  <div className="w-full h-14 rounded-full p-[3px] bg-gradient-to-r from-[#AFA1D9] to-[#9EADE2] shadow-[inset_0_2px_6px_rgba(255,255,255,0.55)]">
                    <div className="w-full h-full rounded-full bg-[#EAF2FF] overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#92A2FF] via-[#75C6F5] to-[#88C4FF] relative"
                        style={{ width: `${waterProgress}%` }}
                      >
                        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.85) 0 3px, transparent 4px), radial-gradient(circle at 60% 50%, rgba(255,255,255,0.8) 0 2px, transparent 3px), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.75) 0 2px, transparent 3px)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => updateDailyLog({ rituals: { ...rituals, water: waterTarget } })}
                      className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-blue-100 text-blue-500 hover:bg-blue-50"
                    >
                      Fill Goal
                    </button>
                    {rituals.water > 0 && (
                      <button
                        onClick={() => updateDailyLog({ rituals: { ...rituals, water: 0 } })}
                        className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-red-100 text-red-400 hover:bg-red-50"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
             </motion.div>
          </div>
        )}
        {activeModal === 'meditation' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/30 backdrop-blur-md"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="relative w-full max-w-[420px] bg-gradient-to-br from-white to-[#F6EDFF] rounded-[38px] shadow-[0_24px_80px_rgba(129,93,176,0.28)] p-7 border-[3px] border-white/80"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={22} weight="bold" />
              </button>
              <div className="flex flex-col items-center">
                <div className="-mt-16 mb-2 w-28 h-28 rounded-full bg-white border-[5px] border-white shadow-[0_10px_24px_rgba(140,102,191,0.35)] flex items-center justify-center text-6xl">
                  🧘‍♀️
                </div>

                <h3 className="text-2xl font-black text-kawaii-earth mb-1">Meditation</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-kawaii-earthLight mb-6">
                  {rituals.meditation ? '15 min complete' : 'Choose your session'}
                </p>

                <div className="flex gap-4 w-full mb-5">
                  <button
                    onClick={() => setMeditation(true)}
                    className="flex-1 py-4 rounded-full font-black text-[#6D3A8B] text-3xl bg-gradient-to-r from-[#EED4FF] to-[#DCC8FF] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_6px_14px_rgba(138,101,192,0.32)] hover:scale-[1.02] transition-transform"
                  >
                    10 min
                  </button>
                  <button
                    onClick={() => setMeditation(true)}
                    className="flex-1 py-4 rounded-full font-black text-[#503579] text-3xl bg-gradient-to-r from-[#E4D3FF] to-[#C9B9FF] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_6px_14px_rgba(104,86,173,0.32)] hover:scale-[1.02] transition-transform"
                  >
                    15 min
                  </button>
                </div>

                <div className="w-full h-14 rounded-full p-[3px] bg-gradient-to-r from-[#B8A7E9] to-[#AA9BDF] shadow-[inset_0_2px_6px_rgba(255,255,255,0.55)]">
                  <div className="w-full h-full rounded-full bg-[#F2EEFF] overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#CDB9FF] via-[#B497FF] to-[#A68AF4] relative"
                      style={{ width: `${meditationProgress}%` }}
                    >
                      <div className="absolute inset-0 opacity-65" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.85) 0 3px, transparent 4px), radial-gradient(circle at 62% 50%, rgba(255,255,255,0.8) 0 2px, transparent 3px), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.75) 0 2px, transparent 3px)' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setMeditation(true);
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-purple-100 text-purple-500 hover:bg-purple-50"
                  >
                    Mark Done
                  </button>
                  {rituals.meditation && (
                    <button
                      onClick={() => {
                        setMeditation(false);
                        setActiveModal(null);
                      }}
                      className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-red-100 text-red-400 hover:bg-red-50"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {activeModal === 'exercise' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/30 backdrop-blur-md"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="relative w-full max-w-[420px] bg-gradient-to-br from-white to-[#FFF4EA] rounded-[38px] shadow-[0_24px_80px_rgba(178,118,76,0.28)] p-7 border-[3px] border-white/80"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={22} weight="bold" />
              </button>
              <div className="flex flex-col items-center">
                <div className="-mt-16 mb-2 w-28 h-28 rounded-full bg-white border-[5px] border-white shadow-[0_10px_24px_rgba(189,125,78,0.35)] flex items-center justify-center">
                  <Barbell size={60} className="text-orange-400" weight="fill" />
                </div>

                <h3 className="text-2xl font-black text-kawaii-earth mb-1">Exercise</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-kawaii-earthLight mb-6">
                  {rituals.exercise ? 'Completed today' : 'Pick your session'}
                </p>

                <div className="flex gap-4 w-full mb-5">
                  <button
                    onClick={() => setExercise(true)}
                    className="flex-1 py-4 rounded-full font-black text-[#97511F] text-3xl bg-gradient-to-r from-[#FFDAB9] to-[#FFCFA1] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_6px_14px_rgba(199,141,89,0.32)] hover:scale-[1.02] transition-transform"
                  >
                    20 min
                  </button>
                  <button
                    onClick={() => setExercise(true)}
                    className="flex-1 py-4 rounded-full font-black text-[#7B431C] text-3xl bg-gradient-to-r from-[#FFD1A1] to-[#FFBE86] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_6px_14px_rgba(193,116,63,0.34)] hover:scale-[1.02] transition-transform"
                  >
                    30 min
                  </button>
                </div>

                <div className="w-full h-14 rounded-full p-[3px] bg-gradient-to-r from-[#E7B894] to-[#DCAB80] shadow-[inset_0_2px_6px_rgba(255,255,255,0.55)]">
                  <div className="w-full h-full rounded-full bg-[#FFF2E4] overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#FFCE9B] via-[#F4B277] to-[#EC9A5C] relative"
                      style={{ width: `${exerciseProgress}%` }}
                    >
                      <div className="absolute inset-0 opacity-65" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.85) 0 3px, transparent 4px), radial-gradient(circle at 62% 50%, rgba(255,255,255,0.8) 0 2px, transparent 3px), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.75) 0 2px, transparent 3px)' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setExercise(true);
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-orange-100 text-orange-500 hover:bg-orange-50"
                  >
                    Mark Done
                  </button>
                  {rituals.exercise && (
                    <button
                      onClick={() => {
                        setExercise(false);
                        setActiveModal(null);
                      }}
                      className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white border border-red-100 text-red-400 hover:bg-red-50"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
