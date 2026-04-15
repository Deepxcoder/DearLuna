import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SquaresFour, Drop, CalendarBlank, Sparkle, ChartBar, GearSix, SignOut } from '@phosphor-icons/react';
import Sticker from '../UI/Sticker';
import { useUserProfile } from '../../context/UserProfileContext';
import { getAvatarUrl } from '../../utils/kawaiiAvatars';

const Sidebar = () => {
  const navigate = useNavigate();
  const { profile, logout } = useUserProfile();
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: SquaresFour },
    { name: 'Cycle',     path: '/cycle',     icon: Drop },
    { name: 'Calendar',  path: '/calendar',  icon: CalendarBlank },
    { name: 'Habits',    path: '/habits',    icon: Sparkle },
    { name: 'Analytics', path: '/analytics', icon: ChartBar },
    { name: 'Settings',  path: '/settings',  icon: GearSix },
  ];

  // Collapse when clicking outside the sidebar
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? '272px' : '72px',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="h-[calc(100vh-2rem)] bg-white rounded-[40px] m-4 flex flex-col relative shadow-soft border-2 border-white/50 backdrop-blur-xl shrink-0 z-20 overflow-hidden"
    >
      {/* Decorative Stickers — only visible when expanded */}
      <div
        style={{
          opacity: expanded ? 1 : 0,
          transition: 'opacity 200ms ease',
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        <Sticker emoji="🌙" className="-top-3 right-6"  rotate={15}  style={{ fontSize: '1.5rem', padding: '0.4rem' }} />
        <Sticker emoji="✨" className="top-16 -right-4" rotate={-10} style={{ fontSize: '1rem', padding: '0.2rem' }} />
        <Sticker emoji="🤍" className="top-40 -right-6" rotate={20}  style={{ fontSize: '1.2rem' }} />
        <Sticker emoji="🐻" className="bottom-40 -right-4" rotate={-25} style={{ fontSize: '1.8rem', padding: '0.5rem' }} />
        <Sticker emoji="💤" className="bottom-60 -left-4" rotate={10}  style={{ fontSize: '1.2rem' }} />
        <Sticker emoji="🤎" className="bottom-8 -right-5"  rotate={-10} style={{ fontSize: '1.4rem' }} />
      </div>

      {/* Brand Header */}
      <div
        className="flex items-center gap-4 relative z-10 cursor-pointer shrink-0"
        style={{
          padding: expanded ? '2rem 1.5rem 1.5rem' : '1.5rem 1rem',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: expanded ? '1rem' : 0,
          transition: 'padding 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          marginBottom: expanded ? '0.5rem' : '0.5rem'
        }}
        onClick={() => navigate('/dashboard')}
      >
        {/* Logo circle — always visible */}
        <div className="w-10 h-10 rounded-full bg-kawaii-pink flex items-center justify-center shrink-0">
          <span className="text-lg">🌅</span>
        </div>

        {/* Brand name — fades in when expanded */}
        <div
          style={{
            opacity: expanded ? 1 : 0,
            width: expanded ? 'auto' : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'opacity 200ms ease 80ms, width 300ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <h1 className="text-xl font-bold font-sticker text-kawaii-earth leading-none">Dear Luna</h1>
          <p className="text-[9px] font-black tracking-widest text-kawaii-earthLight uppercase mt-0.5">Your Daily Glow</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 flex flex-col gap-1 relative z-10"
        style={{ paddingInline: expanded ? '0.5rem' : '0.25rem' }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={!expanded ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-kawaii-pink text-kawaii-earth shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] border border-white/50'
                  : 'text-kawaii-earthLight hover:bg-kawaii-bg'
              }`
            }
            style={{
              padding: expanded ? '0.75rem 1.25rem' : '0.75rem',
              justifyContent: expanded ? 'flex-start' : 'center',
              gap: expanded ? '0.75rem' : 0,
              width: expanded ? '100%' : '48px',
              marginInline: expanded ? 0 : 'auto',
              transition: 'padding 300ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  weight={isActive ? 'fill' : 'regular'}
                  className={`shrink-0 ${isActive ? 'text-kawaii-earth' : 'text-kawaii-earthLight'}`}
                />
                <span
                  style={{
                    opacity: expanded ? 1 : 0,
                    width: expanded ? 'auto' : 0,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 180ms ease 60ms, width 300ms cubic-bezier(0.4,0,0.2,1)',
                  }}
                  className="text-sm tracking-tight"
                >
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div
        onClick={() => { navigate('/profile'); setExpanded(false); }}
        className="pt-4 border-t border-kawaii-bg flex items-center relative z-10 cursor-pointer group shrink-0"
        style={{
          gap: expanded ? '1rem' : 0,
          padding: expanded ? '1rem 1.25rem' : '1rem',
          justifyContent: expanded ? 'flex-start' : 'center',
          transition: 'padding 300ms cubic-bezier(0.4,0,0.2,1), gap 300ms',
        }}
      >
        {/* Avatar — always visible */}
        <img
          src={getAvatarUrl(profile?.avatarId, profile?.name)}
          alt={profile?.name || 'User'}
          className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform shrink-0 object-cover bg-white"
        />

        {/* Name + role — fades in when expanded */}
        <div
          style={{
            opacity: expanded ? 1 : 0,
            width: expanded ? '1fr' : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            flex: expanded ? 1 : 'none',
            transition: 'opacity 180ms ease 60ms, width 300ms cubic-bezier(0.4,0,0.2,1)',
          }}
          className="flex flex-col min-w-0"
        >
          <span className="text-sm font-black text-kawaii-earth truncate">{profile?.name || 'Luna User'}</span>
          <span className="text-[9px] text-kawaii-earthLight font-black uppercase tracking-widest">{profile?.membership || 'Free Member'}</span>
        </div>

        {/* Sign out button — only when expanded */}
        {expanded && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await logout();
              navigate('/login', { replace: true });
            }}
            className="p-1.5 text-kawaii-earthLight hover:bg-kawaii-pink/20 rounded-full transition-colors shrink-0"
            title="Sign Out"
          >
            <SignOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
