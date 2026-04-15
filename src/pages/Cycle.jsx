import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sticker from '../components/UI/Sticker';
import { CaretLeft, CaretRight, Sparkle, Drop, Heart } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import { useCycleLogic } from '../hooks/useCycleLogic';
import { getCalendarGrid, getDayPhase, formatMonthHeader, addMonths, subMonths } from '../utils/dateUtils';
import { addDays, format } from 'date-fns';

const DAYS_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const PHASE_INSIGHTS = [
  { key: 'Menstrual', title: 'Menstrual', icon: '🧘', text: 'A softer window. Rest more and keep movement gentle.' },
  { key: 'Follicular', title: 'Follicular', icon: '🌗', text: 'Energy is rising. Great time to start and plan.' },
  { key: 'Ovulation', title: 'Ovulatory', icon: '🌕', text: 'Social and expressive phase. Communication feels easier.' },
  { key: 'Luteal', title: 'Luteal', icon: '⭐', text: 'Focus on wrapping tasks and protecting your energy.' },
];

const getPhaseMatch = (currentPhase, phaseKey) => {
  if (!currentPhase) return false;
  if (phaseKey === 'Ovulation') return currentPhase === 'Ovulation' || currentPhase === 'Ovulatory';
  return currentPhase === phaseKey;
};

const PhaseCard = ({ title, icon, text, active }) => (
  <div
    className={`rounded-[28px] p-4 border transition-all h-full flex flex-col justify-between ${
      active
        ? 'bg-[#FFFDEE] border-[#F3ECA5] shadow-[0_8px_20px_rgba(243,236,165,0.35)]'
        : 'bg-white/60 border-white/70'
    }`}
  >
    <div>
      <h4 className="text-lg font-black text-kawaii-earth leading-tight">{title}</h4>
      <p className="text-xs text-[#5F5046] font-semibold mt-2 leading-relaxed">{text}</p>
    </div>
    <div className="text-2xl mt-2">{icon}</div>
  </div>
);

