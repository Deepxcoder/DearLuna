import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Crown, Medal, Notebook, Heartbeat, Bell, Moon, ShieldCheck, 
  PencilSimple, CaretRight, Star, X, Lock, CheckCircle
} from '@phosphor-icons/react';
import { useUserProfile } from '../context/UserProfileContext';
import Sticker from '../components/UI/Sticker';
import { KAWAII_AVATARS, RARITY, getAvatarUrl } from '../utils/kawaiiAvatars';

// ─── Avatar Picker Modal ─────────────────────────────────────────────────────

const rarityOrder = ['common', 'rare', 'epic', 'legendary'];

const AvatarPickerModal = ({ currentAvatarId, petLevel, onSelect, onClose }) => {
  const [filter, setFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = filter === 'all'
    ? KAWAII_AVATARS
    : KAWAII_AVATARS.filter(a => a.rarity === filter);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(80, 40, 60, 0.45)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[32px] shadow-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFF5F9 0%, #F3EAFF 100%)', border: '1.5px solid rgba(255,255,255,0.8)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-pink-100/60 shrink-0">
            <div>
              <h2 className="text-2xl font-black text-kawaii-earth">Choose Your Avatar ✨</h2>
              <p className="text-xs font-bold text-kawaii-earthLight mt-0.5 uppercase tracking-widest">
                Pet Level {petLevel} — {KAWAII_AVATARS.filter(a => a.requiredLevel <= petLevel).length} unlocked
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/70 hover:bg-pink-100 transition-colors text-kawaii-earthLight hover:text-kawaii-earth"
            >
              <X size={22} weight="bold" />
            </button>
          </div>

          {/* Rarity Filter Tabs */}
          <div className="flex gap-2 px-8 py-4 shrink-0 overflow-x-auto">
            {['all', ...rarityOrder].map(r => {
              const cfg = r === 'all' ? { label: 'All', color: '#7A593E', bg: '#FFF3E0', border: '#FFDEC2' } : RARITY[r];
              return (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className="whitespace-nowrap text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border-2 transition-all"
                  style={{
                    color: filter === r ? '#fff' : cfg.color,
                    background: filter === r ? cfg.color : cfg.bg,
                    borderColor: cfg.border,
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Avatar Grid */}
          <div className="overflow-y-auto px-8 pb-8 flex-1" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {filtered.map(avatar => {
                const unlocked = petLevel >= avatar.requiredLevel;
                const isActive = currentAvatarId === avatar.id;
                const rarityConfig = RARITY[avatar.rarity];
                const isHovered = hoveredId === avatar.id;

                return (
                  <motion.button
                    key={avatar.id}
                    whileHover={unlocked ? { scale: 1.08 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                    onClick={() => unlocked && onSelect(avatar.id)}
                    onMouseEnter={() => setHoveredId(avatar.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    disabled={!unlocked}
                    className="flex flex-col items-center gap-2 relative group"
                  >
                    {/* Avatar circle */}
                    <div
                      className="relative w-full aspect-square rounded-full overflow-hidden transition-all duration-200"
                      style={{
                        border: isActive ? `3px solid ${rarityConfig.color}` : `2px solid ${rarityConfig.border}`,
                        boxShadow: isActive ? rarityConfig.glow : (isHovered && unlocked ? rarityConfig.glow : 'none'),
                        filter: unlocked ? 'none' : 'grayscale(1) opacity(0.45)',
                      }}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-full h-full object-cover bg-white"
                        loading="lazy"
                      />

                      {/* Active check */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
                          <CheckCircle size={28} weight="fill" color={rarityConfig.color} />
                        </div>
                      )}

                      {/* Locked overlay */}
                      {!unlocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                          style={{ background: 'rgba(40,20,30,0.5)' }}>
                          <Lock size={18} weight="fill" color="#fff" />
                          <span className="text-[9px] font-black text-white">Lv {avatar.requiredLevel}</span>
                        </div>
                      )}
                    </div>

                    {/* Name & rarity badge */}
                    <div className="text-center">
                      <p className="text-[10px] font-black leading-tight" style={{ color: rarityConfig.color }}>
                        {avatar.name}
                      </p>
                      <span
                        className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: rarityConfig.bg, color: rarityConfig.color }}
                      >
                        {rarityConfig.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Profile Card ─────────────────────────────────────────────────────────────

const ProfileCard = ({ profile, onEditClick }) => {
  const petLevel = profile?.pet?.level ?? 1;
  const avatarUrl = getAvatarUrl(profile?.avatarId, profile?.name);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 shadow-sm border border-white/60 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="flex items-center gap-8">
        {/* Avatar with edit button */}
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-kawaii-pink/20 rounded-full filter blur-xl animate-pulse group-hover:blur-2xl transition-all" />
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-md relative z-10 object-cover bg-white"
          />
          {/* Camera overlay on hover */}
          <button
            onClick={onEditClick}
            className="absolute inset-0 z-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(80,40,60,0.45)' }}
            title="Change avatar"
          >
            <PencilSimple size={28} weight="bold" color="#fff" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-4xl lg:text-5xl font-black text-kawaii-earth leading-tight">{profile?.name}</h2>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-200/60 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
              <Star weight="fill" size={10} /> {profile?.membership ?? 'Member'}
            </span>
            <span className="bg-kawaii-bg text-kawaii-earth text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Lv {petLevel} Pet
            </span>
          </div>
          <button
            onClick={onEditClick}
            className="mt-4 bg-gradient-to-r from-kawaii-pink to-[#E0BBE4] text-kawaii-earth font-black text-xs py-3 px-8 rounded-full shadow-lg border border-white/50 hover:scale-105 transition-transform flex items-center gap-2 w-fit"
          >
            <PencilSimple size={14} weight="bold" /> Edit Profile Picture
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Stats & other sub-components (unchanged) ─────────────────────────────────

const StatsCard = ({ title, stats, icon: Icon, emoji }) => (
  <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 lg:p-8 shadow-sm border border-white/60 relative h-full">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-black text-kawaii-earth">{title}</h3>
      <div className="bg-kawaii-bg p-2 rounded-2xl relative">
        <Icon size={24} weight="bold" className="text-kawaii-earth" />
        {emoji && <span className="absolute -top-2 -right-2 text-xl">{emoji}</span>}
      </div>
    </div>
    <div className="space-y-4">
      {stats.map((s, i) => (
        <div key={i} className="flex justify-between items-center group">
          <span className="text-sm font-bold text-kawaii-earthLight group-hover:text-kawaii-earth transition-colors">{s.label}</span>
          <span className="text-sm font-black text-kawaii-earth">{s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const AchievementGallery = () => (
  <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-10 shadow-sm border border-white/60 relative w-full overflow-hidden">
    <div className="flex justify-between items-center mb-10">
      <h3 className="text-2xl font-black text-kawaii-earth">Achievement Gallery</h3>
      <span className="text-2xl">💖</span>
    </div>
    <div className="flex justify-around items-center">
      {[
        { icon: Trophy, color: 'text-yellow-600', bg: 'from-yellow-100 to-orange-100', label: 'Day 100 Warrior' },
        { icon: Crown, color: 'text-kawaii-lilac', bg: 'from-purple-100 to-kawaii-lilac/30', label: 'Luna Queen' },
        { icon: Medal, color: 'text-blue-500', bg: 'from-blue-100 to-cyan-100', label: 'Cycle Master' },
      ].map(({ icon: Icon, color, bg, label }, i) => (
        <div key={i} className="flex flex-col items-center gap-4 transition-transform hover:scale-110 cursor-pointer">
          <div className={`w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center border-4 border-white shadow-sticker`}>
            <Icon size={80} weight="fill" className={color} />
          </div>
          <span className="text-xs font-black text-kawaii-earthLight uppercase tracking-tighter">{label}</span>
        </div>
      ))}
    </div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-100 opacity-20 filter blur-3xl rounded-full" />
  </div>
);

const PreferenceToggle = ({ label, icon: Icon, emoji, active, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex justify-between items-center p-4 rounded-3xl bg-white/40 border border-white/60 hover:bg-white/60 transition-all cursor-pointer group text-left"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-xl bg-kawaii-bg text-kawaii-earth">
        <Icon size={20} weight="bold" />
      </div>
      <span className="font-bold text-kawaii-earth">{label} {emoji}</span>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 relative transition-colors ${active ? 'bg-kawaii-pink' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6 shadow-sm' : 'translate-x-0'}`} />
    </div>
  </button>
);

// ─── Danger Zone: Delete Account Modal ──────────────────────────────────────

const DeleteConfirmationModal = ({ onConfirm, onClose, loading }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-red-950/20 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-4 border-red-50 text-center flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl shadow-inner">
          😿
        </div>
        <div>
          <h2 className="text-2xl font-black text-red-600 mb-2">Saying Goodbye?</h2>
          <p className="text-sm font-medium text-kawaii-earthLight leading-relaxed">
            This will permanently delete your celestial profile, cycle history, and all rituals. This action <span className="text-red-500 font-black">cannot be undone</span>.
          </p>
        </div>
        
        <div className="flex flex-col w-full gap-3 mt-4">
          <button
            disabled={loading}
            onClick={onConfirm}
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Purging data...' : 'Yes, Delete Permanently'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-100 text-kawaii-earth font-black text-sm rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── Main Profile Page ─────────────────────────────────────────────────────────

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, deleteAccount, isGuest } = useUserProfile();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const petLevel = profile?.pet?.level ?? 1;

  const handleAvatarSelect = async (avatarId) => {
    await updateProfile({ avatarId });
    setShowAvatarPicker(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const result = await deleteAccount();
    if (result.success) {
      navigate('/login');
    } else {
      alert(result.message || 'Deletion failed. Please try again.');
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const journalStats = [
    { label: 'Total Entries', value: profile?.stats?.totalJournalEntries || 0 },
    { label: 'Current Streak', value: `${profile?.stats?.currentStreak || 0} days` },
    { label: 'Entries (30d)', value: profile?.stats?.entries30Days || 0 },
    { label: 'Total (Year)', value: profile?.stats?.entriesYear || 0 }
  ];

  const bodyInsights = [
    { label: 'Avg Cycle Length', value: `${profile?.settings?.cycleLength || 28} days` },
    { label: 'Phase Consistency', value: '94%' },
    { label: 'Health Score', value: 'A+' }
  ];
  const darkThemeEnabled = Boolean(profile?.settings?.darkTheme);

  return (
    <>
      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPickerModal
          currentAvatarId={profile?.avatarId}
          petLevel={petLevel}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal 
          onConfirm={handleDeleteAccount}
          onClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 font-body"
      >
        <div className="flex flex-col gap-8 pb-20 overflow-hidden">

          {/* Page Header */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-4xl font-black text-kawaii-earth tracking-tight">User Profile</h1>
              <p className="text-sm font-bold text-kawaii-earthLight uppercase tracking-widest mt-1">Glow Status: Active ✨</p>
            </div>
            <div className="flex gap-2">
              <Sticker emoji="🎨" style={{ fontSize: '1.2rem', padding: '0.4rem' }} rotate={-10} />
              <Sticker emoji="🧸" style={{ fontSize: '1.2rem', padding: '0.4rem' }} rotate={15} />
            </div>
          </div>

          {/* TOP ROW: PROFILE & STICKERS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[320px]">
            <div className="lg:col-span-2">
              <ProfileCard profile={profile} onEditClick={() => setShowAvatarPicker(true)} />
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 shadow-sm border border-white/60 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-kawaii-earth">Sticker Collection</h3>
                <CaretRight size={20} weight="bold" className="text-kawaii-earthLight" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['🐻', '🐱', '🐰', '🐼', '🐨', '🐥', '🦊', '🦁'].map((e, i) => (
                  <div key={i} className="aspect-square bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                    {e}
                  </div>
                ))}
              </div>
              <div className="absolute -top-4 -right-4">
                <Sticker emoji="💖" style={{ fontSize: '1.4rem' }} rotate={15} />
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: STATS & INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatsCard title="Journaling Stats" icon={Notebook} emoji="📓" stats={journalStats} />
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 relative flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-kawaii-earth">Body Insights</h3>
                <Heartbeat size={24} weight="bold" className="text-kawaii-earth" />
              </div>
              <div className="flex items-center justify-around flex-1 gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(0,0,0,0.05)" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke="#E0BBE4" strokeWidth="12" fill="none"
                      strokeDasharray="440" strokeDashoffset="120" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-kawaii-earth">29d</span>
                    <span className="text-[10px] font-bold text-kawaii-earthLight uppercase">Average</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  {bodyInsights.map((s, i) => (
                    <div key={i} className="flex justify-between border-b border-kawaii-bg pb-2">
                      <span className="text-xs font-bold text-kawaii-earthLight uppercase tracking-tighter">{s.label}</span>
                      <span className="text-sm font-black text-kawaii-earth">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <AchievementGallery />

          {/* BOTTOM ROW: PREFERENCES & HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-black text-kawaii-earth px-2">App Preferences</h3>
              <div className="flex flex-col gap-3">
                <PreferenceToggle label="Notifications" icon={Bell} emoji="🔔" active={true} />
                <PreferenceToggle
                  label="Dark Theme"
                  icon={Moon}
                  emoji="🌙"
                  active={darkThemeEnabled}
                  onToggle={() => updateProfile({
                    settings: {
                      ...profile.settings,
                      darkTheme: !darkThemeEnabled,
                      theme: !darkThemeEnabled ? 'Midnight' : 'Sakura'
                    }
                  })}
                />
                <PreferenceToggle label="Data Sharing" icon={ShieldCheck} emoji="🔒" active={false} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-black text-kawaii-earth px-2">Health History</h3>
              <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-white/60 space-y-6">
                {profile?.history?.map((h, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-kawaii-bg/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-kawaii-pink group-hover:scale-150 transition-transform" />
                      <span className="font-bold text-kawaii-earth">{h.month}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black uppercase text-kawaii-earthLight tracking-widest">{h.duration}</span>
                      <span className="text-[10px] font-black bg-kawaii-bg text-kawaii-earth px-3 py-1 rounded-full uppercase">{h.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          {!isGuest && (
            <div className="mt-8 pt-8 border-t border-red-100 flex flex-col items-center gap-4">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="text-red-400 hover:text-red-600 font-black text-xs uppercase tracking-widest px-8 py-3 rounded-full border-2 border-red-50 hover:bg-red-50/50 transition-all flex items-center gap-2"
              >
                ⚠️ Danger Zone: Delete Account
              </button>
              <p className="text-[10px] font-bold text-kawaii-earthLight/60 max-w-xs text-center">
                Once deleted, your lunar history and pet progress are lost forever.
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </>
  );
};

export default Profile;
