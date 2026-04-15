import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Check, Palette } from '@phosphor-icons/react';
import { AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';

const Settings = () => {
  const { 
    profile, updateProfile, loading, dailyLog, updateDailyLog, sendTestNotification, 
    verifySmtp 
  } = useUserProfile();
  const [status, setStatus] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'theme', 'mood'
  const [tempTheme, setTempTheme] = useState('');
  const [tempLog, setTempLog] = useState(null);
  const [smtpConfig, setSmtpConfig] = useState({
    host: '', port: 587, user: '', pass: '', secure: false, senderEmail: ''
  });
  const [testRecipient, setTestRecipient] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'loading', title: '', message: '' });

  // Confetti particles state
  const [confetti, setConfetti] = useState([]);

  const triggerConfetti = () => {
    const emojis = ['✨', '💖', '⭐', '🌙', '🐱', '🐻'];
    const particles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      top: 50 + Math.random() * 50,
      duration: 2 + Math.random() * 2
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 4000);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/config/smtp')
      .then(res => res.json())
      .then(data => setSmtpConfig(data))
      .catch(err => console.error('Failed to load SMTP config:', err));
  }, []);

  if (loading || !profile) return <div className="p-8 text-kawaii-earth">Loading preferences...</div>;

  const handleUpdate = async (updates) => {
    setStatusModal({ isOpen: true, type: 'loading', title: 'Saving...', message: 'Updating your profile preferences.' });
    try {
      const success = await updateProfile(updates);
      if (success !== false) {
        setStatusModal({ isOpen: true, type: 'success', title: 'Profile Updated!', message: 'Your changes have been saved successfully ✨' });
        triggerConfetti();
        setTimeout(() => setStatusModal(prev => ({ ...prev, isOpen: false })), 2000);
      } else {
        setStatusModal({ isOpen: true, type: 'error', title: 'Save Failed', message: 'The backend rejected the update. Please check your data.' });
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setStatusModal({ isOpen: true, type: 'error', title: 'Connection Error', message: 'Could not reach the backend. Is npm run dev running?' });
    }
  };

  const handleSaveSmtp = async () => {
    setStatusModal({ isOpen: true, type: 'loading', title: 'Saving Config...', message: 'Writing SMTP credentials to MongoDB.' });
    try {
      const res = await fetch('http://localhost:5000/api/config/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      
      if (res.ok) {
        setStatusModal({ isOpen: true, type: 'success', title: 'SMTP Config Saved!', message: 'Email settings migrated to database 💾' });
        triggerConfetti();
        setSmtpConfig(prev => ({ ...prev, pass: '********' }));
        setTimeout(() => setStatusModal(prev => ({ ...prev, isOpen: false })), 2500);
      } else {
        let msg = 'Error saving config.';
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch (e) {
          msg = `Server Error (${res.status}): ${res.statusText}`;
        }
        setStatusModal({ isOpen: true, type: 'error', title: 'Save Failed', message: msg });
      }
    } catch (e) {
      console.error('SMTP Save Network Error:', e);
      setStatusModal({ isOpen: true, type: 'error', title: 'Backend Offline', message: 'The backend server (port 5000) is unreachable. Check your terminal!' });
    }
  };

  const handleVerifySmtp = async () => {
    setStatusModal({ isOpen: true, type: 'loading', title: 'Verifying...', message: 'Testing SMTP connection & login 📡' });
    try {
      const res = await verifySmtp(smtpConfig);
      if (res && res.success) {
        setStatusModal({ isOpen: true, type: 'success', title: 'Verified!', message: 'SMTP credentials are valid and connection is active! ✨' });
        triggerConfetti();
        setTimeout(() => setStatusModal(prev => ({ ...prev, isOpen: false })), 3000);
      } else {
        setStatusModal({ isOpen: true, type: 'error', title: 'Verification Failed', message: res?.message || 'Could not connect to SMTP server. Check Port/Secure settings.' });
      }
    } catch (e) {
      setStatusModal({ isOpen: true, type: 'error', title: 'Timeout', message: 'Connection took too long. Check if your Port/Secure settings match!' });
    }
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

            {/* NOTIFICATION CENTER */}
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative">
               <Sticker emoji="🔔" className="-top-6 right-8" rotate={-10} style={{ fontSize: '2rem' }} />
               <h3 className="text-xl font-bold text-kawaii-earth mb-6">Notification Center</h3>
               
               <p className="text-sm font-medium text-kawaii-earthLight mb-6 leading-relaxed">
                 Want a daily nudge to check in on yours rituals and symptoms? Send a test to see how Luna looks in your inbox!
               </p>

               <div className="mb-6">
                  <span className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Recipient Email (for test)</span>
                  <input 
                    type="email" 
                    value={testRecipient}
                    onChange={e => setTestRecipient(e.target.value)}
                    placeholder="Where should the test go?"
                    className="w-full bg-white border border-white rounded-xl px-4 py-3 text-sm text-kawaii-earth font-bold outline-none mt-2 shadow-sm focus:ring-2 ring-kawaii-pink/20"
                  />
                </div>

               <button 
                 onClick={async () => {
                   setStatusModal({ isOpen: true, type: 'loading', title: 'Sending...', message: 'Magic notification in progress...' });
                   const res = await sendTestNotification(testRecipient);
                   if (res.success) {
                     setStatusModal({ isOpen: true, type: 'success', title: 'Sent! 📧', message: 'Check your inbox for the morning glow check-in.' });
                     triggerConfetti();
                     setTimeout(() => setStatusModal(prev => ({ ...prev, isOpen: false })), 3000);
                   } else {
                     setStatusModal({ isOpen: true, type: 'error', title: 'Oopsie! ❌', message: res.message || 'Failed to send notification.' });
                   }
                 }}
                 className="w-full py-4 bg-gradient-to-r from-kawaii-pink to-kawaii-lilac rounded-2xl font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
               >
                 Send Test Notification <CaretRight size={18} weight="bold" />
               </button>
            </div>

            {/* ADVANCED SETTINGS (SMTP) */}
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-kawaii-earth">Advanced Settings</h3>
                 <button 
                   onClick={() => setShowAdvanced(!showAdvanced)}
                   className="text-xs font-black text-kawaii-pink uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full border border-kawaii-pink"
                 >
                   {showAdvanced ? 'Hide' : 'Show'}
                 </button>
               </div>

               {showAdvanced && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex flex-col gap-5 overflow-hidden"
                  >
                     <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1">
                         <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">SMTP Host</label>
                         <input 
                           type="text" value={smtpConfig.host} 
                           onChange={e => setSmtpConfig({...smtpConfig, host: e.target.value})}
                           className="bg-white/60 border border-white rounded-xl px-4 py-2 text-sm text-kawaii-earth font-bold outline-none"
                           placeholder="smtp.gmail.com"
                         />
                       </div>
                       <div className="flex flex-col gap-1">
                         <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Port</label>
                         <input 
                           type="number" value={smtpConfig.port} 
                           onChange={e => setSmtpConfig({...smtpConfig, port: parseInt(e.target.value) || 0})}
                           className="bg-white/60 border border-white rounded-xl px-4 py-2 text-sm text-kawaii-earth font-bold outline-none"
                           placeholder="587"
                         />
                       </div>
                     </div>

                     <div className="flex flex-col gap-1">
                       <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">User / Email</label>
                       <input 
                         type="text" value={smtpConfig.user} 
                         onChange={e => setSmtpConfig({...smtpConfig, user: e.target.value})}
                         className="bg-white/60 border border-white rounded-xl px-4 py-2 text-sm text-kawaii-earth font-bold outline-none"
                         placeholder="yourname@gmail.com"
                       />
                     </div>

                     <div className="flex flex-col gap-1">
                       <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Password / App Key</label>
                       <input 
                         type="password" value={smtpConfig.pass} 
                         onChange={e => setSmtpConfig({...smtpConfig, pass: e.target.value})}
                         className="bg-white/60 border border-white rounded-xl px-4 py-2 text-sm text-kawaii-earth font-bold outline-none"
                         placeholder="xxxx xxxx xxxx xxxx"
                       />
                     </div>

                     <div className="flex flex-col gap-1">
                       <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Sender Email Display</label>
                     </div>

                     <div className="flex flex-col gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" checked={smtpConfig.secure} 
                            onChange={e => setSmtpConfig({...smtpConfig, secure: e.target.checked})}
                            className="accent-kawaii-pink"
                          />
                          <span className="text-xs font-bold text-kawaii-earth">Use Secure Connection (SSL/TLS)</span>
                        </div>
                        {smtpConfig.port === 587 && (
                          <p className="text-[9px] font-bold text-kawaii-pink uppercase mt-1 pl-6">💡 Recommended for Port 587: UNCHECKED</p>
                        )}
                        {smtpConfig.port === 465 && (
                          <p className="text-[9px] font-bold text-kawaii-lilac uppercase mt-1 pl-6">💡 Recommended for Port 465: CHECKED</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={handleVerifySmtp}
                          className="flex-1 py-3 bg-white border-2 border-kawaii-lilac/30 text-kawaii-lilac rounded-2xl font-bold text-xs shadow-sm hover:bg-kawaii-lilac/5 transition-colors"
                        >
                          Test Login
                        </button>
                        <button 
                          onClick={handleSaveSmtp}
                          className="flex-[2] py-3 bg-kawaii-earth text-white rounded-2xl font-bold text-xs shadow-md hover:bg-black transition-colors"
                        >
                          Save Config
                        </button>
                      </div>
                  </motion.div>
               )}
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
        {/* 3. STATUS MODAL */}
        {statusModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/20 backdrop-blur-xl"
              onClick={() => statusModal.type !== 'loading' && setStatusModal(prev => ({ ...prev, isOpen: false }))}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white/90 rounded-[50px] border-[10px] border-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] w-full max-w-sm flex flex-col items-center overflow-hidden p-10 text-center"
            >
               <Sticker 
                 emoji={statusModal.type === 'success' ? '🐱' : statusModal.type === 'error' ? '🙀' : '🌙'} 
                 className={`-top-4 ${statusModal.type === 'loading' ? 'animate-spin-slow' : 'animate-bounce'}`}
                 rotate={statusModal.type === 'error' ? -15 : 15} 
                 style={{ fontSize: '3rem' }} 
               />
               
               <h2 className={`text-2xl font-black mb-3 ${statusModal.type === 'error' ? 'text-red-500' : 'text-kawaii-earth'}`}>
                 {statusModal.title}
               </h2>
               
               <p className="text-sm font-bold text-kawaii-earthLight leading-relaxed mb-6">
                 {statusModal.message}
               </p>

               {statusModal.type !== 'loading' && (
                 <motion.button 
                   whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                   onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                   className="bg-kawaii-pink text-white px-8 py-3 rounded-full font-black shadow-sticker border-4 border-white"
                 >
                   Okay!
                 </motion.button>
               )}
            </motion.div>
          </div>
        )}

        {/* Confetti Particles */}
        {confetti.map(p => (
          <motion.div
            key={p.id}
            initial={{ y: '100vh', x: `${p.left}vw`, opacity: 1, rotate: 0 }}
            animate={{ 
              y: '-20vh', 
              x: `${p.left + (Math.random() * 20 - 10)}vw`,
              opacity: 0,
              rotate: 360 
            }}
            transition={{ duration: p.duration, ease: "easeOut" }}
            className="fixed z-[300] pointer-events-none text-2xl"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default Settings;
