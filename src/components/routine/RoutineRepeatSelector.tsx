import React from 'react';
import { RoutineRepeatType } from '../../types';

interface RoutineRepeatSelectorProps {
  value: RoutineRepeatType;
  onChange: (repeat: RoutineRepeatType) => void;
}

const REPEAT_OPTIONS: { value: RoutineRepeatType; label: string }[] = [
  { value: 'every_day', label: 'Every Day' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'selected_days', label: 'Specific Days' },
  { value: 'once', label: 'One-time Only' },
];

export function RoutineRepeatSelector({ value, onChange }: RoutineRepeatSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-[var(--text)] mb-1.5">
        Repeat Frequency
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {REPEAT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              value === opt.value
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--primary)]/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
