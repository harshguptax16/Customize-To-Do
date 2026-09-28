import React from 'react';
import {
  Star,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { Task } from '../../types';

interface Props {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
}

export const PriorityView: React.FC<Props> = ({
  tasks,
  onToggleTask,
  onToggleStar,
  onOpenAddTask,
  searchQuery,
}) => {
  const priorityTasks = tasks.filter(
    (t) =>
      (t.isPrior || t.priority === 'high') &&
      (t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>High Stakes & Important Milestones</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Priority List & Starred Events</h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
            Critical events drawn from your blueprint: SIH BIT on-site presentation, Kolkata Hackathon, and client syncs.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Priority Event</span>
        </button>
      </div>

      {/* Blueprint Highlight Cards: 20 Sep 26 SIH BIT & 3 Oct 26 Kolkata Hack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
              20 Sep 2026
            </span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>

          <h3 className="text-lg font-black text-slate-900 mt-3">
            SIH BIT Mesra Hackathon
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Smart India Hackathon internal finals presentation and live system architecture evaluation.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Tier: National Level</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              82% Prepared
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-lg">
              03 Oct 2026
            </span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>

          <h3 className="text-lg font-black text-slate-900 mt-3">
            Kolkata Mega Hackathon
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Inter-state software sprint with 150+ teams at Science City Kolkata convention hall.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Tier: Grand Prix</span>
            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Team Enrolled
            </span>
          </div>
        </div>
      </div>

      {/* Priority Tasks List */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            All Starred & High-Priority Tasks ({priorityTasks.length})
          </h3>
          <span className="text-xs text-slate-500">
            Ordered by urgency & milestone impact
          </span>
        </div>

        {priorityTasks.length === 0 ? (
          <div className="text-center py-10">
            <Star className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No starred priority tasks found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {priorityTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : 'bg-gradient-to-r from-white via-white to-amber-50/30 border-amber-200/80 shadow-2xs hover:border-amber-400'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-extrabold truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-600 mt-1 max-w-xl">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1 font-mono text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        Due: {task.dueDate}
                      </span>
                      {task.dueTime && (
                        <span className="flex items-center gap-1 font-mono text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {task.dueTime}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-bold text-amber-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        +{task.pointsReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => onToggleStar(task.id)}
                    className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                    title="Toggle Star Priority"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
