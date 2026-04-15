import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkle, ChatCircleText, ArrowLeft, Plus, Globe, ShieldCheck } from '@phosphor-icons/react';
import Sticker from '../components/UI/Sticker';

const MOCK_AFFIRMATIONS = [
  { id: 1, text: "You are deserving of rest and soft days.", author: "Luna Community", likes: 124, color: "bg-pink-50" },
  { id: 2, text: "Healing isn't linear, and that is okay.", author: "DearLuna Bot", likes: 89, color: "bg-purple-50" },
  { id: 3, text: "Your worth is not measured by your productivity.", author: "Solar Star", likes: 256, color: "bg-yellow-50" },
  { id: 4, text: "Breathe. You have survived everything life threw at you.", author: "Kindness-101", likes: 167, color: "bg-blue-50" },
];

const SafeSpace = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(MOCK_AFFIRMATIONS);
  const [newMsg, setNewMsg] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now(),
      text: newMsg,
      author: "You",
      likes: 0,
      color: "bg-white"
    };
    setMessages([msg, ...messages]);
    setNewMsg("");
    setIsPosting(false);
  };

  return (
    <div className="w-full h-full p-8 flex flex-col gap-8 bg-[#FDFBF7] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kawaii-pink/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kawaii-lilac/10 rounded-full blur-[80px] -z-10" />

      {/* HEADER */}
      <div className="flex justify-between items-start z-20">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-black text-kawaii-earthLight hover:text-kawaii-earth transition-all mb-4 group"
          >
            <ArrowLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-[10px]">Back to sanctuary</span>
          </button>
          <h1 className="text-4xl font-black text-kawaii-earth tracking-tighter">Safe Space</h1>
          <p className="text-xs font-black text-kawaii-earthLight uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck size={16} weight="fill" className="text-kawaii-mint" /> 
            A private community for soft hearts
          </p>
        </div>

        <button 
          onClick={() => setIsPosting(true)}
          className="flex items-center gap-2 px-8 py-4 bg-kawaii-pink text-white rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus weight="bold" /> Share Light
        </button>
      </div>

      {/* SEARCH / FILTER TABS */}
      <div className="flex gap-4 z-20">
        {['All Echoes', 'Mindfulness', 'Self-Love', 'Support'].map((tab, i) => (
          <button key={tab} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all
            ${i === 0 ? 'bg-kawaii-earth text-white border-kawaii-earth' : 'bg-white border-white text-kawaii-earthLight hover:border-kawaii-pink/30'}
           shadow-sm`}>
            {tab}
          </button>
        ))}
      </div>

      {/* FEED GRID */}
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar z-10">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {isPosting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="break-inside-avoid bg-white border-4 border-kawaii-pink p-8 rounded-[40px] shadow-xl relative"
              >
                <textarea 
                  autoFocus
                  placeholder="Share something kind..."
                  className="w-full h-32 bg-transparent text-xl font-medium text-kawaii-earth outline-none resize-none placeholder:text-gray-300"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setIsPosting(false)} className="text-xs font-black text-kawaii-earthLight uppercase tracking-widest">Cancel</button>
                  <button onClick={handlePost} className="px-6 py-2 bg-kawaii-earth text-white rounded-full font-black text-xs">Post ✨</button>
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`break-inside-avoid ${msg.color} p-8 rounded-[40px] shadow-sm border border-white/60 relative group hover:shadow-md transition-shadow`}
              >
                <ChatCircleText size={32} weight="fill" className="absolute -top-4 -left-2 text-kawaii-lilac opacity-20 group-hover:opacity-100 transition-opacity" />
                
                <p className="text-lg font-bold text-kawaii-earth leading-relaxed mb-6">
                  "{msg.text}"
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest">— {msg.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full hover:bg-white transition-colors group/btn">
                       <Heart size={16} weight="fill" className="text-gray-300 group-hover/btn:text-kawaii-pink transition-colors" />
                       <span className="text-xs font-black text-kawaii-earthLight">{msg.likes}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER HINT */}
      <div className="mt-4 flex items-center justify-center gap-3 py-4 border-t border-white shadow-inner bg-white/30 backdrop-blur-md rounded-t-[40px]">
         <Globe size={18} className="text-kawaii-mint animate-pulse" />
         <span className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest">
           1.2k souls present in the sanctuary right now
         </span>
      </div>
    </div>
  );
};

export default SafeSpace;
