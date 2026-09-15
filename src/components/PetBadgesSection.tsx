import React, { useState } from 'react';
import { Pet } from '../types';
import { evaluatePetBadges, PetBadge } from '../lib/badgeSystem';
import { Award, Lock, Sparkles, Clock, ShieldAlert, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

interface PetBadgesSectionProps {
  pet: Pet;
}

export function PetBadgesSection({ pet }: PetBadgesSectionProps) {
  const evaluatedBadges = evaluatePetBadges(pet);
  const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const [selectedBadge, setSelectedBadge] = useState<typeof evaluatedBadges[0] | null>(null);

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
        return 'bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-purple-500/30 text-slate-900 border-amber-400/50 shadow-sm animate-pulse';
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
        return 'bg-red-900 text-amber-200 border-red-700 shadow-xs font-black';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#ff6b4a] flex items-center justify-center text-white shadow-2xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-sm text-slate-900">
                Digital Companion Badges
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                {unlockedCount} / {evaluatedBadges.length} Unlocked
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Long-term milestones of devotion. Requires months to years of flawless care.
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
        {evaluatedBadges.map((badge) => {
          const isSelected = selectedBadge?.id === badge.id;
          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => setSelectedBadge(badge)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition relative text-center group ${
                badge.isUnlocked
                  ? 'bg-gradient-to-b from-amber-500/10 to-orange-500/5 border-amber-300/80 shadow-2xs hover:scale-105 active:scale-95'
                  : 'bg-slate-50/80 border-slate-200/80 opacity-60 hover:opacity-100'
              } ${isSelected ? 'ring-2 ring-[#ff6b4a] border-transparent' : ''}`}
            >
              {/* Badge Icon */}
              <div className="relative text-2xl mb-1 filter drop-shadow-xs flex items-center justify-center w-9 h-9">
                <span className={badge.isUnlocked ? '' : 'grayscale contrast-50'}>{badge.icon}</span>
                {!badge.isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800/80 text-white flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Title */}
              <span className="text-[10px] font-bold text-slate-800 line-clamp-1 w-full leading-tight">
                {badge.name}
              </span>

              {/* Progress Mini Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    badge.isUnlocked
                      ? 'bg-gradient-to-r from-amber-400 to-[#ff6b4a]'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${badge.progressPercent}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Badge Detail Box */}
      {selectedBadge && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                  selectedBadge.isUnlocked
                    ? 'bg-gradient-to-tr from-amber-100 to-orange-100 border-amber-300 shadow-xs'
                    : 'bg-slate-200/60 border-slate-300 grayscale'
                }`}
              >
                {selectedBadge.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900">
                    {selectedBadge.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getTierColor(
                      selectedBadge.tier
                    )}`}
                  >
                    {selectedBadge.tier} Tier
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyBadge(
                      selectedBadge.difficulty
                    )}`}
                  >
                    {selectedBadge.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{selectedBadge.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-bold"
            >
              Close
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                <strong>Est. Dedication:</strong> {selectedBadge.estimatedTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Requirement:</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                {selectedBadge.requirementText}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-600">Current Progress</span>
              <span className={selectedBadge.isUnlocked ? 'text-emerald-700 font-extrabold' : 'text-slate-700'}>
                {selectedBadge.isUnlocked ? 'Completed & Awarded 🏆' : selectedBadge.progressLabel} ({selectedBadge.progressPercent}%)
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
        </div>
      )}

      {/* Transcendence Notice */}
      <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-200/60 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          <strong>Guardianship Legacy:</strong> Pet digital badges are prestige icons recognizing extreme long-term care, resilience, and affection. The apex <strong>Eternal Bond of Eternity</strong> badge demands 100,000 XP and absolute 100% resonance across every pillar.
        </p>
      </div>
    </div>
  );
}
