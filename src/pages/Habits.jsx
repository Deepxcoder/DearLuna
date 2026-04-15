import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Check, PencilSimple, Plus, Trash, X, FloppyDisk, Drop } from '@phosphor-icons/react';
import {
  format, addDays, subDays, addMonths, subMonths, addYears, subYears,
  eachMonthOfInterval, startOfYear, endOfYear,
  eachDayOfInterval, startOfMonth, endOfMonth, isToday as dfIsToday
} from 'date-fns';
import { useUserProfile } from '../context/UserProfileContext';
import LunaPet from '../components/UI/LunaPet';
import confetti from 'canvas-confetti';

// ─── Default habits (used when none are customised) ──────────────────────────
const DEFAULT_HABITS = [
  { id: 'skincare',   emoji: '🧴', name: 'Skincare',   color: 'bg-blue-50'   },
  { id: 'journaling', emoji: '📖', name: 'Journaling', color: 'bg-pink-50'   },
  { id: 'reading',    emoji: '📚', name: 'Reading',    color: 'bg-orange-50' },
  { id: 'sleep',      emoji: '☁️', name: 'Sleep',      color: 'bg-purple-50' },
];

const PALETTE = [
  'bg-blue-50', 'bg-pink-50', 'bg-orange-50', 'bg-purple-50',
  'bg-green-50', 'bg-yellow-50', 'bg-red-50', 'bg-teal-50',
];

const EMOJI_PICKS = ['🧴','📖','📚','☁️','🏃','🧘','💧','🌿','🎨','🎵','🍎','🌙','⭐','🔥','💪','🧠'];

