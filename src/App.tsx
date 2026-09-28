/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { TodoView } from './components/views/TodoView';
import { PriorityView } from './components/views/PriorityView';
import { CalendarView } from './components/views/CalendarView';
import { StatesRewardsView } from './components/views/StatesRewardsView';
import { CommunityView } from './components/views/CommunityView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { LocationMapView } from './components/views/LocationMapView';
import { TaskModal } from './components/TaskModal';

import {
  initialProfile,
  initialTasks,
  initialDailySchedule,
  initialCalendarEvents,
  initialPeerRanks,
  initialChores,
  initialChannels,
  initialMembers,
  initialChatMessages,
  initialWeatherData,
  initialMilestones,
  initialExpenses,
} from './data/initialData';

import {
  Task,
  DailyScheduleEvent,
  CalendarEvent,
  PeerRank,
  ChoreItem,
  ChatMessage,
  Milestone,
  ExpenseItem,
  UserProfile,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('portal_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('portal_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [dailySchedule, setDailySchedule] = useState<DailyScheduleEvent[]>(() => {
    const saved = localStorage.getItem('portal_schedule');
    return saved ? JSON.parse(saved) : initialDailySchedule;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('portal_events');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [peerRanks, setPeerRanks] = useState<PeerRank[]>(initialPeerRanks);
  const [chores, setChores] = useState<ChoreItem[]>(initialChores);
  const [channels, setChannels] = useState(initialChannels);
  const [members] = useState(initialMembers);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [weatherData] = useState(initialWeatherData);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  // Client-Side Quota Defense listener for Google Maps
  useEffect(() => {
    const handleQuota = () => setIsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('portal_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('portal_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portal_schedule', JSON.stringify(dailySchedule));
  }, [dailySchedule]);

  useEffect(() => {
    localStorage.setItem('portal_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Handlers for Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const willComplete = !t.completed;
          // If task completed, increment user points and completed counter
          if (willComplete) {
            setProfile((p) => ({
              ...p,
              totalPoints: p.totalPoints + t.pointsReward,
              tasksCompleted: p.tasksCompleted + 1,
            }));
            // Update current user rank in peer list
            setPeerRanks((ranks) =>
              ranks.map((r) =>
                r.isCurrentUser ? { ...r, points: r.points + t.pointsReward, tasksDone: r.tasksDone + 1 } : r
              )
            );
          }
          return { ...t, completed: willComplete };
        }
        return t;
      })
    );
  };

  const handleToggleStar = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isPrior: !t.isPrior } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, ...taskData } : t
        )
      );
      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Handlers for Daily Schedule Routine
  const handleToggleSchedule = (id: string) => {
    setDailySchedule((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleAddSchedule = (item: Omit<DailyScheduleEvent, 'id'>) => {
    const newRoutine: DailyScheduleEvent = {
      ...item,
      id: `sched-${Date.now()}`,
    };
    setDailySchedule((prev) => [...prev, newRoutine]);
  };

  // Handlers for Chores & Rewards
  const handleToggleChore = (choreId: string) => {
    setChores((prev) =>
      prev.map((c) => {
        if (c.id === choreId && !c.completed) {
          setProfile((p) => ({
            ...p,
            totalPoints: p.totalPoints + c.rewardXP,
            currentStreak: p.currentStreak + 1,
          }));
          setPeerRanks((ranks) =>
            ranks.map((r) =>
              r.isCurrentUser ? { ...r, points: r.points + c.rewardXP } : r
            )
          );
          return {
            ...c,
            completed: true,
            completedAt: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );
  };

  // Calendar Event handler
  const handleAddCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  // Community Chat handler
  const handleSendMessage = (channelId: string, text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: 'user-rahul',
      senderName: profile.name,
      text,
      timestamp: timeStr,
      isUser: true,
    };

    setChatMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));

    // Update last message in channels list
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId ? { ...ch, lastMessage: text, lastMessageTime: timeStr } : ch
      )
    );

    // Simulate smart auto-reply from squadmate after 1.5s
    setTimeout(() => {
      const peerReplies = [
        'Awesome! Marked on my schedule as well.',
        'Good catch Rahul. Let us review this in our 5:00 PM sprint sync.',
        'Great progress! Keep logging chores to hold that leaderboard spot.',
        'Confirmed. I will push the updated hackathon slides to our repo shortly.',
      ];
      const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];
      const replyMsg: ChatMessage = {
        id: `msg-peer-${Date.now()}`,
        channelId,
        senderId: 'peer-sagar',
        senderName: 'Sagar (Diamond #1)',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      setChatMessages((prev) => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), replyMsg],
      }));
    }, 1500);
  };

  // Milestone & Expense Handlers
  const handleAddMilestone = (m: Omit<Milestone, 'id'>) => {
    const newM: Milestone = {
      ...m,
      id: `m-${Date.now()}`,
    };
    setMilestones((prev) => [newM, ...prev]);
  };

  const handleAddExpense = (exp: Omit<ExpenseItem, 'id'>) => {
    const newExp: ExpenseItem = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex antialiased selection:bg-indigo-500 selection:text-white">
      {/* Responsive Left Navigation Sidebar (From Blueprint) */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }}
        profile={profile}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingTasksCount={tasks.filter((t) => !t.completed).length}
        priorityCount={tasks.filter((t) => t.isPrior || t.priority === 'high').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Two-Tier In-App Quota Handling Banner */}
        {isQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Top Header Bar */}
        <Header
          profile={profile}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isPublicMode={isPublicMode}
          onTogglePublicMode={() => setIsPublicMode(!isPublicMode)}
          onOpenAddTask={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={3}
          onNavigate={(tab) => setCurrentTab(tab)}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'home' && (
            <HomeView
              profile={profile}
              tasks={tasks}
              calendarEvents={calendarEvents}
              weatherData={weatherData}
              onToggleTask={handleToggleTask}
              onToggleStar={handleToggleStar}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'todo' && (
            <TodoView
              tasks={tasks}
              dailySchedule={dailySchedule}
              onToggleTask={handleToggleTask}
              onToggleStar={handleToggleStar}
              onDeleteTask={handleDeleteTask}
              onToggleSchedule={handleToggleSchedule}
              onAddSchedule={handleAddSchedule}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'priority' && (
            <PriorityView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onToggleStar={handleToggleStar}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              calendarEvents={calendarEvents}
              tasks={tasks}
              onAddEvent={handleAddCalendarEvent}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onNavigateToMap={() => setCurrentTab('location')}
            />
          )}

          {currentTab === 'location' && (
            <LocationMapView
              calendarEvents={calendarEvents}
              profile={profile}
              onAddEvent={handleAddCalendarEvent}
              onNavigateToCalendar={() => setCurrentTab('calendar')}
            />
          )}

          {currentTab === 'states' && (
            <StatesRewardsView
              peerRanks={peerRanks}
              chores={chores}
              profile={profile}
              onToggleChore={handleToggleChore}
            />
          )}

          {currentTab === 'community' && (
            <CommunityView
              channels={channels}
              members={members}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'report' && (
            <ReportsView
              profile={profile}
              milestones={milestones}
              expenses={expenses}
              isPublicMode={isPublicMode}
              onTogglePublicMode={() => setIsPublicMode(!isPublicMode)}
              onAddMilestone={handleAddMilestone}
              onAddExpense={handleAddExpense}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView profile={profile} onUpdateProfile={handleUpdateProfile} />
          )}
        </main>
      </div>

      {/* Advance Task Creation / Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
}
