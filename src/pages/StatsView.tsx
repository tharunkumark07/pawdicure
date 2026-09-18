import React from 'react';
import { useApp } from '../context/AppContext';
import { Gauge } from '../components/Gauge';
import { AnimatedChart } from '../components/AnimatedChart';
import { ShinyText } from '../components/ui/reactbits/ShinyText';
import { GradientText } from '../components/ui/reactbits/GradientText';
import { TiltedCard } from '../components/ui/reactbits/TiltedCard';
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
  ShieldCheck,
  Scale,
  Brain,
  Info,
  Award,
} from 'lucide-react';

export function StatsView() {
  const {
    activePet,
    logActivity,
    refreshWater,
    showToast,
  } = useApp();

  // 5 Core Pillars Mapping for Overall Wellness Gauge
  const pillars = activePet.affinityPillars || [];
  const getPillarLevel = (key: string, fallback: number) => {
    const p = pillars.find((item) => item.name.toLowerCase().includes(key) || item.id.toLowerCase().includes(key));
    return p ? p.level * 10 : fallback;
  };
  const hygieneVal = Math.min(100, Math.max(15, getPillarLevel('hygiene', 85)));
  const nutritionVal = Math.min(100, Math.max(15, activePet.nutritionPercent ?? getPillarLevel('nutrition', 88)));
  const hydrationVal = Math.min(100, Math.max(15, activePet.hydrationPercent ?? getPillarLevel('hydration', 77)));
  const activityVal = Math.min(100, Math.max(15, getPillarLevel('activity', 92)));
  const careVal = Math.min(100, Math.max(15, activePet.careScore ?? getPillarLevel('medical', 90)));

  const overallWellness = Number(((hygieneVal + nutritionVal + hydrationVal + activityVal + careVal) / 5).toFixed(3));

  // Safe KPI calculations capped at max 3 decimal places
  const stepsToday = activePet.stepsToday ?? (activePet.species === 'Cat' ? 3200 : 8250);
  const formattedStepsToday = Number(stepsToday.toFixed(3));
  const stepsGoalVal = activePet.stepsGoal || 10000;
  const stepsPercent = Number(((stepsToday / (stepsGoalVal || 1)) * 100).toFixed(3));

  const caloriesBurned = activePet.caloriesBurned ?? (activePet.species === 'Cat' ? 145 : 420);
  const formattedCalories = Number(caloriesBurned.toFixed(3));
  const dailyCaloriesGoal = activePet.dailyCaloriesGoal || (activePet.species === 'Cat' ? 240 : 1240);
  const formattedCaloriesGoal = Number(dailyCaloriesGoal.toFixed(3));

  const hydrationPercent = activePet.hydrationPercent ?? 77;
  const formattedHydrationPercent = Number(hydrationPercent.toFixed(3));
  const hydrationMl = activePet.currentMl ?? activePet.hydrationMl ?? (activePet.species === 'Cat' ? 180 : 580);
  const formattedHydrationMl = Number(hydrationMl.toFixed(3));
  const goalMl = activePet.goalMl ?? (activePet.species === 'Cat' ? 250 : 750);
  const formattedGoalMl = Number(goalMl.toFixed(3));

  const restingBpm = activePet.restingBpm ?? 74;
  const formattedRestingBpm = Number(restingBpm.toFixed(3));

  // 7-day step history data for AnimatedChart
  const isDog = activePet.species !== 'Cat';
  const stepsGoal = activePet.stepsGoal || 10000;
  const weeklyStepsData = [
    { label: 'Mon', value: isDog ? 8400 : 3100, secondary: `${isDog ? 410 : 135} kcal • 40m` },
    { label: 'Tue', value: isDog ? 10200 : 3800, secondary: `${isDog ? 490 : 160} kcal • 55m` },
    { label: 'Wed', value: isDog ? 7600 : 2900, secondary: `${isDog ? 370 : 120} kcal • 35m` },
    { label: 'Thu', value: isDog ? 11500 : 4200, secondary: `${isDog ? 540 : 180} kcal • 65m` },
    { label: 'Fri', value: isDog ? 9100 : 3400, secondary: `${isDog ? 430 : 145} kcal • 45m` },
    { label: 'Sat', value: isDog ? 12800 : 4500, secondary: `${isDog ? 610 : 195} kcal • 75m` },
    { label: 'Sun', value: activePet.stepsToday ?? (isDog ? 8250 : 3200), secondary: `${activePet.caloriesBurned ?? (isDog ? 420 : 145)} kcal • 50m` },
  ];

  // 6-Month weight log data for AnimatedChart
  const currentWeight = activePet.weight || (activePet.species === 'Cat' ? 4.5 : 18.2);
  const targetWeight = activePet.species === 'Cat' ? 4.2 : 17.5;
  const weightHistoryData = [
    { label: 'Apr', value: Number((currentWeight + 1.2).toFixed(3)) },
    { label: 'May', value: Number((currentWeight + 0.9).toFixed(3)) },
    { label: 'Jun', value: Number((currentWeight + 0.6).toFixed(3)) },
    { label: 'Jul', value: Number((currentWeight + 0.3).toFixed(3)) },
    { label: 'Aug', value: Number((currentWeight + 0.1).toFixed(3)) },
    { label: 'Sep', value: Number(currentWeight.toFixed(3)) },
  ];

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
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-16 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-rose-500/15 backdrop-blur-md rounded-3xl p-5 sm:p-6 lg:p-7 border border-orange-200/70 shadow-xs shadow-orange-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/90 text-xs font-bold text-orange-900 shadow-2xs mb-2 border border-orange-200/60">
            <Activity className="w-3.5 h-3.5 text-[#ff6b4a] animate-pulse" />
            <ShinyText text="PAW Insights &amp; Analytics" speed={4} />
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            <GradientText colors={['#ff6b4a', '#ff9800', '#ec4899', '#ff6b4a']}>{activePet.name}'s Premium Telemetry</GradientText>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Realtime high-precision biometric tracking &amp; predictive diagnostic advice
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogWalk}
          className="px-4 py-2.5 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Walk</span>
        </button>
      </div>

      {/* Main KPI Stats Grid with Hover-responsive 3D Physics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        {/* Steps */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-3">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Steps
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#ff6b4a] flex items-center justify-center shrink-0 shadow-2xs">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading z-10 relative">
              {formattedStepsToday.toLocaleString()}
            </div>
            <div className="space-y-1.5 z-10 relative">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div
                  style={{
                    width: `${Math.min(100, stepsPercent)}%`,
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all"
                />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 flex justify-between font-medium">
                <span>Goal: {stepsGoalVal.toLocaleString()}</span>
                <span className="font-bold text-[#ff6b4a]">
                  {stepsPercent}%
                </span>
              </div>
            </div>
          </div>
        </TiltedCard>

        {/* Active Calories */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-3">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Burn
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading z-10 relative">
              {formattedCalories} <span className="text-xs sm:text-sm text-slate-400 font-normal">kcal</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium z-10 relative">
              Base: {formattedCaloriesGoal} kcal/day
            </p>
          </div>
        </TiltedCard>

        {/* Hydration */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-3">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Hydration
              </span>
              <button
                type="button"
                onClick={refreshWater}
                className="w-8 h-8 rounded-xl bg-sky-100/80 hover:bg-sky-200 text-sky-600 flex items-center justify-center transition active:scale-95 shrink-0 shadow-2xs"
                title="Refresh bowl (+150ml)"
              >
                <Droplet className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading z-10 relative">
              {formattedHydrationPercent}%
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium z-10 relative">
              {formattedHydrationMl} / {formattedGoalMl} ml
            </div>
          </div>
        </TiltedCard>

        {/* Heart Rate */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-3">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Resting BPM
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading z-10 relative">
              {formattedRestingBpm} <span className="text-xs sm:text-sm text-slate-400 font-normal">BPM</span>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-600 font-bold flex items-center gap-1 z-10 relative">
              Normal cardiac sinus
            </p>
          </div>
        </TiltedCard>
      </div>

      {/* Main Analytics Row: Wellness Indices & Weekly Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch animate-in slide-in-from-bottom duration-350 delay-75">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          <Gauge
            value={overallWellness}
            label="Overall Wellness Index"
            sublabel="Biometric Core"
            color="orange"
            icon={<Sparkles className="w-4 h-4" />}
          />
          <Gauge
            value={careVal}
            label="Care &amp; Health Score"
            sublabel="Vitals Balance"
            color="indigo"
            icon={<ShieldCheck className="w-4 h-4" />}
          />
        </div>

        <AnimatedChart
          data={weeklyStepsData}
          title="7-Day Step Telemetry"
          subtitle="Continuous walking &amp; agility tracker"
          color="rose"
          unit="steps"
          goalValue={stepsGoal}
          icon={<Footprints className="w-4.5 h-4.5" />}
        />
      </div>

      {/* Secondary Analytics Row: Weight Telemetry + Sleep & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start animate-in slide-in-from-bottom duration-350 delay-150">
        <AnimatedChart
          data={weightHistoryData}
          title="Weight &amp; Mass Trend"
          subtitle="6-Month pediatric weight monitoring log"
          color="indigo"
          unit="kg"
          goalValue={targetWeight}
          icon={<Scale className="w-4.5 h-4.5" />}
        />

        <div className="space-y-6 lg:space-y-8">
          {/* Sleep & Rest Analysis */}
          <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-7 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-indigo-100/80 text-indigo-600 shadow-2xs">
                  <Moon className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                  Sleep &amp; Rest Cycles
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 bg-indigo-50/90 border border-indigo-200/60 px-3 py-1 rounded-full shadow-2xs">
                {Number((activePet.sleepHours ?? (activePet.species === 'Cat' ? 13.5 : 9.2)).toFixed(3))}h Recorded
              </span>
            </div>

            {/* Sleep Distribution Bars */}
            <div className="space-y-2.5 pt-1 z-10 relative">
              <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                <span>Deep REM Rest</span>
                <span className="font-mono text-slate-500">5.2 hrs (52%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: '52%' }} className="bg-indigo-600 h-full" />
                <div style={{ width: '33%' }} className="bg-indigo-400 h-full" />
                <div style={{ width: '15%' }} className="bg-indigo-200 h-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Deep REM
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Light Snooze
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-200" /> Nap Intervals
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Breakdown */}
          <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-7 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between z-10 relative">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                Today's Activity Breakdown
              </h3>
              <button
                type="button"
                onClick={handleLogWalk}
                className="text-xs font-bold text-[#ff6b4a] hover:underline flex items-center gap-1"
              >
                + Add Activity
              </button>
            </div>

            <div className="space-y-3 pt-1">
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
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-white hover:border-orange-200/60 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{act.icon}</span>
                    <div>
                      <div className="font-bold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {act.time} • {act.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#ff6b4a]">{act.steps}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{act.calories}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacious, Advanced Vet-Telemetry Insights Advisor Section (Non-Compact, Glassmorphic, Rich in Info) */}
      <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-8 animate-in slide-in-from-bottom duration-350 delay-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                <Brain className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                AI Companion Core Advisor
              </span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Veterinary Telemetry Insights &amp; Adaptive Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Continuous biometric modeling &amp; personalized physiological conditioning feedback
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 font-bold shadow-2xs shrink-0">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Updated real-time • Confidence 98.7%</span>
          </div>
        </div>

        {/* 3-Column Highly Detailed Tilted Advisor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: Conditioning Profile */}
          <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
            <div className="bg-white/90 backdrop-blur-[12px] p-6 rounded-3xl border border-white/50 shadow-md shadow-slate-200/30 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-500">
                    Cardio Fitness Profile
                  </span>
                  <span className="text-xl">🏆</span>
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                  Activity &amp; Agility Advisor
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Daily steps reached <span className="font-bold text-[#ff6b4a]">{stepsPercent}%</span> of target. Based on today's telemetry, {activePet.name} has logged high-quality muscular and metabolic output.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Recommended Recovery</span>
                    <span className="font-mono text-[#ff6b4a]">{Number((stepsPercent * 0.12).toFixed(3))} hrs</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Aerobic Output Quotient</span>
                    <span className="font-mono text-emerald-600">{(stepsToday / 120).toFixed(3)} AQ</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-auto">
                💡 <span className="font-semibold text-slate-700">Vet Tip:</span> Ensure an active warmdown and dynamic pacing after long forest hikes.
              </div>
            </div>
          </TiltedCard>

          {/* Card 2: Hydration Index */}
          <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
            <div className="bg-white/90 backdrop-blur-[12px] p-6 rounded-3xl border border-white/50 shadow-md shadow-slate-200/30 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-500">
                    Intracellular Hydration
                  </span>
                  <span className="text-xl">💧</span>
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                  Hydration &amp; Renal Index
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Current water intake sits at <span className="font-bold text-sky-600">{formattedHydrationMl} ml</span>. Intracellular saturation levels are stable, reducing workload on the renal system.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Optimal Goal Water</span>
                    <span className="font-mono text-sky-600">{Number((formattedGoalMl * 1.15).toFixed(3))} ml</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Electrolyte Saturation</span>
                    <span className="font-mono text-emerald-600">97.4%</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-auto">
                💡 <span className="font-semibold text-slate-700">Species Tip:</span> {activePet.species === 'Cat' ? 'Cats thrive with running water fountains to trigger natural hydration instincts.' : 'Dogs need fresh bowl refills every 4-6 hours to prevent bacterial buildup.'}
              </div>
            </div>
          </TiltedCard>

          {/* Card 3: Weight Conditioning */}
          <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
            <div className="bg-white/90 backdrop-blur-[12px] p-6 rounded-3xl border border-white/50 shadow-md shadow-slate-200/30 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Weight &amp; Mass Index
                  </span>
                  <span className="text-xl">⚖️</span>
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                  Pediatric Weight Assessment
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Current weight is <span className="font-bold text-indigo-600">{currentWeight.toFixed(3)} kg</span> vs target <span className="font-bold text-slate-600">{targetWeight.toFixed(3)} kg</span>. There is a small variation of <span className="font-bold text-indigo-500">{Number(Math.abs(currentWeight - targetWeight).toFixed(3))} kg</span>.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Deviation from Mean</span>
                    <span className="font-mono text-indigo-600">{(Math.abs(currentWeight - targetWeight) / currentWeight * 100).toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Dietary Protein Target</span>
                    <span className="font-mono text-emerald-600">{(currentWeight * 3.2).toFixed(3)} g/day</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-auto">
                💡 <span className="font-semibold text-slate-700">Nutritional Tip:</span> Ensure high protein intake with premium raw or organic kibble formulas.
              </div>
            </div>
          </TiltedCard>

        </div>
      </div>
    </div>
  );
}

