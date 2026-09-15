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

  const levels = [
    {
      level: 1,
      title: 'Acquaintance',
      xp: '0 - 100 XP',
      icon: '🐾',
      benefits: ['Access to daily feeding log', 'Water intake tracker', 'Basic reminders'],
      current: activePet.relationshipLevel === 1,
    },
    {
      level: 2,
      title: 'Companion',
      xp: '101 - 250 XP',
      icon: '🐶',
      benefits: ['Medical passport & vaccine logs', 'Allergy tracking', 'Custom reminder sounds'],
      current: activePet.relationshipLevel === 2,
    },
    {
      level: 3,
      title: 'Soulbound Friend',
      xp: '251 - 500 XP',
      icon: '💖',
      benefits: ['15% discount across pet store', 'PAWdiCURE AI personalized assistant', 'Family sharing access'],
      current: activePet.relationshipLevel === 3,
    },
    {
      level: 4,
      title: 'Pack Alpha Guardian',
      xp: '501 - 900 XP',
      icon: '👑',
      benefits: ['Exclusive silver badge & avatars', 'Priority store deliveries', 'Custom nutritional formulation'],
      current: activePet.relationshipLevel === 4,
    },
    {
      level: 5,
      title: 'Eternal Bond',
      xp: '901+ XP',
      icon: '✨',
      benefits: ['VIP Golden profile passport', 'Free annual telemedicine check', 'Immortalized companion plaque'],
      current: activePet.relationshipLevel === 5,
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

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          Level {activePet.relationshipLevel || 3} Active
        </span>
      </div>

      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-2">
        <h1 className="font-heading font-black text-xl text-slate-900">
          Relationship Tiers &amp; Echelons
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
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
                ? 'bg-gradient-to-r from-orange-50/70 to-rose-50/70 border-orange-200 shadow-sm ring-2 ring-[#ff6b4a]/20'
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
                      <span className="text-[10px] font-bold text-[#ae3115] bg-orange-100 px-2 py-0.2 rounded-full">
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
