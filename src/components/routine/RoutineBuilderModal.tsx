import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Calendar,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Info,
  Layers,
  ArrowRight,
  MapPin,
  Utensils,
  Footprints,
  Pill,
  Sparkle,
} from 'lucide-react';
import {
  CustomRoutine,
  RoutineItem,
  RoutineActivityType,
  RoutineRepeatType,
  RoutinePriority,
  Pet,
} from '../../types';
import { useApp } from '../../context/AppContext';
import { routineService, ROUTINE_TEMPLATES, RoutineTemplate } from '../../services/routineService';
import { standardizeTimeFormat, parseTimeToMinutes } from '../../lib/timeUtils';
import { triggerHaptic } from '../../lib/haptics';
import { RoutineConflictWarning } from './RoutineConflictWarning';

interface RoutineBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRoutine?: CustomRoutine | null;
  onSaved?: (routine: CustomRoutine) => void;
}

const ACCENT_COLORS = [
  { name: 'Ocean Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Warm Amber', value: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Emerald Forest', value: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Royal Violet', value: '#8b5cf6', bg: 'bg-purple-500' },
  { name: 'Coral Rose', value: '#f43f5e', bg: 'bg-rose-500' },
  { name: 'Teal Oasis', value: '#14b8a6', bg: 'bg-teal-500' },
];

const ROUTINE_ICONS = ['🐾', '🐕', '🐈', '🍖', '🎾', '💊', '✨', '🏖️', '🌳', '🛁', '🩺', '🦴', '🦮', '🌙'];

const ACTIVITY_TYPES: { type: RoutineActivityType; label: string; defaultIcon: string }[] = [
  { type: 'feeding', label: 'Feeding / Meal', defaultIcon: '🍖' },
  { type: 'water', label: 'Hydration Check', defaultIcon: '💧' },
  { type: 'walk', label: 'Outdoor Walk', defaultIcon: '🐾' },
  { type: 'medication', label: 'Medication / Dose', defaultIcon: '💊' },
  { type: 'grooming', label: 'Grooming / Coat', defaultIcon: '✨' },
  { type: 'play', label: 'Playtime / Agility', defaultIcon: '🎾' },
  { type: 'training', label: 'Skill Training', defaultIcon: '🎓' },
  { type: 'bath', label: 'Bath / Spa', defaultIcon: '🛁' },
  { type: 'rest', label: 'Wind Down / Sleep', defaultIcon: '🌙' },
  { type: 'custom', label: 'Custom Care', defaultIcon: '⭐' },
];

const DAYS_OF_WEEK = [
  { label: 'M', full: 'Mon', value: 1 },
  { label: 'T', full: 'Tue', value: 2 },
  { label: 'W', full: 'Wed', value: 3 },
  { label: 'T', full: 'Thu', value: 4 },
  { label: 'F', full: 'Fri', value: 5 },
  { label: 'S', full: 'Sat', value: 6 },
  { label: 'S', full: 'Sun', value: 0 },
];

