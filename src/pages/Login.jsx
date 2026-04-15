import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useUserProfile } from '../context/UserProfileContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loading } = useUserProfile();

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    await loginWithGoogle();
    navigate('/dashboard');
  };

  const handleGuestLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" 
         style={{ background: 'linear-gradient(to right, #FBC2EB, #E6DEFA, #A8EDEA)' }}>
      
      {/* Optional: Future background pattern image can go here */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        {/* Offset Glass Backing Layer to perfectly match the Stitch screenshot! */}
        <div className="absolute top-3 -left-2 right-6 bottom-[-12px] bg-white/20 border-[6px] border-white/60 rounded-[48px] pointer-events-none backdrop-blur-sm" />

        {/* Main Solid White Card */}
        <div className="relative bg-white rounded-[48px] px-8 py-16 flex flex-col items-center z-10 shadow-sm">
          
          {/* Logo Handle - Bubbly Text */}
          <div className="mb-12 flex flex-col items-center">
            <h1 className="text-6xl font-black font-sticker tracking-tighter" 
                style={{ 
                  color: '#FF9EB5', 
                  WebkitTextStroke: '6px white', 
                  paintOrder: 'stroke fill',
                  textShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                }}>
              Dear
            </h1>
            <h1 className="text-6xl font-black font-sticker tracking-tighter -mt-4" 
                style={{ 
                  color: '#B39DDB', 
                  WebkitTextStroke: '6px white', 
                  paintOrder: 'stroke fill',
                  textShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                }}>
              Luna
            </h1>
          </div>

          <form className="w-full flex flex-col gap-5 items-center">
            
            {/* Google Login Button */}
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-[90%] bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-full py-4 px-6 flex items-center justify-center gap-3 font-body font-bold text-gray-800 disabled:opacity-50"
              style={{ boxShadow: '0 0 25px rgba(255, 183, 197, 0.7)' }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>
            
            {/* Guest Button */}
            <button 
              type="button" 
              onClick={handleGuestLogin}
              className="w-[90%] bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-full py-4 px-6 flex items-center justify-center gap-3 font-body font-bold"
              style={{ border: '2px solid #D1C4E9', color: '#957DAD' }}
            >
              <span className="text-xl leading-none">👻</span>
              Continue as Guest
            </button>

          </form>

          {/* Bottom Right Cat Sticker Deco */}
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
