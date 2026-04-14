import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoonStars } from '@phosphor-icons/react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-kawaii-bg flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm px-6"
      >
        <div className="bg-white rounded-[32px] p-8 md:p-10 flex flex-col items-center shadow-sticker">
          
          {/* Minimalist Logo */}
          <div className="w-20 h-20 bg-kawaii-sakura rounded-full shadow-sm flex items-center justify-center mb-6">
             <MoonStars weight="fill" className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-sticker font-bold text-gray-800 mb-8 text-center tracking-tight">Dear Luna</h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="w-full bg-gray-50 border-2 border-transparent focus:border-kawaii-pink focus:bg-white outline-none rounded-2xl px-5 py-4 font-body text-gray-700 font-medium transition-all"
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-gray-50 border-2 border-transparent focus:border-kawaii-pink focus:bg-white outline-none rounded-2xl px-5 py-4 font-body text-gray-700 font-medium transition-all"
            />
            
            <button 
              type="submit" 
              className="mt-4 w-full bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-sticker font-bold text-lg py-4 rounded-2xl transition-all shadow-md"
            >
              Enter
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-400 font-medium cursor-pointer hover:text-gray-600 transition-colors">
             Create new account
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
