import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, ArrowLeft, FloppyDisk, Sparkle, Camera } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import Sticker from '../components/UI/Sticker';

const AVAILABLE_STICKERS = [
  '🐻', '🐱', '✨', '💖', '🌙', '⭐', '🌸', '🍵', '📚', '🎨', '🎀', '☁️', '🌈', '🍓', '🧁', '🧸'
];

const Scrapbook = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const [stickers, setStickers] = useState(profile?.scrapbook || []);
  const canvasRef = useRef(null);

  const addSticker = (emoji) => {
    const newSticker = {
      id: `sticker_${Date.now()}`,
      emoji,
      x: Math.random() * 60 + 20, // percentage
      y: Math.random() * 60 + 20, // percentage
      rotate: Math.random() * 60 - 30,
      scale: 1 + Math.random() * 0.5
    };
    const next = [...stickers, newSticker];
    setStickers(next);
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const handleSave = () => {
    updateProfile({ scrapbook: stickers });
    // Visual feedback
    const btn = document.getElementById('save-btn');
    if (btn) {
      btn.innerText = 'Saved! ✨';
      setTimeout(() => btn.innerText = 'Save Layout', 2000);
    }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col gap-6 relative overflow-hidden bg-[#FAF7F2]">
      {/* HEADER */}
      <div className="flex justify-between items-center z-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-black text-kawaii-earthLight hover:text-kawaii-earth transition-all group"
        >
          <div className="p-2 rounded-full bg-white/80 shadow-sm group-hover:bg-white transition-colors">
            <ArrowLeft weight="bold" />
          </div>
          <span className="uppercase tracking-widest text-[10px]">Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-black text-kawaii-earth tracking-tighter">Your Scrapbook</h1>
          <p className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest">A space for your memories</p>
        </div>

        <button 
          id="save-btn"
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-kawaii-earth text-white rounded-full font-black text-xs hover:bg-black transition-all shadow-lg haptic-press"
        >
          <FloppyDisk weight="bold" /> Save Layout
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 relative z-10">
        {/* STICKER PICKER */}
        <div className="w-24 shrink-0 flex flex-col gap-3 p-4 bg-white/60 backdrop-blur-md rounded-[32px] border border-white/80 overflow-y-auto no-scrollbar shadow-sm">
           <h3 className="text-[9px] font-black text-kawaii-earthLight uppercase tracking-widest text-center mb-2">Picks</h3>
           {AVAILABLE_STICKERS.map(emoji => (
             <button
               key={emoji}
               onClick={() => addSticker(emoji)}
               className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-transparent hover:border-kawaii-pink hover:scale-110 transition-all active:scale-90"
             >
               {emoji}
             </button>
           ))}
        </div>

        {/* CANVAS */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-white rounded-[48px] border-8 border-white shadow-soft relative overflow-hidden notebook-paper"
        >
          <div className="absolute top-8 left-12 z-0">
             <div className="flex items-center gap-3 mb-2 opacity-30">
                <Camera size={32} />
                <h2 className="text-2xl font-black italic">Memories...</h2>
             </div>
             <p className="text-sm text-gray-400 font-medium italic">Click stickers to remove them</p>
          </div>

          <AnimatePresence>
            {stickers.map((s) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: s.scale, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                drag
                dragConstraints={canvasRef}
                onDragEnd={(e, info) => {
                  // Coordinate update logic would go here if we wanted persistent drag positions
                  // For now we rely on the drag state and session save
                }}
                onClick={() => removeSticker(s.id)}
                className="absolute cursor-move active:z-50"
                style={{ 
                  left: `${s.x}%`, 
                  top: `${s.y}%`,
                  rotate: `${s.rotate}deg`,
                  touchAction: 'none'
                }}
              >
                <Sticker emoji={s.emoji} className="shadow-lg border-2 border-white/50" style={{ fontSize: '3rem', cursor: 'grab' }} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {stickers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
               <Sparkle size={64} className="mb-4" />
               <p className="font-black uppercase tracking-[0.3em] text-xs">Canvas is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scrapbook;
