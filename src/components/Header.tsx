import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Clock,
  CloudSun,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { NavTab } from './Sidebar';

interface Props {
  profile: UserProfile;
  onOpenMobileMenu: () => void;
  onOpenAddTask: () => void;
  onTogglePrivacy?: () => void;
  isPublicMode?: boolean;
  onTogglePublicMode?: () => void;
  searchQuery: string;
  setSearchQuery?: (query: string) => void;
  onSearchChange?: (query: string) => void;
  unreadCount?: number;
  onNavigate?: (tab: NavTab) => void;
}

export const Header: React.FC<Props> = ({
  profile,
  onOpenMobileMenu,
  onOpenAddTask,
  onTogglePrivacy,
  isPublicMode,
  onTogglePublicMode,
  searchQuery,
  setSearchQuery,
  onSearchChange,
  unreadCount = 3,
  onNavigate,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    if (setSearchQuery) setSearchQuery(val);
  };

  const handleTogglePrivacyMode = () => {
    if (onTogglePublicMode) onTogglePublicMode();
    else if (onTogglePrivacy) onTogglePrivacy();
  };

  const effectivePublic = isPublicMode !== undefined ? isPublicMode : profile.isPublic;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Mobile toggle & Greeting */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight">
                Hey {profile.name.split(' ')[0]}! 👋
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Focus Mode
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 font-mono text-slate-600">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {currentDate} • {currentTime}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar (from sketch "Search 🔍") */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tasks, hackathons, peers, or schedule..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/90 border border-slate-200/80 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Quick Map Button */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('location')}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
              title="Open Google Maps & Live Location"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Map & Live Location</span>
            </button>
          )}

          {/* Weather Chip (from sketch "Weather 26 Aug Rain") */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
            <CloudSun className="w-4 h-4 text-sky-600" />
            <span>28°C Rain forecast</span>
          </div>

          {/* Public / Private toggle (from Image 2 sketch) */}
          <button
            id="header-toggle-privacy-btn"
            onClick={handleTogglePrivacyMode}
            title="Toggle HR & Public Profile Visibility"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              effectivePublic
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {effectivePublic ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Public HR View</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Private</span>
              </>
            )}
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-200/60"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Recent Alerts</span>
                  <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Mark read</span>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                    <p className="font-semibold text-indigo-950">🔥 Rank Up Alert!</p>
                    <p className="text-slate-600 text-[11px]">You gained +60 XP from completing Marathon deep work.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                    <p className="font-semibold text-amber-950">⏰ 5:00 PM Client Sync</p>
                    <p className="text-slate-600 text-[11px]">Starts in 2 hours. Review your project demo slides.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="font-semibold text-slate-800">💬 Community: Sagar replied</p>
                    <p className="text-slate-600 text-[11px]">&quot;Verified the BIT Mesra team registration!&quot;</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Task Button */}
          <button
            id="quick-add-task-btn"
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
