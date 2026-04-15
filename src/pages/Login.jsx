import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Envelope, Lock, User, ArrowLeft, GoogleLogo, Ghost } from '@phosphor-icons/react';

import { useUserProfile } from '../context/UserProfileContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginAsGuest, loginWithEmail, registerWithEmail, loading } = useUserProfile();
  
  const [mode, setMode] = useState('social'); // 'social', 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    const result = await loginWithGoogle();
    if (result && result.success) {
      if (result.isNewUser) {
        navigate('/showcase');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    const result = await loginAsGuest();
    if (result && result.success) {
      if (result.isNewUser) {
        navigate('/showcase');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let result;

    if (mode === 'login') {
      result = await loginWithEmail(email, password);
    } else {
      result = await registerWithEmail(email, password, name);
    }

    if (result.success) {
      if (result.isNewUser) {
        navigate('/showcase');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" 
         style={{ background: 'linear-gradient(to right, #FBC2EB, #E6DEFA, #A8EDEA)' }}>
      
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="absolute top-3 -left-2 right-6 bottom-[-12px] bg-white/20 border-[6px] border-white/60 rounded-[48px] pointer-events-none backdrop-blur-sm" />

        <div className="relative bg-white rounded-[48px] px-8 py-12 flex flex-col items-center z-10 shadow-sm min-h-[500px]">
          
          <div className="mb-8 flex flex-col items-center cursor-pointer" onClick={() => setMode('social')}>
            <h1 className="text-5xl font-black font-sticker tracking-tighter" 
                style={{ 
                  color: '#FF9EB5', 
                  WebkitTextStroke: '4px white', 
                  paintOrder: 'stroke fill',
                  textShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                }}>
              Dear
            </h1>
            <h1 className="text-5xl font-black font-sticker tracking-tighter -mt-3" 
                style={{ 
                  color: '#B39DDB', 
                  WebkitTextStroke: '4px white', 
                  paintOrder: 'stroke fill',
                  textShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                }}>
              Luna
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'social' ? (
              <motion.div 
                key="social"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="w-full flex flex-col gap-4 items-center"
              >
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-[90%] bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-body font-black text-gray-800 disabled:opacity-50 border-2 border-pink-100 shadow-sm"
                >
                  <GoogleLogo weight="bold" size={24} className="text-[#4285F4]" />
                  Login with Google
                </button>

                <button 
                  type="button" 
                  onClick={() => setMode('login')}
                  className="w-[90%] bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-body font-black text-kawaii-earth border-2 border-indigo-100 shadow-sm"
                >
                  <Envelope weight="bold" size={24} className="text-kawaii-lilac" />
                  Email & Password
                </button>
                
                <button 
                  type="button" 
                  onClick={handleGuestLogin}
                  className="w-[90%] bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-body font-black text-kawaii-mint border-2 border-purple-50 shadow-sm"
                >
                  <Ghost weight="bold" size={24} className="text-kawaii-mint" />
                  Continue as Guest
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-4"
              >
                <button 
                  type="button" 
                  onClick={() => { setMode('social'); setError(null); }}
                  className="flex items-center gap-2 text-xs font-black text-kawaii-earthLight hover:text-kawaii-earth mb-2 w-fit transition-colors"
                >
                  <ArrowLeft weight="bold" /> Back to options
                </button>

                <h2 className="text-xl font-black text-kawaii-earth mb-2">
                  {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                </h2>

                {error && (
                  <div className="bg-red-50 text-red-500 text-[10px] font-black p-3 rounded-xl border border-red-100 text-center uppercase tracking-wider">
                    {error}
                  </div>
                )}

                {mode === 'register' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-kawaii-earthLight" weight="bold" />
                    <input 
                      type="text"
                      placeholder="Your First Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-kawaii-bg/50 border-2 border-transparent focus:border-kawaii-pink transition-all outline-none rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-kawaii-earthLight" weight="bold" />
                  <input 
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-kawaii-bg/50 border-2 border-transparent focus:border-kawaii-lilac transition-all outline-none rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-kawaii-earthLight" weight="bold" />
                  <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-kawaii-bg/50 border-2 border-transparent focus:border-kawaii-lilac transition-all outline-none rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-kawaii-earth text-white rounded-2xl py-4 font-black transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 mt-2"
                >
                  {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
                </button>

                <div className="text-center mt-2">
                  <button 
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-xs font-black text-kawaii-pink hover:underline uppercase tracking-widest"
                  >
                    {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="absolute -bottom-6 -right-4 bg-white p-2 rounded-full shadow-md flex items-center justify-center transform rotate-12" style={{ border: '4px solid white' }}>
             <span className="text-5xl leading-none" style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' }}>🐱</span>
             <span className="absolute -top-3 -left-4 text-2xl" style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' }}>✨</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
