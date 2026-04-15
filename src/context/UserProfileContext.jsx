import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  deleteUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
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
  const [petAction, setPetAction] = useState('idle');
  const petActionTimer = useRef(null);

  // Debounce timer refs so rapid UI updates (reflection typing, water taps) don't spam the DB
  const logSaveTimer = useRef(null);
  const profileSaveTimer = useRef(null);

  // ── Safe fetch helper ────────────────────────────────────────────────────
  const safeFetch = async (url, options = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      // If response is not JSON (e.g., 404 HTML), res.json() will throw "Unexpected token <"
      // We handle that by checking Content-Type or simply catching the error below
      const data = await res.json();

      if (!res.ok) {
        console.warn(`[DearLuna] API Error for ${url}:`, data);
        return { error: data.error || data.message || `Server responded with ${res.status}` };
      }
      return data;
    } catch (err) {
      clearTimeout(timeout);
      let msg = 'Unknown connection error';
      if (err.name === 'AbortError') {
        msg = 'Connection timed out. Is the backend running?';
      } else if (err instanceof SyntaxError) {
        msg = 'Received non-JSON response from server (possible 404 or crash).';
      } else {
        msg = err.message;
      }
      console.error(`[DearLuna] Network error for ${url}:`, err);
      return { error: msg };
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
        email: firebaseUser.email || '',
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
        email: firebaseUser.email || '',
        date
      }),
    });

    if (!data || data.error) {
      return { success: false, message: data?.error || 'Failed to initialize session. Check backend connection.' };
    }
    
    // DEBUG: Inform the user and us about the loaded role
    if (data.user) {
      console.info(`%c[DearLuna] Profile Loaded | Email: ${data.user.email} | Role: ${data.user.role}`, "color: #B39DDB; font-weight: bold; font-size: 12px;");
    }

    setProfile(data.user || null);
    setDailyLog(data.dailyLog || null);
    setNeedsPeriodSetup(Boolean(data.user) && !Boolean(data.user.hasSetPeriodDate));
    return { success: true, isNewUser: data.isNewUser };
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
          const result = await bootstrapUserData(currentUser, currentDate);
          if (!result || !result.success) {
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

  // ── Theme sync (profile.settings.theme -> global class) ──────────────────
  useEffect(() => {
    const selectedTheme = profile?.settings?.theme || 'Sakura';
    
    // Remove any existing theme classes
    const themes = ['theme-Sakura', 'theme-Midnight', 'theme-Ocean', 'theme-Forest', 'theme-dark'];
    document.documentElement.classList.remove(...themes);
    
    // Add the current theme class
    document.documentElement.classList.add(`theme-${selectedTheme}`);
    
    // Backward compatibility for components checking theme-dark explicitly
    if (selectedTheme === 'Midnight' || profile?.settings?.darkTheme) {
      document.documentElement.classList.add('theme-dark');
    }

    return () => {
      document.documentElement.classList.remove(...themes);
    };
  }, [profile?.settings?.theme, profile?.settings?.darkTheme]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithPopup(auth, provider);
      const result = await bootstrapUserData(userCredential.user, currentDate);
      return result;
    } catch (e) {
      console.error('Login failed', e);
      setLoading(false);
      return { success: false, message: e.message };
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const result = await bootstrapUserData(userCredential.user, currentDate);
      return result;
    } catch (e) {
      console.error('Email login failed', e);
      setLoading(false);
      return { success: false, message: e.message };
    }
  };

  const registerWithEmail = async (email, password, name) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update Firebase Profile with name
      if (name) {
        await updateFirebaseProfile(userCredential.user, { displayName: name });
      }
      const result = await bootstrapUserData(userCredential.user, currentDate);
      return result;
    } catch (e) {
      console.error('Email registration failed', e);
      setLoading(false);
      return { success: false, message: e.message };
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    const guestUser = { uid: 'guest_user', displayName: 'Luna Guest', photoURL: null, isGuest: true };
    setUser(guestUser);
    setIsGuest(true);
    setNeedsPeriodSetup(false);
    return { success: true, isNewUser: true };
  };

  const setGuestProfile = () => {
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

  const deleteAccount = async () => {
    if (!user || isGuest) return { success: false, message: 'Invalid user or guest account' };
    
    try {
      setLoading(true);
      const uid = user.uid;
      
      // 1. Delete from Backend (MongoDB)
      const res = await fetch(`${API_URL}/users/${uid}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete data from server');

      // 2. Delete from Firebase Auth
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await deleteUser(firebaseUser);
      }

      // 3. Reset State
      setUser(null);
      setProfile(null);
      setDailyLog(null);
      setIsGuest(false);
      setNeedsPeriodSetup(false);
      
      console.log('✅ Account permanently deleted.');
      return { success: true };
    } catch (error) {
      console.error('❌ Deletion failed:', error);
      // If firebase deletion fails due to "recent login" requirement, we might need re-auth
      if (error.code === 'auth/requires-recent-login') {
        return { success: false, code: 'REQUIRES_RECENT_LOGIN', message: 'Please log out and log back in to verify your identity before deleting your account.' };
      }
      return { success: false, message: error.message };
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
  
  // ── Pet Action Trigger ──────────────────────────────────────────────────
  const triggerPetAction = useCallback((action, duration = 2500) => {
    clearTimeout(petActionTimer.current);
    setPetAction(action);
    if (action !== 'idle') {
      petActionTimer.current = setTimeout(() => {
        setPetAction('idle');
      }, duration);
    }
  }, []);

  const sendTestNotification = async (recipientEmail = '') => {
    if (isGuest || !user?.uid) return { success: false, message: 'Must be logged in to send notifications' };
    return await safeFetch(`${API_URL}/notify/daily/${user.uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail })
    });
  };

  const verifySmtp = async (config) => {
    return await safeFetch(`${API_URL}/config/smtp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  };

  const fetchAdminUsers = async () => {
    if (profile?.role !== 'admin') return [];
    return await safeFetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: { 'adminuid': user.uid }
    });
  };

  const triggerHabitNotification = async (habitName) => {
    return await safeFetch(`${API_URL}/notify/habit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, habitName })
    });
  };

  return (
    <UserProfileContext.Provider value={{
      user,
      profile,
      role: profile?.role || 'user',
      dailyLog,
      loading,
      isInitializing,
      isGuest,
      currentDate,
      setCurrentDate,
      updateProfile,
      updateDailyLog,
      fetchLogRange,
      setPeriodStartDate,
      updateLogForDate,
      loginWithGoogle,
      loginAsGuest,
      logout,
      needsPeriodSetup,
      setNeedsPeriodSetup,
      sendTestNotification,
      verifySmtp,
      fetchAdminUsers,
      triggerHabitNotification,
      deleteAccount,
      loginWithEmail,
      registerWithEmail,
      petAction,
      triggerPetAction
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};
