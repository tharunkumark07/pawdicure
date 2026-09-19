import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RoutineProgressProps {
  completed: number;
  total: number;
  label?: string;
}

export function RoutineProgress({ completed, total, label = "Today's Care Progress" }: RoutineProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-[var(--text)]">{label}</span>
        </div>
        <span className="text-xs font-mono font-bold text-[var(--primary)]">
          {completed} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-[var(--background-alt)] rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[var(--primary)] to-emerald-500 h-full transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
