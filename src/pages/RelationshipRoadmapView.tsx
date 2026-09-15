import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ChevronRight,
  Gift,
} from 'lucide-react';

export function RelationshipRoadmapView() {
  const { activePet, householdData, navigate, showToast } = useApp();

  const currentLevel = activePet.relationshipLevel || 3;
  const currentXp = householdData.currentXp || 340;
  const nextLevelXp = householdData.nextLevelXp || 500;

  const milestones = [
    {
      level: 1,
      title: 'New Companion',
      description: 'First steps together, establishing daily feeding & walk routines.',
      perk: 'Unlocks Daily Food Tracker & Hydration Vitals',
      xpRequired: 100,
      unlocked: currentLevel >= 1,
    },
    {
      level: 2,
      title: 'Trusted Friend',
      description: 'Understanding mood cues, preferred toys, and sleep patterns.',
      perk: 'Unlocks Smart Reminders & Medical Passport',
      xpRequired: 250,
      unlocked: currentLevel >= 2,
    },
    {
      level: 3,
      title: 'Inseparable Duo',
      description: 'Deep affection, synchronized daily rhythm, and seamless obedience.',
      perk: 'Unlocks 15% Pet Store Discount + Bronze Badge',
      xpRequired: 500,
      unlocked: currentLevel >= 3,
    },
    {
      level: 4,
      title: 'Soulbound Partner',
      description: 'Intuitive communication and lifetime wellness synergy.',
      perk: 'Unlocks Exclusive Silver Store Perks + Custom Collar Tag',
      xpRequired: 900,
      unlocked: currentLevel >= 4,
    },
    {
      level: 5,
      title: 'Legendary Bond',
      description: 'Highest echelon of companionship and holistic care mastery.',
      perk: 'Unlocks Golden VIP Membership & Free Annual Vet Check voucher',
      xpRequired: 1500,
      unlocked: currentLevel >= 5,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/relationship')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Relationship</span>
        </button>

        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>{householdData.userRank}</span>
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-600 via-rose-500 to-amber-500 text-white p-5 rounded-3xl shadow-xl shadow-purple-600/15 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl">
              💎
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block">
                COMPANION ROADMAP
              </span>
              <h1 className="font-heading font-black text-xl">
                Level {currentLevel}: Inseparable Duo
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-white/90">
              {currentXp} / {nextLevelXp} XP
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (currentXp / nextLevelXp) * 100)}%` }}
              className="bg-white h-full rounded-full transition-all"
            />
          </div>
          <div className="text-[11px] text-purple-100 text-right">
            {nextLevelXp - currentXp} XP remaining until Level {currentLevel + 1}
          </div>
        </div>
      </div>

      {/* Roadmap Vertical Timeline */}
      <div className="space-y-3 pt-2">
        <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-wider">
          Milestone Progression Path
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {milestones.map((m) => (
            <div key={m.level} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-4 ring-white ${
                  m.unlocked
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-slate-300 text-slate-500'
                }`}
              >
                {m.unlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
              </div>

              {/* Milestone Card */}
              <div
                className={`p-4 rounded-3xl border transition-all ${
                  m.level === currentLevel
                    ? 'bg-white border-purple-300 shadow-md ring-2 ring-purple-100'
                    : m.unlocked
                    ? 'bg-white border-slate-100 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Level {m.level}
                      </span>
                      <h4 className="font-heading font-bold text-xs text-slate-900">
                        {m.title}
                      </h4>
                      {m.level === currentLevel && (
                        <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-2 py-0.2 rounded-full">
                          Current Status
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                    {m.xpRequired} XP
                  </span>
                </div>

                {/* Perk Badge */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-purple-800 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-purple-600" />
                    <span>{m.perk}</span>
                  </span>

                  {m.unlocked && (
                    <span className="text-[10px] font-bold text-emerald-600">
                      Active Perk ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
