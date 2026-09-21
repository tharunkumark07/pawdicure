import { useState } from 'react';
import { Pet, RoutineTask, PetActivityRecord } from '../types';
import { PetCard } from '../components/PetCard';
import { PetBiometryInsights } from '../components/PetBiometryInsights';
import { PetActivityTimeline } from '../components/PetActivityTimeline';
import { TodaysRoutineWidget } from '../components/routine/TodaysRoutineWidget';
import { LogActivityModal } from '../components/LogActivityModal';
import { DeleteActivityModal } from '../components/DeleteActivityModal';
import { getTimeAwareGreeting, getUserLocalDate } from '../lib/timeUtils';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Footprints,
  Clock,
  Check,
  Heart,
  Calendar,
  Flame,
  Camera,
  ChevronRight,
  ShieldAlert,
  Stethoscope,
  Pill,
  Plus,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  Droplets,
  Cpu,
  Scale,
  Zap,
  Activity,
} from 'lucide-react';

interface HomeViewProps {
  pet: Pet;
  tasks: RoutineTask[];
  streakDays?: number;
  lastCheckInDate?: string;
  onDailyCheckIn?: () => void;
  onNavigate: (route: string) => void;
  onToggleTask: (taskId: string) => void;
  onLogExercise: () => void;
  memories?: any[];
}

