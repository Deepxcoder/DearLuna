import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ChartLineUp, UserCircle, CheckCircle, WarningCircle, 
  CaretRight, MagnifyingGlass, Funnel, DotsThreeOutlineVertical,
  ShieldCheck, EnvelopeSimple, Gear
} from '@phosphor-icons/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useUserProfile } from '../context/UserProfileContext';
import Sticker from '../components/UI/Sticker';
import GlassCard from '../components/UI/GlassCard';

const AdminDashboard = () => {
  const { profile, fetchAdminUsers, verifySmtp } = useUserProfile();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeToday: 0, newSignups: 0, growthData: [] });
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'dashboard';

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Fetch users
      const userData = await fetchAdminUsers();
      if (userData) setUsers(userData);

      // Fetch dashboard stats
      const statsRes = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        headers: { 'adminuid': profile?.uid }
      });
      const statsData = await statsRes.json();
      if (statsData) setStats(statsData);

    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (membership) => {
    switch (membership) {
      case 'Premium': return { bg: 'bg-[#D2F5F0]', text: 'text-[#0E6258]', label: 'Premium' };
      case 'Gold':    return { bg: 'bg-[#FFEBEE]', text: 'text-[#C62828]', label: 'Gold' };
      default:        return { bg: 'bg-[#F3E5F5]', text: 'text-[#6A1B9A]', label: 'Free' };
    }
  };

  return (
    <div className="w-full h-full bg-[#FDF8F9] flex flex-col overflow-hidden">

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-kawaii-earth">Admin Command Center</h2>
            <p className="text-kawaii-earthLight font-bold text-sm">Managing the DearLuna universe with love 🌙</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-kawaii-earthLight" />
                <input 
                  type="text" placeholder="Search members..." 
                  className="bg-white border-2 border-white rounded-full pl-12 pr-6 py-3 text-sm font-bold shadow-soft outline-none focus:border-kawaii-pink/40"
                />
             </div>
             <div className="w-10 h-10 rounded-full bg-kawaii-pink border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 relative overflow-hidden group border-4 border-white hover:border-kawaii-pink/20 transition-all">
             <Sticker emoji="🐻" className="-top-3 -right-3 group-hover:scale-110 transition-transform" rotate={15} style={{ fontSize: '2.5rem' }} />
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2F1] text-[#00695C] flex items-center justify-center">
                  <Users size={24} weight="fill" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Total Users</p>
                   <h3 className="text-2xl font-black text-kawaii-earth">{stats.totalUsers}</h3>
                </div>
             </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden group border-4 border-white hover:border-kawaii-lilac/20 transition-all">
             <Sticker emoji="✨" className="-bottom-3 -right-3 group-hover:scale-110 transition-transform" rotate={-10} style={{ fontSize: '2rem' }} />
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] text-[#C62828] flex items-center justify-center">
                  <ChartLineUp size={24} weight="fill" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Active Today</p>
                   <h3 className="text-2xl font-black text-kawaii-earth">{stats.activeToday}</h3>
                </div>
             </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden group border-4 border-white hover:border-kawaii-pink/20 transition-all">
             <Sticker emoji="🐻" className="-top-3 -left-3 opacity-20 group-hover:opacity-100 transition-opacity" rotate={-20} style={{ fontSize: '2rem' }} />
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3E5F5] text-[#6A1B9A] flex items-center justify-center">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">New Signups</p>
                   <h3 className="text-2xl font-black text-kawaii-earth">{stats.newSignups}</h3>
                </div>
             </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Growth Chart */}
           <GlassCard className="lg:col-span-2 p-8 border-4 border-white rounded-[40px]">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-black text-kawaii-earth">User Growth</h3>
                    <p className="text-xs font-bold text-kawaii-earthLight">New members per day (Last 7 Days)</p>
                 </div>
                 <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-kawaii-lilac" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Live Sync</span>
                 </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.growthData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A89FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8A89FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3E5F5" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#4A3525', fontSize: 10, fontWeight: 700}}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#4A3525', fontSize: 10, fontWeight: 700}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 900}}
                    />
                    <Area type="monotone" dataKey="count" stroke="#8A89FF" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </GlassCard>

           {/* Quick Actions */}
           <div className="flex flex-col gap-6">
              <GlassCard className="p-6 bg-[#D2F5F0]/30 border-2 border-white/50 rounded-[32px]">
                 <h4 className="font-black text-kawaii-earth mb-3">System Health</h4>
                 <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-kawaii-earthLight">Backend Server</span>
                       <span className="flex items-center gap-1.5 text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ONLINE
                       </span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-kawaii-earthLight">SMTP Engine</span>
                       <span className="flex items-center gap-1.5 text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> READY
                       </span>
                    </div>
                 </div>
              </GlassCard>

              <GlassCard className="p-6 bg-kawaii-pink/10 border-2 border-white/50 rounded-[32px] flex flex-col items-center text-center">
                 <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl mb-3 shadow-sm">👑</div>
                 <h4 className="font-black text-kawaii-earth text-sm">Luna Pro Support</h4>
                 <p className="text-[10px] font-bold text-kawaii-earthLight mb-4">Manage billing and premium tiers.</p>
                 <button className="w-full py-3 bg-white border border-kawaii-pink text-kawaii-earth font-black text-[10px] uppercase rounded-xl hover:bg-kawaii-pink/10 transition-colors">
                    Access Billing Panel
                 </button>
              </GlassCard>
           </div>
        </div>

        {/* User List Table */}
        <section className="mt-10">
           <div className="flex justify-between items-end mb-6">
              <div>
                 <h3 className="text-xl font-black text-kawaii-earth">Active Members</h3>
                 <p className="text-xs font-bold text-kawaii-earthLight tracking-tight">Managing {users.length} registered stars</p>
              </div>
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#F3E5F5] rounded-xl text-xs font-black text-kawaii-earth hover:bg-kawaii-bg transition-all">
                    <Funnel size={16} /> Filters
                 </button>
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-kawaii-earth text-white rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105">
                    Broadcast Announcement
                 </button>
              </div>
           </div>

           <GlassCard className="overflow-hidden border-4 border-white rounded-[40px] shadow-sm">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-kawaii-earth/5 border-b border-[#F3E5F5]">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Member</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Role & Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Sign Up Date</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-kawaii-earthLight">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FDF8F9]">
                       {users.map((user, i) => {
                          const status = getStatusColor(user.membership);
                          return (
                             <tr key={user._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#FDF8F9]/50'} hover:bg-kawaii-pink/5 transition-colors`}>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm flex items-center justify-center ${status.bg} text-lg`}>
                                         {user.name?.[0] || 'L'}
                                      </div>
                                      <div>
                                         <p className="font-black text-kawaii-earth text-sm leading-tight">{user.name}</p>
                                         <p className="text-[10px] font-bold text-kawaii-earthLight truncate max-w-[150px]">{user.email}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex flex-col gap-1">
                                      <span className={`inline-flex items-center justify-center w-max px-3 py-1 rounded-full text-[9px] font-black uppercase border border-white/50 ${status.bg} ${status.text}`}>
                                         {status.label}
                                      </span>
                                      <p className="text-[10px] font-bold text-kawaii-earthLight uppercase px-1">{user.role}</p>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <p className="font-black text-kawaii-earth text-sm">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                   <p className="text-[10px] font-bold text-kawaii-earthLight uppercase">Joined Luna</p>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <button className="px-4 py-2 bg-white border border-kawaii-pink/20 text-kawaii-pink text-[10px] font-black uppercase rounded-lg shadow-sm hover:scale-105 transition-all">
                                         Manage
                                      </button>
                                      <button className="p-2 text-kawaii-earthLight hover:text-kawaii-earth transition-colors">
                                         <DotsThreeOutlineVertical size={18} weight="fill" />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </GlassCard>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
