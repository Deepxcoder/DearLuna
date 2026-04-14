import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Layout Components
import Sidebar from '../components/Navigation/Sidebar';
import WeeklyCalendar from '../components/Dashboard/WeeklyCalendar';
import PhaseInsight from '../components/Dashboard/PhaseInsight';
import Rituals from '../components/Dashboard/Rituals';
import GlassCard from '../components/UI/GlassCard';

import { Sparkle } from '@phosphor-icons/react';

const Dashboard = () => {
  const today = new Date();

  return (
    <>
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <h1 className="text-3xl font-sticker font-bold text-gray-800 tracking-tight">
          Good morning, Luna
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Today is {format(today, 'EEEE, MMMM do')}
        </p>
      </motion.header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          
          {/* Affirmation Hero (Spans 2 columns on lg) */}
          <GlassCard delay={0.1} className="col-span-full lg:col-span-2 !bg-gradient-to-br from-white/80 to-kawaii-sakura/20 flex flex-col justify-center">
            <Sparkle weight="duotone" className="text-kawaii-sakura w-8 h-8 mb-4 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-sticker font-bold text-gray-800 leading-tight mb-3">
              "I am deserving of soft moments and gentle growth."
            </h2>
            <p className="text-gray-600 font-medium">
              Focus on your breath today. You are exactly where you need to be.
            </p>
          </GlassCard>

          {/* Calendar Segment */}
          <div className="col-span-full lg:col-span-1 flex flex-col justify-end">
              <WeeklyCalendar delay={0.2} />
          </div>

          {/* Phase Insight */}
          <div className="col-span-1">
              <PhaseInsight delay={0.3} />
          </div>

          {/* Daily Rituals */}
          <div className="col-span-1">
              <Rituals delay={0.4} />
          </div>

          {/* Education/Article Card */}
          <GlassCard delay={0.5} className="col-span-full md:col-span-2 lg:col-span-1 border-white/60 !bg-kawaii-cream/30">
            <h3 className="font-sticker font-bold text-lg text-gray-800 mb-2">Embracing the Luteal Shift</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              As your body prepares for the next phase, notice the quiet strength in slowing down. This is the time for reflection, soft textures, and herbal teas. Listen to what your body is whispering to you today.
            </p>
            <button className="bg-white/70 hover:bg-white text-kawaii-mint font-bold py-2 px-4 rounded-xl sticker-border text-sm transition-all">
                Read more
            </button>
          </GlassCard>

      </div>
    </>
  );
};

export default Dashboard;