export function HomeView({
  pet,
  tasks,
  streakDays = 5,
  lastCheckInDate,
  onDailyCheckIn,
  onNavigate,
  onToggleTask,
  onLogExercise,
  memories = [],
}: HomeViewProps) {
  const {
    householdData,
    setActivePetId,
    showToast,
    triggerConfetti,
    addCareActivity,
    activities = [],
    logPetActivity,
    updatePetActivity,
    deletePetActivity,
    userProfile,
  } = useApp();
  const [completedAnimationId, setCompletedAnimationId] = useState<string | null>(null);

  // Activity modal states
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<PetActivityRecord | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<PetActivityRecord | null>(null);

  const userDisplayName =
    userProfile?.preferredName?.split(' ')[0] ||
    userProfile?.displayName?.split(' ')[0] ||
    userProfile?.name?.split(' ')[0] ||
    householdData.userProfile?.name?.split(' ')[0] ||
    'THARUN';

  // Check-in status
  const todayDateKey = getUserLocalDate();
  const isCheckedInToday = lastCheckInDate === todayDateKey;

  // Multi-pet list
  const petList: Pet[] = Object.values(householdData.pets || {}) as Pet[];

  // 2. Today's Care Routine metrics
  const petTasks = tasks.filter((t) => !t.petId || t.petId === pet.id);
  const totalTasks = petTasks.length;
  const completedTasks = petTasks.filter((t) => t.completed).length;
  const careProgressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Pet's today activities and minutes
  const todayActivities = activities.filter(
    (act) => (!act.petId || act.petId === pet.id) && act.date === todayDateKey
  );
  const dailyTotalMinutes = todayActivities.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  // 1. Time-aware & Context-aware Greeting
  const timeGreeting = getTimeAwareGreeting(
    userDisplayName,
    pet.name,
    careProgressPercent,
    todayActivities.length
  );

  // Dynamic Care Score
  const dynamicCareScore = Math.min(
    100,
    Math.round(
      (pet.nutritionPercent ?? 50) * 0.4 +
        (pet.hydrationPercent ?? 77) * 0.3 +
        30
    )
  );

  // 3. Priority / Needs Attention Items (from real data)
  const pendingMeds = (householdData.medications || []).filter(
    (m) => !m.takenToday && (!m.petId || m.petId === pet.id)
  );
  const dueVaccines = (householdData.vaccinationHistory || []).filter(
    (v) =>
      (v.status === 'Due' || v.status === 'Overdue') &&
      (!v.petId || v.petId === pet.id)
  );
  const highPriorityReminders = (householdData.reminders || []).filter(
    (r) => !r.completed && r.priority === 'high' && (!r.petId || r.petId === pet.id)
  );

  // Handle direct task toggle with micro-interaction feedback
  const handleTaskAction = (task: RoutineTask) => {
    setCompletedAnimationId(task.id);
    setTimeout(() => setCompletedAnimationId(null), 800);

    onToggleTask(task.id);
    if (!task.completed) {
      triggerConfetti();
      showToast(`✓ ${task.title} completed! (+${task.xp} XP)`, 'success', '✨');
      addCareActivity(task.title, task.xp, '✓');
    }
  };

  // Handle task row contextual action
  const handleTaskRowClick = (task: RoutineTask) => {
    if (task.completed) {
      handleTaskAction(task);
      return;
    }
    if (task.category === 'feed') {
      onNavigate('feed');
    } else if (task.category === 'walk') {
      onLogExercise();
    } else if (task.category === 'med') {
      onNavigate('health');
    } else if (task.category === 'play') {
      triggerConfetti();
      addCareActivity(`Agility Playtime with ${pet.name}`, 25, '🎾');
      showToast(`Playtime logged! (+25 XP) 🎾`, 'success', '✨');
    } else {
      handleTaskAction(task);
    }
  };

  // 4. Upcoming Care (next 2-3 items)
  const pendingTasks = petTasks.filter((t) => !t.completed);
  const upcomingReminders = (householdData.reminders || [])
    .filter((r) => !r.completed && (!r.petId || r.petId === pet.id))
    .slice(0, 2);

  // 5. Intelligent PAW Insight derived from real data
  let pawInsight = '';
  if (careProgressPercent >= 80) {
    pawInsight = `${pet.name} has completed ${completedTasks} of ${totalTasks} care activities today. Your routine consistency is in the top tier!`;
  } else if (streakDays >= 3) {
    pawInsight = `You and ${pet.name} are maintaining a ${streakDays}-day active care streak. Daily walks keep tails wagging!`;
  } else if (completedTasks > 0) {
    pawInsight = `${pet.name} is making great progress with today's routine. Keep up the rhythm!`;
  } else {
    pawInsight = `Starting today's care routine with ${pet.name} builds lasting health and mutual bond.`;
  }

  // 6. Recent Memory for Active Pet
  const petMemories = (memories.length > 0 ? memories : householdData.memories || []).filter(
    (m) => !m.petId || m.petId === pet.id
  );
  const latestMemory = petMemories.length > 0 ? petMemories[0] : null;

  return (
    <div className="flex flex-col w-full pb-24 space-y-8 sm:space-y-10 animate-in fade-in duration-400">
      
      {/* ================================================== */}
      {/* 1. HEADER / GREETING & CONTEXT                      */}
      {/* ================================================== */}
      <div className="flex flex-col gap-4 px-1 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--text)] tracking-tight flex items-center gap-2">
              <span>{timeGreeting.headline}</span>
            </h1>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {timeGreeting.subtitle}
            </p>
          </div>

          {/* Quick Actions: Streak Check-In & Log Activity */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                setEditingActivity(null);
                setIsLogModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Activity</span>
            </button>

            <button
              type="button"
              onClick={onDailyCheckIn}
              disabled={isCheckedInToday}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-2xs ${
                isCheckedInToday
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 cursor-default'
                  : 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] cursor-pointer active:scale-95'
              }`}
              title={isCheckedInToday ? 'Checked in for today' : 'Tap to claim daily check-in'}
            >
              <Flame
                className={`w-4 h-4 ${
                  isCheckedInToday
                    ? 'text-emerald-500'
                    : 'text-amber-500 animate-pulse'
                }`}
              />
              <span>
                {isCheckedInToday
                  ? `${streakDays}d Streak Active`
                  : 'Claim Check-In (+20 XP)'}
              </span>
            </button>
          </div>
        </div>

        {/* Multi-Pet Switcher (only surfaces when user has multiple pets) */}
        {petList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mr-1 shrink-0">
              Pets:
            </span>
            {petList.map((p, idx) => {
              const isSelected = p.id === pet.id;
              return (
                <button
                  key={`pet-tab-${p.id || idx}`}
                  type="button"
                  onClick={() => setActivePetId(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[var(--primary)] text-white shadow-sm ring-2 ring-[var(--primary)]/30'
                      : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]'
                  }`}
                >
                  <span className="text-sm">
                    {p.species === 'Cat' ? '🐱' : p.species === 'Dog' ? '🐶' : '🐾'}
                  </span>
                  <span>{p.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--card-bg)] border border-dashed border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition shrink-0"
              title="Add or manage pets"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* MAIN RESPONSIVE GRID (Desktop 12-col / Mobile 1-col) */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* ================================================== */}
        {/* LEFT COLUMN: PRIMARY ANCHORS (Hero, Today, Actions) */}
        {/* ================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          
          {/* 2. FEATURED PET HERO */}
          <section aria-labelledby="featured-pet-heading" className="space-y-3">
            <div className="flex justify-between items-baseline px-1">
              <h2
                id="featured-pet-heading"
                className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
              >
                Featured Companion
              </h2>
              <button
                type="button"
                onClick={() => onNavigate(`/pet/${pet.id}`)}
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>View Pet Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <PetCard pet={pet} />
          </section>

          {/* 3. TODAY'S CUSTOM CARE ROUTINE */}
          <TodaysRoutineWidget pet={pet} onNavigate={onNavigate} />

          {/* 3.5 INTERACTIVE DAILY ACTIVITY TIMELINE */}
          <section aria-labelledby="activity-timeline-heading" className="space-y-3">
            <div className="flex justify-between items-baseline px-1">
              <h2
                id="activity-timeline-heading"
                className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
              >
                Daily Activity Timeline
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingActivity(null);
                  setIsLogModalOpen(true);
                }}
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Activity</span>
              </button>
            </div>

            <PetActivityTimeline
              activities={activities}
              pet={pet}
              selectedDate={todayDateKey}
              careProgressPercent={careProgressPercent}
              onLogActivityClick={() => {
                setEditingActivity(null);
                setIsLogModalOpen(true);
              }}
              onEditActivity={(act) => {
                setEditingActivity(act);
                setIsLogModalOpen(true);
              }}
              onDeleteActivity={(act) => {
                setDeletingActivity(act);
              }}
              showSummaryHeader={true}
            />
          </section>

          {/* 4. QUICK ACTIONS SECTION */}
          <section aria-labelledby="quick-actions-heading" className="space-y-3">
            <h2
              id="quick-actions-heading"
              className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest px-1"
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {[
                {
                  id: 'feed',
                  label: 'Feed',
                  icon: Utensils,
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10 hover:bg-amber-500/15',
                  action: () => onNavigate('feed'),
                },
                {
                  id: 'activity',
                  label: 'Activity',
                  icon: Footprints,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
                  action: () => {
                    setEditingActivity(null);
                    setIsLogModalOpen(true);
                  },
                },
                {
                  id: 'health',
                  label: 'Health',
                  icon: Stethoscope,
                  color: 'text-teal-500',
                  bg: 'bg-teal-500/10 hover:bg-teal-500/15',
                  action: () => onNavigate('health'),
                },
                {
                  id: 'memory',
                  label: 'Memory',
                  icon: Camera,
                  color: 'text-pink-500',
                  bg: 'bg-pink-500/10 hover:bg-pink-500/15',
                  action: () => onNavigate('bond'),
                },
                {
                  id: 'reminder',
                  label: 'Remind',
                  icon: Calendar,
                  color: 'text-indigo-500',
                  bg: 'bg-indigo-500/10 hover:bg-indigo-500/15',
                  action: () => onNavigate('reminders'),
                },
                {
                  id: 'clinics',
                  label: 'Clinics',
                  icon: Heart,
                  color: 'text-rose-500',
                  bg: 'bg-rose-500/10 hover:bg-rose-500/15',
                  action: () => onNavigate('health/clinics'),
                },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={act.action}
                  className={`p-3 sm:p-3.5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs hover:border-[var(--primary)]/30 group`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${act.bg} flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    <act.icon className={`w-5 h-5 ${act.color}`} />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text)] truncate">
                    {act.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* ================================================== */}
        {/* RIGHT COLUMN: SECONDARY HIERARCHY (Alerts, Health)  */}
        {/* ================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-6">

          {/* 5. PRIORITY / NEEDS ATTENTION (Dynamic State) */}
          <section aria-labelledby="priority-heading">
            {pendingMeds.length > 0 ? (
              <div className="bg-amber-500/[0.08] border border-amber-500/25 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-500/15 text-amber-600 rounded-2xl shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                      Needs Attention
                    </span>
                    <h3 className="font-heading font-black text-sm text-[var(--text)]">
                      Medication Due Today
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                      {pendingMeds[0].name} ({pendingMeds[0].dose})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('health')}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition self-stretch sm:self-auto text-center shrink-0 cursor-pointer"
                >
                  View Health
                </button>
              </div>
            ) : dueVaccines.length > 0 ? (
              <div className="bg-rose-500/[0.06] border border-rose-500/20 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-rose-500/15 text-rose-500 rounded-2xl shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                      Needs Attention
                    </span>
                    <h3 className="font-heading font-black text-sm text-[var(--text)]">
                      Vaccine Due: {dueVaccines[0].name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                      Due date: {dueVaccines[0].dueDate}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('health/passport')}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition self-stretch sm:self-auto text-center shrink-0 cursor-pointer"
                >
                  Passport
                </button>
              </div>
            ) : (
              <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-3xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text)]">
                      Everything is taken care of for today ✓
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">
                      {pet.name} is happy, nourished, and all set!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 6. UPCOMING CARE / UP NEXT (Lightweight 2-3 items) */}
          <section aria-labelledby="up-next-heading" className="space-y-3">
            <div className="flex justify-between items-baseline px-1">
              <h2
                id="up-next-heading"
                className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
              >
                Up Next
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 space-y-2.5 shadow-2xs">
              {pendingTasks.slice(0, 2).map((task, idx) => (
                <div
                  key={`home-pending-task-${task.id || idx}`}
                  onClick={() => handleTaskRowClick(task)}
                  className="p-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-center justify-between gap-3 hover:border-[var(--primary)]/30 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text)] truncate">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">
                        {task.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-md shrink-0">
                    +{task.xp} XP
                  </span>
                </div>
              ))}

              {upcomingReminders.slice(0, 1).map((reminder, idx) => (
                <div
                  key={`home-reminder-${reminder.id || idx}`}
                  onClick={() => onNavigate('reminders')}
                  className="p-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-center justify-between gap-3 hover:border-[var(--primary)]/30 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text)] truncate">
                        {reminder.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">
                        {reminder.time}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                </div>
              ))}

              {pendingTasks.length === 0 && upcomingReminders.length === 0 && (
                <p className="text-xs text-[var(--text-muted)] text-center py-2 font-medium">
                  No further pending activities scheduled.
                </p>
              )}
            </div>
          </section>

          {/* 7. PET BIOMETRY INSIGHTS */}
          <PetBiometryInsights pet={pet} onNavigate={onNavigate} />

          {/* 8. RELATIONSHIP PROGRESS */}
          <section aria-labelledby="relationship-heading" className="space-y-3">
            <div className="flex justify-between items-baseline px-1">
              <h2
                id="relationship-heading"
                className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
              >
                Your Bond
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('bond')}
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>View Relationship</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-heading font-black text-[var(--text)]">
                    {pet.levelTitle || 'Best Buddy'} · Level {pet.level}
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium">
                    {pet.xp ?? 0} / {pet.nextLevelXp || 1000} XP
                  </p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm">
                  ❤️
                </div>
              </div>

              <div className="w-full h-2 bg-[var(--primary)]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((pet.xp ?? 0) / (pet.nextLevelXp || 1000)) * 100)
                    )}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-[var(--text-muted)] italic font-medium pt-1">
                "You're building a stronger bond with {pet.name} every day."
              </p>
            </div>
          </section>

          {/* 9. ONE USEFUL PAW INSIGHT */}
          {pawInsight && (
            <section aria-labelledby="paw-insight-heading">
              <div className="bg-gradient-to-br from-[var(--primary)]/[0.06] to-purple-500/[0.04] border border-[var(--primary)]/15 rounded-3xl p-4.5 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-black text-xs text-[var(--text)] uppercase tracking-wider">
                    PAW Insight 🧠
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                    {pawInsight}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 10. RECENT MEMORY / ACTIVITY */}
          <section aria-labelledby="recent-memory-heading" className="space-y-3">
            <div className="flex justify-between items-baseline px-1">
              <h2
                id="recent-memory-heading"
                className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
              >
                Recent Memory
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('bond')}
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>View Memories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestMemory ? (
              <div
                onClick={() => onNavigate('bond')}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 flex items-center gap-4 hover:border-[var(--primary)]/30 cursor-pointer transition shadow-2xs group"
              >
                {latestMemory.imageUrl ? (
                  <img
                    src={latestMemory.imageUrl}
                    alt={latestMemory.title}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-1 ring-black/5"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xl shrink-0">
                    📖
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
                    {latestMemory.title}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">
                    {latestMemory.date}
                  </p>
                  {latestMemory.desc && (
                    <p className="text-[11px] text-[var(--text-muted)] truncate mt-1">
                      {latestMemory.desc}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--primary)] transition-colors shrink-0" />
              </div>
            ) : (
              <div
                onClick={() => onNavigate('bond')}
                className="bg-[var(--card-bg)] border border-dashed border-[var(--card-border)] rounded-3xl p-5 text-center flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:border-[var(--primary)]/40 transition"
              >
                <Camera className="w-5 h-5 text-[var(--text-muted)]" />
                <p className="text-xs font-bold text-[var(--text)]">Capture Today's Memory</p>
                <p className="text-[10px] text-[var(--text-muted)] font-medium">
                  Document a snapshot of {pet.name} to preserve the moment
                </p>
              </div>
            )}
          </section>

          {/* 11. TODAY WITH PET SUMMARY (Minimalist scannable pills) */}
          <div className="bg-[var(--background-alt)] border border-[var(--card-border)] rounded-2xl p-3.5 flex items-center justify-around text-center">
            <div>
              <span className="block text-xs font-black text-[var(--text)] font-heading">
                {petTasks.filter((t) => t.completed && t.category === 'feed').length}
              </span>
              <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Meals</span>
            </div>
            <div className="h-6 w-px bg-[var(--card-border)]" />
            <div>
              <span className="block text-xs font-black text-[var(--text)] font-heading">
                {petTasks.filter((t) => t.completed && t.category === 'walk').length > 0 ? '30m+' : '0m'}
              </span>
              <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Walks</span>
            </div>
            <div className="h-6 w-px bg-[var(--card-border)]" />
            <div>
              <span className="block text-xs font-black text-[var(--text)] font-heading">
                {dynamicCareScore}%
              </span>
              <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Care Score</span>
            </div>
            <div className="h-6 w-px bg-[var(--card-border)]" />
            <div>
              <span className="block text-xs font-black text-[var(--text)] font-heading">
                {streakDays}d
              </span>
              <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Streak</span>
            </div>
          </div>

        </div>

      </div>

      {/* Activity Creation & Editing Modal */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={async (activityData) => {
          if (editingActivity) {
            await updatePetActivity(editingActivity.id, activityData);
          } else {
            await logPetActivity(activityData);
          }
        }}
        pet={pet}
        editingActivity={editingActivity}
        dailyTotalMinutes={dailyTotalMinutes}
      />

      {/* Activity Deletion Confirmation Modal */}
      <DeleteActivityModal
        isOpen={!!deletingActivity}
        activity={deletingActivity}
        onClose={() => setDeletingActivity(null)}
        onConfirm={async () => {
          if (deletingActivity) {
            await deletePetActivity(deletingActivity.id);
            setDeletingActivity(null);
          }
        }}
      />
    </div>
  );
}
