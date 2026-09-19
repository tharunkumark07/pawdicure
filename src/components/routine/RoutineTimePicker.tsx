import React from 'react';
import { Clock } from 'lucide-react';
import { standardizeTimeFormat } from '../../lib/timeUtils';

interface RoutineTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

export function RoutineTimePicker({ value, onChange, label = "Scheduled Time" }: RoutineTimePickerProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-[var(--text)] mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(standardizeTimeFormat(e.target.value))}
          placeholder="e.g. 07:30 AM"
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-mono font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
        />
        <select
          value={value.includes('PM') ? 'PM' : 'AM'}
          onChange={(e) => {
            const period = e.target.value;
            const clean = value.replace(/AM|PM/gi, '').trim();
            onChange(standardizeTimeFormat(`${clean} ${period}`));
          }}
          className="px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
