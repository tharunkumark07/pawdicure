import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Plus,
  Sparkles,
  Clock,
  Check,
  CheckCircle2,
  Trash2,
  Edit2,
  Copy,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Bell,
  Play,
  Pause,
  ArrowRight,
  Flame,
  Info,
  Sliders,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomRoutine, RoutineItem, ScheduledRoutineItem, Pet } from '../types';
import { RoutineBuilderModal } from '../components/routine/RoutineBuilderModal';
import { ROUTINE_TEMPLATES, routineService } from '../services/routineService';
import { triggerHaptic } from '../lib/haptics';

export function RoutinesView() {
  const {
    activePet,
    householdData,
    setActivePetId,
    activePetRoutines,
    todayScheduledRoutineItems,
    completeRoutineItem,
    skipRoutineItem,
    uncompleteRoutineItem,
    deleteRoutine,
    duplicateRoutine,
    toggleRoutineActive,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'routines' | 'today' | 'templates'>('routines');
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [editingRoutine, setEditingRoutine] = useState<CustomRoutine | null>(null);
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(
    activePetRoutines[0]?.id || null
  );
  const [menuRoutineId, setMenuRoutineId] = useState<string | null>(null);

  const petList: Pet[] = Object.values(householdData.pets || {}) as Pet[];

  const petTodayItems = todayScheduledRoutineItems.filter(
    (i) => !i.petId || i.petId === activePet.id
  );
  const completedTodayCount = petTodayItems.filter((i) => i.status === 'completed').length;
  const totalTodayCount = petTodayItems.length;

  const handleOpenCreate = () => {
    setEditingRoutine(null);
    setIsBuilderOpen(true);
    triggerHaptic('light');
  };

  const handleOpenEdit = (routine: CustomRoutine, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingRoutine(routine);
    setMenuRoutineId(null);
    setIsBuilderOpen(true);
    triggerHaptic('light');
  };

  const handleDuplicate = async (routineId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMenuRoutineId(null);
    await duplicateRoutine(routineId);
  };

  const handleDelete = async (routineId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMenuRoutineId(null);
    if (confirm('Are you sure you want to delete this custom routine?')) {
      await deleteRoutine(routineId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header & Companion Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xl shadow-2xs">
              🗓️
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-heading font-black text-[var(--text)]">
                Custom Care Routines
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Design, schedule, and automate {activePet.name}'s daily wellness rhythms
              </p>
            </div>
          </div>
        </div>

        {/* Pet Switcher & CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex bg-[var(--background-alt)] p-1 rounded-2xl border border-[var(--card-border)]">
            {petList.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePetId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activePet.id === p.id
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <span>{p.species === 'Cat' ? '🐱' : '🐶'}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-white bg-[var(--primary)] hover:opacity-90 transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Routine</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex bg-[var(--background-alt)] p-1 rounded-2xl border border-[var(--card-border)] max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('routines')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'routines'
              ? 'bg-[var(--card-bg)] text-[var(--primary)] shadow-xs border border-[var(--card-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <span>Routines</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[var(--primary)]/10 text-[10px]">
            {activePetRoutines.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'today'
              ? 'bg-[var(--card-bg)] text-[var(--primary)] shadow-xs border border-[var(--card-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <span>Today's Tasks</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px]">
            {completedTodayCount}/{totalTodayCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-[var(--card-bg)] text-[var(--primary)] shadow-xs border border-[var(--card-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Templates</span>
        </button>
      </div>

      {/* Tab 1: Routines List */}
      {activeTab === 'routines' && (
        <div className="space-y-4">
          {activePetRoutines.length > 0 ? (
            activePetRoutines.map((routine) => {
              const isExpanded = expandedRoutineId === routine.id;
              const isMenuOpen = menuRoutineId === routine.id;

              return (
                <div
                  key={routine.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden shadow-xs transition-all hover:border-[var(--primary)]/30"
                >
                  {/* Routine Top Bar */}
                  <div
                    onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-2xs border border-white/20 shrink-0"
                        style={{
                          backgroundColor: `${routine.accent || '#3b82f6'}20`,
                          borderColor: `${routine.accent || '#3b82f6'}40`,
                        }}
                      >
                        {routine.icon || '🐾'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-heading font-black text-[var(--text)] truncate">
                            {routine.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              routine.active
                                ? 'bg-emerald-500/10 text-emerald-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {routine.active ? 'Active' : 'Paused'}
                          </span>
                        </div>

                        {routine.description && (
                          <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5 font-medium">
                            {routine.description}
                          </p>
                        )}

                        <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-1">
                          <span className="font-bold text-[var(--text)]">
                            {routine.items.length} Activities
                          </span>
                          <span>•</span>
                          <span>
                            {routine.items[0]?.scheduledTime} -{' '}
                            {routine.items[routine.items.length - 1]?.scheduledTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Controls */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Quick Pause / Resume Switch */}
                      <button
                        type="button"
                        onClick={() => toggleRoutineActive(routine.id, !routine.active)}
                        className={`w-10 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                          routine.active ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={routine.active ? 'Pause routine' : 'Resume routine'}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            routine.active ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuRoutineId(isMenuOpen ? null : routine.id)}
                          className="w-8 h-8 rounded-xl hover:bg-[var(--background-alt)] flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-9 z-30 w-40 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl p-1 text-xs animate-in fade-in"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(routine, e)}
                              className="w-full px-3 py-2 rounded-xl hover:bg-blue-50 text-[var(--primary)] font-bold flex items-center gap-2 text-left"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Routine</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDuplicate(routine.id, e)}
                              className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 text-left"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Duplicate</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(routine.id, e)}
                              className="w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2 text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                        className="w-8 h-8 rounded-xl hover:bg-[var(--background-alt)] flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items Preview */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 pt-2 border-t border-[var(--card-border)] bg-[var(--background-alt)] space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider pb-1">
                          <span>Scheduled Sequence</span>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(routine, e)}
                            className="text-[var(--primary)] hover:underline flex items-center gap-1 font-bold lowercase"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>customize activities</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {routine.items.map((item, idx) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-base shrink-0">{item.icon || '🐾'}</span>
                                <div className="min-w-0">
                                  <div className="font-bold text-[var(--text)] truncate">
                                    {item.title}
                                  </div>
                                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                                    <span className="capitalize">{item.activityType}</span>
                                    <span>•</span>
                                    <span>{item.durationMinutes} mins</span>
                                    {item.location && <span>• {item.location}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px]">
                                  {item.scheduledTime}
                                </span>
                                {item.reminderEnabled && (
                                  <Bell className="w-3.5 h-3.5 text-indigo-500" title="Reminder Active" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl bg-[var(--card-bg)] border border-dashed border-[var(--card-border)] space-y-3">
              <span className="text-3xl">🗓️</span>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  No custom routines created for {activePet.name} yet
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1">
                  Build your first personalized daily care cycle or select from our verified clinical templates.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[var(--primary)] hover:opacity-90 transition shadow-sm"
              >
                Create First Routine
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Today's Schedule Live Action View */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-heading font-black text-[var(--text)]">
                  {activePet.name}'s Timeline for Today
                </h2>
                <p className="text-xs text-[var(--text-muted)] font-medium">
                  {completedTodayCount} of {totalTodayCount} scheduled items completed
                </p>
              </div>
              <span className="font-heading font-black text-xl text-[var(--primary)]">
                {totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 100}%
              </span>
            </div>

            <div className="space-y-2.5">
              {petTodayItems.length > 0 ? (
                petTodayItems.map((item) => {
                  const isDone = item.status === 'completed';
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                          : item.status === 'due'
                          ? 'bg-amber-500/[0.08] border-amber-500/30 ring-1 ring-amber-500/20'
                          : 'bg-[var(--background-alt)] border-[var(--card-border)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (isDone) {
                              uncompleteRoutineItem(item.id);
                            } else {
                              completeRoutineItem(item.id);
                            }
                          }}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 bg-white hover:border-[var(--primary)]'
                          }`}
                        >
                          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <span className="text-xl shrink-0">{item.icon || '🐾'}</span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs sm:text-sm font-bold truncate ${
                                isDone ? 'line-through text-slate-400' : 'text-[var(--text)]'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 uppercase">
                              {item.scheduledTime}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                            <span className="capitalize">{item.activityType}</span>
                            <span>•</span>
                            <span>{item.durationMinutes} mins</span>
                            {item.location && <span>• {item.location}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                          }`}
                        >
                          +{item.priority === 'high' ? 35 : 25} XP
                        </span>

                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => skipRoutineItem(item.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md hover:bg-slate-100"
                          >
                            Skip
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                  No routine items scheduled for today.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Template Gallery */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROUTINE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[var(--primary)]/40 transition"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl p-2 rounded-2xl bg-slate-100">{tpl.icon}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-heading font-black text-[var(--text)]">
                      {tpl.name.replace('{Pet}', activePet.name)}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      {tpl.speciesRecommendation} • {tpl.items.length} Activities
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] font-medium">
                  {tpl.description}
                </p>

                {/* Items preview */}
                <div className="mt-3 space-y-1.5 pt-2 border-t border-[var(--card-border)]">
                  {tpl.items.slice(0, 3).map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{it.icon}</span>
                        <span className="truncate">{it.title}</span>
                      </span>
                      <span className="font-mono font-bold text-[10px] shrink-0">{it.scheduledTime}</span>
                    </div>
                  ))}
                  {tpl.items.length > 3 && (
                    <div className="text-[10px] text-slate-400 italic">
                      + {tpl.items.length - 3} more activities...
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingRoutine({
                    id: '',
                    userId: 'default-user',
                    petId: activePet.id,
                    name: tpl.name.replace('{Pet}', activePet.name),
                    description: tpl.description,
                    icon: tpl.icon,
                    accent: tpl.accent,
                    active: true,
                    items: tpl.items.map((it, idx) => ({
                      ...it,
                      id: `tpl-${Date.now()}-${idx}`,
                      routineId: '',
                      petId: activePet.id,
                      userId: 'default-user',
                      category: it.category || routineService.getActivityCategory(it.activityType),
                      scheduledTime: it.scheduledTime,
                      repeatType: it.repeatType || 'every_day',
                      priority: it.priority || 'medium',
                      reminderEnabled: it.reminderEnabled !== false,
                      reminderOffset: it.reminderOffset || 0,
                      active: true,
                      icon: it.icon || '🐾',
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    })),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  });
                  setIsBuilderOpen(true);
                }}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Use & Customize Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Routine Builder Modal */}
      {isBuilderOpen && (
        <RoutineBuilderModal
          isOpen={isBuilderOpen}
          existingRoutine={editingRoutine}
          onClose={() => {
            setIsBuilderOpen(false);
            setEditingRoutine(null);
          }}
        />
      )}
    </div>
  );
}
