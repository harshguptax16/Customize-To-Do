import React from 'react';
import {
  Home,
  CheckSquare,
  Star,
  Calendar,
  Award,
  Users,
  MapPin,
  FileBarChart2,
  Settings,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'home'
  | 'todo'
  | 'priority'
  | 'calendar'
  | 'states'
  | 'community'
  | 'location'
  | 'report'
  | 'settings';

interface Props {
  activeTab: NavTab;
  setActiveTab?: (tab: NavTab) => void;
  onSelectTab?: (tab: NavTab) => void;
  profile: UserProfile;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
  onCloseMobile?: () => void;
  pendingTasksCount?: number;
  priorityCount?: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  profile,
  isOpenMobile = false,
  setIsOpenMobile,
  onCloseMobile,
  pendingTasksCount = 0,
  priorityCount = 0,
}) => {
  const handleCloseMobile = () => {
    if (onCloseMobile) onCloseMobile();
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'todo', label: 'To-do & Clock', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'priority', label: 'Priority List', icon: Star, badge: priorityCount > 0 ? `${priorityCount} Star` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'states', label: 'States & Rewards', icon: Award, badge: 'Rank #20', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'community', label: 'Community', icon: Users, badge: '4 online', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'location', label: 'Location & Map', icon: MapPin },
    { id: 'report', label: 'Report & Portfolio', icon: FileBarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: NavTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
    handleCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={handleCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding & Close on Mobile */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-tight">
                Advance To-Do
              </h1>
              <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <span>Task & Life Planner</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </p>
            </div>
          </div>
          <button
            id="close-sidebar-mobile"
            onClick={handleCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card as shown in Blueprint ("Rahul Kr Edit", Portfolio preview) */}
        <div className="p-3.5 mx-3 my-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm truncate">{profile.name}</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-sm">
                  Bronze
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{profile.title}</p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Daily Streak:</span>
            <span className="font-bold text-orange-600 flex items-center gap-1">
              🔥 {profile.currentStreak} Days
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Chore Points:</span>
            <span className="font-bold text-indigo-600">{profile.totalPoints} XP</span>
          </div>

          <button
            id="quick-portfolio-link"
            onClick={() => handleSelect('report')}
            className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-200/70 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>View Public Portfolio</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Helper Banner */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/50 p-2.5 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>SIH 2026 Milestone</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              82% tasks completed for upcoming regional pitch.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
