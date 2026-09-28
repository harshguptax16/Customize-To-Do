import React, { useState } from 'react';
import {
  FileBarChart,
  Award,
  DollarSign,
  Briefcase,
  Linkedin,
  Mail,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Plus,
  Send,
  Sparkles,
  Eye,
  Lock,
} from 'lucide-react';
import { Milestone, ExpenseItem, UserProfile } from '../../types';

interface Props {
  profile: UserProfile;
  milestones: Milestone[];
  expenses: ExpenseItem[];
  isPublicMode: boolean;
  onTogglePublicMode: () => void;
  onAddMilestone: (m: Omit<Milestone, 'id'>) => void;
  onAddExpense: (exp: Omit<ExpenseItem, 'id'>) => void;
}

export const ReportsView: React.FC<Props> = ({
  profile,
  milestones,
  expenses,
  isPublicMode,
  onTogglePublicMode,
  onAddMilestone,
  onAddExpense,
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'expense' | 'hr-view'>('milestones');
  const [connectSent, setConnectSent] = useState(false);
  const [hrMessage, setHrMessage] = useState('');
  const [hrCompany, setHrCompany] = useState('');

  // Add Milestone Modal
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mDate, setMDate] = useState('2026-08');
  const [mCategory, setMCategory] = useState('Hackathon');
  const [mDescription, setMDescription] = useState('');

  // Add Expense Modal
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState<number>(500);
  const [expCategory, setExpCategory] = useState('Travel');
  const [expDate, setExpDate] = useState('2026-08-26');

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSendHRConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrMessage.trim()) return;
    setConnectSent(true);
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;
    onAddMilestone({
      title: mTitle.trim(),
      date: mDate,
      category: mCategory,
      description: mDescription.trim(),
      verified: true,
      badge: 'Certified',
    });
    setMTitle('');
    setMDescription('');
    setShowAddMilestone(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim()) return;
    onAddExpense({
      title: expTitle.trim(),
      amount: Number(expAmount),
      category: expCategory,
      date: expDate,
    });
    setExpTitle('');
    setShowAddExpense(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold backdrop-blur-xs">
            <Briefcase className="w-3.5 h-3.5 text-indigo-300" />
            <span>Public HR & Talent Portfolio</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Verified Reports & Achievements
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Where recruiters, hiring managers, and unknown visitors can inspect real milestone proofs, task track record, and connect like on LinkedIn.
          </p>
        </div>

        {/* Public vs Private Mode Toggle */}
        <div className="relative z-10 flex flex-col items-start md:items-end gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePublicMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPublicMode
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {isPublicMode ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isPublicMode ? 'Public Portfolio Active' : 'Private Sandbox'}</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            {isPublicMode ? 'Visible to HRs with public URL' : 'Only visible to you'}
          </span>
        </div>
      </div>

      {/* Blueprint Sub-Tabs: Milestones, Expense, Report Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'milestones'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Milestones & Badges</span>
          </button>

          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'expense'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Project & Travel Expense</span>
          </button>

          <button
            onClick={() => setActiveTab('hr-view')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hr-view'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>Recruiter Connect (LinkedIn Style)</span>
          </button>
        </div>

        {activeTab === 'milestones' && (
          <button
            onClick={() => setShowAddMilestone(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        )}

        {activeTab === 'expense' && (
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Expense</span>
          </button>
        )}
      </div>

      {/* TAB 1: MILESTONES (From Blueprint Sketch: Milestones) */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {m.date}
                    </span>
                    {m.verified && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-2.5">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {m.category}
                  </span>
                  <span className="font-bold text-slate-700">{m.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES (From Blueprint Sketch: Expense) */}
      {activeTab === 'expense' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Hackathon, Project & Travel Expenses
              </h3>
              <p className="text-xs text-slate-500">
                Keep an auditable record of logistical outlays for events and prototyping.
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Spent</span>
              <div className="text-xl font-black text-indigo-700 font-mono">
                ₹{totalExpense.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {expenses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                    ₹
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-600">{item.category}</span>
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black font-mono text-slate-900">
                  ₹{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HR VIEW (LinkedIn style connection & portfolio) */}
      {activeTab === 'hr-view' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card & Credibility Badges (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
              />
              <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Candidate
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{profile.name}</h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Full-Stack Software Engineer • Smart India Hackathon Finalist • BIT Mesra
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* LinkedIn-style quick stats */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-base font-black text-slate-900 font-mono">
                  {profile.tasksCompleted}
                </span>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Tasks Done
                </span>
              </div>
              <div>
                <span className="text-base font-black text-emerald-600 font-mono">
                  {profile.consistencyRate}%
                </span>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Consistency
                </span>
              </div>
              <div>
                <span className="text-base font-black text-indigo-600 font-mono">
                  #20
                </span>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Peer Rank
                </span>
              </div>
            </div>

            {/* Export Report / PDF Button */}
            <button
              onClick={() => {
                alert('Verified Performance Report downloaded as PDF.');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified Dossier (PDF)</span>
            </button>
          </div>

          {/* Connect / Message Form for Recruiter (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Connect or Inquire with {profile.name}
                </h3>
              </div>
              <span className="text-xs text-slate-400">Response within 24h</span>
            </div>

            {connectSent ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Connection Request Dispatched!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you! Your outreach note from <strong className="text-slate-800">{hrCompany || 'your company'}</strong> has been forwarded directly to {profile.name}&apos;s verified inbox.
                </p>
                <button
                  onClick={() => setConnectSent(false)}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendHRConnect} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Your Organization / Firm *
                    </label>
                    <input
                      type="text"
                      required
                      value={hrCompany}
                      onChange={(e) => setHrCompany(e.target.value)}
                      placeholder="e.g. Google, Microsoft, Tech Corp..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Inquiry Type
                    </label>
                    <select className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
                      <option>🚀 Full-time Software Engineering Role</option>
                      <option>💼 2026 Summer Internship</option>
                      <option>🤝 Hackathon Mentorship / Sponsorship</option>
                      <option>⚡ Freelance / Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Message / Pitch *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={hrMessage}
                    onChange={(e) => setHrMessage(e.target.value)}
                    placeholder="Hello Rahul, we reviewed your SIH 2026 milestones and consistency ratings on this portal. We would love to chat about..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Email will be verified automatically</span>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Connection Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Milestone or Achievement</h3>
            <p className="text-xs text-slate-500 mb-4">Add a verifiable record for recruiters and peers</p>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="e.g. 1st Place at State Hackathon"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date / Month</label>
                  <input
                    type="text"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    placeholder="e.g. Sep 2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={mCategory}
                    onChange={(e) => setMCategory(e.target.value)}
                    placeholder="e.g. Hackathon, Coding"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={mDescription}
                  onChange={(e) => setMDescription(e.target.value)}
                  placeholder="Key deliverables, score, prototype URL..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Log Project / Event Expense</h3>
            <p className="text-xs text-slate-500 mb-4">Track hackathon travel, food, or cloud servers</p>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g. Kolkata Hackathon Express Train Ticket"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    placeholder="e.g. Travel, Cloud, Food"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
