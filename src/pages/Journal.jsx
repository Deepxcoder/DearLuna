import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { BookOpen, PenNib, Trash, Calendar } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import { format } from 'date-fns';

const Journal = () => {
    const { user, loading } = useUserProfile();
    const [entry, setEntry] = useState('');
    const [entries, setEntries] = useState([]);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');

    const API_URL = 'http://localhost:5000/api';

    const fetchEntries = async () => {
      if (!user) return;
      try {
        const resp = await fetch(`${API_URL}/journal/${user.uid}`);
        if (resp.ok) setEntries(await resp.json());
      } catch (e) { console.error(e); }
    };

    useEffect(() => {
      fetchEntries();
    }, [user]);

    const handleSave = async () => {
      if (!entry.trim() || !user) return;
      setSaving(true);
      try {
        const resp = await fetch(`${API_URL}/journal/${user.uid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: entry,
            date: format(new Date(), 'yyyy-MM-dd')
          })
        });
        if (resp.ok) {
          setEntry('');
          setStatus('Saved! ✨');
          fetchEntries();
          setTimeout(() => setStatus(''), 3000);
        }
      } catch (e) {
        console.error(e);
        setStatus('Error ❌');
      } finally {
        setSaving(false);
      }
    };

    if (loading) return <div className="p-8">Loading your thoughts...</div>;

    return (
      <div className="flex flex-col lg:flex-row h-full gap-8 p-8 max-w-6xl mx-auto lg:pl-16 font-body">
        
        {/* Left Column: Editor */}
        <div className="flex-[2] flex flex-col gap-6">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-1">
               <BookOpen weight="duotone" className="text-kawaii-blue w-8 h-8" />
               <h1 className="text-4xl font-extrabold text-kawaii-earth tracking-tight">
                 Dear Diary
               </h1>
            </div>
            <p className="text-kawaii-earthLight font-bold uppercase text-xs tracking-widest mt-2 px-1">Capture your feelings and tiny moments today.</p>
          </motion.header>

          <GlassCard delay={0.1} className="flex-1 flex flex-col !bg-white/60 !rounded-[40px] p-8 border-2 border-white shadow-sm min-h-[400px]">
              <h3 className="font-extrabold text-kawaii-earth flex items-center gap-2 mb-6 text-xl">
                  <PenNib weight="fill" className="text-kawaii-pink" /> 
                  Reflections
              </h3>

              <textarea 
                  className="w-full flex-1 resize-none bg-transparent outline-none text-kawaii-earth font-medium placeholder-kawaii-earthLight/40 p-2 text-lg"
                  placeholder="I felt really happy when..."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
              />

              <div className="flex items-center justify-between mt-6">
                  <span className="text-sm font-bold text-kawaii-pink">{status}</span>
                  <button 
                    disabled={saving}
                    onClick={handleSave}
                    className="bg-gradient-to-r from-kawaii-pink to-kawaii-lilac text-white font-bold px-10 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                      {saving ? 'Writing...' : 'Save Entry'}
                  </button>
              </div>
          </GlassCard>
        </div>

        {/* Right Column: Past Entries */}
        <div className="flex-1 flex flex-col gap-6 h-full min-w-[300px]">
           <h3 className="text-2xl font-extrabold text-kawaii-earth flex items-center gap-2">
             Past Entries
           </h3>
           <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <AnimatePresence>
                {entries.map((item, idx) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/40 border border-white p-6 rounded-[24px] shadow-sm hover:bg-white/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-kawaii-earthLight font-bold text-xs uppercase tracking-tighter">
                         <Calendar size={14} />
                         {item.date}
                      </div>
                      <Trash size={16} className="text-red-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all" />
                    </div>
                    <p className="text-kawaii-earth text-sm font-medium line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {entries.length === 0 && (
                <div className="text-center py-10 text-kawaii-earthLight font-medium">No entries yet. Start writing! ✨</div>
              )}
           </div>
        </div>

      </div>
    );
};

export default Journal;
