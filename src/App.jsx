import React from 'react';
import { useLocation, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout and Global
import Sidebar from './components/Navigation/Sidebar';
import { useUserProfile } from './context/UserProfileContext';
import { useDeviceScale } from './hooks/useDeviceScale';

// Pages
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Cycle from './pages/Cycle';
import Settings from './pages/Settings';
import Habits from './pages/Habits';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Showcase from './pages/Showcase';
import Meditation from './pages/Meditation';
import Scrapbook from './pages/Scrapbook';
import SafeSpace from './pages/SafeSpace';
import Legal from './pages/Legal';

const AppLayout = ({ children }) => {
  // Detect device size/aspect ratio and inject CSS scale variables globally
  useDeviceScale();
  const location = useLocation();
  const isScrollablePage = ['/settings', '/profile', '/showcase', '/legal', '/safespace'].includes(location.pathname);

  return (
    <div className="w-screen h-screen bg-kawaii-bg flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-screen overflow-hidden flex flex-col">
        {/* Background Gradients */}
        <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-white/40 rounded-full filter blur-[100px] z-0 pointer-events-none" />
        <div className="fixed bottom-0 left-[20%] w-[500px] h-[500px] bg-kawaii-pink/20 rounded-full filter blur-[120px] z-0 pointer-events-none" />
        
        {/* Main Content Area */}
        <div className={`flex-1 w-full h-full relative z-10 ${isScrollablePage ? 'overflow-y-auto' : 'overflow-hidden'}`}>
           {children}
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  const { role, needsPeriodSetup } = useUserProfile();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Admins bypass all setup barriers
  if (role === 'admin') return <AppLayout>{children}</AppLayout>;
  
  // Allow access to settings and cycle even if setup is needed
  const allowedPaths = ['/dashboard', '/settings', '/cycle'];
  if (needsPeriodSetup && !allowedPaths.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
};

function App() {
  const { user, role, isInitializing } = useUserProfile();
  console.log('🏗️ App.jsx: Rendering', { user: user?.uid, isInitializing });

  if (isInitializing) {
    console.log('⏳ App.jsx: Showing splash screen');
    return (
      <div className="h-screen w-full flex items-center justify-center bg-kawaii-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-kawaii-pink border-t-transparent rounded-full animate-spin" />
          <p className="text-kawaii-earth font-black text-xl">Waking up Luna...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute user={user}>{role === 'admin' ? <Navigate to="/admin" replace /> : <Dashboard />}</ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute user={user}><Calendar /></ProtectedRoute>} />
        <Route path="/cycle" element={<ProtectedRoute user={user}><Cycle /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute user={user}><Habits /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user}><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute user={user}><Analytics /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute user={user}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/showcase" element={<ProtectedRoute user={user}><Showcase /></ProtectedRoute>} />
        <Route path="/meditation" element={<ProtectedRoute user={user}><Meditation /></ProtectedRoute>} />
        <Route path="/scrapbook" element={<ProtectedRoute user={user}><Scrapbook /></ProtectedRoute>} />
        <Route path="/safespace" element={<ProtectedRoute user={user}><SafeSpace /></ProtectedRoute>} />
        <Route path="/legal" element={<ProtectedRoute user={user}><Legal /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
