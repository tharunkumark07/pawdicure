import React from 'react';
import { RoutineItem } from '../../types';
import { Clock, MapPin } from 'lucide-react';

interface RoutineActivityCardProps {
  item: RoutineItem;
  onClick?: () => void;
}

export function RoutineActivityCard({ item, onClick }: RoutineActivityCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] transition cursor-pointer space-y-2 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-center justify-center text-lg">
            {item.icon || '🐾'}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text)]">{item.title}</h4>
            <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5 font-mono">
              <Clock className="w-3 h-3" />
              <span>{item.scheduledTime} ({item.durationMinutes || 30}m)</span>
            </div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--primary)]/10 text-[var(--primary)]">
          {item.activityType}
        </span>
      </div>

      {item.notes && (
        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
          {item.notes}
        </p>
      )}
    </div>
  );
}
