import React from 'react';
import { CustomRoutine } from '../../types';
import { Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';

interface RoutineSummaryProps {
  routine: CustomRoutine;
}

export function RoutineSummary({ routine }: RoutineSummaryProps) {
  const itemCount = routine.items?.length || 0;
  const highPriorityCount = routine.items?.filter((i) => i.priority === 'high').length || 0;

  return (
    <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
          style={{ backgroundColor: `${routine.accent || '#3b82f6'}20`, color: routine.accent || '#3b82f6' }}
        >
          {routine.icon || '🐾'}
        </div>
        <div>
          <h4 className="text-sm font-heading font-bold text-[var(--text)]">
            {routine.name}
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            {routine.description || 'Custom daily care schedule'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--card-border)] text-center">
        <div className="p-2 rounded-2xl bg-[var(--background-alt)]">
          <div className="text-xs font-bold text-[var(--text)]">{itemCount}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Activities</div>
        </div>
        <div className="p-2 rounded-2xl bg-[var(--background-alt)]">
          <div className="text-xs font-bold text-[var(--text)]">{highPriorityCount}</div>
          <div className="text-[10px] text-[var(--text-muted)]">High Priority</div>
        </div>
        <div className="p-2 rounded-2xl bg-[var(--background-alt)]">
          <div className="text-xs font-bold text-[var(--text)]">{routine.active ? 'Active' : 'Paused'}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Status</div>
        </div>
      </div>
    </div>
  );
}
