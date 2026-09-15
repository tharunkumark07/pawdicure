import React, { useState } from 'react';
import { Pet } from '../types';
import { useApp } from '../context/AppContext';
import { PET_BADGES_CATALOG, PetBadge } from '../lib/badgeSystem';
import { Award, Lock, Sparkles, Clock, ShieldAlert, ChevronRight, Info, CheckCircle2, Star, Bookmark } from 'lucide-react';

interface PetBadgesSectionProps {
  pet: Pet;
}

export function PetBadgesSection({ pet }: PetBadgesSectionProps) {
  const { badgeProgress, toggleBadgeShowcase } = useApp();
  const [selectedBadge, setSelectedBadge] = useState<PetBadge | null>(null);

  // Blend static catalog with Firestore real-time progress values
  const syncedBadges: PetBadge[] = PET_BADGES_CATALOG.map((badge) => {
    const fireProgress = badgeProgress.find((p) => p.badgeId === badge.id);
    return {
      ...badge,
      isUnlocked: fireProgress ? fireProgress.isUnlocked : false,
      progressPercent: fireProgress ? fireProgress.progressPercent : 0,
      progressLabel: fireProgress ? fireProgress.progressLabel : '0% Completed',
      unlockedAt: fireProgress ? fireProgress.unlockedAt : null,
      showcase: fireProgress ? fireProgress.showcase : false,
    };
  });

  const unlockedCount = syncedBadges.filter((b) => b.isUnlocked).length;
  const pinnedBadges = syncedBadges.filter((b) => b.showcase);

  const getTierColor = (tier: PetBadge['tier']) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-amber-900/10 text-amber-800 border-amber-800/20';
      case 'Silver':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Gold':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Mythic':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Transcendent':
        return 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 text-slate-900 border-amber-400 shadow-xs';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDifficultyBadge = (diff: PetBadge['difficulty']) => {
    switch (diff) {
      case 'Hard':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Extreme':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Insane':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Near Impossible':
        return 'bg-red-900 text-amber-200 border-red-800 font-extrabold';
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
                {unlockedCount} / {syncedBadges.length} Unlocked
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Long-term milestones of devotion. Requires months to years of flawless care.
            </p>
          </div>
        </div>
      </div>

      {/* Pinned Badges Showcase Shelf */}
      {pinnedBadges.length > 0 && (
        <div className="p-3 bg-amber-500/5 border border-amber-200/50 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-900 uppercase">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Showcased Companion Medals</span>
            </span>
            <span>{pinnedBadges.length} / 3</span>
          </div>
          <div className="flex items-center gap-2">
            {pinnedBadges.map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => setSelectedBadge(badge)}
                className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-amber-200 transition text-[11px] font-extrabold text-slate-800"
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Badges Grid (showing all) */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
        {syncedBadges.map((badge) => {
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
              } ${isSelected ? 'ring-2 ring-amber-500 border-transparent' : ''}`}
            >
              {badge.showcase && (
                <div className="absolute right-1 top-1">
                  <Bookmark className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                </div>
              )}

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
                    className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${getTierColor(
                      selectedBadge.tier
                    )}`}
                  >
                    {selectedBadge.tier} Tier
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getDifficultyBadge(
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
                {selectedBadge.isUnlocked ? 'Completed & Awarded 🏆' : selectedBadge.progressLabel} ({selectedBadge.progressPercent}%Completed)
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

          {/* Pin/Unpin actions */}
          {selectedBadge.isUnlocked && (
            <button
              type="button"
              onClick={() => toggleBadgeShowcase(selectedBadge.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 ${
                selectedBadge.showcase
                  ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>{selectedBadge.showcase ? 'Unpin from Showcase' : 'Pin to Showcase'}</span>
            </button>
          )}
        </div>
      )}

      {/* Transcendence Notice */}
      <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-200/60 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          <strong>Guardianship Legacy:</strong> Pet digital badges are prestige icons recognizing extreme long-term care, resilience, and affection. Pinned companion medals show off right on your companion's dashboard!
        </p>
      </div>
    </div>
  );
}
