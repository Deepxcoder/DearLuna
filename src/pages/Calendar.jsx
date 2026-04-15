import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Drop } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import {
  getCalendarGrid, getDayPhase, formatMonthHeader, formatDetailDate,
  addMonths, subMonths, format
} from '../utils/dateUtils';
import {
  addDays, subDays, addYears, subYears,
  eachMonthOfInterval, startOfYear, endOfYear,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday as dfIsToday
} from 'date-fns';

// ─── Shared: Day-detail popup content ────────────────────────────────────────
const DayDetailContent = ({ selectedDayLog, onReflectionChange, isSaving }) => (
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
          } rounded-sm`} />
        </div>
        <span className="text-[10px] font-bold uppercase text-kawaii-earthLight">{selectedDayLog.energy || 'No Data'}</span>
      </div>
    </div>

    <div className="w-full bg-white rounded-3xl p-6 min-h-[180px] notebook-paper shadow-inner border border-kawaii-lilac/10 relative">
      <h4 className="absolute top-2 left-10 text-[10px] font-bold text-kawaii-earthLight uppercase tracking-widest bg-white px-2">Journal</h4>
      <textarea
        value={selectedDayLog.reflection || ''}
        onChange={(e) => onReflectionChange(e.target.value)}
        placeholder="Write your note for this day..."
        className="w-full mt-4 min-h-[120px] bg-transparent border-none outline-none resize-none text-kawaii-earth font-body font-medium leading-[2.2rem]"
      />
      <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight mt-1">
        {isSaving ? 'Saving...' : 'Saved'}
      </p>
    </div>
  </div>
);

// ─── VIEW: Day (single-day focus + week strip) ────────────────────────────────
const DayView = ({ viewDate, profile, monthLogs, onDayClick }) => {
  const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(viewDate, { weekStartsOn: 1 }) });

  return (
    <motion.div key="day-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex flex-col gap-4 h-full">

      {/* Week strip */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(d => {
          const isSelected = format(d, 'yyyy-MM-dd') === format(viewDate, 'yyyy-MM-dd');
          const isToday = dfIsToday(d);
          const phase = getDayPhase(d, profile.lastPeriodDate);
          return (
            <div key={d.toString()}
              onClick={() => onDayClick(d)}
              className={`flex flex-col items-center gap-1 py-3 rounded-2xl cursor-pointer transition-all border-2
                ${isSelected ? 'bg-kawaii-earth text-white border-kawaii-earth shadow-md' :
                  isToday ? 'border-kawaii-pink/40 bg-kawaii-pink/10' : 'border-white/60 bg-white/30 hover:bg-white/50'}
              `}
            >
              <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-kawaii-earthLight'}`}>
                {format(d, 'EEE')}
              </span>
              <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-kawaii-earth'}`}>
                {format(d, 'd')}
              </span>
              {phase === 'period' && <Drop weight="fill" size={10} className={isSelected ? 'text-red-300' : 'text-red-400'} />}
            </div>
          );
        })}
      </div>

      {/* Day focus card */}
      <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[32px] p-6 border border-white/60 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-kawaii-earth">{format(viewDate, 'EEEE')}</h3>
          <span className="text-sm font-bold text-kawaii-earthLight">{format(viewDate, 'MMMM d, yyyy')}</span>
        </div>

        {/* Phase pill */}
        {(() => {
          const phase = getDayPhase(viewDate, profile.lastPeriodDate);
          const phaseMap = {
            period: { label: '🩸 Period', bg: 'bg-red-50', text: 'text-red-400', border: 'border-red-200' },
            fertile: { label: '✨ Fertile', bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
          };
          const cfg = phaseMap[phase] || { label: '🌱 Follicular', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
          return (
            <div className={`${cfg.bg} ${cfg.border} border rounded-2xl px-4 py-2 flex items-center gap-2 w-fit`}>
              <span className={`text-sm font-black ${cfg.text}`}>{cfg.label}</span>
            </div>
          );
        })()}

        {/* Log for this day */}
        {(() => {
          const log = monthLogs.find(l => l.date === format(viewDate, 'yyyy-MM-dd'));
          return log ? (
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="bg-white/60 rounded-2xl p-3 text-center">
                <p className="text-2xl">{log.mood === 'happy' ? '😊' : log.mood === 'calm' ? '🧘' : log.mood === 'sad' ? '😢' : '❓'}</p>
                <p className="text-[10px] font-black text-kawaii-earthLight uppercase mt-1">{log.mood || '—'}</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-3 text-center">
                <p className="text-2xl">{log.energy === 'High' ? '⚡' : log.energy === 'Medium' ? '🔆' : log.energy === 'Low' ? '🪫' : '❓'}</p>
                <p className="text-[10px] font-black text-kawaii-earthLight uppercase mt-1">{log.energy || '—'}</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-3 text-center">
                <p className="text-2xl">{log.symptoms?.length ? '🤢' : '☀️'}</p>
                <p className="text-[10px] font-black text-kawaii-earthLight uppercase mt-1">{log.symptoms?.[0] || 'Clear'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-kawaii-earthLight/60 mt-2">No data logged for this day.</p>
          );
        })()}
      </div>
    </motion.div>
  );
};

// ─── VIEW: Month (existing grid) ─────────────────────────────────────────────
const MonthViewGrid = ({ viewDate, profile, monthLogs, onDayClick }) => {
  const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const grid = getCalendarGrid(viewDate);

  return (
    <motion.div key="month-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex-1 min-h-0 grid grid-cols-7 gap-y-2 lg:gap-y-4 gap-x-2 text-center content-start">
      {daysLabels.map((d, i) => (
        <div key={i} className="text-sm font-black text-kawaii-earthLight uppercase tracking-widest mb-2">{d}</div>
      ))}
      {grid.map((day, idx) => {
        const phase = getDayPhase(day.date, profile.lastPeriodDate);
        const isPeriod = phase === 'period';
        const log = monthLogs.find(l => l.date === format(day.date, 'yyyy-MM-dd'));
        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-center relative my-0.5 cursor-pointer group"
            onClick={() => { if (day.isCurrentMonth) onDayClick(day); }}
          >
            <div className={`w-full aspect-[4/3] max-h-16 flex items-center justify-center rounded-2xl font-bold text-lg
              transition-all duration-200 group-hover:scale-105
              ${!day.isCurrentMonth ? 'text-gray-300 opacity-30 select-none' : 'text-kawaii-earth'}
              ${day.isCurrentMonth && !day.isToday ? 'bg-white/40 border border-white/40' : ''}
              ${day.isToday ? 'bg-kawaii-earth text-white shadow-md border-0 ring-4 ring-kawaii-earth/10' : ''}
              ${isPeriod && day.isCurrentMonth ? 'bg-red-50/50 border-red-200' : ''}
              ${log && day.isCurrentMonth ? 'ring-2 ring-kawaii-pink/20' : ''}
            `}>
              {isPeriod && day.isCurrentMonth ? (
                <Drop weight="fill" className="text-red-400" size={18} />
              ) : day.dayNumber}
            </div>
            {log && day.isCurrentMonth && <div className="absolute bottom-1 w-1 h-1 bg-kawaii-pink rounded-full" />}
          </div>
        );
      })}
    </motion.div>
  );
};

