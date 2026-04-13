import React from 'react';
import GlassCard from '../UI/GlassCard';
import { format, addDays, startOfWeek } from 'date-fns';

const WeeklyCalendar = ({ delay = 0 }) => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  return (
    <GlassCard delay={delay} className="!p-4">
      <div className="flex justify-between items-center mb-3 px-2">
        <h3 className="font-sticker font-bold text-lg text-gray-800">{format(today, 'MMMM yyyy')}</h3>
      </div>
      
      <div className="flex justify-between gap-1 md:gap-2">
        {weekDays.map((date, index) => {
          const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          
          return (
            <div 
              key={index} 
              className={`flex flex-col items-center justify-center py-2 px-1 md:px-3 rounded-2xl transition-all ${
                isToday ? 'bg-kawaii-mint text-white shadow-glow' : 'bg-transparent text-gray-500'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold mb-1 ${isToday ? 'text-white' : 'text-gray-400'}`}>
                {format(date, 'EEE')}
              </span>
              <span className={`text-base font-sticker font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
                {format(date, 'd')}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default WeeklyCalendar;
