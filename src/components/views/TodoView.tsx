import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Timer as TimerIcon,
  Plus,
  Star,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trash2,
  Calendar,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, DailyScheduleEvent, PriorityLevel } from '../../types';

interface Props {
  tasks: Task[];
  dailySchedule: DailyScheduleEvent[];
  onToggleTask: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSchedule: (id: string) => void;
  onAddSchedule: (item: Omit<DailyScheduleEvent, 'id'>) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
}

export const TodoView: React.FC<Props> = ({
  tasks,
  dailySchedule,
  onToggleTask,
  onToggleStar,
  onDeleteTask,
  onToggleSchedule,
  onAddSchedule,
  onOpenAddTask,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'todo' | 'daily' | 'timer'>('todo');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Daily Routine modal state
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);
  const [routineTime, setRoutineTime] = useState('06:00 AM');
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineCategory, setRoutineCategory] = useState<DailyScheduleEvent['category']>('routine');

  // Timer / Focus Clock state (From Sketch: "00:00:00 Task: 2hrs marathon 9am-11am")
  const [timerSeconds, setTimerSeconds] = useState<number>(7200); // 2 hours = 7200 sec
  const [timerInitial, setTimerInitial] = useState<number>(7200);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedTimerTask, setSelectedTimerTask] = useState<string>(
    '2 hrs marathon 9am-11am (Core Feature Prep)'
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTimerPreset = (minutes: number, title: string) => {
    setIsTimerRunning(false);
    setTimerSeconds(minutes * 60);
    setTimerInitial(minutes * 60);
    setSelectedTimerTask(title);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags && task.tags.some((tg) => tg.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesPriority =
      filterPriority === 'all' ||
      (filterPriority === 'starred' ? task.isPrior : task.priority === filterPriority);

    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;

    return matchesSearch && matchesPriority && matchesCategory;
  });

  const handleTaskCheck = (taskId: string, currentCompleted: boolean) => {
    if (!currentCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
    onToggleTask(taskId);
  };

  const handleAddRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle.trim()) return;

    onAddSchedule({
      time: routineTime,
      title: routineTitle.trim(),
      category: routineCategory,
      enabled: true,
      durationMinutes: 45,
    });

    setRoutineTitle('');
    setShowAddRoutineModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & 3-Tab Navigator from Blueprint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <span>Advance Task & Clock System</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage daily schedule, mark starred priority milestones, and track focus marathons.
          </p>
        </div>

        {/* 3 Main Tabs: ToDo, Daily Events, Timer */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            id="tab-todo-tasks"
            onClick={() => setActiveTab('todo')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'todo'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>ToDo List</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700">
              {tasks.filter((t) => !t.completed).length}
            </span>
          </button>

          <button
            id="tab-daily-events"
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'daily'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Events Clock</span>
          </button>

          <button
            id="tab-timer-clock"
            onClick={() => setActiveTab('timer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timer'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TimerIcon className="w-3.5 h-3.5" />
            <span>Focus Timer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TODO LIST */}
      {activeTab === 'todo' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                Filter:
              </span>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Priorities</option>
                <option value="starred">⭐ Starred Only</option>
                <option value="high">🔴 High Urgency</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="hackathon">⚡ Hackathon</option>
                <option value="work">💼 Work / Client</option>
                <option value="personal">🎯 Personal</option>
                <option value="family">🏡 Family</option>
                <option value="study">📚 Study</option>
              </select>
            </div>

            <button
              id="add-task-todo-view-btn"
              onClick={onOpenAddTask}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Hint from sketch: "Right click or D-check for prior" */}
          <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>
                <strong>Blueprint Tip:</strong> Click the Star icon on any task to promote it to the{' '}
                <strong>Priority List</strong> & earn extra peer ranking XP upon completion.
              </span>
            </div>
          </div>

          {/* Task Items */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No tasks found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your search or click &quot;Add Task&quot; to plan your schedule.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200/90 hover:border-indigo-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => handleTaskCheck(task.id, task.completed)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.isPrior && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            Priority
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : task.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p
                          className={`text-xs mt-1 ${
                            task.completed ? 'text-slate-400 line-through' : 'text-slate-600'
                          }`}
                        >
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {task.dueDate}
                        </span>
                        {task.dueTime && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.dueTime}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-indigo-600 font-bold">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          +{task.pointsReward} XP Reward
                        </span>

                        {task.tags &&
                          task.tags.map((tg, i) => (
                            <span
                              key={i}
                              className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px]"
                            >
                              #{tg}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {/* Star Priority Button */}
                    <button
                      onClick={() => onToggleStar(task.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Toggle Priority Star"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          task.isPrior
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 group-hover:text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Delete Task */}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY EVENTS (Clock daily schedule from sketch) */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Daily Clock Schedule (From-To)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle routines on or off to adjust daily time blocking.
              </p>
            </div>
            <button
              onClick={() => setShowAddRoutineModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Routine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dailySchedule.map((routine) => (
              <div
                key={routine.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  routine.enabled
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-50/80 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xs ${
                      routine.enabled
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{routine.time.split(' ')[0]}</span>
                    <span className="text-[9px] uppercase">{routine.time.split(' ')[1]}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {routine.title}
                    </h4>
                    {routine.description && (
                      <p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">
                        {routine.description}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                      {routine.durationMinutes ? `${routine.durationMinutes} min block` : 'Routine'}
                    </span>
                  </div>
                </div>

                {/* Toggle Switch (From Blueprint Sketch: Toggle Pill) */}
                <button
                  onClick={() => onToggleSchedule(routine.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    routine.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      routine.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Add Routine Modal */}
          {showAddRoutineModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-1">Add Daily Schedule Routine</h3>
                <p className="text-xs text-slate-500 mb-4">Set regular clock intervals for work, meals, or workouts</p>

                <form onSubmit={handleAddRoutineSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time (From)</label>
                    <input
                      type="text"
                      required
                      value={routineTime}
                      onChange={(e) => setRoutineTime(e.target.value)}
                      placeholder="e.g. 06:00 AM or 02:00 PM"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={routineTitle}
                      onChange={(e) => setRoutineTitle(e.target.value)}
                      placeholder="e.g. Evening Gym & Jogging"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      value={routineCategory}
                      onChange={(e) => setRoutineCategory(e.target.value as DailyScheduleEvent['category'])}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="routine">Routine</option>
                      <option value="work">Deep Work</option>
                      <option value="meal">Meal</option>
                      <option value="health">Fitness</option>
                      <option value="leisure">Leisure</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRoutineModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Add to Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TIMER (From Blueprint Sketch: "00:00:00 Task: 2hrs marathon 9am-11am") */}
      {activeTab === 'timer' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              <Zap className="w-3.5 h-3.5" />
              Deep Focus Clock Engine
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              Focus Clock & Marathon Stopwatch
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Active Task: <strong className="text-indigo-600">{selectedTimerTask}</strong>
            </p>
          </div>

          {/* Big Digital Display matching Sketch: "00:00:00" */}
          <div className="p-8 rounded-3xl bg-slate-950 text-white font-mono shadow-inner border border-slate-800">
            <div className="text-5xl sm:text-7xl font-black tracking-wider text-indigo-400 drop-shadow-md">
              {formatTimer(timerSeconds)}
            </div>
            <div className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isTimerRunning ? 'Timer Active & Running' : 'Paused / Ready'}</span>
            </div>
          </div>

          {/* Action Buttons: Play/Pause/Reset */}
          <div className="flex items-center justify-center gap-4">
            <button
              id="timer-toggle-btn"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Focus Marathon</span>
                </>
              )}
            </button>

            <button
              id="timer-reset-btn"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(timerInitial);
              }}
              className="p-3 text-slate-600 hover:text-slate-900 rounded-2xl hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Presets matching sketch's 2hrs marathon */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Focus Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => setTimerPreset(120, '2 hrs marathon 9am-11am')}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-900 font-bold transition-colors"
              >
                2 Hrs Marathon
              </button>
              <button
                onClick={() => setTimerPreset(60, '1 hr Deep Coding & API Sprint')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
              >
                60 Min Deep Work
              </button>
              <button
                onClick={() => setTimerPreset(45, '45 min Hackathon Slide Deck')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
              >
                45 Min Sprint
              </button>
              <button
                onClick={() => setTimerPreset(25, '25 min Pomodoro Quick Burst')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
              >
                25 Min Pomodoro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
