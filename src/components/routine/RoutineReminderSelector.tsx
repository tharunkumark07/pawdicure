import React from 'react';
import { Bell } from 'lucide-react';

interface RoutineReminderSelectorProps {
  enabled: boolean;
  offsetMinutes: number;
  onToggle: (enabled: boolean) => void;
  onChangeOffset: (offset: number) => void;
}

const OFFSETS = [
  { label: 'At scheduled time', value: 0 },
  { label: '5 min before', value: 5 },
  { label: '10 min before', value: 10 },
  { label: '15 min before', value: 15 },
  { label: '30 min before', value: 30 },
];

export function RoutineReminderSelector({
  enabled,
  offsetMinutes,
  onToggle,
  onChangeOffset,
}: RoutineReminderSelectorProps) {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-bold text-[var(--text)]">Activity Reminder</span>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
            enabled ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Notify me
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {OFFSETS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => onChangeOffset(o.value)}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  offsetMinutes === o.value
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
