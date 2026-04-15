import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sticker from '../components/UI/Sticker';
import { CaretRight, Sparkle, Drop, CalendarBlank, Heart } from '@phosphor-icons/react';

const FeatureCard = ({ title, description, badge, path, image, reverse = false, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 p-8 lg:p-12 rounded-[50px] border-4 border-white shadow-[0_20px_60px_rgba(0,0,0,0.04)] bg-white/60 backdrop-blur-md relative overflow-hidden group hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] transition-all duration-500`}
    >
      {/* Decorative Background Blob */}
      <div className={`absolute -top-20 ${reverse ? '-left-20' : '-right-20'} w-64 h-64 bg-kawaii-pink/10 rounded-full blur-[60px] pointer-events-none group-hover:scale-110 transition-transform duration-700`} />
      
      {/* Visual Component Previews (The "Image" section) */}
      <div className="flex-1 w-full flex justify-center items-center relative min-h-[250px] lg:min-h-[300px]">
        {image}
      </div>

      {/* Copy / Action Section */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 relative z-10">
        <span className="text-[10px] font-black text-kawaii-pink uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border-2 border-kawaii-pink/20 shadow-sm">
          {badge}
        </span>
        <h2 className="text-4xl lg:text-5xl font-[Outfit] font-black text-kawaii-earth leading-tight">
          {title}
        </h2>
        <p className="text-lg lg:text-xl font-medium text-kawaii-earthLight leading-relaxed max-w-sm">
          {description}
        </p>
        
        <button 
          onClick={() => navigate(path)}
          className="mt-4 px-8 py-4 bg-kawaii-earth text-white rounded-2xl font-black text-sm shadow-sticker hover:scale-105 active:scale-95 transition-all flex items-center gap-3 animate-jiggle"
        >
          Try Feature <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </motion.div>
  );
};

const Showcase = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col py-20 px-6 lg:px-20 gap-20 bg-gradient-to-b from-kawaii-bg to-white relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Sticker emoji="✨" className="top-[10%] left-[5%]" rotate={15} style={{ opacity: 0.4, fontSize: '3rem' }} />
        <Sticker emoji="⭐" className="top-[30%] right-[10%]" rotate={-10} style={{ opacity: 0.3, fontSize: '2rem' }} />
        <Sticker emoji="🌙" className="bottom-[15%] left-[12%]" rotate={20} style={{ opacity: 0.4, fontSize: '4rem' }} />
        <Sticker emoji="💫" className="bottom-[5%] right-[5%]" rotate={-15} style={{ opacity: 0.3, fontSize: '2.5rem' }} />
      </div>

      {/* Header */}
      <header className="flex flex-col items-center gap-6 text-center relative z-20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-3xl bg-kawaii-pink flex items-center justify-center shadow-sticker border-4 border-white mb-2"
        >
          <Sparkle size={32} weight="fill" className="text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl lg:text-8xl font-showcase"
        >
          Feature Showcase
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-bold text-kawaii-earthLight max-w-xl italic"
        >
          "Guided by the moon, glowing from within. Explore the tools designed for your natural rhythm."
        </motion.p>
      </header>

      {/* Feature Sections */}
      <div className="flex flex-col gap-12 lg:gap-20 max-w-6xl mx-auto w-full relative z-10 pb-40">
        
        {/* 1. Cycle Tracker */}
        <FeatureCard 
          title="Luna Cycle Tracker"
          description="A celestial way to track your natural rhythms. Understand your cycle through lunar phases."
          badge="Main Feature"
          path="/cycle"
          image={
            <div className="bg-kawaii-bg/50 rounded-full p-8 p-12 lg:p-16 border-4 border-white/60 shadow-xl relative">
              <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full border-[12px] border-white/80 bg-white flex flex-col items-center justify-center p-4 relative">
                <div className="w-full h-full rounded-full border-4 border-kawaii-pink/20 flex flex-col items-center justify-center text-center">
                   <span className="text-5xl mb-4">🌙</span>
                   <p className="font-black text-xs text-kawaii-pink tracking-widest uppercase">Phase 14</p>
                   <p className="font-black text-xl text-kawaii-earth">Moon Dial</p>
                </div>
                <Sticker emoji="🐱" className="-bottom-6 -left-6" rotate={-10} style={{ fontSize: '3rem' }} />
              </div>
            </div>
          }
        />

        {/* 2. Habits & Rituals */}
        <FeatureCard 
          reverse
          title="Habits & Rituals"
          description="Build healthy rituals that feel like a treat. Our interactive trackers keep you motivated."
          badge="Daily Glow"
          path="/habits"
          delay={0.2}
          image={
            <div className="flex gap-4 items-end relative">
              <div className="w-48 h-64 lg:w-56 lg:h-80 bg-white/50 border-4 border-white rounded-[40px] shadow-lg p-6 flex flex-col gap-4 overflow-hidden relative">
                 <div className="flex justify-between items-center">
                    <span className="font-black text-[10px] uppercase text-kawaii-earthLight">Water intake</span>
                    <Drop size={16} weight="fill" className="text-blue-400" />
                 </div>
                 <div className="flex-1 bg-blue-50/50 rounded-3xl flex flex-col items-center justify-center gap-6 overflow-hidden relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-100 h-1/2 animate-pulse" />
                    <span className="text-4xl relative z-10">💧</span>
                    <p className="text-xs font-black text-blue-500 relative z-10">1200 / 2000ml</p>
                 </div>
              </div>
              <div className="w-40 h-52 lg:w-48 lg:h-64 bg-white/70 border-4 border-white rounded-[40px] shadow-lg p-6 flex flex-col items-center gap-4 -ml-12 lg:-ml-16 mb-4 relative z-20">
                 <span className="font-black text-[10px] uppercase text-kawaii-earthLight">Pet Growth</span>
                 <Sticker emoji="🐻" rotate={0} style={{ fontSize: '3.5rem', border: 'none', background: 'transparent', boxShadow: 'none' }} />
                 <div className="w-full h-2 bg-kawaii-bg rounded-full overflow-hidden">
                    <div className="h-full bg-kawaii-pink w-[65%]" />
                 </div>
              </div>
            </div>
          }
        />

        {/* 3. Celestial Insights */}
        <FeatureCard 
          title="Celestial Insights"
          description="Deep dive into your symptom patterns. Understand your body better every single day."
          badge="Body Wisdom"
          path="/analytics"
          delay={0.1}
          image={
            <div className="bg-white/40 rounded-[40px] p-4 lg:p-6 border-4 border-white shadow-xl flex flex-col gap-6 w-full max-w-[400px]">
               <div className="bg-white border-4 border-white rounded-3xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center"><CalendarBlank size={20} className="text-kawaii-pink" /> </div>
                     <span className="font-black text-sm">Symptoms Log</span>
                  </div>
                  <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-kawaii-pink" />
                     <span className="w-1.5 h-1.5 rounded-full bg-kawaii-lilac" />
                  </div>
               </div>
               <div className="flex flex-col gap-3 px-2">
                  {[
                    { e: '⭐', l: 'Balanced', c: 'bg-green-50' },
                    { e: '🩸', l: 'Symmetry', c: 'bg-pink-50' },
                    { e: '🌜', l: 'Deep Calm', c: 'bg-indigo-50' }
                  ].map((it, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-2xl border-2 border-white/60 ${it.c}`}>
                       <span className="text-sm font-black text-kawaii-earth">{it.l}</span>
                       <span className="text-lg">{it.e}</span>
                    </div>
                  ))}
               </div>
               <Sticker emoji="🌜" className="-top-4 -right-4" rotate={15} style={{ fontSize: '2.5rem' }} />
            </div>
          }
        />

        {/* 4. Vision & Mission */}
        <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           viewport={{ once: true }}
           className="bg-[#FDF6F9] rounded-[60px] p-12 lg:p-20 border-[8px] border-white shadow-2xl relative mt-10 overflow-hidden"
        >
           {/* Taped paper effect */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-12 bg-kawaii-pink/40 blur-[2px] rotate-2" />
           <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="relative">
                 <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white rounded-full flex items-center justify-center p-4 shadow-sticker border-[10px] border-white z-10 relative">
                    <Sticker emoji="🐱" rotate={0} style={{ fontSize: '10rem', border: 'none', background: 'transparent', boxShadow: 'none' }} />
                 </div>
                 <Sticker emoji="🌙" className="-top-10 -right-4" rotate={15} style={{ fontSize: '5rem' }} />
                 <Sticker emoji="✨" className="bottom-0 -left-8" rotate={-10} style={{ fontSize: '4rem' }} />
              </div>
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                 <h2 className="text-5xl lg:text-6xl font-black text-kawaii-earth leading-tight mb-8">Vision & Mission</h2>
                 <p className="text-xl lg:text-2xl font-medium text-kawaii-earthLight leading-relaxed italic mb-8">
                   "We empower your journey to daily glow by embracing your natural rhythms. Our mission is to provide a kind, personalized space for holistic well-being, guiding you towards balance and self-love with every lunar cycle."
                 </p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-kawaii-pink flex items-center justify-center text-white shadow-sm border-2 border-white">
                       <Heart size={24} weight="fill" />
                    </div>
                    <span className="text-lg font-black text-kawaii-pink">Team DearLuna</span>
                 </div>
              </div>
           </div>
        </motion.div>

      </div>
      
      {/* Footer / Call to Action */}
      <footer className="w-full flex flex-col items-center gap-8 pb-20 relative z-20">
         <h3 className="text-3xl font-black text-kawaii-earth">Ready to start your journey?</h3>
         <button 
           onClick={() => navigate('/dashboard')}
           className="px-12 py-5 bg-kawaii-pink text-kawaii-earth rounded-full font-black text-xl shadow-sticker border-4 border-white hover:scale-105 active:scale-95 transition-all"
         >
           Enter Dashboard
         </button>
      </footer>
    </div>
  );
};

export default Showcase;
