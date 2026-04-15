import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useUserProfile } from '../context/UserProfileContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import Sticker from '../components/UI/Sticker';
import { ChartBar, TrendUp, Heartbeat, Drop } from '@phosphor-icons/react';

const Analytics = () => {
  const { user, profile, fetchLogRange, loading } = useUserProfile();
  const [logs, setLogs] = useState([]);
  const [daysCount, setDaysCount] = useState(14);

  useEffect(() => {
    const getStats = async () => {
      if (!user) return;
      const end = format(new Date(), 'yyyy-MM-dd');
      const start = format(subDays(new Date(), daysCount), 'yyyy-MM-dd');
      const data = await fetchLogRange(start, end);
      setLogs(data);
    };
    getStats();
  }, [user, daysCount]);

  // Data Transformations
  const moodData = useMemo(() => {
    const moodMap = { happy: 5, sad: 1, angry: 2, tired: 3, stressed: 2, '': 0 };
    const interval = eachDayOfInterval({
      start: subDays(new Date(), daysCount),
      end: new Date()
    });

    return interval.map(date => {
      const dStr = format(date, 'yyyy-MM-dd');
      const log = logs.find(l => l.date === dStr);
      return {
        date: format(date, 'MMM dd'),
        mood: log ? moodMap[log.mood] : 0,
        water: log ? log.rituals.water : 0,
      };
    });
  }, [logs, daysCount]);

  const symptomData = useMemo(() => {
    const counts = {};
    logs.forEach(l => {
      l.symptoms.forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const COLORS = ['#FFB7C5', '#957DAD', '#BCECE0', '#A85A6B', '#FFD1DC'];

  if (loading || !profile) return <div className="p-8 text-kawaii-earth">Calculating your moon cycles...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 w-full max-w-7xl mx-auto flex flex-col gap-10 min-h-screen font-body relative lg:pl-16"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-kawaii-earth tracking-tight mb-2 flex items-center gap-3">
             <ChartBar weight="fill" className="text-kawaii-pink" /> 
             Analytics
          </h2>
          <p className="text-kawaii-earthLight font-bold uppercase text-xs tracking-widest pl-1">Insights for your last {daysCount} days</p>
        </div>
        
        <div className="flex bg-white/40 backdrop-blur-md rounded-full border border-white/60 p-1 shadow-inner shrink-0">
          {[14, 30].map(v => (
            <button 
              key={v} 
              onClick={() => setDaysCount(v)} 
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${daysCount === v ? 'bg-kawaii-pink text-kawaii-earth shadow-md' : 'text-kawaii-earthLight'}`}
            >
              Last {v} Days
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MOOD & WATER TRENDS */}
        <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 border-2 border-white shadow-sm relative overflow-hidden h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-kawaii-earth mb-6 flex items-center gap-2">
             <TrendUp weight="bold" /> Mood & Hydration
           </h3>
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={moodData}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB7C5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FFB7C5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#7A593E', fontSize: 10, fontWeight: 700}} />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="mood" stroke="#FFB7C5" strokeWidth={4} fillOpacity={1} fill="url(#colorMood)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* SYMPTOM DISTRIBUTION */}
        <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 border-2 border-white shadow-sm relative overflow-hidden h-[400px] flex flex-col">
           <h3 className="text-xl font-bold text-kawaii-earth mb-6 flex items-center gap-2">
             <Heartbeat weight="bold" /> Top Symptoms
           </h3>
           <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={symptomData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {symptomData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 pl-4">
                 {symptomData.map((s, idx) => (
                   <div key={s.name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                     <span className="text-xs font-bold text-kawaii-earth">{s.name}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* WATER INTAKE */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-[40px] p-8 border-2 border-white shadow-sm relative overflow-hidden h-[300px] flex flex-col">
           <h3 className="text-xl font-bold text-kawaii-earth mb-6 flex items-center gap-2">
              <Drop weight="fill" className="text-blue-400" /> Daily Hydration (ml)
           </h3>
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#7A593E', fontSize: 10, fontWeight: 700}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'rgba(96, 165, 250, 0.1)'}} />
                    <Bar dataKey="water" fill="#60A5FA" radius={[10, 10, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <Sticker emoji="💧" className="bottom-4 right-4" rotate={15} style={{ fontSize: '2rem' }} />
        </div>

      </div>

      {/* INSIGHT CARD */}
      <div className="bg-gradient-to-r from-kawaii-pink to-kawaii-lilac rounded-[40px] p-10 text-white relative shadow-lg">
         <Sticker emoji="🐱" className="-top-6 -left-6" rotate={-15} style={{ fontSize: '3rem', border: '5px solid white' }} />
         <h3 className="text-2xl font-black mb-2">Luna Insight</h3>
         <p className="text-lg font-bold opacity-90 max-w-2xl">
            "We've noticed you felt a bit **stressed** during your follicular phase this month. Maybe try adding 5 minutes of extra meditation in your next cycle? You've got this, {profile.name}! ✨"
         </p>
      </div>

    </motion.div>
  );
};

export default Analytics;
