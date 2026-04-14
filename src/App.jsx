import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout and Global
import Sidebar from './components/Navigation/Sidebar';
import { app, db } from './firebase'; // Ensures Firebase initializes

// Pages
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Calendar from './pages/Calendar';
import Cycle from './pages/Cycle';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Login from './pages/Login';

// The Shared Layout encompassing the application wrap and Sidebar
const AppLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-kawaii-bg flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-12 relative overflow-y-auto min-h-screen">
        {/* Background Gradients */}
        <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-kawaii-pink rounded-full mix-blend-multiply filter blur-[80px] opacity-70 z-0 pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[20%] w-96 h-96 bg-kawaii-cream rounded-full mix-blend-multiply filter blur-[80px] opacity-70 z-0 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-8">
           {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes wrapped in the AppLayout */}
        <Route path="/*" element={
          <AppLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/cycle" element={<Cycle />} />
              <Route path="/community" element={<Community />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
