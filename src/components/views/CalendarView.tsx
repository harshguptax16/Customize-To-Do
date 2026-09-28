import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  Sparkles,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { CalendarEvent, Task } from '../../types';

interface Props {
  calendarEvents: CalendarEvent[];
  tasks: Task[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onOpenAddTask: () => void;
  onNavigateToMap?: () => void;
}

export const CalendarView: React.FC<Props> = ({
  calendarEvents,
  tasks,
  onAddEvent,
  onOpenAddTask,
  onNavigateToMap,
}) => {
  // Current view month: 2026-08 or 2026-09 or 2026-10
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 7 = August (0-indexed), matching sketch
  const [selectedDate, setSelectedDate] = useState('2026-08-26');
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-08-26');
  const [eventType, setEventType] = useState<CalendarEvent['type']>('hackathon');
  const [eventLocation, setEventLocation] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar Math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    onAddEvent({
      title: eventTitle.trim(),
      date: eventDate,
      type: eventType,
      location: eventLocation.trim() || undefined,
      notes: eventNotes.trim() || undefined,
      status: 'upcoming',
    });

    setEventTitle('');
    setEventLocation('');
    setEventNotes('');
    setShowAddEventModal(false);
  };

  // Filter events and tasks for the selected date
  const eventsOnSelectedDate = calendarEvents.filter((ev) => ev.date === selectedDate);
  const tasksOnSelectedDate = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span>Event Calendar & Schedule Planner</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark dates of key events, hackathons, and family celebrations as drawn in your blueprint.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
            >
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>View All on Map</span>
            </button>
          )}

          <button
            onClick={() => setShowAddEventModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Mark New Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (7 or 8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-slate-900">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {calendarEvents.filter((e) => e.date.startsWith(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`)).length} Events
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(7); // Aug 2026
                }}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
              >
                Aug 2026
              </button>
              <button
                onClick={nextMonth}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2 border-y border-slate-100">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 p-1 rounded-xl bg-slate-50/40 opacity-30" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const dayEvents = calendarEvents.filter((ev) => ev.date === dateStr);
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 sm:h-24 p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30'
                      : dayEvents.length > 0
                      ? 'border-indigo-200 bg-white hover:border-indigo-400'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : dayEvents.length > 0
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayTasks.length}t
                      </span>
                    )}
                  </div>

                  {/* Badges / Chips */}
                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[10px] font-bold truncate px-1.5 py-0.5 rounded ${
                          ev.type === 'hackathon'
                            ? 'bg-indigo-100 text-indigo-900'
                            : ev.type === 'festival'
                            ? 'bg-amber-100 text-amber-900'
                            : ev.type === 'trip'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel for Selected Date */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Selected Date
                </span>
                <h4 className="text-base font-black text-slate-900">{selectedDate}</h4>
              </div>

              <button
                onClick={() => {
                  setEventDate(selectedDate);
                  setShowAddEventModal(true);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mark Event</span>
              </button>
            </div>

            {/* Events on this date */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Events ({eventsOnSelectedDate.length})
              </span>

              {eventsOnSelectedDate.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No events marked for this date.</p>
              ) : (
                <div className="space-y-2">
                  {eventsOnSelectedDate.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{ev.title}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-700">
                          {ev.type}
                        </span>
                      </div>
                      {ev.location && (
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <p className="text-slate-600 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </p>
                          {onNavigateToMap && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToMap();
                              }}
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold shrink-0 ml-1 hover:underline"
                            >
                              Map ↗
                            </button>
                          )}
                        </div>
                      )}
                      {ev.notes && <p className="text-slate-500 text-[11px]">{ev.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks due on this date */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Tasks Scheduled ({tasksOnSelectedDate.length})
              </span>

              {tasksOnSelectedDate.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tasks due on this date.</p>
              ) : (
                <div className="space-y-2">
                  {tasksOnSelectedDate.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span className={`font-semibold truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{t.dueTime || 'All Day'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Mark Calendar Event</h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule a hackathon, festival, trip, or milestone date
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Kolkata Mega Hackathon Finals"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as CalendarEvent['type'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="hackathon">⚡ Hackathon</option>
                    <option value="festival">🎉 Festival</option>
                    <option value="trip">✈️ Trip Plan</option>
                    <option value="meeting">🤝 Meeting</option>
                    <option value="milestone">🎯 Milestone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Science City, Kolkata or BIT Auditorium"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  placeholder="Team roster, gear checklist, presentation link..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