export function RoutineBuilderModal({
  isOpen,
  onClose,
  existingRoutine,
  onSaved,
}: RoutineBuilderModalProps) {
  const { activePet, householdData, createRoutine, updateRoutine, showToast } = useApp();
  const petList: Pet[] = Object.values(householdData.pets || {}) as Pet[];

  // Form states
  const [selectedPetId, setSelectedPetId] = useState<string>(
    existingRoutine?.petId || activePet.id
  );
  const [name, setName] = useState<string>(
    existingRoutine?.name || `${activePet.name}'s Daily Care Rhythm`
  );
  const [description, setDescription] = useState<string>(
    existingRoutine?.description || ''
  );
  const [icon, setIcon] = useState<string>(existingRoutine?.icon || '🐕');
  const [accent, setAccent] = useState<string>(existingRoutine?.accent || '#3b82f6');
  const [active, setActive] = useState<boolean>(
    existingRoutine?.active !== false
  );

  // Items state
  const [items, setItems] = useState<RoutineItem[]>(() => {
    if (existingRoutine?.items && existingRoutine.items.length > 0) {
      return existingRoutine.items;
    }
    // Default starter items
    return [
      {
        id: 'item-new-1',
        routineId: existingRoutine?.id || '',
        petId: activePet.id,
        userId: 'default-user',
        title: 'Morning Walk & Sniffari',
        activityType: 'walk',
        category: 'activity',
        scheduledTime: '07:30 AM',
        durationMinutes: 30,
        repeatType: 'every_day',
        priority: 'high',
        location: 'Neighborhood Loop',
        reminderEnabled: true,
        reminderOffset: 10,
        active: true,
        icon: '🐾',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'item-new-2',
        routineId: existingRoutine?.id || '',
        petId: activePet.id,
        userId: 'default-user',
        title: 'Calibrated Breakfast & Omega Chew',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '08:15 AM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 180,
        unit: 'g',
        reminderEnabled: true,
        reminderOffset: 0,
        active: true,
        icon: '🍖',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
  });

  const [expandedItemId, setExpandedItemId] = useState<string | null>(items[0]?.id || null);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Template Loader
  const handleApplyTemplate = (template: RoutineTemplate) => {
    const petName = householdData.pets[selectedPetId]?.name || activePet.name;
    setName(template.name.replace('{Pet}', petName));
    setDescription(template.description);
    setIcon(template.icon);
    setAccent(template.accent);
    setItems(
      template.items.map((it, idx) => ({
        ...it,
        id: `tpl-${Date.now()}-${idx}`,
        routineId: existingRoutine?.id || '',
        petId: selectedPetId,
        userId: 'default-user',
        category: it.category || routineService.getActivityCategory(it.activityType),
        scheduledTime: standardizeTimeFormat(it.scheduledTime),
        repeatType: it.repeatType || 'every_day',
        priority: it.priority || 'medium',
        reminderEnabled: it.reminderEnabled !== false,
        reminderOffset: it.reminderOffset || 0,
        active: true,
        icon: it.icon || '🐾',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }))
    );
    setShowTemplates(false);
    showToast(`Applied template: "${template.name}"`, 'success', template.icon);
    triggerHaptic('medium');
  };

  // Item Modifiers
  const handleAddItem = () => {
    const nextTimeMin = items.length > 0
      ? parseTimeToMinutes(items[items.length - 1].scheduledTime) + 60
      : 480; // 8:00 AM
    const nextHour = Math.floor((nextTimeMin % 1440) / 60);
    const nextMin = nextTimeMin % 60;
    const period = nextHour >= 12 ? 'PM' : 'AM';
    const displayHour = nextHour % 12 === 0 ? 12 : nextHour % 12;
    const timeStr = `${displayHour.toString().padStart(2, '0')}:${nextMin.toString().padStart(2, '0')} ${period}`;

    const newItem: RoutineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      routineId: existingRoutine?.id || '',
      petId: selectedPetId,
      userId: 'default-user',
      title: 'New Activity',
      activityType: 'walk',
      category: 'activity',
      scheduledTime: standardizeTimeFormat(timeStr),
      durationMinutes: 20,
      repeatType: 'every_day',
      priority: 'medium',
      reminderEnabled: true,
      reminderOffset: 5,
      active: true,
      icon: '🐾',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setItems([...items, newItem]);
    setExpandedItemId(newItem.id);
    triggerHaptic('light');
  };

  const handleUpdateItem = (itemId: string, updates: Partial<RoutineItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, ...updates, updatedAt: Date.now() } : it))
    );
  };

  const handleDeleteItem = (itemId: string) => {
    if (items.length <= 1) {
      showToast('A routine must contain at least 1 activity item', 'warning');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    triggerHaptic('light');
  };

  const handleDuplicateItem = (itemId: string) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const dup: RoutineItem = {
      ...target,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setItems([...items, dup]);
    setExpandedItemId(dup.id);
    triggerHaptic('light');
  };

  // Move items up/down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
    triggerHaptic('light');
  };

  // Conflict detection state
  const [conflictingPairs, setConflictingPairs] = useState<Array<{ item1: RoutineItem; item2: RoutineItem }>>([]);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);

  const checkConflicts = (itemsToCheck: RoutineItem[]) => {
    const pairs: Array<{ item1: RoutineItem; item2: RoutineItem }> = [];
    for (let i = 0; i < itemsToCheck.length; i++) {
      for (let j = i + 1; j < itemsToCheck.length; j++) {
        const item1 = itemsToCheck[i];
        const item2 = itemsToCheck[j];
        const start1 = parseTimeToMinutes(item1.scheduledTime);
        const end1 = start1 + (item1.durationMinutes || 30);
        const start2 = parseTimeToMinutes(item2.scheduledTime);
        const end2 = start2 + (item2.durationMinutes || 30);

        if (Math.max(start1, start2) < Math.min(end1, end2)) {
          pairs.push({ item1, item2 });
        }
      }
    }
    return pairs;
  };

  // Submit Handler
  const handleSaveRoutine = async (bypassConflictCheck: boolean = false) => {
    if (!name.trim()) {
      showToast('Please give your routine a title', 'warning');
      return;
    }
    if (items.length === 0) {
      showToast('Please add at least one activity to your routine', 'warning');
      return;
    }

    if (!bypassConflictCheck) {
      const conflicts = checkConflicts(items);
      if (conflicts.length > 0) {
        setConflictingPairs(conflicts);
        setShowConflictModal(true);
        return;
      }
    }

    // Sort items by scheduled time
    const sortedItems = [...items].sort(
      (a, b) => parseTimeToMinutes(a.scheduledTime) - parseTimeToMinutes(b.scheduledTime)
    );

    setIsSubmitting(true);
    try {
      if (existingRoutine) {
        await updateRoutine(existingRoutine.id, {
          name,
          description,
          icon,
          accent,
          active,
          petId: selectedPetId,
          items: sortedItems,
        });
        if (onSaved) {
          onSaved({
            ...existingRoutine,
            name,
            description,
            icon,
            accent,
            active,
            petId: selectedPetId,
            items: sortedItems,
          });
        }
      } else {
        const created = await createRoutine({
          name,
          description,
          icon,
          accent,
          active,
          petId: selectedPetId,
          items: sortedItems,
        });
        if (onSaved) {
          onSaved(created);
        }
      }
      onClose();
    } catch (err) {
      console.error('Failed to save custom routine:', err);
      showToast('Failed to save routine. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full sm:max-w-2xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--card-border)] flex items-center justify-between bg-gradient-to-r from-[var(--card-bg)] via-[var(--background-alt)] to-[var(--card-bg)] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-white/20"
              style={{ backgroundColor: `${accent}20`, borderColor: `${accent}40` }}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-[var(--text)]">
                {existingRoutine ? 'Edit Custom Routine' : 'Create Custom Routine'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Personalized care rhythm synchronized with your schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[var(--background-alt)] hover:bg-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Template Drawer */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-[var(--card-border)] bg-[var(--background-alt)] p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Clinical & Breed-Calibrated Templates
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">Tap to load & customize</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {ROUTINE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 text-left transition flex items-start gap-2.5 group cursor-pointer"
                  >
                    <span className="text-xl shrink-0 p-1.5 rounded-xl bg-slate-100">{tpl.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)] truncate">
                        {tpl.name}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {tpl.description}
                      </div>
                      <div className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mt-1">
                        {tpl.items.length} Activities • {tpl.speciesRecommendation}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* General Routine Metadata Card */}
          <div className="p-4 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pet Selector */}
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5">
                  Companion Pet
                </label>
                <div className="flex gap-2 flex-wrap">
                  {petList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPetId(p.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        selectedPetId === p.id
                          ? 'bg-[var(--primary)] text-white shadow-sm'
                          : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                      }`}
                    >
                      <span>{p.species === 'Cat' ? '🐱' : '🐶'}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                <div>
                  <span className="block text-xs font-bold text-[var(--text)]">Routine Active</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {active ? 'Generating daily tasks' : 'Paused'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    active ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      active ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5">
                Routine Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Milo's Autumn Schedule"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5">
                Description / Purpose (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Caloric-controlled diet, 2 sniffaris, and joint supplements"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Icon & Color Customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Routine Icon
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {ROUTINE_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition cursor-pointer ${
                        icon === ic
                          ? 'bg-[var(--primary)]/20 ring-2 ring-[var(--primary)] scale-110'
                          : 'bg-[var(--card-bg)] hover:bg-slate-100'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Accent Color
                </label>
                <div className="flex gap-2 items-center">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setAccent(c.value)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${c.bg} ${
                        accent === c.value ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activities List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-heading font-black text-[var(--text)] flex items-center gap-2">
                  <span>Scheduled Activities</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold">
                    {items.length} tasks
                  </span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Items automatically appear in Today's Routine sorted chronologically
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--primary)] text-white hover:opacity-90 transition flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            {/* List of Routine Items */}
            <div className="space-y-3">
              {items.map((item, index) => {
                const isExpanded = expandedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'bg-[var(--card-bg)] border-[var(--primary)] ring-1 ring-[var(--primary)]/20 shadow-md'
                        : 'bg-[var(--background-alt)] border-[var(--card-border)] hover:border-slate-300'
                    }`}
                  >
                    {/* Collapsed Item Header */}
                    <div
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Order Controls */}
                        <div className="flex flex-col items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveItem(index, 'up')}
                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20 transition cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[9px] font-black text-slate-400">{index + 1}</span>
                          <button
                            type="button"
                            disabled={index === items.length - 1}
                            onClick={() => handleMoveItem(index, 'down')}
                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20 transition cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Icon */}
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                          {item.icon || '🐾'}
                        </div>

                        {/* Title & Timing Summary */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text)] truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 uppercase tracking-wider">
                              {item.scheduledTime}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{item.activityType}</span>
                            <span>•</span>
                            <span>{item.durationMinutes} mins</span>
                            <span>•</span>
                            <span className="capitalize">{item.repeatType.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleDuplicateItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-[var(--primary)] transition rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Duplicate item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail Editor Form */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-1 border-t border-[var(--card-border)] space-y-4"
                        >
                          {/* Title & Activity Type */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text)] mb-1">
                                Activity Name
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                                placeholder="e.g., Morning Sniffari Walk"
                                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text)] mb-1">
                                Activity Category
                              </label>
                              <select
                                value={item.activityType}
                                onChange={(e) => {
                                  const newType = e.target.value as RoutineActivityType;
                                  const matching = ACTIVITY_TYPES.find((a) => a.type === newType);
                                  handleUpdateItem(item.id, {
                                    activityType: newType,
                                    category: routineService.getActivityCategory(newType),
                                    icon: matching?.defaultIcon || item.icon,
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                              >
                                {ACTIVITY_TYPES.map((at) => (
                                  <option key={at.type} value={at.type}>
                                    {at.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Precise Time Selection */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-2">
                            <label className="block text-[11px] font-bold text-[var(--text)]">
                              Exact Scheduled Time
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Manual Time Input with Standardizer */}
                              <div className="relative flex-1 min-w-[140px]">
                                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                  type="text"
                                  value={item.scheduledTime}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, { scheduledTime: e.target.value })
                                  }
                                  onBlur={(e) => {
                                    const cleaned = standardizeTimeFormat(e.target.value);
                                    handleUpdateItem(item.id, { scheduledTime: cleaned });
                                  }}
                                  placeholder="e.g. 07:30 AM"
                                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-white text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                                />
                              </div>

                              {/* Time Presets */}
                              <div className="flex gap-1">
                                {['07:00 AM', '08:00 AM', '12:30 PM', '06:00 PM', '09:00 PM'].map((tPreset) => (
                                  <button
                                    key={tPreset}
                                    type="button"
                                    onClick={() => handleUpdateItem(item.id, { scheduledTime: tPreset })}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                      item.scheduledTime === tPreset
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-white border border-[var(--card-border)] text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    {tPreset.replace(':00', '')}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Duration & Repeat Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text)] mb-1">
                                Duration (Minutes)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="240"
                                  value={item.durationMinutes || 20}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, {
                                      durationMinutes: Math.max(1, parseInt(e.target.value) || 1),
                                    })
                                  }
                                  className="w-20 px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] text-center focus:outline-none focus:border-[var(--primary)]"
                                />
                                <div className="flex gap-1 flex-wrap">
                                  {[10, 20, 30, 45, 60].map((dur) => (
                                    <button
                                      key={dur}
                                      type="button"
                                      onClick={() => handleUpdateItem(item.id, { durationMinutes: dur })}
                                      className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer ${
                                        item.durationMinutes === dur
                                          ? 'bg-[var(--primary)] text-white'
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                    >
                                      {dur}m
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text)] mb-1">
                                Repeat Pattern
                              </label>
                              <select
                                value={item.repeatType}
                                onChange={(e) =>
                                  handleUpdateItem(item.id, {
                                    repeatType: e.target.value as RoutineRepeatType,
                                  })
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                              >
                                <option value="every_day">Every Day (Daily)</option>
                                <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                                <option value="weekends">Weekends Only (Sat-Sun)</option>
                                <option value="selected_days">Specific Days of Week</option>
                              </select>
                            </div>
                          </div>

                          {/* Specific Days Multi-Select */}
                          {item.repeatType === 'selected_days' && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--card-border)]">
                              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Select Active Days
                              </span>
                              <div className="flex gap-1.5">
                                {DAYS_OF_WEEK.map((d) => {
                                  const activeDays = item.repeatDays || [1, 2, 3, 4, 5];
                                  const isSelected = activeDays.includes(d.value);
                                  return (
                                    <button
                                      key={d.value}
                                      type="button"
                                      onClick={() => {
                                        const next = isSelected
                                          ? activeDays.filter((x) => x !== d.value)
                                          : [...activeDays, d.value];
                                        handleUpdateItem(item.id, { repeatDays: next });
                                      }}
                                      className={`w-8 h-8 rounded-lg text-xs font-black transition cursor-pointer ${
                                        isSelected
                                          ? 'bg-[var(--primary)] text-white shadow-xs'
                                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                                      }`}
                                    >
                                      {d.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Feeding or Activity Specific Fields */}
                          {item.activityType === 'feeding' && (
                            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-orange-50/60 border border-orange-200">
                              <div>
                                <label className="block text-[10px] font-bold text-orange-900 uppercase">
                                  Meal Portion (Grams)
                                </label>
                                <input
                                  type="number"
                                  value={item.quantity || 180}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, {
                                      quantity: parseInt(e.target.value) || 0,
                                      unit: 'g',
                                    })
                                  }
                                  className="w-full px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-xs font-bold text-slate-900 mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-orange-900 uppercase">
                                  Food Recipe / Brand
                                </label>
                                <input
                                  type="text"
                                  value={item.notes || ''}
                                  onChange={(e) => handleUpdateItem(item.id, { notes: e.target.value })}
                                  placeholder="e.g., Raw Salmon Pate + Pumpkin"
                                  className="w-full px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-xs font-medium text-slate-900 mt-1"
                                />
                              </div>
                            </div>
                          )}

                          {/* Walk or Outdoor Venue */}
                          {['walk', 'play', 'outdoor'].includes(item.activityType) && (
                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text)] mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-600" />
                                <span>Location / Route</span>
                              </label>
                              <input
                                type="text"
                                value={item.location || ''}
                                onChange={(e) => handleUpdateItem(item.id, { location: e.target.value })}
                                placeholder="e.g. Mountain Creek Trail, Dog Beach"
                                className="w-full px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text)]"
                              />
                            </div>
                          )}

                          {/* Reminder Settings & Priority */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[var(--card-border)]">
                              <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-indigo-500" />
                                <div>
                                  <span className="block text-xs font-bold text-[var(--text)]">
                                    Push Notification
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {item.reminderEnabled ? 'Send push alert' : 'Disabled'}
                                  </span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={item.reminderEnabled !== false}
                                onChange={(e) =>
                                  handleUpdateItem(item.id, { reminderEnabled: e.target.checked })
                                }
                                className="w-4 h-4 rounded text-[var(--primary)] cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Priority:
                              </span>
                              {(['low', 'medium', 'high'] as RoutinePriority[]).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => handleUpdateItem(item.id, { priority: p })}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                                    item.priority === p
                                      ? p === 'high'
                                        ? 'bg-rose-500 text-white'
                                        : p === 'medium'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-700 text-white'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--background-alt)] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSaveRoutine}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--primary)] hover:opacity-90 transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{existingRoutine ? 'Save Changes' : 'Create Routine'}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      <RoutineConflictWarning
        isOpen={showConflictModal}
        conflictingPairs={conflictingPairs}
        onAdjustTime={() => setShowConflictModal(false)}
        onKeepAnyway={() => {
          setShowConflictModal(false);
          handleSaveRoutine(true);
        }}
        onCancel={() => setShowConflictModal(false)}
      />
    </div>
  );
}
