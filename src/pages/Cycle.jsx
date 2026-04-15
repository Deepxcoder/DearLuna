import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Drop } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import { useCycleLogic } from '../hooks/useCycleLogic';
import { getCalendarGrid, getDayPhase, formatMonthHeader, addMonths, subMonths } from '../utils/dateUtils';
import { format, addDays } from 'date-fns';

const Cycle = () => {
  const { profile, loading } = useUserProfile();
  const [viewDate, setViewDate] = useState(new Date());

  // Wait for profile to calculate cycle logic
  const cycleData = useCycleLogic(profile?.lastPeriodDate);
  
  if (loading || !profile) return <div className="p-8 text-kawaii-earth">Loading Luna Dial...</div>;

  const cycleLength = profile.settings?.cycleLength || 28;

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const grid = getCalendarGrid(viewDate);

  // Cycle progress calculation for the dial
  const cycleDay = cycleLength - (cycleData.daysUntilPeriod || 0);
  const cyclePercent = (cycleDay / cycleLength) * 100;
  
  // Adjusted SVG path length is ~904 for radius 144
  const dashOffset = 904 - (904 * (cyclePercent / 100));

  // Forecast Logic based on lastPeriodDate
  const lastPeriod = new Date(profile.lastPeriodDate);
  const forecast = [
    { name: 'Follicular', date: format(addDays(lastPeriod, 5), 'MMM dd'), color: 'bg-purple-200' },
    { name: 'Ovulatory', date: format(addDays(lastPeriod, Math.floor(cycleLength/2)), 'MMM dd'), color: 'bg-[#7A593E]' },
    { name: 'Luteal', date: format(addDays(lastPeriod, Math.floor(cycleLength * 0.7)), 'MMM dd'), color: 'bg-yellow-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center max-w-6xl mx-auto p-8 font-body relative lg:pl-16"
    >
      <div className="flex flex-col w-full">
        <h2 className="text-4xl font-extrabold text-kawaii-earth tracking-tight mb-8">
          Cycle Tracking
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
           {/* LEFT LARGE COLUMN: Luna Dial */}
           <div className="flex-[3] flex flex-col gap-8 relative">
              <h3 className="text-xl font-bold text-kawaii-earth">Luna Dial</h3>
              <Sticker emoji="🐾" className="-top-2 right-[20%]" rotate={15} style={{ fontSize: '1.5rem', padding: '0.2rem' }} />
              
              <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-12 shadow-sm border border-white/60 relative w-full h-[460px] flex items-center justify-center overflow-hidden">
                 <Sticker emoji="🐱" className="top-[20%] -left-6" rotate={-15} style={{ fontSize: '2.5rem' }} />
                 <Sticker emoji="🐱" className="bottom-[20%] right-10" rotate={15} style={{ fontSize: '2rem' }} />

                 <div className="relative w-80 h-80">
                    <div className="absolute inset-0 border-[16px] border-[#957DAD] rounded-full opacity-30"></div>
                    
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                       <circle cx="160" cy="160" r="144" stroke="rgba(112,68,95,0.1)" strokeWidth="16" fill="none" />
                       <circle 
                         cx="160" cy="160" r="144" 
                         stroke="#70445f" strokeWidth="16" fill="none" 
                         strokeDasharray="904" 
                         strokeDashoffset={dashOffset} 
                         strokeLinecap="round" 
                         className="transition-all duration-1000"
                       />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-black text-[#7A593E] mb-1">Day {cycleDay}</span>
                       <span className="text-sm font-bold text-kawaii-earthLight uppercase tracking-tight">- {cycleData.currentPhase} Phase</span>
                    </div>

                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <div key={i} className="absolute inset-0 pointer-events-none" style={{ transform: `rotate(${deg}deg)` }}>
                         <div className={`absolute top-[-26px] left-[50%] -translate-x-[50%] w-6 h-6 rounded-full bg-white shadow-sm border-2 border-white flex items-center justify-center text-[10px]`}>
                            {i % 2 === 0 ? '🌙' : '✨'}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* RIGHT NARROW COLUMN: Interactive Calendar & Forecast */}
           <div className="flex-[2] flex flex-col gap-8 relative">
              <h3 className="text-xl font-bold text-kawaii-earth">Interactive Schedule</h3>
              <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 shadow-sm border border-white/60 relative w-full">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-kawaii-earth">{formatMonthHeader(viewDate)}</h4>
                    <div className="flex items-center gap-2">
                      <button onClick={handlePrevMonth} className="text-kawaii-earth hover:scale-110 transition-transform"><CaretLeft size={20} weight="bold" /></button>
                      <button onClick={handleNextMonth} className="text-kawaii-earth hover:scale-110 transition-transform"><CaretRight size={20} weight="bold" /></button>
                    </div>
                 </div>

                 <div className="grid grid-cols-7 gap-y-2 text-center">
                    {daysLabels.map((d, i) => <div key={`col-${i}`} className="text-[10px] font-bold text-kawaii-earthLight uppercase">{d}</div>)}
                    {grid.map((day, i) => {
                      const phase = getDayPhase(day.date, profile.lastPeriodDate);
                      const isPeriod = phase === 'period';
                      const isFertile = phase === 'fertile';
                      return (
                        <div key={i} className="flex justify-center relative my-1 h-8 items-center">
                           {isFertile && day.isCurrentMonth && <div className="absolute inset-0 bg-pink-100/40 rounded-full"></div>}
                           <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full
                              ${!day.isCurrentMonth ? 'text-gray-300' : 'text-kawaii-earth'}
                              ${day.isToday ? 'bg-gradient-to-r from-kawaii-pink to-kawaii-lilac text-white shadow-md' : ''}
                           `}>
                              {isPeriod && day.isCurrentMonth ? <Drop weight="fill" className="text-red-600" size={14} /> : day.dayNumber}
                           </span>
                        </div>
                      );
                    })}
                 </div>
              </div>

              {/* LUNA FORECAST */}
              <h3 className="text-xl font-bold text-kawaii-earth">Forecast</h3>
              <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 pt-10 pb-12 shadow-sm border border-white/60 relative w-full overflow-hidden">
                 <div className="w-full h-1 bg-gray-200 mt-6 relative rounded-full">
                    {forecast.map((f, i) => (
                      <div key={f.name} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${20 + (i * 30)}%` }}>
                        <span className={`w-4 h-4 ${f.color} rounded-full border-[3px] border-white shadow-sm z-10 relative ${cycleData.currentPhase === f.name ? 'scale-150 ring-4 ring-white' : 'opacity-60'}`}></span>
                        <span className="text-[9px] font-black text-kawaii-earthLight uppercase tracking-widest absolute -top-8 w-16 text-center">{f.name}</span>
                        <span className="text-[10px] font-bold text-kawaii-earth mt-6">{f.date}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* PHASE INSIGHT */}
        <div className="flex flex-col gap-4 mt-8 w-full mb-12 relative z-10">
           <h3 className="text-xl font-bold text-kawaii-earth">Phase Insight</h3>
           <div className="flex flex-col lg:flex-row gap-4 w-full">
              {[
                { t: 'Menstrual', x: 'Inward and reflective time. Focus on rest.', i: '🧘‍♀️' },
                { t: 'Follicular', x: 'Energy rising! Start new projects.', i: '🌗' },
                { t: 'Ovulatory', x: 'Social and vibrant. Peak energy.', i: '🐾' },
                { t: 'Luteal', x: 'Winding down. Focus on completion.', i: '★' }
              ].map(p => (
                <PhaseCard key={p.t} title={p.t} text={p.x} icon={p.i} active={cycleData.currentPhase === p.t} />
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const PhaseCard = ({ title, text, icon, active }) => (
  <div className={`flex-1 p-6 rounded-[32px] flex flex-col justify-between transition-all duration-500 border
    ${active ? 'bg-white border-yellow-200 shadow-md scale-105 z-10' : 'bg-white/30 border-white/60 opacity-60'}
  `}>
     <div>
       <h4 className="font-bold text-kawaii-earth">{title}</h4>
       <p className="text-[11px] font-semibold text-kawaii-earthLight leading-relaxed mt-2">{text}</p>
     </div>
     <span className={`text-2xl mt-4 ${active ? 'animate-bounce-slow' : ''}`}>{icon}</span>
  </div>
);

export default Cycle;
