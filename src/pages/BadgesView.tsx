import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { evaluatePetBadges, PetBadge } from '../lib/badgeSystem';
import {
  Award,
  Lock,
  Sparkles,
  Clock,
  ChevronLeft,
  Info,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Filter,
  Search,
  Star,
  Zap,
} from 'lucide-react';

export function BadgesView() {
  const { activePet, navigate } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<ReturnType<typeof evaluatePetBadges>[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const evaluatedBadges = evaluatePetBadges(activePet);
  const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const pillarsCount = (activePet.affinityPillars || []).filter((p) => p.resonance >= 100).length;

  const filteredBadges = evaluatedBadges.filter((badge) => {
    const matchesCategory = activeCategory === 'all' || badge.category === activeCategory;
    const matchesSearch =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.tier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTierColor = (tier: PetBadge['tier']) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-amber-900/10 text-amber-800 border-amber-800/20';
      case 'Silver':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      case 'Gold':
        return 'bg-amber-400/20 text-amber-900 border-amber-400/40';
      case 'Mythic':
        return 'bg-purple-500/20 text-purple-900 border-purple-500/30';
      case 'Transcendent':
        return 'bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-purple-500/30 text-slate-900 border-amber-400/50 shadow-xs animate-pulse';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDifficultyBadge = (diff: PetBadge['difficulty']) => {
    switch (diff) {
      case 'Hard':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Extreme':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Insane':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Near Impossible':
        return 'bg-red-900 text-amber-200 border-red-700 font-black shadow-2xs';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-200">
            🏆 {unlockedCount} / {evaluatedBadges.length} Badges Earned
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-zinc-900 to-amber-950 text-white rounded-3xl p-5 shadow-lg border border-amber-500/20 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>YEARS OF DEVOTION HALL OF FAME</span>
            </div>
            <h1 className="font-heading font-black text-2xl text-white tracking-tight">
              {activePet.name}'s Digital Badges
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prestige digital icons recognizing lifelong commitment, high-tier XP thresholds, and 100% pillar resonance. No tangible shop rewards — strictly non-commercial marks of honor.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shrink-0 flex items-center justify-center text-3xl">
            🪐
          </div>
        </div>

        {/* Quick Stats Counter Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-2xl p-2 border border-white/5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Bond XP</div>
            <div className="text-sm font-black text-amber-300 mt-0.5">
              {(activePet.xp || 0).toLocaleString()} XP
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2 border border-white/5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">100% Pillars</div>
            <div className="text-sm font-black text-emerald-400 mt-0.5">
              {pillarsCount} / 7
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2 border border-white/5">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Apex Progress</div>
            <div className="text-sm font-black text-rose-300 mt-0.5">
              {evaluatedBadges.find((b) => b.id === 'badge-eternal-transcendence')?.progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges by name, tier, or requirement..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#ff6b4a] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Badges 🏅' },
            { id: 'xp', label: 'XP Milestones ⚡' },
            { id: 'pillar', label: 'Pillar Zenith 👑' },
            { id: 'devotion', label: 'Lifelong Care 🌌' },
            { id: 'legendary', label: 'Near Impossible 🪐' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition shadow-2xs ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Cards List / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredBadges.map((badge) => {
          const isSelected = selectedBadge?.id === badge.id;
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-3xl border transition cursor-pointer relative overflow-hidden ${
                badge.isUnlocked
                  ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white border-amber-300 shadow-2xs hover:shadow-md'
                  : 'bg-white border-slate-200/80 opacity-85 hover:opacity-100'
              } ${isSelected ? 'ring-2 ring-[#ff6b4a] border-transparent' : ''}`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border relative ${
                    badge.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-100 to-orange-100 border-amber-300 shadow-2xs'
                      : 'bg-slate-100 border-slate-200 grayscale contrast-75'
                  }`}
                >
                  {badge.icon}
                  {!badge.isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white">
                      <Lock className="w-3 h-3 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 truncate">
                      {badge.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getTierColor(
                        badge.tier
                      )}`}
                    >
                      {badge.tier}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyBadge(
                        badge.difficulty
                      )}`}
                    >
                      {badge.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{badge.description}</p>

                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span className="truncate max-w-[170px]">{badge.requirementText}</span>
                    <span
                      className={
                        badge.isUnlocked ? 'text-emerald-700 font-black' : 'text-slate-700 font-bold'
                      }
                    >
                      {badge.isUnlocked ? 'Unlocked 🏆' : `${badge.progressPercent}%`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.isUnlocked
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'bg-gradient-to-r from-amber-400 to-[#ff6b4a]'
                      }`}
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal / Bottom Drawer for Selected Badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getTierColor(
                  selectedBadge.tier
                )}`}
              >
                {selectedBadge.tier} Tier Digital Badge
              </span>
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border shadow-xs ${
                  selectedBadge.isUnlocked
                    ? 'bg-gradient-to-tr from-amber-100 to-orange-100 border-amber-300'
                    : 'bg-slate-100 border-slate-200 grayscale'
                }`}
              >
                {selectedBadge.icon}
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900">
                  {selectedBadge.name}
                </h3>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getDifficultyBadge(
                    selectedBadge.difficulty
                  )}`}
                >
                  {selectedBadge.difficulty} Challenge
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              {selectedBadge.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/80">
                <span className="font-bold text-amber-900">Estimated Care Time:</span>
                <span className="font-black text-amber-950">{selectedBadge.estimatedTime}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700">Requirement:</span>
                <span className="font-extrabold text-slate-900">{selectedBadge.requirementText}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Current Progress</span>
                <span className={selectedBadge.isUnlocked ? 'text-emerald-700' : 'text-slate-800'}>
                  {selectedBadge.isUnlocked ? 'Unlocked & Awarded 🏆' : selectedBadge.progressLabel}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedBadge.isUnlocked
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      : 'bg-gradient-to-r from-amber-400 to-[#ff6b4a]'
                  }`}
                  style={{ width: `${selectedBadge.progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
            >
              Close Badge Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
