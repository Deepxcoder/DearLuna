import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase';
import { format } from 'date-fns';

const UserProfileContext = createContext(null);
const API_URL = 'http://localhost:5000/api';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Helper for safe fetches
  const safeFetch = async (url, options = {}) => {
    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(`HTTP Error: ${resp.status}`);
      return await resp.json();
    } catch (e) {
      console.warn(`Fetch error for ${url}:`, e);
      return null;
    }
  };

  // Fetch or Create User Profile
  const fetchProfile = async (firebaseUser) => {
    const data = await safeFetch(`${API_URL}/users/${firebaseUser.uid}`);
    if (data) {
      setProfile(data);
    } else {
      const newProfile = {
        name: firebaseUser.displayName?.split(' ')[0] || 'Luna User',
        lastPeriodDate: new Date().toISOString(),
        pet: { level: 1, xp: 0, happiness: 100 },
        settings: { cycleLength: 28, periodLength: 5 }
      };
      const createdData = await safeFetch(`${API_URL}/users/${firebaseUser.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      if (createdData) setProfile(createdData);
      else setProfile(newProfile); // Fallback to local if server fails
    }
  };

  // Fetch or Create Daily Log
  const fetchDailyLog = async (uid, date) => {
    const data = await safeFetch(`${API_URL}/logs/${uid}/${date}`);
    if (data) {
      setDailyLog(data);
    } else {
      setDailyLog({
        rituals: { water: 0, meditation: false, exercise: false },
        habits: { skincare: false, reading: false, sleep: false, journaling: false },
        mood: '', energy: '', symptoms: [], reflection: ''
      });
    }
  };

  useEffect(() => {
    console.log('🔄 UserProfileContext: Setting up onAuthStateChanged...');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('👤 UserProfileContext: Auth state changed', currentUser?.uid || 'No User');
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        try {
          console.log('📥 UserProfileContext: Fetching profile and logs...');
          await Promise.all([
            fetchProfile(currentUser),
            fetchDailyLog(currentUser.uid, currentDate)
          ]);
          console.log('✅ UserProfileContext: Fetching complete');
        } catch (e) {
          console.error("❌ UserProfileContext: Critical fetch failure during auth", e);
        }
      } else {
        setProfile(null);
        setDailyLog(null);
      }
      setLoading(false);
      setIsInitializing(false);
      console.log('🏁 UserProfileContext: Initialization sequence finished');
    });
    
    return () => unsubscribe();
  }, [auth, currentDate]);

  const loginWithGoogle = async () => {
    try { 
      setLoading(true);
      await signInWithPopup(auth, provider); 
    } catch (e) { 
      console.error("Login failed", e); 
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const next = { ...profile, ...updates };
    setProfile(next);
    if (user) {
      await safeFetch(`${API_URL}/users/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
    }
  };

  const updateDailyLog = async (updates) => {
    const next = { ...dailyLog, ...updates };
    setDailyLog(next);
    if (user) {
      await safeFetch(`${API_URL}/logs/${user.uid}/${currentDate}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
    }
  };

  const fetchLogRange = async (start, end) => {
    if (!user) return [];
    const data = await safeFetch(`${API_URL}/logs/${user.uid}/range/${start}/${end}`);
    return data || [];
  };

  return (
    <UserProfileContext.Provider value={{ 
      user, profile, dailyLog, loading, isInitializing, currentDate, 
      setCurrentDate, updateProfile, updateDailyLog, fetchLogRange, loginWithGoogle 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};
