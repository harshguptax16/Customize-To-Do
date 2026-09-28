import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, Tag, Sparkles } from 'lucide-react';
import { Task, PriorityLevel } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('work');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('10:00 AM');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [isPrior, setIsPrior] = useState(false);
  const [pointsReward, setPointsReward] = useState(50);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate);
      setDueTime(initialTask.dueTime || '10:00 AM');
      setPriority(initialTask.priority);
      setIsPrior(initialTask.isPrior);
      setPointsReward(initialTask.pointsReward);
      setTagInput(initialTask.tags ? initialTask.tags.join(', ') : '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setCategory('work');
      setDueDate(today);
      setDueTime('10:00 AM');
      setPriority('medium');
      setIsPrior(false);
      setPointsReward(50);
      setTagInput('');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSaveTask({
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      dueTime,
      priority,
      isPrior,
      completed: initialTask ? initialTask.completed : false,
      pointsReward: Number(pointsReward) || 50,
      tags: tags.length ? tags : ['Task'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {isPrior ? <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> : <Tag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {initialTask ? 'Edit Advance Task' : 'Add New Task / Event'}
              </h3>
              <p className="text-xs text-slate-500">Plan tasks with date, clock time, and priority ranking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task / Event Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SIH 2026 Hackathon Final Submission or 5:00 PM Meeting"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Milestone Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key deliverables, deliverables checklist, links..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Task['category'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="hackathon">⚡ Hackathon</option>
                <option value="work">💼 Work / Client</option>
                <option value="study">📚 Study & Tech</option>
                <option value="personal">🎯 Personal</option>
                <option value="family">🏡 Family</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="high">🔴 High Urgency</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Calendar Date & Clock Time (Features 1 & 2) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Calendar Date</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Clock Schedule Time</span>
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. 05:00 PM or 9am-11am"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Priority Star Toggle & XP Reward (Feature 3 & 4 from Sketch) */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrior}
                onChange={(e) => setIsPrior(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Star className={`w-3.5 h-3.5 ${isPrior ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                  Mark as Priority Event (Starred)
                </span>
                <p className="text-[11px] text-slate-500">Appears on Priority List & Home Work State</p>
              </div>
            </label>

            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">XP:</span>
              <input
                type="number"
                min="10"
                max="500"
                step="10"
                value={pointsReward}
                onChange={(e) => setPointsReward(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold text-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. SIH, Hackathon, Finals"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-task-submit-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
