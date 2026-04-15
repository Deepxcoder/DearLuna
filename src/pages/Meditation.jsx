import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Wind, Sparkle, Timer, CheckCircle } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import confetti from 'canvas-confetti';

const Meditation = () => {
  const navigate = useNavigate();
  const { updateDailyLog, dailyLog, triggerPetAction } = useUserProfile();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [phase, setPhase] = useState('Breathe In'); // Breathe In, Hold, Breathe Out
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef(null);

  // Breathing cycle logic
  useEffect(() => {
    let phaseTimer;
    if (isActive) {
      phaseTimer = setInterval(() => {
        setPhase(prev => {
          if (prev === 'Breathe In') return 'Hold';
          if (prev === 'Hold') return 'Breathe Out';
          return 'Breathe In';
        });
      }, 4000);
    } else {
      setPhase('Ready?');
    }
    return () => clearInterval(phaseTimer);
  }, [isActive]);

  // Main countdown timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setSessionsCompleted(prev => prev + 1);
    updateDailyLog({ rituals: { ...dailyLog?.rituals, meditation: true } });
    triggerPetAction('sparkle');
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E0BBE4', '#957DAD', '#D291BC']
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-kawaii-bg to-white relative overflow-hidden"
    >
      {/* Dynamic Background Circles */}
      <motion.div 
        animate={{ 
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.1, 0.2, 0.1] : 0.05
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] bg-kawaii-lilac rounded-full blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <button 
          onClick={() => navigate(-1)}
          className="absolute -top-16 left-0 flex items-center gap-2 font-black text-kawaii-earthLight hover:text-kawaii-earth transition-all group"
        >
          <ArrowLeft weight="bold" />
          <span className="uppercase tracking-widest text-[10px]">Back to Dashboard</span>
        </button>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-kawaii-earth mb-2 tracking-tighter">Zen Zone</h1>
          <p className="text-xs font-black text-kawaii-earthLight uppercase tracking-[0.2em]">Find your inner peace</p>
        </header>

        {/* The Breathing Circle */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-16">
          <AnimatePresence>
            <motion.div
              key={phase}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: phase === 'Breathe In' ? 1.2 : phase === 'Breathe Out' ? 0.8 : 1.1,
                opacity: 0.6
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-kawaii-pink to-kawaii-lilac rounded-full shadow-2xl blur-sm"
            />
          </AnimatePresence>
          
          <div className="relative z-20 flex flex-col items-center text-center">
            <motion.span 
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black text-white drop-shadow-md mb-2"
            >
              {phase}
            </motion.span>
            <span className="text-lg font-bold text-white/80">{formatTime(timeLeft)}</span>
          </div>

          {/* Particle Effects when active */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-20, -100],
                    x: [0, (i % 2 === 0 ? 30 : -30)],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute left-1/2 top-1/2 text-xl"
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => { setTimeLeft(300); setIsActive(false); }}
            className="p-5 rounded-full bg-white border-2 border-kawaii-bg text-kawaii-earthLight hover:bg-kawaii-bg transition-all haptic-press"
            title="Reset"
          >
            <Timer size={24} weight="bold" />
          </button>

          <button 
            onClick={() => setIsActive(!isActive)}
            className={`p-10 rounded-full flex items-center justify-center transition-all haptic-press shadow-xl
              ${isActive ? 'bg-white text-kawaii-earth border-4 border-kawaii-pink' : 'bg-kawaii-pink text-white border-4 border-white'}`}
          >
            {isActive ? <Pause size={48} weight="fill" /> : <Play size={48} weight="fill" className="ml-2" />}
          </button>

          <button 
            onClick={() => { setTimeLeft(600); setIsActive(false); }}
            className="p-5 rounded-full bg-white border-2 border-kawaii-bg text-kawaii-earthLight hover:bg-kawaii-bg transition-all haptic-press"
            title="Deep Zen (10 min)"
          >
            <Wind size={24} weight="bold" />
          </button>
        </div>

        {/* Stats / Feedback */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 flex items-center gap-6 bg-white/40 backdrop-blur-md px-8 py-4 rounded-full border border-white/60"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={20} weight="fill" className="text-kawaii-mint" />
            <span className="text-xs font-black text-kawaii-earth uppercase tracking-widest">
              {sessionsCompleted} Sessions Today
            </span>
          </div>
          <div className="w-px h-4 bg-kawaii-earth/10" />
          <div className="flex items-center gap-2">
            <Sparkle size={20} weight="fill" className="text-kawaii-pink" />
            <span className="text-xs font-black text-kawaii-earth uppercase tracking-widest">
              Luna is calm
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Meditation;
