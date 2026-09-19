import React from 'react';
import { Flame, Award, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { ScheduledRoutineItem } from '../../types';

interface RoutineStatsProps {
  items: ScheduledRoutineItem[];
  streakDays?: number;
  weeklyCompleted?: number;
  weeklyTotal?: number;
}

export function RoutineStats({
  items,
  streakDays = 6,
  weeklyCompleted = 32,
  weeklyTotal = 40,
}: RoutineStatsProps) {
  const completedToday = items.filter((i) => i.status === 'completed').length;
  const totalToday = items.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const nextActivity = items.find((i) => i.status !== 'completed');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Today Progress */}
      <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Today's Progress</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl font-heading font-black text-[var(--text)]">
          {completedToday} / {totalToday}
        </div>
        <div className="w-full bg-[var(--background-alt)] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Weekly Score */}
      <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Weekly</span>
          <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
        </div>
        <div className="text-xl font-heading font-black text-[var(--text)]">
          {weeklyCompleted} / {weeklyTotal}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-medium">
          {Math.round((weeklyCompleted / weeklyTotal) * 100)}% completion rate
        </div>
      </div>

      {/* Care Streak */}
      <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Current Streak</span>
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
        <div className="text-xl font-heading font-black text-[var(--text)]">
          {streakDays} days
        </div>
        <div className="text-[10px] text-amber-600 font-bold">
          Active daily rhythm 🔥
        </div>
      </div>

      {/* Next Up */}
      <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Next Activity</span>
          <Calendar className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-xs font-bold text-[var(--text)] truncate">
          {nextActivity ? `${nextActivity.item.title}` : 'All complete! 🎉'}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-mono">
          {nextActivity ? nextActivity.item.scheduledTime : 'Rest time'}
        </div>
      </div>
    </div>
  );
}
