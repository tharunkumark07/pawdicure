import { useState } from 'react';
import { Pet, BondMemory, Trophy } from '../types';
import { TROPHIES_LIST } from '../lib/mockData';
import { PetBadgesSection } from '../components/PetBadgesSection';
import {
  Sparkles,
  Camera,
  Check,
  Lock,
  TrendingUp,
  Award,
  Sun,
  ShieldCheck,
  Droplet,
  Heart,
  Flame,
  Scissors,
  CheckCircle2,
} from 'lucide-react';

interface BondViewProps {
  pet: Pet;
  memories: BondMemory[];
  onOpenAddMemory: () => void;
  onInspectPillar: (pillarId: string) => void;
}

export function BondView({
  pet,
  memories,
  onOpenAddMemory,
  onInspectPillar,
}: BondViewProps) {
  // Radial XP calculation
  // Radius = 40, circumference = 2 * PI * 40 = 251.32
  const currentXp = pet.xp ?? 0;
  const nextXp = pet.nextLevelXp || 1000;
  const progressRatio = Math.min(1, Math.max(0, currentXp / nextXp));
  const strokeDashoffset = 251.32 * (1 - progressRatio);

  return (
    <div className="flex flex-col w-full pb-8 space-y-5 animate-in fade-in duration-200">
      {/* Screen Narrative Header */}
      <section className="flex flex-col pt-1 px-1">
        <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#ff6b4a] mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 fill-[#ff6b4a]" />
          <span className="text-xs font-bold tracking-tight">
            Lifetime Connection
          </span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
          Our Journey with {pet.name}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          A lifetime bond built one walk, belly rub, and shared adventure at a time.
        </p>
      </section>

      {/* Section 1: Prominent Gamified Relationship Level Card */}
      <section className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
        {/* Ambient background glows */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-orange-100/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-amber-100/30 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          {/* Card Top Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ae3115] text-white shadow-xs">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Current Resonance
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
              Top 3% Bonded
            </span>
          </div>

          {/* XP Ring and Core Status Block */}
          <div className="flex items-center gap-5 mt-4">
            {/* SVG Radial Gauge */}
            <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  className="text-slate-100"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="9"
                />
                {/* Animated Arc */}
                <circle
                  className="text-[#ff6b4a] transition-all duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeDasharray="251.32"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-heading text-3xl font-extrabold leading-none text-[#ae3115]">
                  {pet.level}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                  Tier Level
                </span>
              </div>
            </div>

            {/* Level Details */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-extrabold text-lg text-slate-900 truncate">
                  {pet.levelTitle}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-amber-500 fill-amber-100 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="font-bold text-[#ae3115]">
                  {(pet.xp ?? 0).toLocaleString()}
                </span>{' '}
                / {(pet.nextLevelXp || 1000).toLocaleString()} Total XP
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-amber-800 text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {Math.max(0, (pet.nextLevelXp || 1000) - (pet.xp ?? 0))} XP to Lvl {(pet.level || 1) + 1}: “Inseparable Duo”
                </span>
              </div>
            </div>
          </div>

          {/* Roadmap Progression Preview Bar */}
          <div className="mt-5 pt-3.5 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600">
                Roadmap Milestones
              </span>
              <span className="text-[10px] text-[#ff6b4a] font-bold">
                Next unlock: Custom Charm 🏷️
              </span>
            </div>

            <div className="relative flex items-center justify-between w-full mt-2 px-1">
              {/* Horizontal connector line */}
              <div className="absolute left-4 right-4 h-1 bg-slate-200 z-0" />
              <div className="absolute left-4 w-1/2 h-1 bg-[#ff6b4a] z-0" />

              {/* Node Lvl 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#ff6b4a] text-white flex items-center justify-center shadow-xs text-[11px] font-bold">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 mt-1">Lvl 1</span>
              </div>

              {/* Node Lvl 5 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#ff6b4a] text-white flex items-center justify-center shadow-xs text-[11px] font-bold">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 mt-1">Lvl 5</span>
              </div>

              {/* Node Lvl 12 (Current Bracket) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#ae3115] text-white flex items-center justify-center shadow-md ring-2 ring-orange-200 text-[11px] font-black">
                  {pet.level}
                </div>
                <span className="text-[10px] text-[#ae3115] font-bold mt-1">Buddies</span>
              </div>

              {/* Node Lvl 20 (Locked) */}
              <div className="relative z-10 flex flex-col items-center opacity-65">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[11px]">
                  <Lock className="w-3 h-3" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Lvl 20</span>
              </div>

              {/* Node Lvl 30 (Locked) */}
              <div className="relative z-10 flex flex-col items-center opacity-45">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[11px]">
                  <Lock className="w-3 h-3" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Lvl 30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Visual Affinity Pillars (8 balance vectors) */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Affinity Pillars
            </h3>
            <p className="text-xs text-slate-500">
              8 balance vectors defining {pet.name}'s harmony
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            Tap node to inspect
          </span>
        </div>

        {/* 2-Column Grid matching screenshot layout */}
        <div className="grid grid-cols-2 gap-2.5">
          {pet.affinityPillars.map((pillar) => (
            <button
              key={pillar.id}
              type="button"
              onClick={() => onInspectPillar(pillar.id)}
              className="flex flex-col p-3.5 rounded-2xl bg-white shadow-xs hover:shadow-md border border-slate-100 transition-all text-left group active:scale-98"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff6b4a] font-bold text-sm">
                  {pillar.id === 'affection' && '❤️'}
                  {pillar.id === 'nutrition' && '🍖'}
                  {pillar.id === 'play' && '🎾'}
                  {pillar.id === 'outdoors' && '🌲'}
                  {pillar.id === 'grooming' && '🛁'}
                  {pillar.id === 'health' && '🩺'}
                  {pillar.id === 'rest' && '🌙'}
                  {pillar.id === 'tricks' && '🎓'}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Lvl {pillar.level}
                </span>
              </div>

              <span className="text-xs font-bold text-slate-900 mt-2.5 truncate">
                {pillar.name}
              </span>

              {/* Resonance Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pillar.category === 'primary'
                      ? 'bg-[#ff6b4a]'
                      : pillar.category === 'secondary'
                      ? 'bg-amber-500'
                      : pillar.category === 'tertiary'
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${pillar.resonance}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 mt-1 self-end font-semibold">
                {pillar.resonance}% resonance
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Interactive Bond Journal & Memory Timeline */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Bond Journal
            </h3>
            <p className="text-xs text-slate-500">
              Cherished milestones &amp; memories together
            </p>
          </div>
          {/* Add Memory Button */}
          <button
            type="button"
            onClick={onOpenAddMemory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ae3115] hover:bg-[#8c1900] text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* Timeline list with vertical connector spine */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="relative flex flex-col bg-white rounded-2xl p-4 shadow-xs border border-slate-100"
            >
              {/* Timeline marker node */}
              <div className="absolute -left-6 top-4 w-3.5 h-3.5 rounded-full bg-[#ff6b4a] ring-4 ring-[#f7f9fd]" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {mem.date}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-[#ae3115] text-[10px] font-bold">
                  +{mem.xp} XP
                </span>
              </div>

              <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                {mem.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {mem.desc}
              </p>

              <div className="flex items-center gap-2.5 mt-3">
                {mem.imageUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-1.5">
                  {mem.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extreme Digital Milestone Badges (Years of Devotion) */}
      <PetBadgesSection pet={pet} />

      {/* Section 4: Unlocked Trophies (6 / 24) */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Unlocked Trophies
            </h3>
            <p className="text-xs text-slate-500">
              6 honors earned through dedicated daily care
            </p>
          </div>
          <span className="text-xs text-[#ae3115] font-bold">6 / 24</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {TROPHIES_LIST.map((trophy) => (
            <div
              key={trophy.id}
              className="flex flex-col items-center text-center p-3 rounded-2xl bg-white shadow-xs border border-slate-100"
            >
              <div className="w-11 h-11 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff6b4a] shadow-xs mb-1.5 font-bold">
                {trophy.id === 't1' && <Sun className="w-5 h-5 text-amber-500" />}
                {trophy.id === 't2' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                {trophy.id === 't3' && <Droplet className="w-5 h-5 text-blue-500" />}
                {trophy.id === 't4' && <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
                {trophy.id === 't5' && <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />}
                {trophy.id === 't6' && <Scissors className="w-5 h-5 text-slate-600" />}
              </div>
              <span className="text-xs text-slate-900 font-bold truncate w-full">
                {trophy.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {trophy.subtitle}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
