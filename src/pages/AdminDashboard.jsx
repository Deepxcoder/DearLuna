import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, EnvelopeSimple, Gear, ShieldCheck, ChartLineUp, UserCircle, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import Sticker from '../components/UI/Sticker';
import GlassCard from '../components/UI/GlassCard';

const AdminDashboard = () => {
  const { fetchAdminUsers, sendTestNotification, verifySmtp, profile } = useUserProfile();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smtpConfig, setSmtpConfig] = useState({
    host: '', port: 587, user: '', pass: '', secure: false, senderEmail: ''
  });
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'smtp'
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadUsers();
    loadSmtpConfig();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchAdminUsers();
      if (data) setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSmtpConfig = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/config/smtp');
      const data = await response.json();
      if (data) setSmtpConfig(data);
    } catch (err) {
      console.error('Failed to load SMTP config:', err);
    }
  };

  const handleSaveSmtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/config/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      if (response.ok) {
        setStatus({ type: 'success', message: 'SMTP Configuration saved successfully!' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save configuration.' });
    }
  };

  const handleVerifySmtp = async () => {
    setStatus({ type: 'info', message: 'Verifying connection...' });
    try {
      const result = await verifySmtp(smtpConfig);
      if (result.success) {
        setStatus({ type: 'success', message: 'Verification Successful! ✅' });
      } else {
        setStatus({ type: 'error', message: result.message || 'Verification Failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection Error' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10 relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-kawaii-earth text-white flex items-center justify-center shadow-sticker border-4 border-white">
            <ShieldCheck size={28} weight="fill" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-kawaii-earth leading-tight">Admin Command Center</h1>
            <p className="text-kawaii-earthLight font-bold tracking-wide uppercase text-xs">Manage your Luna Empire</p>
          </div>
        </div>
        <Sticker emoji="👑" className="-top-4 right-0" rotate={15} style={{ fontSize: '3rem' }} />
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-kawaii-pink/20 flex items-center justify-center text-kawaii-pink">
            <Users size={32} weight="fill" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Total Users</p>
            <h3 className="text-2xl font-black text-kawaii-earth">{users.length}</h3>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-5 text-kawaii-earth">
          <div className="w-14 h-14 rounded-full bg-kawaii-lilac/20 flex items-center justify-center text-kawaii-lilac">
            <ChartLineUp size={32} weight="fill" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Active Today</p>
            <h3 className="text-2xl font-black">{users.filter(u => new Date(u.updatedAt).toDateString() === new Date().toDateString()).length}</h3>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-kawaii-earth/10 flex items-center justify-center text-kawaii-earth">
            <EnvelopeSimple size={32} weight="fill" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">SMTP Status</p>
            <h3 className="text-lg font-black text-kawaii-green flex items-center gap-1">
              <CheckCircle size={18} weight="fill" /> Connected
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-sm ${activeTab === 'users' ? 'bg-kawaii-earth text-white' : 'bg-white text-kawaii-earthLight hover:bg-kawaii-bg border-4 border-white'}`}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('smtp')}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-sm ${activeTab === 'smtp' ? 'bg-kawaii-earth text-white' : 'bg-white text-kawaii-earthLight hover:bg-kawaii-bg border-4 border-white'}`}
        >
          SMTP Settings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'users' ? (
          <motion.div 
            key="users"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <GlassCard className="overflow-hidden border-4 border-white rounded-[40px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-kawaii-earth text-white">
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">User</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Membership</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kawaii-bg">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-white/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-kawaii-pink/10 flex items-center justify-center text-kawaii-pink">
                              <UserCircle size={28} weight="fill" />
                            </div>
                            <div>
                              <p className="font-black text-kawaii-earth text-sm">{u.name}</p>
                              <p className="text-[10px] font-bold text-kawaii-earthLight uppercase">{u.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-kawaii-earthLight">{u.email || 'No email synced'}</td>
                        <td className="px-8 py-5 text-sm font-black text-kawaii-earth">{u.membership}</td>
                        <td className="px-8 py-5 text-xs font-bold text-kawaii-earthLight">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-kawaii-earthLight font-bold">
                          No users found yet. Is the backend awake? 🌙
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div 
            key="smtp"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <GlassCard className="p-10 rounded-[50px] border-[10px] border-white relative overflow-hidden">
              <header className="mb-8">
                <h2 className="text-2xl font-black text-kawaii-earth mb-2 flex items-center gap-2">
                  <Gear size={28} weight="fill" className="text-kawaii-lilac" />
                  SMTP Engine Configuration
                </h2>
                <p className="text-sm font-bold text-kawaii-earthLight">Control how magic notifications are delivered.</p>
              </header>

              <div className="flex flex-col gap-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">SMTP Host</label>
                      <input 
                        type="text" value={smtpConfig.host} 
                        onChange={e => setSmtpConfig({...smtpConfig, host: e.target.value})}
                        className="bg-white/70 border-4 border-white rounded-[24px] px-5 py-3 text-sm text-kawaii-earth font-bold outline-none shadow-inner"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Port</label>
                      <input 
                        type="number" value={smtpConfig.port} 
                        onChange={e => setSmtpConfig({...smtpConfig, port: parseInt(e.target.value) || 0})}
                        className="bg-white/70 border-4 border-white rounded-[24px] px-5 py-3 text-sm text-kawaii-earth font-bold outline-none shadow-inner"
                        placeholder="587"
                      />
                    </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">User / Email</label>
                   <input 
                     type="text" value={smtpConfig.user} 
                     onChange={e => setSmtpConfig({...smtpConfig, user: e.target.value})}
                     className="bg-white/70 border-4 border-white rounded-[24px] px-5 py-3 text-sm text-kawaii-earth font-bold outline-none shadow-inner"
                     placeholder="yourname@gmail.com"
                   />
                 </div>

                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Password / App Key</label>
                   <input 
                     type="password" value={smtpConfig.pass} 
                     onChange={e => setSmtpConfig({...smtpConfig, pass: e.target.value})}
                     className="bg-white/70 border-4 border-white rounded-[24px] px-5 py-3 text-sm text-kawaii-earth font-bold outline-none shadow-inner"
                     placeholder="xxxx xxxx xxxx xxxx"
                   />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-kawaii-earthLight uppercase tracking-widest pl-1">Sender Name (Optional)</label>
                    <input 
                      type="text" value={smtpConfig.senderEmail} 
                      onChange={e => setSmtpConfig({...smtpConfig, senderEmail: e.target.value})}
                      className="bg-white/70 border-4 border-white rounded-[24px] px-5 py-3 text-sm text-kawaii-earth font-bold outline-none shadow-inner"
                      placeholder="Dear Luna Postman"
                    />
                 </div>

                 <div className="flex flex-col gap-2 py-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className="relative">
                          <input 
                            type="checkbox" checked={smtpConfig.secure} 
                            onChange={e => setSmtpConfig({...smtpConfig, secure: e.target.checked})}
                            className="w-6 h-6 rounded-lg accent-kawaii-pink"
                          />
                       </div>
                       <span className="text-sm font-black text-kawaii-earth group-hover:text-kawaii-pink transition-colors">Use Secure Connection (SSL/TLS)</span>
                    </label>
                    <div className="pl-9">
                       {smtpConfig.port === 587 && <p className="text-[9px] font-black text-kawaii-pink uppercase">💡 Best for 587: Unchecked</p>}
                       {smtpConfig.port === 465 && <p className="text-[9px] font-black text-kawaii-lilac uppercase">💡 Best for 465: Checked</p>}
                    </div>
                 </div>

                 <div className="flex gap-4 mt-4">
                    <button 
                      onClick={handleVerifySmtp}
                      className="flex-1 py-4 bg-white border-4 border-white text-kawaii-earthLight rounded-[24px] font-black text-xs shadow-sticker hover:scale-105 transition-transform"
                    >
                      Test Connection
                    </button>
                    <button 
                      onClick={handleSaveSmtp}
                      className="flex-[1.5] py-4 bg-kawaii-earth text-white rounded-[24px] font-black text-xs shadow-sticker hover:bg-black transition-colors"
                    >
                      Save Configuration
                    </button>
                 </div>

                 {status.message && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     className={`mt-4 p-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest border-4 border-white ${
                       status.type === 'success' ? 'bg-green-100 text-green-700' : 
                       status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                     }`}
                   >
                     {status.type === 'success' ? <CheckCircle size={18} weight="fill" /> : <WarningCircle size={18} weight="fill" />}
                     {status.message}
                   </motion.div>
                 )}
              </div>
            </GlassCard>

            <div className="flex flex-col gap-6">
               <GlassCard className="p-8 rounded-[40px] border-4 border-white bg-kawaii-lilac/10">
                  <h3 className="text-lg font-black text-kawaii-earth mb-4">Quick Help 💡</h3>
                  <ul className="flex flex-col gap-4 text-sm font-bold text-kawaii-earthLight">
                    <li className="flex gap-3">
                      <span className="text-lg">📧</span>
                      <span>For **Gmail**, use an **App Password**, not your regular login.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-lg">🔒</span>
                      <span>Port 587 uses STARTTLS (Secure: Off). Port 465 uses SSL (Secure: On).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-lg">✨</span>
                      <span>The "Sender Name" is what users see in their inbox!</span>
                    </li>
                  </ul>
               </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
