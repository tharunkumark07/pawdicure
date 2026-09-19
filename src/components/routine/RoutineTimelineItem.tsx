import React from 'react';
import { Check, Clock, Play, SkipForward, AlertCircle, MapPin } from 'lucide-react';
import { ScheduledRoutineItem } from '../../types';
import { triggerHaptic } from '../../lib/haptics';

interface RoutineTimelineItemProps {
  key?: string | number;
  item: ScheduledRoutineItem;
  onComplete: (itemId: string) => void;
  onSkip?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
}

export function RoutineTimelineItem({
  item,
  onComplete,
  onSkip,
}: RoutineTimelineItemProps) {
  const { item: routineItem, status, execution } = item;
  const isCompleted = status === 'completed';
  const isDue = status === 'due';
  const isMissed = status === 'missed';

  return (
    <div className={`relative flex items-start gap-4 p-4 rounded-3xl border transition-all ${
      isCompleted
        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-90'
        : isDue
        ? 'bg-[var(--primary)]/10 border-[var(--primary)] shadow-md animate-pulse'
        : isMissed
        ? 'bg-amber-500/5 border-amber-500/30'
        : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--primary)]/30'
    }`}>
      {/* Time Column */}
      <div className="w-20 shrink-0 text-right pt-0.5">
        <div className="text-xs font-mono font-bold text-[var(--text)]">
          {routineItem.scheduledTime}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-medium">
          {routineItem.durationMinutes || 30} min
        </div>
      </div>

      {/* Timeline Node / Icon */}
      <div className="relative flex flex-col items-center">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-xs border ${
          isCompleted
            ? 'bg-emerald-500 text-white border-emerald-600'
            : isDue
            ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
            : 'bg-[var(--background-alt)] text-[var(--text)] border-[var(--card-border)]'
        }`}>
          {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : (routineItem.icon || '🐾')}
        </div>
        <div className="w-0.5 flex-1 bg-[var(--card-border)] my-2 min-h-[2rem]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-xs sm:text-sm font-bold truncate ${
            isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text)]'
          }`}>
            {routineItem.title}
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            routineItem.priority === 'high'
              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
              : routineItem.priority === 'medium'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
          }`}>
            {routineItem.priority}
          </span>
        </div>

        {routineItem.notes && (
          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
            {routineItem.notes}
          </p>
        )}

        {routineItem.location && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-1">
            <MapPin className="w-3 h-3 text-[var(--primary)]" />
            <span>{routineItem.location}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3">
          {!isCompleted ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onComplete(routineItem.id);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Complete (+{routineItem.priority === 'high' ? 35 : 25} XP)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded-xl">
              <Check className="w-3.5 h-3.5" />
              <span>Completed at {execution?.completedAt ? new Date(execution.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}</span>
            </div>
          )}

          {!isCompleted && onSkip && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSkip(routineItem.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-[var(--background-alt)] hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-bold transition cursor-pointer"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
