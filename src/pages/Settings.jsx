import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Check } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';

const Settings = () => {
  const { profile, updateProfile, loading } = useUserProfile();
  const [status, setStatus] = useState('');

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
      className="w-full flex justify-center max-w-6xl mx-auto p-8 font-body relative lg:pl-16"
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
                     <div key={c} style={{ background: c }} className="w-8 h-8 rounded-lg shadow-sm border-2 border-white cursor-pointer hover:scale-110 transition-transform"></div>
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
    </motion.div>
  );
};

export default Settings;
