import React from 'react';
import { Calendar, Check } from 'lucide-react';

interface RoutineCalendarSyncProps {
  onSync?: () => void;
  isSynced?: boolean;
}

export function RoutineCalendarSync({ onSync, isSynced = true }: RoutineCalendarSyncProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] text-xs">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[var(--primary)]" />
        <div>
          <span className="font-bold text-[var(--text)]">Calendar & Reminders</span>
          <p className="text-[10px] text-[var(--text-muted)]">Synchronized with Daily Care cycle</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSync}
        className="px-3 py-1.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--text)] font-bold transition flex items-center gap-1 border border-[var(--card-border)] cursor-pointer"
      >
        <Check className="w-3.5 h-3.5 text-emerald-500" />
        <span>{isSynced ? 'Synced ✓' : 'Sync'}</span>
      </button>
    </div>
  );
}