// ─── Habit Card (Day view) ────────────────────────────────────────────────────
const HabitCard = ({ emoji, title, isActive, onClick, color, rotate = 0 }) => (
  <div
    onClick={onClick}
    className={`habit-card-shell ${color} ui-rounded-sm ui-p shadow-sm border border-white relative flex flex-col cursor-pointer hover:brightness-95 transition-all select-none`}
    style={{ minHeight: 'clamp(100px, 16vh, 160px)' }}
  >
    <Sticker emoji={emoji} className="absolute top-4 left-4" rotate={rotate} style={{ fontSize: 'var(--ui-font-3xl, 3rem)' }} />
    <div className="absolute top-4 right-6 text-right">
      <h4 className="font-extrabold text-kawaii-earth ui-text-base">{title}</h4>
      <AnimatePresence>
        {isActive && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={24} className="text-[#A85A6B] inline-block mt-2" weight="bold" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

// ─── Habit Editor Modal ───────────────────────────────────────────────────────
const HabitEditorModal = ({ habits, onSave, onClose }) => {
  const [draft, setDraft] = useState(habits.map(h => ({ ...h })));
  const [editingIdx, setEditingIdx] = useState(null);

  const addHabit = () => {
    const newHabit = {
      id: `habit_${Date.now()}`,
      emoji: '✨',
      name: 'New Habit',
      color: PALETTE[draft.length % PALETTE.length],
    };
    setDraft(prev => [...prev, newHabit]);
    setEditingIdx(draft.length);
  };

  const removeHabit = (idx) => {
    setDraft(prev => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const updateHabit = (idx, field, value) => {
    setDraft(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-[32px] shadow-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-kawaii-earth text-lg">Edit Habits</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-kawaii-earthLight" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {draft.map((h, idx) => (
            <div key={h.id} className={`${h.color} rounded-2xl p-3 border border-white/60`}>
              {/* Collapsed row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                  className="text-2xl w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center hover:bg-white/90 transition-colors"
                >
                  {h.emoji}
                </button>
                <span className="flex-1 font-black text-kawaii-earth text-sm">{h.name}</span>
                <button
                  onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                  className="p-1.5 hover:bg-white/60 rounded-full transition-colors"
                >
                  <PencilSimple size={16} className="text-kawaii-earthLight" />
                </button>
                <button
                  onClick={() => removeHabit(idx)}
                  className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash size={16} className="text-red-400" />
                </button>
              </div>

              {/* Expanded editor */}
              <AnimatePresence>
                {editingIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex flex-col gap-3">
                      {/* Name */}
                      <input
                        type="text"
                        value={h.name}
                        onChange={e => updateHabit(idx, 'name', e.target.value)}
                        className="w-full bg-white/70 border border-white rounded-xl px-3 py-2 text-sm font-bold text-kawaii-earth outline-none"
                        placeholder="Habit name"
                        maxLength={20}
                      />
                      {/* Emoji picker */}
                      <div>
                        <p className="text-[9px] font-black text-kawaii-earthLight uppercase tracking-widest mb-1">Emoji</p>
                        <div className="grid grid-cols-8 gap-1">
                          {EMOJI_PICKS.map(em => (
                            <button
                              key={em}
                              onClick={() => updateHabit(idx, 'emoji', em)}
                              className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                ${h.emoji === em ? 'bg-kawaii-earth/20 scale-110' : 'hover:bg-white/60'}`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Colour picker */}
                      <div>
                        <p className="text-[9px] font-black text-kawaii-earthLight uppercase tracking-widest mb-1">Colour</p>
                        <div className="flex gap-2 flex-wrap">
                          {PALETTE.map(c => (
                            <button
                              key={c}
                              onClick={() => updateHabit(idx, 'color', c)}
                              className={`w-7 h-7 rounded-full ${c} border-2 transition-transform
                                ${h.color === c ? 'border-kawaii-earth scale-125' : 'border-white/60 hover:scale-110'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {draft.length < 8 && (
          <button
            onClick={addHabit}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-kawaii-pink/40 text-kawaii-earthLight hover:border-kawaii-pink hover:text-kawaii-earth transition-all font-black text-sm"
          >
            <Plus size={18} /> Add Habit
          </button>
        )}

        <button
          onClick={() => onSave(draft)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-kawaii-earth text-white font-black text-sm hover:bg-kawaii-earth/90 transition-colors"
        >
          <FloppyDisk size={18} /> Save Habits
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── Water Target Modal ───────────────────────────────────────────────────────
const WaterTargetModal = ({ current, onSave, onClose }) => {
  const [val, setVal] = useState(current);
  const PRESETS = [1000, 1500, 2000, 2500, 3000];
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-[32px] shadow-2xl p-6 w-full max-w-xs"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-kawaii-earth">Daily Water Goal</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Drop size={24} className="text-blue-400" weight="fill" />
          <input
            type="number"
            min={500} max={5000} step={100}
            value={val}
            onChange={e => setVal(Number(e.target.value))}
            className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-lg font-black text-kawaii-earth outline-none text-center"
          />
          <span className="text-sm font-black text-kawaii-earthLight">ml</span>
        </div>
        {/* Quick presets */}
        <div className="flex gap-2 flex-wrap mb-4">
          {PRESETS.map(p => (
            <button key={p} onClick={() => setVal(p)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all
                ${val === p ? 'bg-kawaii-earth text-white' : 'bg-blue-50 text-kawaii-earthLight hover:bg-blue-100'}`}>
              {p}ml
            </button>
          ))}
        </div>
        <button onClick={() => onSave(val)}
          className="w-full py-3 rounded-2xl bg-kawaii-earth text-white font-black text-sm hover:bg-kawaii-earth/90 transition-colors flex items-center justify-center gap-2">
          <FloppyDisk size={16} /> Set Goal
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── Water Log Modal ────────────────────────────────────────────────────────
const WaterLogModal = ({ current, target, onAdd, onSet, onReset, onClose }) => {
  const quickAdds = [150, 250, 400, 500];
  const progress = Math.min(100, ((current || 0) / target) * 100);
  const dropMarks = [25, 50, 75, 100];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-white/25 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md rounded-[36px] border-[3px] border-white/80 bg-gradient-to-br from-white to-[#FCEFF6] p-6 shadow-[0_24px_80px_rgba(147,93,122,0.22)]"
        initial={{ scale: 0.9, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 18 }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/70 transition-colors">
          <X size={18} className="text-kawaii-earthLight" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center border border-white shadow-sm">
            <Drop size={24} className="text-blue-500" weight="fill" />
          </div>
          <div>
            <h3 className="text-xl font-black text-kawaii-earth leading-tight">Hydration Log</h3>
            <p className="text-xs font-bold text-kawaii-earthLight uppercase tracking-widest">Update your water intake</p>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-4 border border-white/80 mb-4">
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-black text-kawaii-earth">{current || 0}ml</span>
            <span className="text-xs font-black text-kawaii-earthLight uppercase tracking-widest">Target {target}ml</span>
          </div>
          <div className="relative w-full h-3 bg-blue-50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            {dropMarks.map(mark => (
              <div key={mark} className="absolute top-0 bottom-0 w-px bg-white/70" style={{ left: `${mark}%` }} />
            ))}
          </div>
          <p className="mt-2 text-[11px] font-bold text-kawaii-earthLight uppercase tracking-wider">{progress.toFixed(0)}% complete</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickAdds.map(amount => (
            <button
              key={amount}
              onClick={() => onAdd(amount)}
              className="py-3 rounded-2xl bg-white border border-blue-100 font-black text-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              + {amount}ml
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSet(target)}
            className="py-3 rounded-2xl bg-gradient-to-r from-kawaii-pink to-kawaii-lilac text-white font-black"
          >
            Fill To Goal
          </button>
          <button
            onClick={onReset}
            className="py-3 rounded-2xl bg-white border border-red-100 text-red-400 font-black"
          >
            Reset Today
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Month View ───────────────────────────────────────────────────────────────
const MonthView = ({ currentDate, habitList }) => {
  const base = new Date(currentDate);
  const days = eachDayOfInterval({ start: startOfMonth(base), end: endOfMonth(base) });
  const firstDow = (startOfMonth(base).getDay() + 6) % 7;
  const fakeDone = (d) => (d.getDate() % 3 !== 0);

  return (
    <motion.div key="month" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 w-full h-full min-h-0">
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-white/60 flex-1">
        <h3 className="font-black text-kawaii-earth text-sm uppercase tracking-widest mb-6">
          Habit Heatmap — {format(base, 'MMMM yyyy')}
        </h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="text-center text-[9px] font-black text-kawaii-earthLight uppercase tracking-wider">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDow).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {days.map(d => {
            const done = fakeDone(d);
            const today = dfIsToday(d);
            return (
              <div key={d.toString()}
                className={`aspect-square flex items-center justify-center rounded-xl text-xs font-black transition-all
                  ${today ? 'ring-2 ring-kawaii-earth' : ''}
                  ${done ? 'bg-kawaii-pink/70 text-white' : 'bg-white/50 text-kawaii-earthLight'}`}>
                {format(d, 'd')}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-kawaii-pink/70" />
            <span className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-wider">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-white/50 border border-white" />
            <span className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-wider">Missed</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {habitList.map(({ emoji, name, id }) => {
          const days = Math.floor(Math.random() * 10) + 12;
          const total = parseInt(format(endOfMonth(base), 'd'));
          return (
            <div key={id} className="bg-white/40 backdrop-blur-md rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col gap-2">
              <span className="text-2xl">{emoji}</span>
              <p className="font-black text-kawaii-earth text-sm">{name}</p>
              <p className="text-[10px] font-bold text-kawaii-earthLight uppercase tracking-wider">{days} / {total} days</p>
              <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-kawaii-pink rounded-full" style={{ width: `${(days / total) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ─── Year View ────────────────────────────────────────────────────────────────
const YEAR_COLORS = ['#E0BBE4','#FFD1DC','#B5E8FF','#FFDEC2','#B5F7D0','#FFF3B0','#FFCDD2','#B2EBF2'];

const YearView = ({ currentDate, habitList }) => {
  const base = new Date(currentDate);
  const months = eachMonthOfInterval({ start: startOfYear(base), end: endOfYear(base) });
  const currentMonthIdx = base.getMonth();
  const fakeRate = (m) => [78, 65, 90, 55, 82, 70, 88, 60, 75, 92, 68, 80][m.getMonth()];

  return (
    <motion.div key="year" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 w-full h-full min-h-0">
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-white/60 flex-1">
        <h3 className="font-black text-kawaii-earth text-sm uppercase tracking-widest mb-6">
          Year at a Glance — {format(base, 'yyyy')}
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {months.map(m => {
            const rate = fakeRate(m);
            const isCurrent = m.getMonth() === currentMonthIdx;
            return (
              <div key={m.toString()}
                className={`rounded-[20px] p-4 flex flex-col gap-2 transition-all border-2
                  ${isCurrent ? 'border-kawaii-earth bg-kawaii-earth/5' : 'border-white bg-white/40'}`}>
                <p className={`font-black text-xs uppercase tracking-widest ${isCurrent ? 'text-kawaii-earth' : 'text-kawaii-earthLight'}`}>
                  {format(m, 'MMM')}
                </p>
                <div className="flex gap-0.5 items-end h-8">
                  {habitList.map((_, i) => {
                    const h = [rate * 0.95, rate * 1.05, rate * 0.9, rate][i % 4];
                    const capped = Math.min(100, Math.max(10, h));
                    return <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${capped}%`, background: YEAR_COLORS[i % YEAR_COLORS.length] }} />;
                  })}
                </div>
                <p className="font-black text-kawaii-earth text-sm">{rate}%</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          {habitList.map((h, i) => (
            <div key={h.id} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: YEAR_COLORS[i % YEAR_COLORS.length] }} />
              <span className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-wider">{h.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Habits Page ─────────────────────────────────────────────────────────
const Habits = () => {
  const { 
    profile, updateProfile, dailyLog, updateDailyLog, currentDate, setCurrentDate, loading,
    petAction, petMood, triggerPetAction
  } = useUserProfile();
  const [view, setView] = useState('Day');
  const [showHabitEditor, setShowHabitEditor] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showWaterLogModal, setShowWaterLogModal] = useState(false);

  if (loading || !profile || !dailyLog) return <div className="p-8 text-kawaii-earth">Growing your garden...</div>;

  // Resolve habit list: user's custom habits or the defaults
  const habitList = (profile.customHabits && profile.customHabits.length > 0)
    ? profile.customHabits
    : DEFAULT_HABITS;

  const waterTarget = profile.settings?.waterTarget || 2000;
  // Number of droplets = target / 200 (max 10)
  const dropCount = Math.min(10, Math.max(4, Math.round(waterTarget / 200)));
  const mlPerDrop = Math.round(waterTarget / dropCount);

  const habits  = dailyLog.habits  || {};
  const rituals = dailyLog.rituals || {};
  const petLevel = profile.pet?.level || 1;
  const petXp = profile.pet?.xp || 0;
  const petHappiness = profile.pet?.happiness ?? 100;
  const xpToNextLevel = Math.max(0, 100 - petXp);

  const awardPetProgress = (xpGain, happinessGain = 0) => {
    let nextXp = Math.max(0, petXp + xpGain);
    let nextLevel = petLevel;
    while (nextXp >= 100) {
      nextXp -= 100;
      nextLevel += 1;
    }
    updateProfile({
      pet: {
        ...profile.pet,
        level: nextLevel,
        xp: nextXp,
        happiness: Math.min(100, Math.max(0, petHappiness + happinessGain)),
      }
    });
    triggerPetAction('happy');
  };

  const toggleHabit = (id) => {
    const nextVal = !habits[id];
    updateDailyLog({ habits: { ...habits, [id]: nextVal } });
    if (nextVal) {
      awardPetProgress(10, 2);
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD1DC', '#E0BBE4', '#FFF3CD']
      });
      
      // Trigger animations based on habit
      if (id === 'skincare') triggerPetAction('sparkle');
      if (id === 'journaling') triggerPetAction('writing');
      
      // Trigger automated email notification
      const habit = habitList.find(h => h.id === id);
      if (habit) {
        triggerHabitNotification(habit.name);
      }
    }
  };

  const handleSaveHabits = (newHabits) => {
    updateProfile({ customHabits: newHabits });
    setShowHabitEditor(false);
  };

  const handleSaveWaterTarget = (val) => {
    updateProfile({ settings: { ...profile.settings, waterTarget: val } });
    setShowWaterModal(false);
  };

  const handleAddWater = (amount) => {
    updateDailyLog({ rituals: { ...rituals, water: Math.min(waterTarget, (rituals.water || 0) + amount) } });
    triggerPetAction('drinking');
  };

  const handleSetWater = (amount) => {
    updateDailyLog({ rituals: { ...rituals, water: Math.max(0, amount) } });
  };

  const handlePrev = () => {
    const d = new Date(currentDate);
    let next;
    if (view === 'Day') next = subDays(d, 1);
    else if (view === 'Month') next = subMonths(d, 1);
    else next = subYears(d, 1);
    setCurrentDate(format(next, 'yyyy-MM-dd'));
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    let next;
    if (view === 'Day') next = addDays(d, 1);
    else if (view === 'Month') next = addMonths(d, 1);
    else next = addYears(d, 1);
    setCurrentDate(format(next, 'yyyy-MM-dd'));
  };

  const getLabel = () => {
    const d = new Date(currentDate);
    if (view === 'Day') return format(d, 'MMMM do');
    if (view === 'Month') return format(d, 'MMMM yyyy');
    return format(d, 'yyyy');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="habits-page w-full h-full flex flex-col max-w-[1600px] mx-auto ui-p font-body overflow-hidden relative"
    >
      <div className="dark-celestial dark-celestial-1">✨</div>
      <div className="dark-celestial dark-celestial-2">🌙</div>
      <div className="dark-celestial dark-celestial-3">⭐</div>
      <div className="dark-celestial dark-celestial-4">✨</div>
      <div className="flex flex-col w-full h-full min-h-0 overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 w-full shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="ui-text-2xl font-black text-kawaii-earth tracking-tight">Habits</h2>
            {view === 'Day' && (
              <button
                onClick={() => setShowHabitEditor(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-white/80 rounded-full text-[10px] font-black text-kawaii-earthLight uppercase tracking-wider hover:bg-kawaii-pink/10 hover:text-kawaii-earth transition-all"
              >
                <PencilSimple size={12} weight="bold" /> Customize
              </button>
            )}
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm">
              <CaretLeft weight="bold" onClick={handlePrev} className="text-kawaii-earthLight cursor-pointer hover:text-kawaii-earth hover:scale-125 transition-transform" />
              <span className="font-bold text-kawaii-earth min-w-[140px] text-center">{getLabel()}</span>
              <CaretRight weight="bold" onClick={handleNext} className="text-kawaii-earthLight cursor-pointer hover:text-kawaii-earth hover:scale-125 transition-transform" />
            </div>
            <div className="flex bg-white/40 backdrop-blur-md rounded-full border border-white/60 p-1 shadow-inner">
              {['Day', 'Month', 'Year'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300
                    ${view === v ? 'bg-kawaii-earth text-white shadow-md' : 'text-kawaii-earthLight hover:text-kawaii-earth'}`}
                >{v}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full flex-1 min-h-0 overflow-hidden">

          {/* MAIN CONTENT */}
          <div className="flex-[2] flex flex-col gap-6 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence mode="wait">

              {/* ── DAY VIEW ── */}
              {view === 'Day' && (
                <motion.div key="day" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 w-full">

                  {/* Habit cards grid */}
                  <div className={`grid gap-4 shrink-0 ${habitList.length <= 2 ? 'grid-cols-2' : habitList.length <= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                    {habitList.map((h, i) => (
                      <HabitCard
                        key={h.id}
                        emoji={h.emoji}
                        title={h.name}
                        isActive={!!habits[h.id]}
                        onClick={() => toggleHabit(h.id)}
                        color={h.color || 'bg-pink-50'}
                        rotate={[0, 10, -5, 5, -10, 8, -8, 3][i % 8]}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6 w-full flex-1 min-h-0">
                    {/* Daily Reflection */}
                    <div className="daily-reflection-card flex-1 bg-yellow-100/40 rounded-[32px] p-6 shadow-sm relative flex flex-col border border-yellow-200/50 min-h-0" style={{ borderBottomRightRadius: '60px' }}>
                      <h4 className="font-black text-kawaii-earthLight text-[10px] uppercase tracking-widest mb-4">Daily Reflection</h4>
                      <textarea
                        value={dailyLog.reflection || ''}
                        onChange={(e) => updateDailyLog({ reflection: e.target.value })}
                        className="w-full flex-1 bg-transparent border-none p-0 text-sm font-medium text-kawaii-earth outline-none resize-none leading-relaxed placeholder:text-yellow-900/20"
                        placeholder="How was your day? Write a little note to your future self..."
                      />
                      <div className="absolute bottom-4 right-4 text-2xl opacity-40">✍️</div>
                    </div>

                    {/* Water Tracker */}
                    <div className="water-tracker-card flex-1 flex flex-col bg-white/40 backdrop-blur-md rounded-[40px] p-6 shadow-sm border border-white/60 min-h-0 overflow-hidden">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="font-black text-kawaii-earth text-[10px] uppercase tracking-widest">Water Intake</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowWaterLogModal(true)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider hover:scale-[1.03] transition-transform"
                          >
                            Log Water
                          </button>
                          <button
                            onClick={() => setShowWaterModal(true)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-wider hover:bg-blue-100 transition-colors"
                          >
                            <PencilSimple size={10} weight="bold" /> Goal: {waterTarget}ml
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-3 flex-1 items-center justify-items-center">
                        {[...Array(dropCount)].map((_, i) => (
                          <Sticker
                            key={i}
                            emoji="💧"
                            onClick={() => updateDailyLog({ rituals: { ...rituals, water: (i + 1) * mlPerDrop } })}
                            className="hover:scale-110 transition-transform cursor-pointer relative"
                            rotate={i % 2 === 0 ? 5 : -5}
                            style={{
                              pointerEvents: 'auto',
                              fontSize: '2rem', padding: '0.4rem',
                              background: rituals.water >= (i + 1) * mlPerDrop ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.6)',
                              border: rituals.water >= (i + 1) * mlPerDrop ? '2px solid white' : '2px solid rgba(255,255,255,0.4)',
                              boxShadow: rituals.water >= (i + 1) * mlPerDrop ? '0 4px 12px rgba(59,130,246,0.2)' : 'none'
                            }}
                          />
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-xs font-black text-kawaii-earthLight uppercase tracking-tighter">
                          {rituals.water || 0}ml / {waterTarget}ml
                        </p>
                        <div className="w-full h-1.5 bg-blue-50 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-300/60 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ((rituals.water || 0) / waterTarget) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {view === 'Month' && <MonthView currentDate={currentDate} habitList={habitList} />}
              {view === 'Year'  && <YearView  currentDate={currentDate} habitList={habitList} />}

            </AnimatePresence>
          </div>

          {/* PET GROWTH SIDEBAR */}
          <div className="flex-1 lg:flex-none flex flex-col gap-6 w-full lg:w-72 h-full shrink-0">
            <div className="pet-zen-card bg-white/60 backdrop-blur-md ui-rounded ui-p shadow-sm border border-white flex flex-col h-full items-center relative text-center">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="ui-text-base font-black text-kawaii-earth uppercase tracking-widest">Pet Zen</h3>
                <span className="text-[10px] font-black bg-kawaii-pink text-white px-3 py-1 rounded-full uppercase">Lvl {petLevel}</span>
              </div>
              <div className="relative w-full flex-1 flex items-center justify-center min-h-[180px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-kawaii-pink/5 rounded-full filter blur-3xl opacity-30" />
                <LunaPet state={petAction !== 'idle' ? petAction : petMood} size="large" className="relative z-10" />
              </div>
              <div className="w-full mt-6">
                <div className="flex justify-center mb-3">
                  <span className="text-[10px] font-black bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full uppercase tracking-widest">
                    {xpToNextLevel} XP to next level
                  </span>
                </div>
                <div className="flex justify-between w-full mb-3 uppercase text-[9px] font-black tracking-widest text-kawaii-earthLight">
                  <span>XP Progress</span>
                  <span>{petXp}/100</span>
                </div>
                <div className="w-full h-3 bg-white/80 rounded-full border border-gray-100 overflow-hidden flex shadow-inner">
                  <div className="h-full bg-kawaii-earth transition-all duration-700" style={{ width: `${petXp}%` }} />
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">
                  <span>Happiness</span>
                  <span>{petHappiness}%</span>
                </div>
                <button
                  onClick={() => awardPetProgress(5, 5)}
                  className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-kawaii-pink to-kawaii-lilac text-white font-black text-[11px] uppercase tracking-wider hover:scale-[1.02] transition-transform"
                >
                  Play With Pet (+5 XP)
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showHabitEditor && (
          <HabitEditorModal
            habits={habitList}
            onSave={handleSaveHabits}
            onClose={() => setShowHabitEditor(false)}
          />
        )}
        {showWaterModal && (
          <WaterTargetModal
            current={waterTarget}
            onSave={handleSaveWaterTarget}
            onClose={() => setShowWaterModal(false)}
          />
        )}
        {showWaterLogModal && (
          <WaterLogModal
            current={rituals.water || 0}
            target={waterTarget}
            onAdd={handleAddWater}
            onSet={handleSetWater}
            onReset={() => handleSetWater(0)}
            onClose={() => setShowWaterLogModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Habits;