// ─── VIEW: Year ───────────────────────────────────────────────────────────────
const YearViewGrid = ({ viewDate, profile, onMonthClick }) => {
  const months = eachMonthOfInterval({ start: startOfYear(viewDate), end: endOfYear(viewDate) });

  return (
    <motion.div key="year-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="grid grid-cols-3 gap-3 flex-1 content-start overflow-y-auto custom-scrollbar">
      {months.map(m => {
        const isCurrentMonth = format(m, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
        const isFocused = format(m, 'yyyy-MM') === format(viewDate, 'yyyy-MM');

        // Mini days grid for this month
        const firstDow = (new Date(m.getFullYear(), m.getMonth(), 1).getDay() + 6) % 7;
        const daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();

        return (
          <div
            key={m.toString()}
            onClick={() => onMonthClick(m)}
            className={`rounded-[24px] p-4 cursor-pointer transition-all border-2 flex flex-col gap-2
              ${isFocused ? 'border-kawaii-earth bg-kawaii-earth/5 shadow-md' :
                isCurrentMonth ? 'border-kawaii-pink/30 bg-white/50' : 'border-white/60 bg-white/30 hover:bg-white/50'}
            `}
          >
            <p className={`font-black text-sm ${isFocused ? 'text-kawaii-earth' : 'text-kawaii-earthLight'}`}>
              {format(m, 'MMMM')}
            </p>
            {/* Tiny 7-col grid */}
            <div className="grid grid-cols-7 gap-px">
              {Array(firstDow).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const dayDate = new Date(m.getFullYear(), m.getMonth(), i + 1);
                const phase = getDayPhase(dayDate, profile.lastPeriodDate);
                const today = dfIsToday(dayDate);
                return (
                  <div key={i}
                    className={`aspect-square rounded-sm text-[7px] font-bold flex items-center justify-center
                      ${today ? 'bg-kawaii-earth text-white rounded-full' :
                        phase === 'period' ? 'bg-red-300/60' :
                        phase === 'fertile' ? 'bg-yellow-200/60' : 'bg-transparent text-kawaii-earthLight/50'}
                    `}
                  >
                    {today ? '·' : ''}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

// ─── Main Calendar Page ───────────────────────────────────────────────────────
const Calendar = () => {
  const { profile, dailyLog, updateDailyLog, loading, fetchLogRange, updateLogForDate, currentDate, setCurrentDate } = useUserProfile();
  const [viewDate, setViewDate] = useState(new Date(`${currentDate}T00:00:00`));
  const [calView, setCalView] = useState('Month'); // 'Day' | 'Month' | 'Year'
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDayLog, setSelectedDayLog] = useState(null);
  const [monthLogs, setMonthLogs] = useState([]);
  const [isSavingDetail, setIsSavingDetail] = useState(false);
  const detailSaveTimer = useRef(null);

  const grid = getCalendarGrid(viewDate);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;
      const start = format(grid[0].date, 'yyyy-MM-dd');
      const end = format(grid[grid.length - 1].date, 'yyyy-MM-dd');
      const logs = await fetchLogRange(start, end);
      setMonthLogs(logs);
    };
    fetchData();
  }, [viewDate, profile]);

  useEffect(() => {
    setViewDate(new Date(`${currentDate}T00:00:00`));
  }, [currentDate]);

  useEffect(() => () => clearTimeout(detailSaveTimer.current), []);

  if (loading || !profile || !dailyLog) return <div className="p-8 text-kawaii-earth">Syncing with stars...</div>;

  // Navigation
  const handlePrev = () => {
    let nextDate;
    if (calView === 'Day') nextDate = subDays(viewDate, 1);
    else if (calView === 'Month') nextDate = subMonths(viewDate, 1);
    else nextDate = subYears(viewDate, 1);
    setViewDate(nextDate);
    setCurrentDate(format(nextDate, 'yyyy-MM-dd'));
  };
  const handleNext = () => {
    let nextDate;
    if (calView === 'Day') nextDate = addDays(viewDate, 1);
    else if (calView === 'Month') nextDate = addMonths(viewDate, 1);
    else nextDate = addYears(viewDate, 1);
    setViewDate(nextDate);
    setCurrentDate(format(nextDate, 'yyyy-MM-dd'));
  };

  const getNavLabel = () => {
    if (calView === 'Day') return format(viewDate, 'EEEE, MMMM d');
    if (calView === 'Month') return formatMonthHeader(viewDate);
    return format(viewDate, 'yyyy');
  };

  const openDayDetail = (dayOrDate) => {
    const dateStr = dayOrDate.date
      ? format(dayOrDate.date, 'yyyy-MM-dd')
      : format(dayOrDate, 'yyyy-MM-dd');
    setCurrentDate(dateStr);
    const log = monthLogs.find(l => l.date === dateStr);
    setSelectedDayLog(log || { date: dateStr, mood: '', symptoms: [], energy: '', reflection: '' });
    setActiveModal('detail');
  };

  const toggleSymptom = (s) => {
    const fresh = dailyLog.symptoms || [];
    const next = fresh.includes(s) ? fresh.filter(x => x !== s) : [...fresh, s];
    updateDailyLog({ symptoms: next });
  };

  const handleDetailReflectionChange = (text) => {
    if (!selectedDayLog?.date) return;
    setSelectedDayLog(prev => ({ ...prev, reflection: text }));
    clearTimeout(detailSaveTimer.current);
    setIsSavingDetail(true);
    detailSaveTimer.current = setTimeout(async () => {
      const saved = await updateLogForDate(selectedDayLog.date, { reflection: text });
      if (saved) {
        setMonthLogs(prev => {
          const exists = prev.some(l => l.date === saved.date);
          if (exists) return prev.map(l => (l.date === saved.date ? saved : l));
          return [...prev, saved].sort((a, b) => a.date.localeCompare(b.date));
        });
        setSelectedDayLog(saved);
      }
      setIsSavingDetail(false);
    }, 450);
  };

  return (
    <div className="w-full flex h-full max-w-[1600px] mx-auto p-4 lg:p-6 gap-6 font-body overflow-hidden">

      {/* LEFT COLUMN: CALENDAR */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex-[1.4] flex flex-col min-h-0 bg-white/20 border-2 border-white/50 backdrop-blur-lg rounded-[40px] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] relative"
      >
        <Sticker emoji="🐱" className="-top-10 left-10" rotate={-5} style={{ fontSize: '3rem' }} />
        <Sticker emoji="✨" className="-top-6 right-10" rotate={10} style={{ fontSize: '1.5rem' }} />

        {/* Header: nav + view tabs */}
        <div className="flex justify-between items-center mb-6 px-2 shrink-0">
          <h2 className="text-2xl font-black text-kawaii-earth tracking-tight truncate mr-2">
            {getNavLabel()}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/40 text-kawaii-earth transition-colors">
              <CaretLeft size={20} weight="bold" />
            </button>
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/40 text-kawaii-earth transition-colors">
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* View mode tabs */}
        <div className="flex bg-white/40 backdrop-blur-md rounded-full border border-white/60 p-1 shadow-inner mb-6 w-fit shrink-0">
          {['Day', 'Month', 'Year'].map(v => (
            <button key={v} onClick={() => setCalView(v)}
              className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300
                ${calView === v ? 'bg-kawaii-earth text-white shadow-md' : 'text-kawaii-earthLight hover:text-kawaii-earth'}`}
            >{v}</button>
          ))}
        </div>

        {/* View content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {calView === 'Day' && (
              <DayView
                viewDate={viewDate}
                profile={profile}
                monthLogs={monthLogs}
                onDayClick={(d) => {
                  setViewDate(d);
                  setCurrentDate(format(d, 'yyyy-MM-dd'));
                  openDayDetail(d);
                }}
              />
            )}
            {calView === 'Month' && (
              <MonthViewGrid
                viewDate={viewDate}
                profile={profile}
                monthLogs={monthLogs}
                onDayClick={openDayDetail}
              />
            )}
            {calView === 'Year' && (
              <YearViewGrid
                viewDate={viewDate}
                profile={profile}
                onMonthClick={(m) => { setViewDate(m); setCalView('Month'); }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: QUICK LOGGING */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar"
      >
        <h3 className="text-2xl font-black text-kawaii-earth px-2">
          Daily Rituals
          <span className="ml-3 text-xs font-bold uppercase tracking-widest text-kawaii-earthLight">
            {currentDate}
          </span>
        </h3>

        {/* MOOD */}
        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-white/60 relative">
          <Sticker emoji="🐻" className="-top-4 -right-2" rotate={10} style={{ fontSize: '1.5rem' }} />
          <h4 className="font-bold text-kawaii-earth mb-4">How are you feeling?</h4>
          <div className="grid grid-cols-5 gap-3">
            {[
              { e: '😊', m: 'happy' }, { e: '😢', m: 'sad' }, { e: '😠', m: 'angry' },
              { e: '😴', m: 'tired' }, { e: '🧘', m: 'calm' }
            ].map(item => (
              <div
                key={item.m}
                onClick={() => updateDailyLog({ mood: item.m })}
                className={`aspect-square rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 cursor-pointer transition-all
                  ${dailyLog.mood === item.m ? 'scale-110 border-kawaii-pink bg-white shadow-md ring-4 ring-pink-50' : 'border-white bg-white/40 hover:scale-105'}`}
              >{item.e}</div>
            ))}
          </div>
        </div>

        {/* ENERGY */}
        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-white/60">
          <h4 className="font-bold text-kawaii-earth mb-4">Energy Level</h4>
          <div className="flex justify-between items-center px-2">
            {['Low', 'Medium', 'High'].map((l, i) => (
              <div
                key={l}
                onClick={() => updateDailyLog({ energy: l })}
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${dailyLog.energy === l ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                <div className={`w-12 h-16 border-[3px] ${dailyLog.energy === l ? 'border-kawaii-earth' : 'border-gray-300'} rounded-xl bg-white flex flex-col justify-end p-1`}>
                  <div className={`w-full ${i === 0 ? 'h-1/3 bg-red-200' : i === 1 ? 'h-2/3 bg-yellow-200' : 'h-full bg-green-200'} rounded-lg transition-all`} />
                </div>
                <span className="text-[11px] font-black text-kawaii-earthLight uppercase">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SYMPTOMS */}
        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-white/60 relative flex-1">
          <h4 className="font-bold text-kawaii-earth mb-4">Symptoms</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { e: '🤢', l: 'Bloating' }, { e: '🌩️', l: 'Cramps' },
              { e: '🤕', l: 'Headache' }, { e: '🩹', l: 'Acne' }
            ].map(s => {
              const isActive = dailyLog.symptoms?.includes(s.l);
              return (
                <div
                  key={s.l}
                  onClick={() => toggleSymptom(s.l)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer
                    ${isActive ? 'bg-white border-kawaii-pink shadow-sm' : 'bg-white/30 border-transparent hover:bg-white/50'}`}
                >
                  <span className="text-xl">{s.e}</span>
                  <span className={`text-xs font-bold ${isActive ? 'text-kawaii-earth' : 'text-kawaii-earthLight'}`}>{s.l}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-yellow-100/40 rounded-2xl border border-yellow-200/50">
            <h5 className="text-[10px] font-black uppercase text-kawaii-earthLight tracking-widest mb-2">Daily Note</h5>
            <textarea
              value={dailyLog.reflection || ''}
              onChange={(e) => updateDailyLog({ reflection: e.target.value })}
              placeholder="Write a small note..."
              className="w-full bg-transparent text-sm font-medium text-kawaii-earth outline-none resize-none h-16"
            />
          </div>
        </div>
      </motion.div>

      {/* MODAL */}
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
              {activeModal === 'detail' && selectedDayLog && (
                <DayDetailContent
                  selectedDayLog={selectedDayLog}
                  onReflectionChange={handleDetailReflectionChange}
                  isSaving={isSavingDetail}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
