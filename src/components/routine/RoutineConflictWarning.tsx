import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { RoutineItem } from '../../types';

interface RoutineConflictWarningProps {
  isOpen: boolean;
  conflictingPairs: Array<{ item1: RoutineItem; item2: RoutineItem }>;
  onAdjustTime: () => void;
  onKeepAnyway: () => void;
  onCancel: () => void;
}

export function RoutineConflictWarning({
  isOpen,
  conflictingPairs,
  onAdjustTime,
  onKeepAnyway,
  onCancel,
}: RoutineConflictWarningProps) {
  if (!isOpen || conflictingPairs.length === 0) return null;

  const hasHealthConflict = conflictingPairs.some(
    ({ item1, item2 }) =>
      item1.activityType === 'medication' ||
      item2.activityType === 'medication' ||
      item1.category === 'health' ||
      item2.category === 'health'
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs">
            {hasHealthConflict ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-heading font-black text-[var(--text)]">
              Schedule Overlap Detected
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {hasHealthConflict
                ? 'Strict validation: Medication or health care items overlap.'
                : 'These activities have overlapping times.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto w-8 h-8 rounded-full bg-[var(--background-alt)] hover:bg-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflict List */}
        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
          {conflictingPairs.map(({ item1, item2 }, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-[var(--text)]">
                <span className="flex items-center gap-1.5">
                  <span>{item1.icon || '⏰'}</span>
                  <span>{item1.title}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-mono text-[11px]">
                  {item1.scheduledTime} ({item1.durationMinutes || 30}m)
                </span>
              </div>
              <div className="text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                overlaps with
              </div>
              <div className="flex items-center justify-between font-bold text-[var(--text)]">
                <span className="flex items-center gap-1.5">
                  <span>{item2.icon || '⏰'}</span>
                  <span>{item2.title}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-mono text-[11px]">
                  {item2.scheduledTime} ({item2.durationMinutes || 30}m)
                </span>
              </div>
            </div>
          ))}
        </div>

        {hasHealthConflict && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-[11px] leading-relaxed font-medium">
            ⚠️ <strong>Health Notice:</strong> Overlapping medication times may cause administration errors or dosage timing conflicts. Adjusting is strongly recommended.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={onAdjustTime}
            className="flex-1 py-3 px-4 rounded-2xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Adjust Time</span>
          </button>

          <button
            type="button"
            onClick={onKeepAnyway}
            className="py-3 px-4 rounded-2xl bg-[var(--background-alt)] text-[var(--text)] text-xs font-bold hover:bg-[var(--card-border)] transition border border-[var(--card-border)] cursor-pointer"
          >
            Keep Anyway
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="py-3 px-3 rounded-2xl text-[var(--text-muted)] text-xs font-bold hover:text-[var(--text)] transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
