import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Footprints,
  Flame,
  Droplet,
  Heart,
  Moon,
  TrendingUp,
  Plus,
  Sparkles,
  Calendar,
} from 'lucide-react';

export function StatsView() {
  const {
    activePet,
    logActivity,
    refreshWater,
    showToast,
  } = useApp();

  const handleLogWalk = () => {
    logActivity(
      'walk',
      `Afternoon Agility Walk with ${activePet.name}`,
      35,
      1200
    );
    showToast(`Logged 35m walk (+1,200 steps, +50 XP)!`, 'success', '🐕');
  };

  return (
    <div className="flex flex-col w-full pb-12 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 rounded-3xl p-4 sm:p-5 border border-orange-100 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-orange-900 shadow-2xs mb-1">
            <Activity className="w-3 h-3 text-[#ff6b4a]" />
            <span>PAW Insights &amp; Analytics</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            {activePet.name}'s Vitals
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Realtime biometric telemetry &amp; daily goal tracking
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogWalk}
          className="px-3.5 py-2 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Walk</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Steps */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Daily Steps
            </span>
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#ff6b4a] flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">
            {(activePet.stepsToday ?? (activePet.species === 'Cat' ? 3200 : 8250)).toLocaleString()}
          </div>
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.min(100, ((activePet.stepsToday ?? (activePet.species === 'Cat' ? 3200 : 8250)) / (activePet.stepsGoal ?? 10000)) * 100)}%`,
                }}
                className="bg-[#ff6b4a] h-full rounded-full transition-all"
              />
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Goal: {(activePet.stepsGoal ?? 10000).toLocaleString()}</span>
              <span className="font-bold text-[#ff6b4a]">
                {Math.round(((activePet.stepsToday ?? (activePet.species === 'Cat' ? 3200 : 8250)) / (activePet.stepsGoal ?? 10000)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Active Calories */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Burn
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">
            {activePet.caloriesBurned ?? (activePet.species === 'Cat' ? 145 : 420)} <span className="text-xs text-slate-400">kcal</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Metabolic Base: {activePet.dailyCaloriesGoal || (activePet.species === 'Cat' ? 240 : 1240)} kcal/day
          </p>
        </div>

        {/* Hydration */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hydration
            </span>
            <button
              type="button"
              onClick={refreshWater}
              className="w-7 h-7 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-600 flex items-center justify-center transition"
              title="Refresh bowl (+150ml)"
            >
              <Droplet className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">
            {activePet.hydrationPercent ?? 77}%
          </div>
          <div className="text-[10px] text-slate-500">
            {activePet.currentMl ?? activePet.hydrationMl ?? (activePet.species === 'Cat' ? 180 : 580)} / {activePet.goalMl ?? (activePet.species === 'Cat' ? 250 : 750)} ml consumed
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Resting BPM
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">
            {activePet.restingBpm ?? 74} <span className="text-xs text-slate-400">BPM</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">
            Normal cardiac sinus
          </p>
        </div>
      </div>

      {/* Sleep & Rest Analysis */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Sleep &amp; Rest Cycles
            </h3>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {activePet.sleepHours ?? (activePet.species === 'Cat' ? 13.5 : 9.2)}h Recorded Today
          </span>
        </div>

        {/* Sleep Distribution Bars */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>Deep REM Rest</span>
            <span>5.2 hrs (52%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div style={{ width: '52%' }} className="bg-indigo-600 h-full" />
            <div style={{ width: '33%' }} className="bg-indigo-400 h-full" />
            <div style={{ width: '15%' }} className="bg-indigo-200 h-full" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" /> Deep REM
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400" /> Light Snooze
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-200" /> Nap Intervals
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline Breakdown */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Today's Activity Breakdown
          </h3>
          <button
            type="button"
            onClick={handleLogWalk}
            className="text-xs font-bold text-[#ff6b4a] hover:underline"
          >
            + Add Activity
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {[
            {
              title: 'Morning Forest Sniffari',
              time: '07:30 AM',
              duration: '45 mins',
              steps: '3,800 steps',
              calories: '180 kcal',
              icon: '🌲',
            },
            {
              title: 'Backyard Flirt Pole Play',
              time: '12:15 PM',
              duration: '20 mins',
              steps: '1,450 steps',
              calories: '95 kcal',
              icon: '🎾',
            },
            {
              title: 'Evening Neighborhood Stroll',
              time: '05:45 PM',
              duration: '35 mins',
              steps: '3,000 steps',
              calories: '140 kcal',
              icon: '🐕',
            },
          ].map((act, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{act.icon}</span>
                <div>
                  <div className="font-bold text-slate-900">{act.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {act.time} • {act.duration}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#ff6b4a]">{act.steps}</div>
                <div className="text-[10px] text-slate-400">{act.calories}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
