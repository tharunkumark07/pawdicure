import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetActivityRecord } from '../types';
import { ACTIVITY_TYPES_META } from '../services/activityService';
import { isToday, formatDateLabel } from '../lib/timeUtils';
import {
  Footprints,
  Flame,
  Clock,
  Sparkles,
  MapPin,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Heart,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface PetActivityTimelineProps {
  activities: PetActivityRecord[];
  pet: Pet;
  selectedDate?: string;
  careProgressPercent?: number;
  onLogActivityClick: () => void;
  onEditActivity?: (activity: PetActivityRecord) => void;
  onDeleteActivity?: (activity: PetActivityRecord) => void;
  showSummaryHeader?: boolean;
}

export const PetActivityTimeline: React.FC<PetActivityTimelineProps> = ({
  activities = [],
  pet,
  selectedDate,
  careProgressPercent = 80,
  onLogActivityClick,
  onEditActivity,
  onDeleteActivity,
  showSummaryHeader = true,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isTodayView = !selectedDate || isToday(selectedDate);
  const dateLabel = selectedDate ? formatDateLabel(selectedDate) : 'Today';

  // Filter activities for this pet and date (if provided)
  const petActivities = activities.filter((act) => {
    const matchesPet = !act.petId || act.petId === pet.id;
    const matchesDate = !selectedDate || act.date === selectedDate;
    return matchesPet && matchesDate;
  });

  // Calculate daily summary metrics
  const totalMinutes = petActivities.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalCalories = petActivities.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalXpEarned = petActivities.reduce((acc, curr) => acc + (curr.xpEarned || 0), 0);
  const activityCount = petActivities.length;

  // Determine dominant intensity
  const highIntensityCount = petActivities.filter((a) => a.intensity === 'high').length;
  const dominantIntensity =
    highIntensityCount > 0
      ? 'High Energy'
      : petActivities.some((a) => a.intensity === 'moderate')
      ? 'Moderate Energy'
      : totalMinutes > 0
      ? 'Gentle Activity'
      : 'Resting';

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. COMPACT DAILY SUMMARY BAR */}
      {showSummaryHeader && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🐾</span>
              <div>
                <h3 className="text-xs font-black text-[var(--text)] uppercase tracking-wider">
                  {dateLabel}'s Activity Summary
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-medium">
                  {activityCount} {activityCount === 1 ? 'entry' : 'entries'} recorded with {pet.name || 'companion'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogActivityClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Activity</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5 pt-3 border-t border-[var(--card-border)]/60">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block leading-none">Active Time</span>
                <span className="text-xs font-black text-[var(--text)]">{totalMinutes} min</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block leading-none">Burned</span>
                <span className="text-xs font-black text-[var(--text)]">{totalCalories} kcal</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
              <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block leading-none">Intensity</span>
                <span className="text-xs font-black text-[var(--text)]">{dominantIntensity}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block leading-none">XP Earned</span>
                <span className="text-xs font-black text-[var(--text)]">+{totalXpEarned} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TIMELINE LIST OR EMPTY STATE */}
      {petActivities.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-dashed border-[var(--card-border)] rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto text-xl shadow-2xs">
            🐾
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--text)]">
              {isTodayView ? 'Nothing logged yet today.' : `No activities logged on ${dateLabel}.`}
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              {isTodayView
                ? `Start ${pet.name || 'your companion'}'s day with a walk, playtime, or meal to keep their care streak going!`
                : `No activity records were found for this date.`}
            </p>
          </div>
          {isTodayView && (
            <button
              type="button"
              onClick={onLogActivityClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Activity</span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--card-border)]">
          <AnimatePresence initial={false}>
            {petActivities.map((activity, index) => {
              const meta = ACTIVITY_TYPES_META[activity.activityType] || ACTIVITY_TYPES_META.custom;
              const isExpanded = expandedId === activity.id;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="relative group"
                >
                  {/* Timeline node icon */}
                  <div className="absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full bg-[var(--card-bg)] border-2 border-[var(--primary)] flex items-center justify-center text-xs shadow-xs z-10">
                    <span className="text-[11px] leading-none">{activity.icon || meta.emoji}</span>
                  </div>

                  {/* Activity Card */}
                  <div
                    onClick={() => toggleExpand(activity.id)}
                    className={`bg-[var(--card-bg)] border transition-all rounded-2xl p-4 cursor-pointer shadow-2xs hover:shadow-sm ${
                      isExpanded
                        ? 'border-[var(--primary)]/60 ring-1 ring-[var(--primary)]/20'
                        : 'border-[var(--card-border)] hover:border-[var(--primary)]/30'
                    }`}
                  >
                    {/* Collapsed Header Bar */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-[var(--text)] tracking-tight truncate">
                            {activity.title}
                          </span>

                          {activity.durationMinutes && activity.durationMinutes > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold">
                              <Clock className="w-2.5 h-2.5" />
                              {activity.durationMinutes} min
                            </span>
                          )}

                          {activity.intensity && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                activity.intensity === 'high'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                  : activity.intensity === 'light'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {activity.intensity}
                            </span>
                          )}
                        </div>

                        {/* Subtitle / Timestamp */}
                        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-medium">
                          <span>{activity.startTime || 'Logged'}</span>
                          {activity.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 truncate">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                {activity.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Tag / Expand Icon */}
                      <div className="flex items-center gap-2 shrink-0">
                        {activity.xpEarned > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-tight">
                            +{activity.xpEarned} XP
                          </span>
                        )}
                        <button
                          type="button"
                          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsed short note preview if not expanded */}
                    {!isExpanded && activity.notes && (
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 italic mt-2 pt-2 border-t border-[var(--card-border)]/40">
                        "{activity.notes}"
                      </p>
                    )}

                    {/* Expanded Detailed View */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3.5 pt-3.5 border-t border-[var(--card-border)] space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Rich Metadata Badges */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            {activity.startTime && (
                              <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                  Time Window
                                </span>
                                <span className="font-bold text-[var(--text)]">
                                  {activity.startTime}
                                  {activity.endTime ? ` – ${activity.endTime}` : ''}
                                </span>
                              </div>
                            )}

                            {activity.calories !== undefined && activity.calories > 0 && (
                              <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                  Energy Output
                                </span>
                                <span className="font-bold text-amber-600 dark:text-amber-400">
                                  ~{activity.calories} kcal
                                </span>
                              </div>
                            )}

                            {activity.distanceKm !== undefined && activity.distanceKm > 0 && (
                              <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                  Distance
                                </span>
                                <span className="font-bold text-[var(--text)]">
                                  {activity.distanceKm} km
                                </span>
                              </div>
                            )}

                            {activity.amountGrams !== undefined && activity.amountGrams > 0 && (
                              <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                  Portion Size
                                </span>
                                <span className="font-bold text-[var(--text)]">
                                  {activity.amountGrams} g
                                </span>
                              </div>
                            )}

                            {activity.waterMl !== undefined && activity.waterMl > 0 && (
                              <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                  Hydration
                                </span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  +{activity.waterMl} ml
                                </span>
                              </div>
                            )}

                            {activity.medicationName && (
                              <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/40">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                  Medication
                                </span>
                                <span className="font-bold text-[var(--text)]">
                                  {activity.medicationName} {activity.medicationDose ? `(${activity.medicationDose})` : ''}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Full Notes */}
                          {activity.notes && (
                            <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--card-border)]/50">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                                Activity Notes
                              </span>
                              <p className="text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed">
                                {activity.notes}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex items-center justify-end gap-2 pt-1">
                            {onEditActivity && (
                              <button
                                type="button"
                                onClick={() => onEditActivity(activity)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg)] hover:bg-[var(--card-border)]/50 text-[var(--text)] text-xs font-bold transition border border-[var(--card-border)] cursor-pointer active:scale-95"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                                <span>Edit</span>
                              </button>
                            )}

                            {onDeleteActivity && (
                              <button
                                type="button"
                                onClick={() => onDeleteActivity(activity)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition border border-rose-500/20 cursor-pointer active:scale-95"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
