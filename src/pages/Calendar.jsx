import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { CalendarBlank } from '@phosphor-icons/react';

const Calendar = () => {
    const currentDate = new Date();
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Padding for start of month (assuming Monday is 1, Sunday is 0)
    const padDays = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;

    return (
        <div className="flex flex-col h-full gap-6">
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
            >
                <div className="flex items-center gap-3 mb-1">
                    <CalendarBlank weight="duotone" className="text-kawaii-mint w-8 h-8" />
                    <h1 className="text-3xl font-sticker font-bold text-gray-800 tracking-tight">
                        {format(currentDate, 'MMMM yyyy')}
                    </h1>
                </div>
            </motion.header>

            <GlassCard delay={0.1} className="flex-1 !bg-white/50">
                <div className="grid grid-cols-7 gap-2 md:gap-4 text-center font-bold text-gray-400 text-sm mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
                    {Array.from({ length: padDays }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-4" />
                    ))}
                    
                    {daysInMonth.map((date, i) => (
                        <motion.div 
                            whileHover={{ scale: 1.1 }}
                            key={i} 
                            className={`p-3 md:p-4 rounded-xl flex items-center justify-center font-sticker text-lg md:text-xl font-bold cursor-pointer transition-all ${
                                isToday(date) 
                                    ? 'bg-kawaii-mint text-white shadow-glow' 
                                    : 'bg-white/60 text-gray-700 hover:bg-kawaii-sakura hover:text-white'
                            }`}
                        >
                            {format(date, 'd')}
                        </motion.div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default Calendar;
