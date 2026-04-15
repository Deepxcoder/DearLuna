import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { format } from 'date-fns';

const UserProfileContext = createContext(null);
const API_URL = 'http://localhost:5000/api';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const useUserProfile = () => useContext(UserProfileContext);

/** Deep merge two objects (one level deep for nested objects like habits/rituals) */
const deepMerge = (base, updates) => {
  const result = { ...base };
  for (const key of Object.keys(updates)) {
    if (
      updates[key] !== null &&
      typeof updates[key] === 'object' &&
      !Array.isArray(updates[key]) &&
      typeof base[key] === 'object' &&
      base[key] !== null &&
      !Array.isArray(base[key])
    ) {
      result[key] = { ...base[key], ...updates[key] };
    } else {
      result[key] = updates[key];
    }
  }
  return result;
};

export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [needsPeriodSetup, setNeedsPeriodSetup] = useState(false);

  // Debounce timer refs so rapid UI updates (reflection typing, water taps) don't spam the DB
  const logSaveTimer = useRef(null);
  const profileSaveTimer = useRef(null);

  // ── Safe fetch helper ────────────────────────────────────────────────────
  const safeFetch = async (url, options = {}) => {
    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) {
      console.warn(`[DearLuna API] ${url}:`, e.message);
      return null;
    }
  };

  // ── Persist daily log to MongoDB (debounced 600ms) ────────────────────────
  const persistLog = useCallback((uid, date, logData) => {
    clearTimeout(logSaveTimer.current);
    logSaveTimer.current = setTimeout(() => {
      safeFetch(`${API_URL}/logs/${uid}/${date}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
    }, 600);
  }, []);

  // ── Persist user profile to MongoDB (debounced 600ms) ────────────────────
  const persistProfile = useCallback((uid, profileData) => {
    clearTimeout(profileSaveTimer.current);
    profileSaveTimer.current = setTimeout(() => {
      safeFetch(`${API_URL}/users/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
    }, 600);
  }, []);

  // ── Fetch or create user profile ─────────────────────────────────────────
  const fetchProfile = async (firebaseUser) => {
    const data = await safeFetch(`${API_URL}/users/${firebaseUser.uid}`);
    if (data) {
      setProfile(data);
    } else {
      // First-time user — create in DB
      const newProfile = {
        name: firebaseUser.displayName?.split(' ')[0] || 'Luna User',
        lastPeriodDate: new Date().toISOString(),
        hasSetPeriodDate: false,
        membership: 'Free Member',
        avatarId: null,
        pet: { level: 1, xp: 0, happiness: 100 },
        settings: { cycleLength: 28, periodLength: 5, waterTarget: 2000, darkTheme: false },
        stats: { totalJournalEntries: 0, currentStreak: 0, entries30Days: 0, entriesYear: 0 },
        history: []
      };
      const created = await safeFetch(`${API_URL}/users/${firebaseUser.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
      setProfile(created || newProfile);
    }
  };

  // ── Bootstrap user + day log in one call (new or existing user) ─────────
  const bootstrapUserData = async (firebaseUser, date) => {
    const data = await safeFetch(`${API_URL}/users/${firebaseUser.uid}/bootstrap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: firebaseUser.displayName || '',
        date
      }),
    });

    if (!data) return false;
    setProfile(data.user || null);
    setDailyLog(data.dailyLog || null);
    setNeedsPeriodSetup(Boolean(data.user) && !Boolean(data.user.hasSetPeriodDate));
    return true;
  };

  // ── Fetch or create today's daily log ────────────────────────────────────
  const fetchDailyLog = async (uid, date) => {
    const data = await safeFetch(`${API_URL}/logs/${uid}/${date}`);
    if (data) {
      setDailyLog(data);
    } else {
      // No log for today yet — use clean defaults (will be created on first update)
      setDailyLog({
        mood: '',
        energy: '',
        symptoms: [],
        severity: 50,
        reflection: '',
        rituals: { water: 0, meditation: false, exercise: false },
        habits: { skincare: false, journaling: false, reading: false, sleep: false },
      });
    }
  };

  // ── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        try {
          const bootstrapped = await bootstrapUserData(currentUser, currentDate);
          if (!bootstrapped) {
            await Promise.all([
              fetchProfile(currentUser),
              fetchDailyLog(currentUser.uid, currentDate),
            ]);
            setNeedsPeriodSetup(false);
          }
        } catch (e) {
          console.error('[DearLuna] Auth fetch failure', e);
        }
      } else {
        setProfile(null);
        setDailyLog(null);
        setNeedsPeriodSetup(false);
      }
      setLoading(false);
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // ── Date-bound log sync across pages ─────────────────────────────────────
  useEffect(() => {
    if (!user || isGuest || isInitializing) return;
    fetchDailyLog(user.uid, currentDate);
  }, [currentDate, user, isGuest, isInitializing]);

  // ── Theme sync (profile setting -> global class) ─────────────────────────
  useEffect(() => {
    const enabled = Boolean(profile?.settings?.darkTheme);
    document.documentElement.classList.toggle('theme-dark', enabled);
    return () => {
      document.documentElement.classList.remove('theme-dark');
    };
  }, [profile?.settings?.darkTheme]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Login failed', e);
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    setLoading(true);
    const guestUser = { uid: 'guest_user', displayName: 'Luna Guest', photoURL: null, isGuest: true };
    setUser(guestUser);
    setIsGuest(true);
    setNeedsPeriodSetup(false);
    setProfile({
      name: 'Alex Rivera',
      lastPeriodDate: new Date().toISOString(),
      hasSetPeriodDate: true,
      avatarId: null,
      membership: 'Pro Member',
      pet: { level: 4, xp: 65, happiness: 100 },
      settings: { cycleLength: 29, periodLength: 5, waterTarget: 2000, darkTheme: false },
      stats: { totalJournalEntries: 256, currentStreak: 12, entries30Days: 16, entriesYear: 154 },
      history: [
        { month: 'June 2024', duration: '28 days', status: 'Normal' },
        { month: 'May 2024', duration: '30 days', status: 'Normal' },
        { month: 'April 2024', duration: '29 days', status: 'Normal' },
      ]
    });
    setDailyLog({
      mood: 'calm',
      energy: 'Medium',
      symptoms: [],
      severity: 50,
      reflection: 'Feeling good today.',
      rituals: { water: 1200, meditation: true, exercise: false },
      habits: { skincare: true, journaling: true, reading: false, sleep: true },
    });
    setLoading(false);
    setIsInitializing(false);
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (!isGuest) {
        await signOut(auth);
      }
      setUser(null);
      setProfile(null);
      setDailyLog(null);
      setIsGuest(false);
      setNeedsPeriodSetup(false);
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Update profile (deep merge + debounced DB write) ──────────────────────
  const updateProfile = (updates) => {
    setProfile(prev => {
      const normalizedUpdates = updates?.lastPeriodDate
        ? { ...updates, hasSetPeriodDate: true }
        : updates;
      const next = deepMerge(prev, normalizedUpdates);
      // Don't persist guest data to real DB
      if (user && !isGuest) persistProfile(user.uid, next);
      return next;
    });
  };

  const setPeriodStartDate = (dateValue) => {
    if (!dateValue) return;
    const iso = `${dateValue}T00:00:00.000Z`;
    updateProfile({ lastPeriodDate: iso, hasSetPeriodDate: true });
    setNeedsPeriodSetup(false);
  };

  // ── Update daily log (deep merge + debounced DB write) ────────────────────
  const updateDailyLog = (updates) => {
    setDailyLog(prev => {
      const next = deepMerge(prev, updates);
      if (user && !isGuest) persistLog(user.uid, currentDate, next);
      return next;
    });
  };

  // ── Fetch log range (calendar view) ──────────────────────────────────────
  const fetchLogRange = async (start, end) => {
    if (!user || isGuest) return [];
    const data = await safeFetch(`${API_URL}/logs/${user.uid}/range/${start}/${end}`);
    return data || [];
  };

  // ── Update a specific date log (used by calendar detail editor) ──────────
  const updateLogForDate = async (date, updates) => {
    if (!user || isGuest || !date) return null;
    const existing = await safeFetch(`${API_URL}/logs/${user.uid}/${date}`);
    const base = existing || {
      mood: '',
      energy: '',
      symptoms: [],
      severity: 50,
      reflection: '',
      rituals: { water: 0, meditation: false, exercise: false },
      habits: { skincare: false, journaling: false, reading: false, sleep: false },
    };
    const merged = deepMerge(base, updates);
    const saved = await safeFetch(`${API_URL}/logs/${user.uid}/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
    if (saved && date === currentDate) setDailyLog(saved);
    return saved;
  };

  return (
    <UserProfileContext.Provider value={{
      user, profile, dailyLog, loading, isInitializing, currentDate, isGuest,
      needsPeriodSetup, setCurrentDate, updateProfile, updateDailyLog, fetchLogRange, setPeriodStartDate,
      updateLogForDate, loginWithGoogle, loginAsGuest, logout,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};
