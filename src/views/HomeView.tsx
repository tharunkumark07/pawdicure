import { Pet, RoutineTask } from '../types';
import { PetCard } from '../components/PetCard';
import { SpotlightCard } from '../components/ui/premium/SpotlightCard';
import { ShinyText } from '../components/ui/reactbits/ShinyText';
import {
  Sparkles,
  Utensils,
  Footprints,
  Clock,
  Check,
  Bot,
  Heart,
  Calendar,
  Gift,
  Flame,
  Camera,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface HomeViewProps {
  pet: Pet;
  tasks: RoutineTask[];
  streakDays?: number;
  lastCheckInDate?: string;
  onDailyCheckIn?: () => void;
  onNavigate: (tab: 'home' | 'feed' | 'health' | 'bond' | 'rewards' | 'badges') => void;
  onToggleTask: (taskId: string) => void;
  onLogExercise: () => void;
  onOpenAi: () => void;
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
  onOpenAi,
  memories = [],
}: HomeViewProps) {
  const isCheckedInToday = lastCheckInDate === new Date().toISOString().slice(0, 10);

  const dynamicCareScore = Math.min(
    100,
    Math.round(((pet.nutritionPercent ?? 50) * 0.4) + ((pet.hydrationPercent ?? 77) * 0.3) + 30)
  );

  return (
    <div className="flex flex-col w-full pb-16 space-y-10 sm:space-y-12 animate-in fade-in duration-500">
      
      {/* 1. Greeting Section (Primary Display - Supporting spacing) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-1">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-[10px] font-black uppercase tracking-wider text-[#ae3115] border border-orange-500/20">
            <Sparkles className="w-3 h-3 text-[#ff6b4a]" />
            <ShinyText text="Premium Pet Concierge" speed={4} />
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Hello, Tharun
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            Here is your daily update for <strong className="text-slate-800 font-bold">{pet.name}</strong>. ✨
          </p>
        </div>
        
        {/* Simple Streak Pill */}
        <button
          type="button"
          onClick={onDailyCheckIn}
          disabled={isCheckedInToday}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
            isCheckedInToday
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default'
              : 'bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800'
          }`}
        >
          <Flame className={`w-4 h-4 ${isCheckedInToday ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
          <span>{isCheckedInToday ? `${streakDays}d Streak Active` : 'Claim Daily Check-In'}</span>
        </button>
      </div>

      {/* 2. Featured Pet Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline px-1">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Companion</h2>
        </div>
        <PetCard pet={pet} />
      </div>

      {/* 3. Today's Care Routine & Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-1">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Care</h2>
            <p className="text-xs text-slate-500 font-medium">Routine targets set by your household</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Active Tracker
          </span>
        </div>

        {/* Daily Routine Task List */}
        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-emerald-50/20 border-emerald-100/60'
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
              } flex items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition shrink-0 ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                      : 'border-slate-300 hover:border-[#ff6b4a] bg-white'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {task.time}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        task.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-850'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                    {task.desc}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold tracking-wider uppercase shrink-0 ml-2 ${
                  task.completed ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                +{task.xp} XP
              </span>
            </div>
          ))}
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('feed')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ff6b4a] to-[#d94f2d] text-white font-extrabold text-xs shadow-md shadow-orange-500/10 hover:opacity-95 transition"
          >
            <Utensils className="w-4 h-4" />
            <span>Feed {pet.name} Now</span>
          </button>

          <button
            type="button"
            onClick={onLogExercise}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white border border-slate-100 text-slate-800 font-extrabold text-xs shadow-sm hover:bg-slate-50 transition"
          >
            <Footprints className="w-4 h-4 text-emerald-600" />
            <span>Log Playtime / Walks</span>
          </button>
        </div>
      </div>

      {/* 4. Important Reminder Banner */}
      <div className="bg-red-500/[0.03] border border-red-500/10 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-black text-sm text-slate-900">
              Crucial Wellness Event Due
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {pet.name} is scheduled for a rabies booster vaccination next week. Ensure all medical immunizations are documented.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('health')}
          className="px-4.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md transition self-stretch sm:self-auto text-center shrink-0"
        >
          View Vaccine Card
        </button>
      </div>

      {/* 5. PAW Insights (Predictive AI Panel) */}
      <div className="bg-gradient-to-r from-blue-500/[0.04] to-indigo-500/[0.04] border border-blue-100 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">
                PAWdiCURE Predictive Insight
              </h4>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Clinical Pet AI Concierge
              </p>
            </div>
          </div>
          <span className="text-[9px] font-black tracking-widest uppercase text-blue-700 bg-white border border-blue-100 px-2.5 py-1 rounded-full">
            Biometric Link Active
          </span>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {pet.species === 'Cat' ? (
            <>
              {pet.name}'s general active state has risen by <strong>18%</strong> following routine scratching posts. The next FVRCP vaccine is clinically ideal in <strong>14 days</strong>.
            </>
          ) : (
            <>
              {pet.name}'s daily step-count peaked <strong>22% higher</strong> post-beach run. The next canine DHPP booster is recommended in <strong>14 days</strong>.
            </>
          )}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('health')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition"
          >
            Review Health Records
          </button>
          <button
            type="button"
            onClick={onOpenAi}
            className="px-4 py-2 bg-white border border-blue-200 text-blue-800 rounded-xl text-xs font-extrabold hover:bg-blue-50/50 transition"
          >
            Consult AI Veterinary Nurse
          </button>
        </div>
      </div>

      {/* 6. Memories & Journal Entries (Secondary Content Block) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="space-y-1">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Memories</h2>
            <p className="text-xs text-slate-500 font-medium">Captured milestones with {pet.name}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('bond')}
            className="text-xs font-bold text-[#ff6b4a] hover:underline flex items-center gap-1"
          >
            <span>View Journal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {memories && memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memories.slice(0, 2).map((memory: any) => (
              <div 
                key={memory.id}
                className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition"
              >
                {memory.imageUrl ? (
                  <img 
                    src={memory.imageUrl} 
                    alt={memory.title} 
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
                    📖
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate">{memory.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{memory.date}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-1">{memory.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50/40 border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
              🐾
            </div>
            <div>
              <p className="text-xs font-black text-slate-700">No recent memory tags found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Start journaling daily interactions with {pet.name}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

