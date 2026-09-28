import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CloudSun,
  FileBarChart,
  Star,
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  Bot,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';
import { Task, CalendarEvent, UserProfile, WeatherDay } from '../../types';
import { WorkStatsDonut } from '../WorkStatsDonut';
import { WeekStatsChart } from '../WeekStatsChart';
import { NavTab } from '../Sidebar';

interface Props {
  profile: UserProfile;
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  weatherData: WeatherDay[];
  onToggleTask: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
}

export const HomeView: React.FC<Props> = ({
  profile,
  tasks,
  calendarEvents,
  weatherData,
  onToggleTask,
  onToggleStar,
  onNavigate,
  onOpenAddTask,
  searchQuery,
}) => {
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Break down SIH Hackathon presentation into 3 micro-milestones',
    'Set optimal daily deep-work clock block from 9:00 AM to 11:00 AM',
    'Review pending chores to climb into Gold Tier rank',
  ]);

  // Filter tasks based on search
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priorityTasks = filteredTasks.filter((t) => t.isPrior || t.priority === 'high');
  const upcomingEvents = calendarEvents.slice(0, 3);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Streak: {profile.currentStreak} Consecutive Days</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Plan, Prioritize & Win Every Day
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
            Stay on track for upcoming SIH finals & Kolkata Hackathon. Clock your daily routines, mark priority events, and earn XP to rank on the peer leaderboard.
          </p>
        </div>

        <div className="relative z-10 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-indigo-200 font-medium block">Peer Tier</span>
            <span className="text-lg font-black text-amber-300 flex items-center gap-1.5 sm:justify-end">
              <Award className="w-5 h-5" />
              Bronze Rank #20
            </span>
          </div>
          <button
            onClick={() => onNavigate('states')}
            className="px-3.5 py-1.5 rounded-xl bg-white text-indigo-900 text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Leaderboard →
          </button>
        </div>
      </div>

      {/* 4 Category Buttons (Direct from Home Page Sketch) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Schedule */}
        <button
          id="cat-schedule-btn"
          onClick={() => onNavigate('todo')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all group text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-600">
              Schedule & Clock
            </span>
            <span className="text-[11px] text-slate-500">6 Daily Routines</span>
          </div>
        </button>

        {/* Weather */}
        <button
          id="cat-weather-btn"
          onClick={() => setShowWeatherModal(true)}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all group text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-600">
              Weather Forecast
            </span>
            <span className="text-[11px] text-slate-500">25–31 Aug Live</span>
          </div>
        </button>

        {/* Reports */}
        <button
          id="cat-reports-btn"
          onClick={() => onNavigate('report')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-600">
              Reports & HRs
            </span>
            <span className="text-[11px] text-slate-500">Milestones & Connect</span>
          </div>
        </button>

        {/* Prior Task */}
        <button
          id="cat-prior-task-btn"
          onClick={() => onNavigate('priority')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all group text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 fill-purple-200" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-600">
              Prior Task
            </span>
            <span className="text-[11px] text-slate-500">{priorityTasks.length} Starred Items</span>
          </div>
        </button>
      </div>

      {/* Main Grid: Left (Events & Work State) + Right (Portfolio Sidebar Panel from Sketch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Events Section (from Sketch: 2 October 2026 Hackathon, 25 Dec 2026 Trip Plan) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Key Events & Milestones</h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Event 1: 2 October 2026 Hackathon */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                      National Hackathon
                    </span>
                    <span className="text-xs font-mono text-slate-500">2 Oct 2026</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    Kolkata Mega Hackathon
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    Science City Convention Hall
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-indigo-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status: In Preparation</span>
                  <span className="font-bold text-indigo-700">Team Registered</span>
                </div>
              </div>

              {/* Event 2: 25 Dec 2026 Trip Plan */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                      Vacation / Leisure
                    </span>
                    <span className="text-xs font-mono text-slate-500">25 Dec 2026</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    Goa Year-End Trip Plan
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    Coastal Circuit Resort
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status: Planning</span>
                  <span className="font-bold text-amber-700">Budgeting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work State (Current) - Trend Line & Tasks Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Work State (Current Trend)</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {progressPercent}% Complete Today
              </span>
            </div>

            {/* Quick Starred & Priority Tasks Checklist */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <span>Priority Focus Items</span>
                <button
                  onClick={onOpenAddTask}
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </button>
              </div>

              {priorityTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.isPrior && (
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{task.dueDate}</span>
                        {task.dueTime && <span>• {task.dueTime}</span>}
                        <span className="font-semibold text-indigo-600 font-mono">+{task.pointsReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => onToggleStar(task.id)}
                      className="p-1 rounded hover:bg-slate-100"
                      title="Toggle Priority Star"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          task.isPrior ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) - "Portfolio" Sidebar Column from Sketch */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            {/* Header: Portfolio & Rahul Kr Edit */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm">{profile.name}</h4>
                    <button
                      onClick={() => onNavigate('settings')}
                      className="text-[10px] text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200"
                    >
                      Edit
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block">SDE & Hackathon Finalist</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('report')}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"
              >
                <span>Report</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Donut Chart: "Current Work Stats:" (From Sketch) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Current Work Stats
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">26 Aug</span>
              </div>
              <WorkStatsDonut dateLabel="26 Aug" compact={true} />
            </div>

            {/* Line Chart: "Day/Week Stats:" (From Sketch: 23, 24, 25, 26, 27, 28) */}
            <div className="pt-2 border-t border-slate-100">
              <WeekStatsChart />
            </div>

            {/* Month Milestones: "Month: SIH 82% Done, Eto" (From Sketch) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Month Progress
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  82% SIH Done
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span className="font-semibold">SIH 2026 Pitch Prototype</span>
                    <span className="font-bold text-emerald-600">82%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: '82%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span className="font-semibold">BIT Hackathon Registration</span>
                    <span className="font-bold text-indigo-600">65%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI / Smart Assistant button from sketch ("Ask me anything") */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="ask-assistant-bubble-btn"
          onClick={() => setShowAiHelper(!showAiHelper)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl border border-slate-700 hover:scale-105 transition-all text-xs font-bold"
        >
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>Ask me anything!</span>
        </button>

        {showAiHelper && (
          <div className="absolute bottom-12 right-0 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold">Advance Task Planner AI</span>
              </div>
              <button
                onClick={() => setShowAiHelper(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Need to optimize your daily routine or organize hackathon chores?
            </p>

            <div className="space-y-1.5 mb-3">
              {aiSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiPrompt(sug);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 text-[11px] text-indigo-900 font-medium transition-colors"
                >
                  ⚡ {sug}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask to reschedule or prioritize..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  if (!aiPrompt.trim()) return;
                  setAiSuggestions((prev) => [
                    `Plan created for: "${aiPrompt.trim()}" (Added to schedule)`,
                    ...prev.slice(0, 2),
                  ]);
                  setAiPrompt('');
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Weather Forecast Modal from Sketch (25, 26, 27, 28, 29, 30, 31) */}
      {showWeatherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Weather & Event Horizon (25–31 Aug)</h3>
              </div>
              <button
                onClick={() => setShowWeatherModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2">
              Synchronized with your outdoor events and travel schedule as outlined in your blueprint.
            </p>

            <div className="grid grid-cols-7 gap-2 mt-4 text-center">
              {weatherData.map((item) => (
                <div
                  key={item.day}
                  className={`p-2 rounded-xl border flex flex-col items-center ${
                    item.hasEvent
                      ? 'bg-amber-50 border-amber-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {item.day} Aug
                  </span>
                  <span className="text-xl my-1">
                    {item.condition === 'rainy' ? '🌧️' : item.condition === 'cloudy' ? '⛅' : '☀️'}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{item.tempC}°C</span>
                  {item.hasEvent && (
                    <span className="mt-1 text-[9px] font-bold text-amber-800 bg-amber-200/70 px-1 rounded-sm leading-tight">
                      Event
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">Event Notice for 26 Aug:</p>
              <p className="text-slate-600 mt-0.5">
                Light rain expected during afternoon Rakhi celebration. Pack umbrella for local commute.
              </p>
            </div>

            <button
              onClick={() => setShowWeatherModal(false)}
              className="mt-4 w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              Close Weather Forecast
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
