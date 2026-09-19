import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetActivityRecord, ActivityType, ActivityIntensity } from '../types';
import { ACTIVITY_TYPES_META, ActivityTypeMeta, estimateActivityCalories } from '../services/activityService';
import { petCareLimitService } from '../services/petCareLimitService';
import { getUserLocalDate, getUserLocalTime } from '../lib/timeUtils';
import {
  X,
  Plus,
  Minus,
  Clock,
  Sparkles,
  Flame,
  MapPin,
  Check,
  AlertCircle,
  FileText,
  Calendar,
  Utensils,
  Droplets,
  Pill,
  Heart,
  ShieldCheck,
} from 'lucide-react';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
  initialActivity?: PetActivityRecord | null;
  onSave: (activity: Omit<PetActivityRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  dailyTotalMinutes?: number;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  pet,
  initialActivity,
  onSave,
  dailyTotalMinutes = 0,
}) => {
  const [selectedType, setSelectedType] = useState<ActivityType>('walk');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [intensity, setIntensity] = useState<ActivityIntensity>('moderate');
  const [date, setDate] = useState(getUserLocalDate());
  const [startTime, setStartTime] = useState(getUserLocalTime());
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [amountGrams, setAmountGrams] = useState(150);
  const [waterMl, setWaterMl] = useState(250);
  const [medicationName, setMedicationName] = useState('');
  const [medicationDose, setMedicationDose] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditMode = !!initialActivity;
  const currentMeta: ActivityTypeMeta = ACTIVITY_TYPES_META[selectedType] || ACTIVITY_TYPES_META.custom;

  // Initialize or reset form state when modal opens or initialActivity changes
  useEffect(() => {
    if (isOpen) {
      if (initialActivity) {
        setSelectedType(initialActivity.activityType || 'walk');
        setTitle(initialActivity.title || '');
        setDurationMinutes(initialActivity.durationMinutes || 30);
        setIntensity(initialActivity.intensity || 'moderate');
        setDate(initialActivity.date || getUserLocalDate());
        setStartTime(initialActivity.startTime || getUserLocalTime());
        setEndTime(initialActivity.endTime || '');
        setLocation(initialActivity.location || '');
        setNotes(initialActivity.notes || '');
        setAmountGrams(initialActivity.amountGrams || 150);
        setWaterMl(initialActivity.waterMl || 250);
        setMedicationName(initialActivity.medicationName || '');
        setMedicationDose(initialActivity.medicationDose || '');
      } else {
        const defaultType: ActivityType = 'walk';
        const meta = ACTIVITY_TYPES_META[defaultType];
        setSelectedType(defaultType);
        setTitle(meta.defaultTitle);
        setDurationMinutes(meta.defaultDuration);
        setIntensity('moderate');
        setDate(getUserLocalDate());
        setStartTime(getUserLocalTime());
        setEndTime('');
        setLocation('');
        setNotes('');
        setAmountGrams(150);
        setWaterMl(250);
        setMedicationName('');
        setMedicationDose('');
      }
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialActivity]);

  // When activity type changes in create mode, update default title and duration
  const handleTypeChange = (type: ActivityType) => {
    setSelectedType(type);
    const meta = ACTIVITY_TYPES_META[type] || ACTIVITY_TYPES_META.custom;
    if (!isEditMode) {
      setTitle(meta.defaultTitle);
      if (meta.hasDuration) {
        setDurationMinutes(meta.defaultDuration);
      }
    }
  };

  // Adjust duration via stepper
  const adjustDuration = (delta: number) => {
    setDurationMinutes((prev) => {
      const next = prev + delta;
      return Math.max(5, Math.min(360, next));
    });
  };

  // Calculate live energy output and XP
  const isDog = pet.species !== 'Cat';
  const estimatedCalories = currentMeta.hasDuration
    ? estimateActivityCalories(selectedType, durationMinutes, intensity, isDog)
    : undefined;
  const xpEarned = currentMeta.baseXp;

  // Validate care limits
  const limitStatus = currentMeta.hasDuration
    ? petCareLimitService.validateActivity(durationMinutes, dailyTotalMinutes, pet)
    : 'NORMAL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validation Checks
    if (currentMeta.hasDuration) {
      if (durationMinutes <= 0) {
        setErrorMessage('Activity duration must be greater than 0 minutes.');
        return;
      }
      if (durationMinutes > 360) {
        setErrorMessage('That activity duration looks unusually high (> 6 hours). Please check the value.');
        return;
      }
    }

    if (selectedType === 'medication' && !medicationName.trim()) {
      setErrorMessage('Please enter the medication name.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        id: initialActivity?.id,
        petId: pet.id,
        activityType: selectedType,
        title: title.trim() || currentMeta.defaultTitle,
        durationMinutes: currentMeta.hasDuration ? durationMinutes : undefined,
        intensity: currentMeta.hasIntensity ? intensity : undefined,
        date,
        startTime,
        endTime: endTime.trim() || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        calories: estimatedCalories,
        amountGrams: selectedType === 'feeding' ? amountGrams : undefined,
        waterMl: selectedType === 'water' ? waterMl : undefined,
        medicationName: selectedType === 'medication' ? medicationName.trim() : undefined,
        medicationDose: selectedType === 'medication' ? medicationDose.trim() : undefined,
        source: 'manual',
        xpEarned,
        icon: currentMeta.emoji,
      });

      onClose();
    } catch (err) {
      console.error('Failed to log activity:', err);
      setErrorMessage('Failed to save activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 space-y-6 animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentMeta.emoji}</span>
            <div>
              <h2 className="text-lg font-heading font-black text-[var(--text)] tracking-tight">
                {isEditMode ? 'Edit Activity' : 'Log Activity'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Recording care for <strong className="text-[var(--text)]">{pet.name || 'companion'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Activity Type Grid */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
              Activity Type
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {(Object.keys(ACTIVITY_TYPES_META) as ActivityType[]).map((typeKey) => {
                const meta = ACTIVITY_TYPES_META[typeKey];
                const isSelected = selectedType === typeKey;

                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => handleTypeChange(typeKey)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm scale-105'
                        : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="text-lg leading-none mb-1">{meta.emoji}</span>
                    <span className="text-[10px] font-bold tracking-tight text-center truncate w-full">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text)]">
              Activity Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={currentMeta.defaultTitle}
              className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 font-medium"
            />
          </div>

          {/* 3. Duration Stepper & Chips (if applicable) */}
          {currentMeta.hasDuration && (
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                  How Long?
                </span>
                <span className="text-base font-black text-[var(--text)]">
                  {durationMinutes} min
                </span>
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => adjustDuration(-5)}
                  disabled={durationMinutes <= 5}
                  className="w-10 h-10 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text)] hover:border-[var(--primary)] disabled:opacity-40 transition cursor-pointer active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5">
                  {[15, 30, 45, 60].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDurationMinutes(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        durationMinutes === preset
                          ? 'bg-[var(--primary)] text-white shadow-xs'
                          : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => adjustDuration(5)}
                  disabled={durationMinutes >= 360}
                  className="w-10 h-10 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text)] hover:border-[var(--primary)] disabled:opacity-40 transition cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Slider for smooth selection */}
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>
          )}

          {/* 4. Intensity Selector (if applicable) */}
          {currentMeta.hasIntensity && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Intensity
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['light', 'moderate', 'high'] as ActivityIntensity[]).map((level) => {
                  const isSelected = intensity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setIntensity(level)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold capitalize transition border cursor-pointer ${
                        isSelected
                          ? level === 'high'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                            : level === 'light'
                            ? 'bg-blue-500 text-white border-blue-500 shadow-xs'
                            : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                Date
              </label>
              <input
                type="date"
                value={date}
                max={getUserLocalDate()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 6:15 PM"
                className="w-full px-3.5 py-2 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 font-medium"
              />
            </div>
          </div>

          {/* 6. Context-Specific Inputs: Feeding / Water / Medication / Location */}
          {selectedType === 'feeding' && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)]">
              <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-500" />
                Meal Portion (Grams)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={10}
                  max={1500}
                  value={amountGrams}
                  onChange={(e) => setAmountGrams(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text)] font-bold"
                />
                <span className="text-xs font-bold text-[var(--text-muted)]">grams</span>
              </div>
            </div>
          )}

          {selectedType === 'water' && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)]">
              <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                Water Refilled (Milliliters)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={50}
                  max={3000}
                  value={waterMl}
                  onChange={(e) => setWaterMl(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text)] font-bold"
                />
                <span className="text-xs font-bold text-[var(--text-muted)]">ml</span>
              </div>
            </div>
          )}

          {selectedType === 'medication' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)]">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-rose-500" />
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="e.g. Heartgard Plus, Probiotic"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text)] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text)]">
                  Dose / Strength (Optional)
                </label>
                <input
                  type="text"
                  value={medicationDose}
                  onChange={(e) => setMedicationDose(e.target.value)}
                  placeholder="e.g. 1 chewable tablet"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text)] font-medium"
                />
              </div>
            </div>
          )}

          {currentMeta.hasLocation && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                Location / Route (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sunset Dog Park, Neighborhood trail"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)] text-xs text-[var(--text)] font-medium"
              />
            </div>
          )}

          {/* 7. Notes Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Notes & Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Energetic pace, sniffed many flowers, great focus!"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 font-medium resize-none"
            />
          </div>

          {/* 8. Care Limit Safety Reminder Banner if approaching limits */}
          {limitStatus === 'WARNING' && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                You've logged a high amount of activity for {pet.name} today. Consider checking their usual activity guidance to keep them comfortable.
              </p>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Reward Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg)] border border-[var(--card-border)] text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-[var(--text)]">Bond Progression</span>
            </div>
            <div className="flex items-center gap-3">
              {estimatedCalories !== undefined && estimatedCalories > 0 && (
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  ~{estimatedCalories} kcal
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black">
                +{xpEarned} XP
              </span>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-[var(--bg)] hover:bg-[var(--card-border)]/40 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-black transition shadow-sm cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Activity' : 'Save Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
