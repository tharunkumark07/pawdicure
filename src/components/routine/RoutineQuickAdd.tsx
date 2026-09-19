import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { RoutineActivityType } from '../../types';

interface RoutineQuickAddProps {
  onAdd: (title: string, activityType: RoutineActivityType, time: string) => void;
}

export function RoutineQuickAdd({ onAdd }: RoutineQuickAddProps) {
  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState<RoutineActivityType>('walk');
  const [time, setTime] = useState('12:00 PM');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), activityType, time);
    setTitle('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[var(--card-border)] hover:border-[var(--primary)] text-[var(--text-muted)] hover:text-[var(--primary)] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer bg-[var(--card-bg)]"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Quick Add Activity</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--text)]">Quick Add Activity</span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] font-bold cursor-pointer"
        >
          Cancel
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Activity title (e.g. Afternoon Stretch)"
        className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--background-alt)] text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
        autoFocus
      />
      <div className="flex gap-2">
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value as RoutineActivityType)}
          className="flex-1 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--background-alt)] text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
        >
          <option value="walk">🐾 Walk</option>
          <option value="feeding">🍖 Feeding</option>
          <option value="water">💧 Water</option>
          <option value="medication">💊 Medication</option>
          <option value="play">🎾 Play</option>
          <option value="grooming">✨ Grooming</option>
          <option value="custom">⭐ Custom</option>
        </select>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="08:00 AM"
          className="w-28 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--background-alt)] text-xs font-mono font-bold text-[var(--text)] focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition shadow-sm cursor-pointer"
        >
          Add
        </button>
      </div>
    </form>
  );
}
