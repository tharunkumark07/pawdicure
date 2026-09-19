import React from 'react';

interface RoutineDaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const DAYS = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
];

export function RoutineDaySelector({ selectedDays, onChange }: RoutineDaySelectorProps) {
  const toggleDay = (val: number) => {
    if (selectedDays.includes(val)) {
      onChange(selectedDays.filter((d) => d !== val));
    } else {
      onChange([...selectedDays, val].sort());
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-[var(--text)] mb-1.5">
        Select Active Days
      </label>
      <div className="flex gap-1.5 justify-between">
        {DAYS.map((d) => {
          const isSelected = selectedDays.includes(d.value);
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => toggleDay(d.value)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                isSelected
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                  : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--primary)]/40'
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
