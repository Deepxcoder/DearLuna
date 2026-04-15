import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Check, Palette } from '@phosphor-icons/react';
import { AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';

const Settings = () => {
  const { profile, updateProfile, loading, dailyLog, updateDailyLog } = useUserProfile();
  const [status, setStatus] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'theme', 'mood'
  const [tempTheme, setTempTheme] = useState('');
  const [tempLog, setTempLog] = useState(null);

  if (loading || !profile) return <div className="p-8 text-kawaii-earth">Loading preferences...</div>;

  const handleUpdate = async (updates) => {
    setStatus('Saving...');
    await updateProfile(updates);
    setStatus('Saved! ✨');
    setTimeout(() => setStatus(''), 2000);
  };

  const handleCycleChange = (field, val) => {
    const num = parseInt(val) || 0;
    handleUpdate({ settings: { ...profile.settings, [field]: num } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center min-h-full max-w-6xl mx-auto p-8 pb-32 font-body relative lg:pl-16 shadow-inner"
    >
      <div className="flex flex-col w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-4xl font-extrabold text-kawaii-earth tracking-tight">
             Settings
           </h2>
           <span className="text-kawaii-pink font-bold animate-pulse">{status}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* LEFT COLUMN: Profile */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative">
               <Sticker emoji="🐻" className="-top-6 right-8" rotate={10} style={{ fontSize: '2.5rem' }} />
               <h3 className="text-xl font-bold text-kawaii-earth mb-6">Profile Settings</h3>
               
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-kawaii-earthLight uppercase tracking-widest pl-1">Your Name</label>
                    <input 
                      type="text" 
                      defaultValue={profile.name} 
                      onBlur={(e) => handleUpdate({ name: e.target.value })}
                      className="bg-white/60 border border-white rounded-2xl px-4 py-3 text-kawaii-earth font-bold outline-none focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-kawaii-earthLight uppercase tracking-widest pl-1">Pronouns</label>
                    <input 
                      type="text" 
                      placeholder="She/Her"
                      className="bg-white/60 border border-white rounded-2xl px-4 py-3 text-kawaii-earth font-bold outline-none focus:bg-white transition-all shadow-inner"
                    />
                  </div>
               </div>
            </div>

            {/* Cycle Preferences */}
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative">
               <Sticker emoji="🩸" className="-top-6 left-8" rotate={-10} style={{ fontSize: '2rem' }} />
               <h3 className="text-xl font-bold text-kawaii-earth mb-6">Cycle Calibration</h3>
               
               <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-kawaii-earth">Average Cycle Length</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         value={profile.settings.cycleLength} 
                         onChange={(e) => handleCycleChange('cycleLength', e.target.value)}
                         className="w-16 bg-white/60 border border-white rounded-xl px-2 py-1 text-center font-bold text-kawaii-earth"
                       />
                       <span className="text-xs font-bold text-kawaii-earthLight">Days</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-kawaii-earth">Average Period Length</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         value={profile.settings.periodLength} 
                         onChange={(e) => handleCycleChange('periodLength', e.target.value)}
                         className="w-16 bg-white/60 border border-white rounded-xl px-2 py-1 text-center font-bold text-kawaii-earth"
                       />
                       <span className="text-xs font-bold text-kawaii-earthLight">Days</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* DAILY GLOW-UP: QUICK LOG */}
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative overflow-hidden group">
               <Sticker emoji="🐱" className="-top-4 -right-2 transition-transform group-hover:scale-110" rotate={10} style={{ fontSize: '2.5rem' }} />
               <h3 className="text-xl font-bold text-kawaii-earth mb-4">Instant Reflection</h3>
               <p className="text-sm font-medium text-kawaii-earthLight mb-6">Record your vibe for today without leaving your settings.</p>
               <button 
                 onClick={() => {
                   setTempLog(dailyLog);
                   setActiveModal('mood');
                 }}
                 className="w-full py-4 bg-white/60 border-2 border-dashed border-kawaii-pink rounded-2xl font-black text-kawaii-pink hover:bg-kawaii-pink hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
               >
                 <span className="text-xl">✨</span> Log Today's Mood
               </button>
            </div>
          </div>

          {/* RIGHT COLUMN: App Settings */}
          <div className="flex-1 flex flex-col gap-8">
             <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative">
               <Sticker emoji="⭐" className="-top-4 right-8" rotate={15} style={{ fontSize: '1.2rem' }} />
               <h3 className="text-xl font-bold text-kawaii-earth mb-6">Notifications</h3>
               <div className="flex flex-col gap-6">
                  {['Period Reminders', 'Habit Alerts', 'Mood Tracking'].map(tag => (
                    <div key={tag} className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-kawaii-earth">{tag}</span>
                      <div className="w-10 h-6 bg-pink-200 rounded-full cursor-pointer relative shadow-inner flex items-center">
                         <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                      </div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative">
               <Sticker emoji="🎨" className="top-8 right-8" rotate={15} style={{ fontSize: '2rem' }} />
               <h3 className="text-xl font-bold text-kawaii-earth mb-6">Aesthetics</h3>
               <div className="mb-6">
                 <span className="text-xs font-bold text-kawaii-earthLight block mb-3 uppercase tracking-widest pl-1">Theme Palette</span>
                 <div className="flex gap-3">
                   {['#FFB7C5', '#957DAD', '#BCECE0', '#A85A6B'].map(c => (
                     <div 
                       key={c} 
                       style={{ background: c }} 
                       onClick={() => {
                         setTempTheme(profile.settings?.theme || 'Sakura');
                         setActiveModal('theme');
                       }}
                       className="w-8 h-8 rounded-lg shadow-sm border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                     ></div>
                   ))}
                 </div>
               </div>
               <button className="w-full py-4 bg-gradient-to-r from-kawaii-pink to-kawaii-lilac rounded-2xl font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">
                 Customize Stickers <Check size={16} className="inline ml-1" />
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* THEME SELECTION MODAL */}
      <AnimatePresence>
        {activeModal === 'theme' && (
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
              className="relative bg-white/90 rounded-[50px] border-[10px] border-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] w-full max-w-lg flex flex-col items-center overflow-hidden p-8 lg:p-10"
            >
               <Sticker emoji="🎨" className="-top-4 -right-2" rotate={15} style={{ fontSize: '2.5rem' }} />
               <h2 className="text-3xl font-black text-kawaii-earth mb-8">Choose Theme</h2>
               
               <div className="flex grid grid-cols-2 gap-4 mb-8 w-full">
                 {[
                   { id: 'Sakura', l: 'Sakura Dream', e: '🐱', c: 'bg-pink-100 border-kawaii-pink' },
                   { id: 'Midnight', l: 'Midnight Glow', e: '🐻', c: 'bg-indigo-100 border-indigo-400' },
                   { id: 'Ocean', l: 'Ocean Breeze', e: '🐱', c: 'bg-blue-100 border-blue-400' },
                   { id: 'Forest', l: 'Forest Mist', e: '🐻', c: 'bg-green-100 border-green-400' }
                 ].map(theme => (
                   <div 
                     key={theme.id}
                     onClick={() => setTempTheme(theme.id)}
                     className={`flex flex-col items-center gap-2 p-4 rounded-[32px] transition-all cursor-pointer border-4 text-center
                       ${tempTheme === theme.id ? `${theme.c} scale-105 shadow-md` : 'bg-white border-transparent opacity-70'}
                     `}
                   >
                     <span className="text-4xl">{theme.e}</span>
                     <span className="text-xs font-bold text-kawaii-earth">{theme.l}</span>
                   </div>
                 ))}
               </div>

               <div className="w-full relative mb-8">
                  <div className="w-full h-24 bg-pink-50/50 border-4 border-white rounded-[24px] p-4 text-center flex items-center justify-center italic text-kawaii-earthLight text-sm">
                     {tempTheme === 'Midnight' ? "Moonlight and stardust for late-night souls..." : 
                      tempTheme === 'Sakura' ? "Soft pinks and cherry blossoms for a fresh glow..." :
                      tempTheme === 'Ocean' ? "Cool blues and calm waves for deep serenity..." :
                      "Deep greens and mist for a grounded spirit..."}
                  </div>
               </div>

               <motion.button 
                 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                 onClick={() => {
                   handleUpdate({ settings: { ...profile.settings, theme: tempTheme } });
                   setActiveModal(null);
                 }}
                 className="bg-kawaii-pink text-white px-12 py-4 rounded-full font-black shadow-sticker border-4 border-white"
               >
                 Apply Theme
               </motion.button>
            </motion.div>
          </div>
        )}

        {/* 2. MOOD SELECTION MODAL */}
        {activeModal === 'mood' && tempLog && (
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
               className="relative bg-white/90 rounded-[50px] border-[10px] border-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] w-full max-w-lg flex flex-col items-center overflow-hidden p-8 lg:p-10"
             >
                <Sticker emoji="🐱" className="-top-4 -right-2" rotate={10} style={{ fontSize: '2.5rem' }} />
                <h2 className="text-3xl font-black text-kawaii-earth mb-8">Mood Selection</h2>
                <div className="flex gap-4 mb-8 flex-wrap justify-center">
                  {[
                    { e: '😊', m: 'happy', l: 'Happy' },
                    { e: '😢', m: 'sad', l: 'Sad' },
                    { e: '😠', m: 'angry', l: 'Angry' },
                    { e: '😴', m: 'tired', l: 'Tired' },
                    { e: '🧘', m: 'calm', l: 'Calm' }
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
                     className="w-full h-32 bg-pink-50/50 border-4 border-white rounded-[32px] p-6 focus:outline-none focus:ring-4 focus:ring-pink-100 text-kawaii-earth font-medium placeholder:text-pink-200 shadow-inner"
                     value={tempLog.reflection || ''}
                     onChange={(e) => setTempLog({ ...tempLog, reflection: e.target.value })}
                   />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { 
                    updateDailyLog(tempLog); 
                    setActiveModal(null); 
                  }}
                  className="bg-kawaii-pink text-white px-12 py-4 rounded-full font-black shadow-sticker border-4 border-white"
                >
                  Save Vibe
                </motion.button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Settings;
