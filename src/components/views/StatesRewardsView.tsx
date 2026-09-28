import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Star,
  Flame,
  CheckCircle2,
  Circle,
  Gift,
  ArrowUp,
  Sparkles,
  Crown,
  Medal,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PeerRank, ChoreItem, UserProfile } from '../../types';

interface Props {
  peerRanks: PeerRank[];
  chores: ChoreItem[];
  profile: UserProfile;
  onToggleChore: (choreId: string) => void;
}

export const StatesRewardsView: React.FC<Props> = ({
  peerRanks,
  chores,
  profile,
  onToggleChore,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rank' | 'reward' | 'states'>('rank');
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('month');

  const handleClaimChore = (chore: ChoreItem) => {
    if (!chore.completed) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
    onToggleChore(chore.id);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Platinum':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Gold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Silver':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      default:
        return 'bg-amber-50 text-amber-900 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold backdrop-blur-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Peer Leaderboard & Chores Arena</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            States, Rewards & Peer Ranking
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
            Complete daily tasks and chores to earn XP, climb ranks among Sagar, Sonu, Harsh & friends, and unlock tier badges.
          </p>
        </div>

        {/* User Current Tier Snapshot */}
        <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-indigo-200">Your Current Rank</span>
          <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1.5 mt-0.5">
            <Crown className="w-5 h-5" />
            <span>#20 (Bronze)</span>
          </div>
          <span className="text-xs font-mono text-white/80">{profile.totalPoints} Total XP</span>
        </div>
      </div>

      {/* Blueprint Sub-Tabs: States, Reward, Rank */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('rank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'rank'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Peer Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reward')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'reward'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Chores & Rewards</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
              {chores.filter((c) => !c.completed).length} Available
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('states')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'states'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Tier Milestones</span>
          </button>
        </div>

        {/* Timeframe selector matching sketch (Day 1, Month 1, Year 1) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('day')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'day' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Day 1 (Rank 25)
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'month' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Month 1 (Rank 20)
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'year' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Year 1 (Excellent)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: LEADERBOARD (Directly matching sketch: Sagar Diamond #1, Jim #2, Sonu #3, Harsh #4, You #20) */}
      {activeSubTab === 'rank' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Squad & Peer Leaderboard ({timeframe === 'day' ? 'Today' : timeframe === 'month' ? 'This Month' : 'All Time'})
              </h3>
              <p className="text-xs text-slate-500">
                Rankings update automatically whenever chores and to-do milestones are checked off.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5" />
              You climbed +5 spots this month!
            </span>
          </div>

          <div className="space-y-2.5">
            {peerRanks.map((peer) => {
              const isUser = peer.isCurrentUser;
              return (
                <div
                  key={peer.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isUser
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Number with badge */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl font-black font-mono text-sm shrink-0">
                      {peer.rank === 1 ? (
                        <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">
                          🥇
                        </span>
                      ) : peer.rank === 2 ? (
                        <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-base">
                          🥈
                        </span>
                      ) : peer.rank === 3 ? (
                        <span className="w-8 h-8 rounded-xl bg-amber-700/20 text-amber-900 flex items-center justify-center text-base">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-500">#{peer.rank}</span>
                      )}
                    </div>

                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 truncate">
                          {peer.name} {isUser && '(You)'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getTierBadge(
                            peer.tier
                          )}`}
                        >
                          {peer.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>{peer.badge}</span>
                        <span>•</span>
                        <span>{peer.tasksDone} tasks done</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black font-mono text-indigo-700">
                      {peer.points}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                      XP Score
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CHORES & REWARDS */}
      {activeSubTab === 'reward' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Daily Chores & XP Bounties</h3>
              <p className="text-xs text-slate-500">
                Complete daily habit and productivity chores to harvest ranking XP.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile.totalPoints} Available XP</span>
            </div>
          </div>

          <div className="space-y-3">
            {chores.map((chore) => (
              <div
                key={chore.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  chore.completed
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleClaimChore(chore)}
                    className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    {chore.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold truncate ${
                          chore.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {chore.title}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {chore.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {chore.completed
                        ? `Claimed • Completed: ${chore.completedAt || 'Today'}`
                        : 'Tap to complete and claim XP points'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    +{chore.rewardXP} XP
                  </span>

                  {!chore.completed && (
                    <button
                      onClick={() => handleClaimChore(chore)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TIER MILESTONES */}
      {activeSubTab === 'states' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-2">
            <span className="text-2xl">👑</span>
            <h4 className="text-sm font-black text-cyan-950">Diamond Tier</h4>
            <p className="text-xs text-cyan-800">1,400+ XP. Held by Sagar (#1). Top 1% task execution.</p>
            <span className="inline-block text-[10px] font-bold text-cyan-900 bg-cyan-200/60 px-2 py-0.5 rounded-full">
              Crown Trophy
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <span className="text-2xl">⚡</span>
            <h4 className="text-sm font-black text-purple-950">Platinum Tier</h4>
            <p className="text-xs text-purple-800">1,100+ XP. Held by Jim (#2) & Sonu (#3).</p>
            <span className="inline-block text-[10px] font-bold text-purple-900 bg-purple-200/60 px-2 py-0.5 rounded-full">
              Speed Finisher
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="text-2xl">🎯</span>
            <h4 className="text-sm font-black text-amber-950">Gold Tier</h4>
            <p className="text-xs text-amber-800">800+ XP. Held by Harsh (#4). Next target for Rahul!</p>
            <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
              380 XP to Unlock
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-amber-100/50 border-2 border-amber-400 space-y-2">
            <span className="text-2xl">🚀</span>
            <h4 className="text-sm font-black text-amber-950">Bronze Tier (Current)</h4>
            <p className="text-xs text-amber-900">420 XP. Rahul Kr (#20). Rising Contender.</p>
            <span className="inline-block text-[10px] font-bold text-white bg-amber-700 px-2 py-0.5 rounded-full">
              Active Tier
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