const Cycle = () => {
  const { profile, loading, updateProfile } = useUserProfile();
  const [viewDate, setViewDate] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState('month');

  const cycleData = useCycleLogic(profile?.lastPeriodDate);

  if (loading || !profile) return <div className="p-8 text-kawaii-earth">Loading cycle...</div>;

  const cycleLength = profile.settings?.cycleLength || 28;
  const safeDaysUntilPeriod = Number.isFinite(cycleData.daysUntilPeriod) ? cycleData.daysUntilPeriod : cycleLength;
  const cycleDayRaw = cycleLength - safeDaysUntilPeriod;
  const cycleDay = Math.min(cycleLength, Math.max(1, cycleDayRaw));

  const progress = cycleDay / cycleLength;
  const ringRadius = 108;
  const circumference = 2 * Math.PI * ringRadius;

  const grid = getCalendarGrid(viewDate);
  const monthTiles = useMemo(() => (
    Array.from({ length: 12 }, (_, i) => new Date(viewDate.getFullYear(), i, 1))
  ), [viewDate]);

  const handlePrev = () => {
    if (calendarMode === 'month') setViewDate(subMonths(viewDate, 1));
    else setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
  };

  const handleNext = () => {
    if (calendarMode === 'month') setViewDate(addMonths(viewDate, 1));
    else setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
  };

  const handleSetPeriodStart = (date) => {
    if (window.confirm(`Set ${format(date, 'MMMM dd')} as your period start date?`)) {
      updateProfile({ lastPeriodDate: date.toISOString() });
    }
  };

  const ovulationDayNumber = Math.max(1, cycleLength - 14);
  const fertileStartDayNumber = Math.max(1, ovulationDayNumber - 4);
  const lutealStartDayNumber = Math.min(cycleLength, ovulationDayNumber + 1);

  const lastPeriod = new Date(profile.lastPeriodDate);
  const forecast = [
    {
      key: 'Fertility',
      label: 'Fertility',
      day: fertileStartDayNumber,
      date: format(addDays(lastPeriod, fertileStartDayNumber - 1), 'MMM dd'),
      active: cycleDay >= fertileStartDayNumber,
    },
    {
      key: 'Ovulatory',
      label: 'Ovulatory',
      day: ovulationDayNumber,
      date: format(addDays(lastPeriod, ovulationDayNumber - 1), 'MMM dd'),
      active: cycleDay >= ovulationDayNumber,
    },
    {
      key: 'Luteal',
      label: 'Luteal',
      day: lutealStartDayNumber,
      date: format(addDays(lastPeriod, lutealStartDayNumber - 1), 'MMM dd'),
      active: cycleDay >= lutealStartDayNumber,
    },
  ];

  const moonMarkers = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full max-w-[1600px] mx-auto ui-p lg:p-6 font-body overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-5">
        <h1 className="ui-text-3xl font-black text-kawaii-earth tracking-tight">Cycle</h1>
        <Sparkle size={24} weight="fill" className="text-[#8C5D70]" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-6">
        <section className="bg-white/70 rounded-[40px] border border-white/70 shadow-sm p-5 lg:p-6 relative">
          <h2 className="ui-text-2xl font-black text-kawaii-earth mb-4">Luna Dial</h2>
          <Sticker emoji="🐻" className="-top-5 right-6" rotate={8} style={{ fontSize: '2rem' }} />

          <div className="relative ui-cycle-dial mx-auto mt-4 flex items-center justify-center">
            {moonMarkers.map((moon, idx) => {
              const angle = (idx / moonMarkers.length) * 360 - 90;
              return (
                <div
                  key={`moon-${idx}`}
                  className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#EADFE4] shadow-sm flex items-center justify-center text-sm"
                  style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(130px) rotate(${-angle}deg)` }}
                >
                  {moon}
                </div>
              );
            })}

            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r={ringRadius} stroke="#F6EEA7" strokeWidth="11" fill="none" />
              <circle
                cx="120"
                cy="120"
                r={ringRadius}
                stroke="#7C4A59"
                strokeWidth="11"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress)}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="ui-text-3xl font-black text-[#2F231A] leading-none">Day {cycleDay}</span>
              <span className="ui-text-lg font-bold text-[#403329] mt-1">- {cycleData.currentPhase} Phase</span>
            </div>

            <div className="absolute left-[7%] top-[52%] text-2xl">🐻</div>
            <div className="absolute right-[7%] top-[52%] text-2xl">🐻</div>
            <div className="absolute bottom-[4%] left-[38%] text-2xl">🐻</div>
            <div className="absolute bottom-[4%] right-[38%] text-2xl">🐻</div>
          </div>
        </section>

        <section className="bg-white/70 rounded-[40px] border border-white/70 shadow-sm p-5 lg:p-6 relative">
          <h2 className="ui-text-2xl font-black text-kawaii-earth mb-4">Interactive Calendar</h2>

          <div className="flex items-center justify-between mb-4">
            <h3 className="ui-text-xl font-black text-kawaii-earth">
              {calendarMode === 'month' ? formatMonthHeader(viewDate) : format(viewDate, 'yyyy')}
            </h3>

            <button
              type="button"
              onClick={() => setCalendarMode(prev => (prev === 'month' ? 'year' : 'month'))}
              className="flex items-center gap-3"
            >
              <span className="text-sm font-bold text-kawaii-earth">Month/Year</span>
              <span className={`w-12 h-7 rounded-full p-1 transition-colors ${calendarMode === 'year' ? 'bg-[#8E516D]' : 'bg-[#D9C7D2]'}`}>
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${calendarMode === 'year' ? 'translate-x-5' : 'translate-x-0'}`} />
              </span>
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2">
            {DAYS_LABELS.map((d, i) => (
              <div key={`head-${i}`} className="text-xs font-black text-[#6A594F]">{d}</div>
            ))}
          </div>

          {calendarMode === 'month' ? (
            <div className="grid grid-cols-7 gap-y-1 text-center select-none">
              {grid.map((day, i) => {
                const phase = getDayPhase(day.date, profile.lastPeriodDate);
                const isPeriod = phase === 'period';
                const isFertile = phase === 'fertile';
                return (
                  <div
                    key={i}
                    onClick={() => day.isCurrentMonth && handleSetPeriodStart(day.date)}
                    className="flex justify-center relative items-center h-9 cursor-pointer"
                  >
                    <span
                      className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-all relative z-10 ${
                        !day.isCurrentMonth
                          ? 'text-gray-300 opacity-30'
                          : day.isToday
                            ? 'bg-[#8E516D] text-white'
                            : 'text-kawaii-earth'
                      } ${isFertile && day.isCurrentMonth && !day.isToday ? 'bg-[#F6DDE7]' : ''}`}
                    >
                      {isPeriod && day.isCurrentMonth ? <Drop weight="fill" size={14} className="text-[#8E516D]" /> : day.dayNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {monthTiles.map((m) => {
                const isActive = m.getMonth() === viewDate.getMonth();
                return (
                  <button
                    key={m.toISOString()}
                    type="button"
                    onClick={() => {
                      setViewDate(m);
                      setCalendarMode('month');
                    }}
                    className={`rounded-2xl py-3 text-sm font-black transition-colors ${isActive ? 'bg-[#8E516D] text-white' : 'bg-white/70 text-kawaii-earth hover:bg-[#F6DDE7]'}`}
                  >
                    {format(m, 'MMM')}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={handlePrev} className="w-9 h-9 rounded-full bg-white/80 hover:bg-[#F6DDE7] flex items-center justify-center">
              <CaretLeft size={16} weight="bold" className="text-kawaii-earth" />
            </button>
            <button onClick={handleNext} className="w-9 h-9 rounded-full bg-white/80 hover:bg-[#F6DDE7] flex items-center justify-center">
              <CaretRight size={16} weight="bold" className="text-kawaii-earth" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="ui-text-2xl font-black text-kawaii-earth mb-3">Phase Insight</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PHASE_INSIGHTS.map((phase) => (
              <PhaseCard
                key={phase.key}
                title={phase.title}
                icon={phase.icon}
                text={phase.text}
                active={getPhaseMatch(cycleData.currentPhase, phase.key)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="ui-text-2xl font-black text-kawaii-earth mb-3">Luna Forecast</h2>
          <div className="bg-white/70 rounded-[34px] border border-white/70 shadow-sm p-6 h-full">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {forecast.map((f) => (
                <div key={f.key} className="text-center">
                  <div className="text-sm font-black text-kawaii-earth">{f.label}</div>
                  <div className="text-xs font-bold text-[#6A594F] mt-1">{f.date}</div>
                </div>
              ))}
            </div>

            <div className="relative mt-5 mb-4 h-8">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#D7C5D0] rounded-full" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#8E516D] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, (cycleDay / cycleLength) * 100))}%` }}
              />
              {forecast.map((f) => {
                const left = `${(f.day / cycleLength) * 100}%`;
                return (
                  <div key={`dot-${f.key}`} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left }}>
                    <div className={`w-4 h-4 rounded-full border-2 ${f.active ? 'bg-[#8E516D] border-[#8E516D]' : 'bg-white border-[#8E516D]'}`} />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {forecast.map((f) => (
                <div key={`date-${f.key}`} className="text-center text-base font-black text-[#4A3525]">{f.date}</div>
              ))}
            </div>

            <div className="mt-6 text-sm font-semibold text-[#5F5046] flex items-center gap-2">
              <Heart size={16} weight="fill" className="text-[#8E516D]" />
              Day {cycleDay} of {cycleLength} · {Math.max(0, safeDaysUntilPeriod)} days until next period
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Cycle;
