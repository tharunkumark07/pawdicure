import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  Plus,
  RotateCcw,
  Check,
  MapPin,
  Utensils,
  Footprints,
  Pill,
  Droplets,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduledRoutineItem, RoutineItem, Pet } from '../../types';
import { triggerHaptic } from '../../lib/haptics';

interface TodaysRoutineWidgetProps {
  pet?: Pet;
  onNavigate?: (route: string) => void;
  onOpenRoutineBuilder?: () => void;
  onNavigateToRoutines?: () => void;
}

export function TodaysRoutineWidget({
  pet,
  onNavigate,
  onOpenRoutineBuilder,
  onNavigateToRoutines,
}: TodaysRoutineWidgetProps) {
  const {
    activePet: contextActivePet,
    todayScheduledRoutineItems,
    completeRoutineItem,
    skipRoutineItem,
    resetRoutineItemExecution,
    navigate: contextNavigate,
  } = useApp();

  const activePet = pet || contextActivePet;
  const navigate = onNavigate || contextNavigate;

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const items = todayScheduledRoutineItems || [];

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered list
  const displayItems = items.filter((i) => {
    if (filter === 'completed') return i.status === 'completed';
    if (filter === 'pending') return i.status !== 'completed';
    return true;
  });

  const handleComplete = async (sched: ScheduledRoutineItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('medium');
    await completeRoutineItem(sched.item.id, sched.item);
  };

  const handleSkip = async (sched: ScheduledRoutineItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');
    await skipRoutineItem(sched.item.id, 'Skipped by user');
  };

  const handleReset = async (sched: ScheduledRoutineItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');
    await resetRoutineItemExecution(sched.item.id);
  };

  // When no routine exists yet
  if (items.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗓️</span>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text)]">
                Today's Care Routine
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Personalized care rhythm for {activePet.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenRoutineBuilder || (() => navigate('/routines'))}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--primary)] text-white hover:opacity-90 transition flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Routine</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--background-alt)] border border-dashed border-[var(--card-border)] text-center space-y-2">
          <div className="text-2xl">✨</div>
          <h4 className="text-xs font-bold text-[var(--text)]">No Routine Scheduled for Today</h4>
          <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
            Design a custom routine with scheduled meals, walks, meds, and hydration checks to keep {activePet.name}'s day in sync.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              type="button"
              onClick={onOpenRoutineBuilder || (() => navigate('/routines'))}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              Choose a Starter Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-lg">
            🗓️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text)]">
                Today's Care Routine
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                {completedCount}/{totalCount} Completed
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-medium">
              Daily timeline calibrated for {activePet.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToRoutines || (() => navigate('/routines'))}
          className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Manage</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar Strip */}
      <div>
        <div className="flex justify-between items-center text-[10px] font-bold mb-1">
          <span className="text-[var(--text-muted)] uppercase tracking-wider">
            Daily Rhythm Progress
          </span>
          <span className="text-[var(--primary)]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--background-alt)] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-[var(--primary)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 pb-1">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold capitalize transition cursor-pointer ${
              filter === f
                ? 'bg-[var(--text)] text-[var(--background)] shadow-2xs'
                : 'bg-[var(--background-alt)] text-[var(--text-muted)] hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? `All (${items.length})` : f}
          </button>
        ))}
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {displayItems.map((sched) => {
            const item = sched.item;
            const isCompleted = sched.status === 'completed';
            const isSkipped = sched.status === 'skipped';
            const isDue = sched.status === 'due';
            const isUpcoming = sched.status === 'upcoming';
            const isMissed = sched.status === 'missed';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 opacity-80'
                    : isSkipped
                    ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 opacity-60'
                    : isDue
                    ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20 shadow-xs'
                    : isMissed
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200'
                    : 'bg-[var(--background-alt)] border-[var(--card-border)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left info & time */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Time Badge */}
                    <div className="flex flex-col items-center justify-center w-12 py-1 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xs shrink-0">
                      <span className="text-[10px] font-black text-[var(--text)] leading-none">
                        {sched.displayTime.split(' ')[0]}
                      </span>
                      <span className="text-[8px] font-extrabold text-[var(--text-muted)] uppercase tracking-tight">
                        {sched.displayTime.split(' ')[1] || 'AM'}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{item.icon || '🐾'}</span>
                        <h4
                          className={`text-xs font-bold truncate ${
                            isCompleted
                              ? 'line-through text-slate-500'
                              : isSkipped
                              ? 'line-through text-slate-400'
                              : 'text-[var(--text)]'
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] mt-0.5">
                        <span className="capitalize">{item.activityType}</span>
                        {item.durationMinutes && (
                          <>
                            <span>•</span>
                            <span>{item.durationMinutes}m</span>
                          </>
                        )}
                        {item.quantity && (
                          <>
                            <span>•</span>
                            <span>
                              {item.quantity}
                              {item.unit || 'g'}
                            </span>
                          </>
                        )}
                        {item.location && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">{item.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Status / Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCompleted ? (
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-black">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Done</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleReset(sched, e)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
                          title="Undo completion"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    ) : isSkipped ? (
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                          <span>Skipped</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleReset(sched, e)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
                          title="Undo skip"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleSkip(sched, e)}
                          className="px-2 py-1.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 text-[10px] font-bold text-slate-500 transition cursor-pointer"
                        >
                          Skip
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleComplete(sched, e)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Complete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
