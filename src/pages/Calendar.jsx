import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Drop, Check, PencilSimple } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../context/UserProfileContext';
import { getCalendarGrid, getDayPhase, formatMonthHeader, formatDetailDate, addMonths, subMonths, format } from '../utils/dateUtils';

// Reusable Battery Composite Component
const BatteryOption = ({ level, fillHeight, colorClass, emoji, rotate, isSelected, onClick }) => {
  return (
    <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={onClick}>
      <div className={`relative ${isSelected ? 'scale-110' : 'scale-100 hover:scale-105'} transition-transform z-10`}>
        <div className={`w-16 h-[5.5rem] bg-white border-[4px] rounded-2xl relative overflow-hidden flex flex-col justify-end
           ${isSelected ? 'border-kawaii-earthLight shadow-lg' : 'border-gray-200'}`}
        >
           <div className={`w-full ${fillHeight} ${colorClass} transition-all duration-300`}></div>
           {level === 'Medium' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
               <div className="w-8 h-1 bg-yellow-400/50 rounded-full"></div>
             </div>
           )}
        </div>
        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 rounded-t-sm border-[4px] border-b-0
          ${isSelected ? 'border-kawaii-earthLight bg-gray-100' : 'border-gray-200 bg-white'}`}
        ></div>
        <Sticker 
          emoji={emoji} 
          rotate={rotate} 
          className="left-1/2 -ml-5 bottom-0 shadow-none border-[3px]"
          style={{ padding: '0', fontSize: '2rem' }}
        />
      </div>
      <span className={`text-xl font-bold ${isSelected ? 'text-kawaii-earth' : 'text-gray-500'}`}>{level}</span>
    </div>
  );
};

const Calendar = () => {
  const { profile, dailyLog, updateDailyLog, loading, fetchLogRange } = useUserProfile();
  const [viewDate, setViewDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState(null); // 'energy', 'mood', 'symptoms', 'detail'
  const [selectedDayLog, setSelectedDayLog] = useState(null);
  const [monthLogs, setMonthLogs] = useState([]);
  const navigate = useNavigate();

  // Local temp state for modal edits before saving
  const [tempLog, setTempLog] = useState(null);

  // Fetch all logs for the viewed month
  useEffect(() => {
    const fetchVisibleMonthData = async () => {
      if (!profile) return;
      const start = format(grid[0].date, 'yyyy-MM-dd');
      const end = format(grid[grid.length - 1].date, 'yyyy-MM-dd');
      const logs = await fetchLogRange(start, end);
      setMonthLogs(logs);
    };
    fetchVisibleMonthData();
  }, [viewDate, profile]);

  // Guard
  if (loading || !profile || !dailyLog) return <div className="p-8 text-kawaii-earth">Syncing with stars...</div>;

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const grid = getCalendarGrid(viewDate);

  const toggleSymptom = (s) => {
    const fresh = dailyLog.symptoms || [];
    const next = fresh.includes(s) ? fresh.filter(x => x !== s) : [...fresh, s];
    updateDailyLog({ symptoms: next });
  };

  return (
    <div className="w-full flex justify-center max-w-6xl mx-auto p-4 font-body relative lg:pl-16">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full relative z-0 flex flex-col gap-6"
      >
        {/* CALENDAR BLOCK */}
        <div className="w-full bg-white/20 border-2 border-white/50 backdrop-blur-lg rounded-[40px] p-8 lg:p-10 pt-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] relative">
           
           <Sticker emoji="🐱" className="-top-12 right-[30%]" rotate={-5} style={{ fontSize: '3rem' }} />
           <Sticker emoji="⭐" className="-top-8 right-[50%]" rotate={15} style={{ fontSize: '1.5rem', padding: '0.2rem' }} />
           <Sticker emoji="🌙" className="-top-8 right-[46%]" rotate={-10} style={{ fontSize: '1.5rem', padding: '0.2rem' }} />

           <div className="flex justify-between items-center mb-8 px-4">
             <h2 className="text-3xl font-bold text-kawaii-earth tracking-tight">{formatMonthHeader(viewDate)}</h2>
             <div className="flex gap-4">
               <button onClick={handlePrevMonth} className="text-kawaii-earth hover:scale-110 transition-transform"><CaretLeft size={24} weight="bold" /></button>
               <button onClick={handleNextMonth} className="text-kawaii-earth hover:scale-110 transition-transform"><CaretRight size={24} weight="bold" /></button>
             </div>
                       <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-kawaii-earthLight font-bold">
              {daysLabels.map((d, i) => <div key={i} className="mb-2 text-lg">{d}</div>)}
              {grid.map((day, idx) => {
                 const phase = getDayPhase(day.date, profile.lastPeriodDate);
                 const isPeriod = phase === 'period';
                 const isFertile = phase === 'fertile';
                 const log = monthLogs.find(l => l.date === format(day.date, 'yyyy-MM-dd'));
                 
                 return (
                   <div 
                    key={idx} 
                    className="flex justify-center relative my-1 cursor-pointer group"
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        setSelectedDayLog(log || { 
                          date: format(day.date, 'yyyy-MM-dd'),
                          mood: '', symptoms: [], energy: '', reflection: ''
                        });
                        setActiveModal('detail');
                      }
                    }}
                   >
                     <div className={`w-12 h-10 lg:w-14 lg:h-12 flex items-center justify-center rounded-2xl font-bold text-lg
                        transition-all duration-200 group-hover:scale-110
                        ${!day.isCurrentMonth ? 'text-gray-300 opacity-50' : 'text-kawaii-earth'}
                        ${day.isCurrentMonth && !day.isToday ? 'bg-white/40 shadow-sm border border-white/40' : ''}
                        ${day.isToday ? 'bg-gradient-to-r from-kawaii-pink to-kawaii-lilac text-white shadow-md border-0 transform scale-110 rotate-2' : ''}
                        ${isFertile && day.isCurrentMonth ? 'border-2 border-kawaii-lilac/30' : ''}
                        ${log ? 'ring-2 ring-white/60' : ''}
                     `}>
                        {isPeriod && day.isCurrentMonth ? (
                          <Drop weight="fill" className="text-red-400" size={20} />
                        ) : (
                          day.dayNumber
                        )}
                     </div>
                     {isFertile && day.isCurrentMonth && <Sticker emoji="✨" className="-top-2 -right-2 scale-50" rotate={-15} style={{ padding: 0 }} />}
                     {(day.isToday || log) && <Sticker emoji={day.isToday ? "❤️" : "⭐"} className="bottom-0 right-0 scale-75" rotate={15} style={{ padding: 0 }} />}
                   </div>
                 )
              })}
           </div>          </div>
        </div>

        {/* BOTTOM SECTION: SYMPTOMS & CATEGORIES */}
        <div className="flex flex-col w-full relative z-0 mb-12">
           <h3 className="text-2xl font-bold text-kawaii-earth mb-4 px-4">Symptoms</h3>

           <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* MOOD */}
              <div 
                onClick={() => {
                  setTempLog(dailyLog);
                  setActiveModal('mood');
                }}
                className="flex-1 bg-white/20 border-2 border-white/50 backdrop-blur-lg rounded-[32px] p-6 shadow-sm relative cursor-pointer hover:bg-white/30 transition-colors"
              >
                <Sticker emoji="🐻" className="top-1/2 -left-6" rotate={-15} style={{ fontSize: '2.2rem' }} />
                <h4 className="font-bold text-kawaii-earth mb-4">Mood</h4>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { e: '😊', m: 'happy' }, { e: '😢', m: 'sad' }, { e: '😠', m: 'angry' }, 
                    { e: '😴', m: 'tired' }, { e: '🤯', m: 'stressed' }
                  ].map(item => (
                    <div 
                      key={item.m}
                      onClick={() => updateDailyLog({ mood: item.m })}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border-2 cursor-pointer transition-all
                        ${dailyLog.mood === item.m ? 'scale-125 border-[#A85A6B] bg-white ring-4 ring-pink-100' : 'border-white bg-white/60 hover:scale-110'}
                      `}
                    >
                      {item.e}
                    </div>
                  ))}
                </div>
              </div>

              {/* PHYSICAL SYMPTOMS */}
              <div 
                onClick={() => {
                  setTempLog(dailyLog);
                  setActiveModal('symptoms');
                }}
                className="flex-1 bg-white/20 border-2 border-white/50 backdrop-blur-lg rounded-[32px] p-6 shadow-sm relative flex flex-col justify-between cursor-pointer hover:bg-white/30 transition-colors"
              >
                <Sticker emoji="🐻" className="-top-6 right-8" rotate={10} style={{ fontSize: '1.8rem' }} />
                <h4 className="font-bold text-kawaii-earth mb-4">Physical Symptoms</h4>
                <div className="flex justify-around items-end w-full">
                   {[
                     { e: '🤢', l: 'Bloating' }, { e: '🌩️', l: 'Cramps' }, 
                     { e: '🤕', l: 'Headache' }, { e: '🩹', l: 'Acne' }
                   ].map(s => {
                     const isActive = dailyLog.symptoms?.includes(s.l);
                     return (
                       <div key={s.l} onClick={() => toggleSymptom(s.l)} className="flex flex-col items-center gap-1 cursor-pointer group">
                         <span className={`text-2xl p-2 rounded-full shadow-sm border-2 transition-all group-hover:scale-110 
                           ${isActive ? 'bg-pink-100 border-[#A85A6B]' : 'bg-white border-white'}
                         `}>
                           {s.e}
                         </span>
                         <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-[#A85A6B]' : 'text-kawaii-earthLight'}`}>{s.l}</span>
                       </div>
                     )
                   })}
                </div>
              </div>

              {/* ENERGY LEVELS MINI PREVIEW */}
              <div 
                onClick={() => {
                  setTempLog(dailyLog);
                  setActiveModal('energy');
                }}
                className="flex-1 bg-white/20 border-2 border-white/50 backdrop-blur-lg rounded-[32px] p-6 shadow-sm relative cursor-pointer hover:bg-white/30 transition-colors"
              >
                <Sticker emoji="🐱" className="-bottom-4 -right-4" rotate={-10} style={{ fontSize: '2rem' }} />
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-kawaii-earth">Energy Level</h4>
                   {dailyLog.energy && <Check size={18} className="text-[#A85A6B] font-bold" />}
                </div>
                <div className="flex justify-between px-2">
                   {['Low', 'Medium', 'High'].map((l, i) => (
                      <div key={l} className={`flex flex-col items-center gap-1 transition-opacity ${dailyLog.energy === l ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                        <div className={`w-8 h-12 border-2 ${dailyLog.energy === l ? 'border-[#A85A6B]' : 'border-gray-300'} rounded-md bg-white flex flex-col justify-end p-[2px]`}>
                          <div className={`w-full ${i===0?'h-1/3 bg-red-200':i===1?'h-2/3 bg-yellow-200':'h-full bg-green-200'} rounded-sm`}></div>
                        </div>
                        <span className="text-xs font-bold text-kawaii-earthLight">{l}</span>
                      </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* OVERLAY MODAL */}
      {/* MODAL OVERLAY SYSTEM */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/20 backdrop-blur-xl"
              onClick={() => setActiveModal(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white/90 rounded-[50px] border-[10px] border-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] w-full max-w-lg flex flex-col items-center overflow-hidden"
            >
               {/* 1. DATE DETAIL POPUP */}
               {activeModal === 'detail' && selectedDayLog && (
                 <div className="p-8 lg:p-10 w-full flex flex-col items-center">
                    <Sticker emoji="✨" className="top-4 left-4" rotate={-10} style={{ fontSize: '1.5rem' }} />
                    <Sticker emoji="🌙" className="top-4 right-4" rotate={15} style={{ fontSize: '1.5rem' }} />
                    <Sticker emoji="⭐" className="bottom-4 left-6" rotate={5} style={{ fontSize: '1.2rem' }} />

                    <h2 className="text-3xl font-black text-kawaii-pink mb-8 tracking-tight font-body text-center">
                      {formatDetailDate(new Date(selectedDayLog.date))}
                    </h2>

                    <div className="flex gap-4 w-full justify-center mb-8">
                       <div className="flex flex-col items-center gap-1 bg-white/60 p-3 rounded-2xl shadow-sm min-w-[80px]">
                         <span className="text-3xl">
                           {selectedDayLog.mood === 'happy' ? '😊' : 
                            selectedDayLog.mood === 'sad' ? '😢' : 
                            selectedDayLog.mood === 'angry' ? '😠' : 
                            selectedDayLog.mood === 'tired' ? '😴' : 
                            selectedDayLog.mood === 'calm' ? '🧘' : '❓'}
                         </span>
                         <span className="text-[10px] font-bold uppercase text-kawaii-earthLight">{selectedDayLog.mood || 'No Mood'}</span>
                       </div>
                       <div className="flex flex-col items-center gap-1 bg-white/60 p-3 rounded-2xl shadow-sm min-w-[80px]">
                         <span className="text-3xl">
                            {selectedDayLog.symptoms?.includes('Cramps') ? '🌩️' : 
                             selectedDayLog.symptoms?.includes('Bloating') ? '🤢' : 
                             selectedDayLog.symptoms?.includes('Headache') ? '🤕' : 
                             selectedDayLog.symptoms?.includes('Acne') ? '🩹' : '☁️'}
                         </span>
                         <span className="text-[10px] font-bold uppercase text-kawaii-earthLight">{selectedDayLog.symptoms?.[0] || 'Clear'}</span>
                       </div>
                       <div className="flex flex-col items-center gap-1 bg-white/60 p-3 rounded-2xl shadow-sm min-w-[80px]">
                         <div className="w-6 h-8 border-2 border-kawaii-earthLight rounded-md bg-white flex flex-col justify-end p-[1px] mb-1">
                           <div className={`w-full ${
                             selectedDayLog.energy === 'High' ? 'h-full bg-green-200' :
                             selectedDayLog.energy === 'Medium' ? 'h-2/3 bg-yellow-200' :
                             selectedDayLog.energy === 'Low' ? 'h-1/3 bg-red-200' : 'h-0'
                           } rounded-sm`}></div>
                         </div>
                         <span className="text-[10px] font-bold uppercase text-kawaii-earthLight">{selectedDayLog.energy || 'No Data'}</span>
                       </div>
                    </div>
                    
                    <div className="w-full bg-white rounded-3xl p-6 min-h-[160px] notebook-paper shadow-inner border border-kawaii-lilac/10 relative">
                       <h4 className="absolute top-2 left-10 text-[10px] font-bold text-kawaii-earthLight uppercase tracking-widest bg-white px-2">Journal</h4>
                       <p className="text-kawaii-earth font-body font-medium leading-[2.5rem] mt-4">
                         {selectedDayLog.reflection || 'No thoughts recorded for this day...'}
                       </p>
                    </div>

                    <div className="mt-8 relative group">
                       <motion.button 
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => navigate('/dashboard')}
                         className="relative z-10 w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-sticker border-[6px] border-white group-hover:border-kawaii-pink/20 transition-all"
                       >
                         <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full fill-white stroke-none -z-10 bg-kawaii-pink rounded-full p-2">
                            <path d="M16 28.5L14.1 26.8C7.1 20.4 2.5 16.3 2.5 11.2C2.5 7 5.7 3.8 9.9 3.8C12.3 3.8 14.6 4.9 16 6.7C17.4 4.9 19.7 3.8 22.1 3.8C26.3 3.8 29.5 7 29.5 11.2C29.5 16.3 24.9 20.4 17.9 26.8L16 28.5Z" fill="#FCE4EC" />
                         </svg>
                         <PencilSimple size={24} weight="fill" className="text-kawaii-earth" />
                         <span className="text-[10px] font-black text-kawaii-earth uppercase">Quick Edit</span>
                       </motion.button>
                    </div>
                 </div>
               )}

               {/* 2. MOOD SELECTION MODAL */}
               {activeModal === 'mood' && tempLog && (
                 <div className="p-8 lg:p-10 w-full flex flex-col items-center">
                    <Sticker emoji="🐱" className="-top-4 -right-2" rotate={10} style={{ fontSize: '2.5rem' }} />
                    <h2 className="text-3xl font-black text-kawaii-earth mb-8">Mood Selection</h2>
                    <div className="flex gap-4 mb-8 flex-wrap justify-center">
                      {[
                        { e: '😊', m: 'happy', l: 'Happy', char: '🐱' },
                        { e: '😢', m: 'sad', l: 'Sad', char: '🐱' },
                        { e: '😠', m: 'angry', l: 'Angry', char: '🐻' },
                        { e: '😴', m: 'tired', l: 'Tired', char: '🐱' },
                        { e: '🧘', m: 'calm', l: 'Calm', char: '🐻' }
                      ].map(item => (
                        <div 
                          key={item.m} 
                          onClick={() => setTempLog({ ...tempLog, mood: item.m })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-3xl transition-all cursor-pointer border-4
                            ${tempLog.mood === item.m ? 'bg-pink-100 border-kawaii-pink scale-110 shadow-md' : 'bg-white border-transparent grayscale-[0.2]'}
                          `}
                        >
                          <span className="text-4xl">{item.e}</span>
                          <span className="text-xs font-bold text-kawaii-earthLight">{item.l}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-full relative mb-8">
                       <textarea 
                         placeholder="Journaling your feelings..."
                         className="w-full h-32 bg-pink-50/50 border-4 border-white rounded-[32px] p-6 focus:outline-none focus:ring-4 focus:ring-pink-100 text-kawaii-earth font-medium placeholder:text-pink-200"
                         value={tempLog.reflection || ''}
                         onChange={(e) => setTempLog({ ...tempLog, reflection: e.target.value })}
                       />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { updateDailyLog(tempLog); setActiveModal(null); }}
                      className="bg-kawaii-pink text-white px-12 py-4 rounded-full font-black shadow-sticker border-4 border-white"
                    >
                      Save Mood
                    </motion.button>
                 </div>
               )}

               {/* 3. PHYSICAL SYMPTOMS MODAL */}
               {activeModal === 'symptoms' && tempLog && (
                 <div className="p-8 lg:p-10 w-full flex flex-col items-center">
                    <Sticker emoji="🐻" className="-top-4 -right-2" rotate={5} style={{ fontSize: '2.5rem' }} />
                    <h2 className="text-3xl font-black text-kawaii-earth mb-8">Physical Symptoms</h2>
                    <div className="flex justify-around w-full mb-10">
                      {[
                        { e: '🤢', l: 'Bloating' }, { e: '🌩️', l: 'Cramps' }, 
                        { e: '🤕', l: 'Headache' }, { e: '🩹', l: 'Acne' }
                      ].map(s => {
                        const active = tempLog.symptoms?.includes(s.l);
                        return (
                          <div 
                            key={s.l} 
                            onClick={() => {
                              const next = active ? tempLog.symptoms.filter(x => x !== s.l) : [...(tempLog.symptoms || []), s.l];
                              setTempLog({ ...tempLog, symptoms: next });
                            }}
                            className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all cursor-pointer border-4
                              ${active ? 'bg-blue-50 border-blue-400 scale-110' : 'bg-white border-transparent'}
                            `}
                          >
                            <span className="text-4xl">{s.e}</span>
                            <span className="text-[10px] font-bold uppercase text-kawaii-earthLight">{s.l}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="w-full mb-12">
                       <h4 className="text-lg font-bold text-kawaii-earth mb-4 px-2">Severity</h4>
                       <div className="relative px-2">
                         <input 
                           type="range" 
                           className="rainbow-range" 
                           min="0" max="100"
                           value={tempLog.severity || 50}
                           onChange={(e) => setTempLog({ ...tempLog, severity: parseInt(e.target.value) })}
                         />
                         <div className="flex justify-between mt-4 px-1 text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest">
                           <span>Mild</span><span>Intense</span>
                         </div>
                       </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { updateDailyLog(tempLog); setActiveModal(null); }}
                      className="bg-[#A5D8FF] text-[#1971C2] px-12 py-4 rounded-full font-black shadow-[0_8px_0_#D0EBFF] border-4 border-white"
                    >
                      Done
                    </motion.button>
                 </div>
               )}

               {/* 4. ENERGY LEVEL MODAL */}
               {activeModal === 'energy' && tempLog && (
                 <div className="p-8 lg:p-10 w-full flex flex-col items-center">
                    <h2 className="text-3xl font-black text-kawaii-earth mb-12">Energy Level</h2>
                    <div className="flex gap-8 w-full justify-center mb-12">
                       {[
                         { l: 'Low', e: '😴', c: 'bg-red-100', tx: 'text-red-400' },
                         { l: 'Medium', e: '🐻', c: 'bg-yellow-50', tx: 'text-yellow-600' },
                         { l: 'High', e: '🕺', c: 'bg-green-100', tx: 'text-green-600' }
                       ].map(item => (
                         <div 
                           key={item.l}
                           onClick={() => setTempLog({ ...tempLog, energy: item.l })}
                           className={`flex flex-col items-center gap-4 transition-all cursor-pointer
                             ${tempLog.energy === item.l ? 'scale-110' : 'opacity-60 grayscale-[0.5] hover:opacity-90'}
                           `}
                         >
                           <div className={`w-20 h-28 ${item.c} border-[6px] border-white rounded-[32px] shadow-sticker flex flex-col items-center justify-center text-4xl`}>
                             {item.e}
                           </div>
                           <span className={`text-xl font-black ${item.tx}`}>{item.l}</span>
                         </div>
                       ))}
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { updateDailyLog(tempLog); setActiveModal(null); }}
                      className="bg-kawaii-pink text-white px-12 py-4 rounded-full font-black shadow-sticker border-4 border-white"
                    >
                      Confirm
                    </motion.button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
