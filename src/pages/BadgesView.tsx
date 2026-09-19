import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PET_BADGES_CATALOG, PetBadge } from '../lib/badgeSystem';
import {
  Award,
  Lock,
  Sparkles,
  Clock,
  ChevronLeft,
  Info,
  CheckCircle2,
  Filter,
  Search,
  Star,
  Zap,
  Bookmark,
  Compass,
  Trophy,
} from 'lucide-react';

export function BadgesView() {
  const {
    activePet,
    navigate,
    badgeProgress,
    missionProgress,
    toggleBadgeShowcase,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'badges' | 'missions'>('badges');
  const [activeFilter, setActiveFilter] = useState<'all' | 'earned' | 'progress' | 'locked'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<PetBadge | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Suture static catalog with real-time Firestore evaluation progress values
  const syncedBadges: PetBadge[] = PET_BADGES_CATALOG.map((badge) => {
    const fireProgress = badgeProgress.find((p) => p.badgeId === badge.id);
    return {
      ...badge,
      isUnlocked: fireProgress ? fireProgress.isUnlocked : false,
      progressPercent: fireProgress ? fireProgress.progressPercent : 0,
      progressLabel: fireProgress ? fireProgress.progressLabel : `0% Completed`,
      unlockedAt: fireProgress ? fireProgress.unlockedAt : null,
      showcase: fireProgress ? fireProgress.showcase : false,
    };
  });

  const unlockedCount = syncedBadges.filter((b) => b.isUnlocked).length;
  const pinnedBadges = syncedBadges.filter((b) => b.showcase);

  const filteredBadges = syncedBadges.filter((badge) => {
    const matchesCategory = activeCategory === 'all' || badge.category === activeCategory;
    
    let matchesFilter = true;
    if (activeFilter === 'earned') matchesFilter = !!badge.isUnlocked;
    else if (activeFilter === 'progress') matchesFilter = !badge.isUnlocked && (badge.progressPercent || 0) > 0;
    else if (activeFilter === 'locked') matchesFilter = !badge.isUnlocked && (badge.progressPercent || 0) === 0;

    const matchesSearch =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.requirementText.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesFilter && matchesSearch;
  });

  // Server defined missions synced with Firestore tracking progress
  const serverMissions = [
    {
      id: 'mission-ultimate-caregiver',
      title: 'The Ultimate Caregiver',
      description: 'Demonstrate consistent, complete daily routine tasks.',
      category: 'CARE',
      badgeRewardId: 'badge-absolute-caregiver',
      tasks: [
        { id: 'task-100-routines', text: 'Complete 100 routine tasks', target: 100 },
        { id: 'task-30-streak', text: 'Complete 30 consecutive daily check-ins', target: 30 },
        { id: 'task-10-reminders', text: 'Log 10 completed reminders', target: 10 }
      ]
    },
    {
      id: 'mission-lifelong-companion',
      title: 'Lifelong Companion',
      description: 'Forge an unbreakable bond through shared milestones and memories.',
      category: 'RELATIONSHIP',
      badgeRewardId: 'badge-twin-flame',
      tasks: [
        { id: 'task-lvl-15', text: 'Reach Level 15 Bond', target: 15 },
        { id: 'task-20-memories', text: 'Record 20 memories in the journal', target: 20 },
        { id: 'task-3-pillars', text: 'Reach 100% resonance in at least 3 pillars', target: 3 }
      ]
    },
    {
      id: 'mission-guardian-wellness',
      title: 'Guardian of Wellness',
      description: 'Maintain strict healthcare, hydration, and dietary goals.',
      category: 'HEALTH',
      badgeRewardId: 'badge-regimen-specialist',
      tasks: [
        { id: 'task-hydration-7', text: 'Maintain 100% hydration status', target: 1 },
        { id: 'task-15-meds', text: 'Administer 15 scheduled medication doses', target: 15 },
        { id: 'task-3-vaccines', text: 'Verify 3 vaccination records as current', target: 3 }
      ]
    }
  ];

  const syncedMissions = serverMissions.map((m) => {
    const fireProg = missionProgress.find((mp) => mp.missionId === m.id);
    const rewardBadge = syncedBadges.find((b) => b.id === m.badgeRewardId);

    return {
      ...m,
      status: fireProg ? fireProg.status : 'Active',
      completedTasks: fireProg ? (fireProg.completedTasks || []) : [],
      progressPercent: fireProg ? fireProg.progressPercent : 0,
      completedAt: fireProg ? fireProg.completedAt : null,
      rewardBadge
    };
  });

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
        return 'bg-purple-200 text-purple-900 border-purple-400 shadow-xs';
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
    <div className="space-y-4 pb-14 animate-in fade-in duration-200">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-extrabold text-[11px] border border-amber-200 shadow-2xs flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>{unlockedCount} / {syncedBadges.length} Badges Earned</span>
        </span>
      </div>

      {/* Hero Achievement Showcase Strip */}
      {pinnedBadges.length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-black text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Showcased Companionship Medals (Max 3)</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-bold">{pinnedBadges.length} / 3 Pinned</span>
          </div>

          <div className="flex items-center gap-3">
            {pinnedBadges.map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => setSelectedBadge(badge)}
                className="flex items-center gap-2 bg-amber-500/5 hover:bg-amber-500/10 px-3.5 py-2 rounded-2xl border border-amber-200/80 transition text-left"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">{badge.name}</div>
                  <div className="text-[9px] text-amber-800 font-bold leading-none">{badge.tier} Tier</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Mode Toggle Tab bar */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/40">
        <button
          type="button"
          onClick={() => setActiveTab('badges')}
          className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Digital Badges</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('missions')}
          className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'missions'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Active Campaigns</span>
        </button>
      </div>

      {activeTab === 'badges' ? (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filters & Category Strip */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search badges by name, tier, or requirement..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#ff6b4a] shadow-2xs"
                />
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shrink-0">
                {(['all', 'earned', 'progress', 'locked'] as const).map((filt) => (
                  <button
                    key={filt}
                    type="button"
                    onClick={() => setActiveFilter(filt)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase transition ${
                      activeFilter === filt
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filt}
                  </button>
                ))}
              </div>
            </div>

            {/* Care Categories Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Categories 🏅' },
                { id: 'CARE', label: 'Routine Care 🌱' },
                { id: 'HEALTH', label: 'Vaccines & Meds 💊' },
                { id: 'NUTRITION', label: 'Feeds & Water 🍲' },
                { id: 'ACTIVITY', label: 'Activity & Walks 🏃' },
                { id: 'RELATIONSHIP', label: 'Companionship Bond 🔥' },
                { id: 'MEMORIES', label: 'Journal Memories 📸' },
                { id: 'EXPLORATION', label: 'Exploration 🗺️' },
                { id: 'CONSISTENCY', label: 'Streaks & Consistency ⭐' },
                { id: 'SAFETY', label: 'Medical Safety 🔐' },
                { id: 'COMMUNITY', label: 'Caregivers 👥' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition shadow-2xs border ${
                    activeCategory === cat.id
                      ? 'bg-amber-600 border-transparent text-white shadow-xs'
                      : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredBadges.map((badge) => {
              const isSelected = selectedBadge?.id === badge.id;
              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-4 rounded-3xl border transition cursor-pointer relative overflow-hidden ${
                    badge.isUnlocked
                      ? 'bg-[var(--primary-light)] border-[var(--primary-border)] shadow-2xs hover:shadow-md'
                      : 'bg-white border-slate-200/80 opacity-85 hover:opacity-100'
                  } ${isSelected ? 'ring-2 ring-[var(--primary)] border-transparent' : ''}`}
                >
                  {badge.showcase && (
                    <div className="absolute right-3 top-3" title="Pinned to pet profile">
                      <Bookmark className="w-4 h-4 text-amber-500 fill-amber-400" />
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border relative ${
                        badge.isUnlocked
                          ? 'bg-white border-[var(--primary-border)] shadow-2xs'
                          : 'bg-slate-50 border-slate-200 grayscale contrast-75'
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
                          className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${getTierColor(
                            badge.tier
                          )}`}
                        >
                          {badge.tier}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getDifficultyBadge(
                            badge.difficulty
                          )}`}
                        >
                          {badge.difficulty}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{badge.description}</p>

                      <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span className="truncate max-w-[170px]">{badge.requirementText}</span>
                        <span
                          className={
                            badge.isUnlocked ? 'text-emerald-700 font-extrabold' : 'text-slate-600 font-bold'
                          }
                        >
                          {badge.isUnlocked ? 'Unlocked' : badge.progressLabel}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            badge.isUnlocked
                              ? 'bg-emerald-500'
                              : 'bg-[var(--primary)]'
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

          {filteredBadges.length === 0 && (
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center">
              <p className="text-slate-500 text-xs font-medium">No digital companion badges found matching your active filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Active Campaigns list */}
          <div className="space-y-3.5">
            {syncedMissions.map((mission) => {
              const isCompleted = mission.status === 'Completed';
              return (
                <div
                  key={mission.id}
                  className={`bg-white rounded-3xl p-5 border shadow-2xs space-y-4 relative overflow-hidden ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                          {mission.category} Campaign
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>COMPLETED</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-black text-base text-slate-900 mt-1">
                        {mission.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {mission.description}
                      </p>
                    </div>

                    {mission.rewardBadge && (
                      <div className="flex flex-col items-center shrink-0 text-center bg-amber-500/5 px-2.5 py-1.5 rounded-2xl border border-amber-200">
                        <span className="text-2xl">{mission.rewardBadge.icon}</span>
                        <span className="text-[8px] font-extrabold text-amber-800 uppercase mt-0.5">Reward Badge</span>
                      </div>
                    )}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <h4 className="text-[10px] text-slate-400 font-extrabold uppercase">Campaign Milestones</h4>
                    <div className="space-y-1.5">
                      {mission.tasks.map((task) => {
                        const isTaskCompleted = mission.completedTasks.includes(task.id) || isCompleted;
                        return (
                          <div
                            key={task.id}
                            className={`flex items-center justify-between text-xs p-2.5 rounded-xl border ${
                              isTaskCompleted
                                ? 'bg-emerald-500/5 border-emerald-100/80 text-slate-800'
                                : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isTaskCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={isTaskCompleted ? 'line-through opacity-75' : 'font-medium'}>
                                {task.text}
                              </span>
                            </div>
                            <span className="font-bold font-mono text-[11px]">
                              {isTaskCompleted ? 'Done' : 'Active'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Campaign Progress tracker */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Campaign Completion</span>
                      <span className={isCompleted ? 'text-emerald-700 font-extrabold' : 'text-slate-800'}>
                        {mission.progressPercent}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-[var(--primary)]'
                        }`}
                        style={{ width: `${mission.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Modal for Selected Badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getTierColor(
                  selectedBadge.tier
                )}`}
              >
                {selectedBadge.tier} Tier Digital Badge
              </span>
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border shadow-xs ${
                  selectedBadge.isUnlocked
                    ? 'bg-white border-[var(--primary-border)]'
                    : 'bg-slate-100 border-slate-200 grayscale'
                }`}
              >
                {selectedBadge.icon}
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                  {selectedBadge.name}
                </h3>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${getDifficultyBadge(
                    selectedBadge.difficulty
                  )}`}
                >
                  {selectedBadge.difficulty} Challenge
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              {selectedBadge.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/80">
                <span className="font-bold text-amber-900">Estimated Care Time:</span>
                <span className="font-black text-amber-950">{selectedBadge.estimatedTime}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700">Requirement:</span>
                <span className="font-extrabold text-slate-950">{selectedBadge.requirementText}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Current Progress</span>
                <span className={selectedBadge.isUnlocked ? 'text-emerald-700 font-extrabold' : 'text-slate-800'}>
                  {selectedBadge.isUnlocked ? 'Unlocked & Awarded 🏆' : selectedBadge.progressLabel}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedBadge.isUnlocked
                      ? 'bg-emerald-500'
                      : 'bg-[var(--primary)]'
                  }`}
                  style={{ width: `${selectedBadge.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Showcase / Pin to profile toggle action (Only if badge is unlocked!) */}
            {selectedBadge.isUnlocked ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleBadgeShowcase(selectedBadge.id)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 ${
                    selectedBadge.showcase
                      ? 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-600'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{selectedBadge.showcase ? 'Unpin from Companion Showcase' : 'Pin to Companion Showcase'}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  You must complete this extreme milestone to unlock this badge and pin it on {activePet.name}'s profile.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
