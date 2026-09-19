import React from 'react';
import { ScheduledRoutineItem } from '../../types';
import { RoutineTimelineItem } from './RoutineTimelineItem';
import { Calendar, Sparkles } from 'lucide-react';

interface RoutineTimelineProps {
  items: ScheduledRoutineItem[];
  onComplete: (itemId: string) => void;
  onSkip?: (itemId: string) => void;
}

export function RoutineTimeline({ items, onComplete, onSkip }: RoutineTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto text-2xl">
          🐾
        </div>
        <h3 className="text-sm font-bold text-[var(--text)]">Your pet's day is waiting</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
          No scheduled routine activities for today. Create or load a routine to keep your companion thriving.
        </p>
      </div>
    );
  }

  // Sort by time
  const sorted = [...items].sort((a, b) => {
    const parseTime = (t: string) => {
      const clean = t.trim().toUpperCase();
      const m = clean.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
      if (!m) return 0;
      let h = parseInt(m[1], 10);
      const min = m[2] ? parseInt(m[2], 10) : 0;
      if (h === 12) h = m[3] === 'PM' ? 12 : 0;
      else if (m[3] === 'PM') h += 12;
      return h * 60 + min;
    };
    return parseTime(a.item.scheduledTime) - parseTime(b.item.scheduledTime);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
          Today's Timeline ({sorted.length} Activities)
        </h3>
      </div>

      <div className="space-y-3">
        {sorted.map((item) => (
          <RoutineTimelineItem
            key={item.item.id}
            item={item}
            onComplete={onComplete}
            onSkip={onSkip}
          />
        ))}
      </div>
    </div>
  );
}
