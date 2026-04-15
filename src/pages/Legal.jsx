import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, LockKey, Scales } from '@phosphor-icons/react';

const Legal = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('privacy');

  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldCheck size={32} weight="fill" className="text-kawaii-pink" />,
      updated: 'April 15, 2026',
      sections: [
        { title: 'Your Data, Your Sanctuary', text: 'At DearLuna, we believe your daily reflections and health data are sacred. We do not sell your personal information to third parties. Your data is used exclusively to provide you with insights, cycle predictions, and a personalized experience.' },
        { title: 'Information We Collect', text: 'We collect minimal data required for functionality: your account details (email, name), cycle dates, and daily logs (mood, symptoms, habits). This data is encrypted and stored securely.' },
        { title: 'Luna\'s Protection', text: 'You can delete your account and all associated data at any time through the Settings panel. Once deleted, your logs are purged from our active databases permanently.' }
      ]
    },
    terms: {
      title: 'Terms of Service',
      icon: <FileText size={32} weight="fill" className="text-kawaii-lilac" />,
      updated: 'April 15, 2026',
      sections: [
        { title: 'Usage Agreements', text: 'DearLuna is designed for personal wellness tracking. By using this service, you agree to provide accurate information for the best experience. The app is not a substitute for professional medical advice.' },
        { title: 'Premium Features', text: 'Some features within DearLuna may require a subscription. These are billed through your chosen platform and can be managed in your profile settings.' },
        { title: 'Community Standards', text: 'When using community features like the "Safe Space", you agree to maintain a kind, supportive, and respectful presence. Harassment of any kind is strictly prohibited.' }
      ]
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full h-full p-8 overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 font-black text-kawaii-earthLight hover:text-kawaii-earth transition-colors group"
        >
          <div className="p-2 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors">
            <ArrowLeft weight="bold" />
          </div>
          <span className="uppercase tracking-widest text-[10px]">Back to safety</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0">
            <button 
              onClick={() => setTab('privacy')}
              className={`w-full p-6 rounded-[32px] flex flex-col items-center gap-3 transition-all border-2
                ${tab === 'privacy' ? 'bg-white border-kawaii-pink shadow-lg scale-[1.02]' : 'bg-white/40 border-transparent hover:bg-white/60'}`}
            >
              <ShieldCheck size={28} weight={tab === 'privacy' ? 'fill' : 'bold'} className="text-kawaii-pink" />
              <span className="font-black text-kawaii-earth text-xs uppercase tracking-widest">Privacy</span>
            </button>
            <button 
              onClick={() => setTab('terms')}
              className={`w-full p-6 rounded-[32px] flex flex-col items-center gap-3 transition-all border-2
                ${tab === 'terms' ? 'bg-white border-kawaii-lilac shadow-lg scale-[1.02]' : 'bg-white/40 border-transparent hover:bg-white/60'}`}
            >
              <FileText size={28} weight={tab === 'terms' ? 'fill' : 'bold'} className="text-kawaii-lilac" />
              <span className="font-black text-kawaii-earth text-xs uppercase tracking-widest">Terms</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/60 backdrop-blur-xl border-4 border-white rounded-[48px] p-8 lg:p-12 shadow-soft relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-kawaii-bg rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    {content[tab].icon}
                    <h1 className="text-4xl font-black text-kawaii-earth tracking-tighter">{content[tab].title}</h1>
                  </div>
                  <p className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest mb-10 pl-12">
                    Last Updated — {content[tab].updated}
                  </p>

                  <div className="flex flex-col gap-10">
                    {content[tab].sections.map((sec, i) => (
                      <div key={i} className="flex flex-col gap-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white border border-kawaii-bg flex items-center justify-center font-black text-kawaii-earth text-sm shadow-sm group-hover:scale-110 transition-transform">
                            {i + 1}
                          </div>
                          <h3 className="text-xl font-black text-kawaii-earth">{sec.title}</h3>
                        </div>
                        <p className="text-sm font-medium text-kawaii-earthLight leading-relaxed pl-11">
                          {sec.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 pt-10 border-t border-white/40 text-center">
                    <p className="text-[10px] font-bold text-kawaii-earthLight italic">
                      Questions about your data? Reach out to <span className="text-kawaii-pink">privacy@dearluna.app</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Legal;
