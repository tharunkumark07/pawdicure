import { Pet, RoutineTask } from '../types';
import { evaluatePetBadges } from '../lib/badgeSystem';
import { PetCard } from '../components/PetCard';
import { SpotlightCard } from '../components/ui/premium/SpotlightCard';
import { PremiumButton } from '../components/ui/premium/PremiumButton';
import { GlossyCard } from '../components/ui/premium/GlossyCard';
import { AnimatedCounter } from '../components/ui/premium/AnimatedCounter';
import {
  Sparkles,
  Utensils,
  Footprints,
  Clock,
  Check,
  Bot,
  ChevronRight,
  Droplet,
  Heart,
  Moon,
  Calendar,
  Gift,
  Award,
  Flame,
} from 'lucide-react';

interface HomeViewProps {
  pet: Pet;
  tasks: RoutineTask[];
  streakDays?: number;
  lastCheckInDate?: string;
  onDailyCheckIn?: () => void;
  onNavigate: (tab: 'home' | 'feed' | 'health' | 'bond' | 'rewards') => void;
  onToggleTask: (taskId: string) => void;
  onLogExercise: () => void;
  onOpenAi: () => void;
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
  onOpenAi,
}: HomeViewProps) {
  const isCheckedInToday = lastCheckInDate === new Date().toISOString().slice(0, 10);
  const xpPct = Math.min(100, Math.round(((pet.xp ?? 0) / (pet.nextLevelXp || 1000)) * 100));

  const dynamicCareScore = Math.min(
    100,
    Math.round(((pet.nutritionPercent ?? 50) * 0.4) + ((pet.hydrationPercent ?? 77) * 0.3) + 30)
  );

  return (
    <div className="flex flex-col w-full pb-8 space-y-6 animate-in fade-in duration-500">
      {/* Hero Greeting Section */}
      <GlossyCard className="relative p-6 sm:p-8 bg-gradient-to-br from-white/80 to-white/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff6b4a]/10 to-amber-500/10 text-[11px] font-bold text-[#ae3115] border border-[#ff6b4a]/20 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#ff6b4a]" />
              <span>Daily Concierge Active</span>
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-950 leading-tight">
              Good morning, Tharun
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              How's {pet.name} doing today? ✨
            </p>
          </div>
          <div className="w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-white/50 shadow-xl shadow-orange-500/20 shrink-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src={pet.avatarUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </GlossyCard>
      
      {/* Pet ID Card */}
      <PetCard pet={pet} />

      {/* Daily Check-In & Streak Reward Card */}
      <SpotlightCard id="daily-streak-card">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#ff6b4a] flex items-center justify-center text-white shadow-xs shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 truncate">
                  Daily Companion Check-In
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] shrink-0">
                  🔥 {streakDays}d Streak
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Check in daily to nurture the bond and earn <strong className="text-amber-800 font-bold">+12 Paw Points</strong>!
              </p>
            </div>
          </div>

          <PremiumButton
            onClick={onDailyCheckIn}
            className={isCheckedInToday ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' : ''}
          >
            {isCheckedInToday ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Checked In!</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Claim +12 Pts</span>
              </>
            )}
          </PremiumButton>
        </div>
      </SpotlightCard>

      {/* Key Metrics Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        <SpotlightCard className="p-4 bg-gradient-to-br from-orange-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-[#ff6b4a]"><Heart className="w-5 h-5" /></div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Bond Level</div>
              <div className="text-lg font-black text-slate-950 font-heading">Lvl {pet.level}</div>
            </div>
          </div>
        </SpotlightCard>
        
        <SpotlightCard className="p-4 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><Utensils className="w-5 h-5" /></div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Nutrition</div>
              <div className="text-lg font-black text-slate-950 font-heading">{pet.nutritionPercent ?? 50}%</div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Level & XP Progression Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 bg-orange-100 text-[#ae3115] rounded-full font-bold text-[10px]">
              Level {pet.level}
            </span>
            <span className="font-bold text-slate-800 font-heading">
              {pet.levelTitle}
            </span>
          </div>
          <span className="font-bold text-[#ae3115] text-[11px]">
            {(pet.xp ?? 0).toLocaleString()} / {(pet.nextLevelXp || 1000).toLocaleString()} XP
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#ff6b4a] to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      {/* Primary Care Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('feed')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#ff6b4a] to-[#ae3115] text-white font-bold text-xs shadow-xs hover:opacity-95 active:scale-98 transition"
        >
          <Utensils className="w-4 h-4" />
          <span>Feed {pet.name} Supper</span>
        </button>

        <button
          type="button"
          onClick={onLogExercise}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-xs hover:bg-slate-50 active:scale-98 transition"
        >
          <Footprints className="w-4 h-4 text-emerald-600" />
          <span>Log 20m Play Loop</span>
        </button>
      </div>

      {/* Today's Care Routine with real-time interactive checkboxes */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#ff6b4a]" />
            <span>Today's Care Routine</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Shared Family Care
          </span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-emerald-50/40 border-emerald-100'
                  : 'bg-slate-50 border-slate-100'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition shrink-0 ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                      : 'border-slate-300 hover:border-[#ff6b4a] bg-white'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      {task.time}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        task.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {task.desc}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold shrink-0 ml-2 ${
                  task.completed ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                +{task.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PAWdiCURE AI Predictive Pet Insight */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-blue-950">
                PAWdiCURE AI Pet Insight
              </h4>
              <p className="text-[10px] text-blue-700">
                Predictive Clinical &amp; Routine Intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('health')}
            className="text-[10px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-full shadow-2xs hover:bg-blue-50"
          >
            Review Hub →
          </button>
        </div>

        <p className="text-xs text-blue-900 mt-2.5 leading-relaxed font-medium">
          {pet.name}'s activity peaked <strong>22% higher</strong> post-beach run. Next DHPP 5-in-1 vaccination booster is recommended in <strong>14 days</strong>.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('health')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            View Vaccine Center
          </button>
          <button
            type="button"
            onClick={onOpenAi}
            className="px-3 py-1.5 bg-white border border-blue-200 text-blue-800 rounded-xl text-xs font-bold hover:bg-blue-50 transition"
          >
            Ask AI Nurse
          </button>
        </div>
      </div>

      {/* Daily Wellness Score Breakdown */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Daily Wellness Score
            </h3>
            <p className="text-[11px] text-slate-500">
              Comprehensive biometric &amp; routine evaluation
            </p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl font-extrabold text-xs">
            <span>Top 5% Tier</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Radial Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#ff6b4a]"
                strokeDasharray={`${dynamicCareScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-slate-900 font-heading leading-none">
                {dynamicCareScore}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">
                /100
              </span>
            </div>
          </div>

          {/* Metric mini-bars */}
          <div className="flex-1 space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Nutrition &amp; Feeding</span>
                <span className="text-emerald-700">{pet.nutritionPercent ?? 50}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pet.nutritionPercent ?? 50}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Exercise &amp; Activity</span>
                <span className="text-[#ae3115]">85%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#ff6b4a] h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Routine Consistency</span>
                <span className="text-amber-700">90%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
