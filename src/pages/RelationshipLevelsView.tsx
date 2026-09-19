import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  ArrowLeft,
  Sparkles,
  Heart,
  Shield,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export function RelationshipLevelsView() {
  const { activePet, householdData, navigate } = useApp();

  const getRelationshipLevel = (level: number) => {
    if (level <= 3) return 1;
    if (level <= 7) return 2;
    if (level <= 11) return 3;
    if (level <= 15) return 4;
    return 5;
  };

  const activeTier = getRelationshipLevel(activePet.level || 1);

  const levels = [
    {
      level: 1,
      title: 'Acquaintance',
      xp: 'Level 1 - 3',
      icon: '🐾',
      benefits: ['Access to daily feeding log', 'Water intake tracker', 'Basic reminders'],
      current: activeTier === 1,
    },
    {
      level: 2,
      title: 'Companion',
      xp: 'Level 4 - 7',
      icon: '🐶',
      benefits: ['Medical passport & vaccine logs', 'Allergy tracking', 'Custom reminder sounds'],
      current: activeTier === 2,
    },
    {
      level: 3,
      title: 'Soulbound Friend',
      xp: 'Level 8 - 11',
      icon: '💖',
      benefits: ['15% discount across pet store', 'PAWdiCURE AI personalized assistant', 'Family sharing access'],
      current: activeTier === 3,
    },
    {
      level: 4,
      title: 'Pack Alpha Guardian',
      xp: 'Level 12 - 15',
      icon: '👑',
      benefits: ['Exclusive silver badge & avatars', 'Priority store deliveries', 'Custom nutritional formulation'],
      current: activeTier === 4,
    },
    {
      level: 5,
      title: 'Eternal Bond',
      xp: 'Level 16+',
      icon: '✨',
      benefits: ['VIP Golden profile passport', 'Free annual telemedicine check', 'Immortalized companion plaque'],
      current: activeTier === 5,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/relationship')}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--card-bg)] px-3 py-1.5 rounded-xl border border-[var(--card-border)] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Relationship</span>
        </button>

        <span className="text-xs font-bold text-[var(--text)] bg-[var(--background-alt)] px-3 py-1 rounded-full">
          {activePet.name}: Level {activePet.level || 1} • Tier {activeTier} Active
        </span>
      </div>

      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 rounded-3xl border border-[var(--card-border)] shadow-xs space-y-2">
        <h1 className="font-heading font-black text-xl text-[var(--text)]">
          Relationship Tiers &amp; Echelons
        </h1>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Leveling up your companionship unlocks deeper clinical features, discounts on premium nutrition, and specialized care badges.
        </p>
      </div>

      {/* Levels Cards */}
      <div className="space-y-3">
        {levels.map((lvl) => (
          <div
            key={lvl.level}
            className={`p-4 rounded-3xl border transition-all ${
              lvl.current
                ? 'bg-[var(--primary-light)] border-[var(--primary-border)] shadow-sm ring-2 ring-[var(--primary)]/10'
                : 'bg-white border-slate-100 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-2xs">
                  {lvl.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      Tier {lvl.level}: {lvl.title}
                    </h3>
                    {lvl.current && (
                      <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.2 rounded-full">
                        Your Rank
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {lvl.xp}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tier Perks
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {lvl.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
