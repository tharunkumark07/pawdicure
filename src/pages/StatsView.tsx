import React from 'react';
import { useApp } from '../context/AppContext';
import { Gauge } from '../components/Gauge';
import { AnimatedChart } from '../components/AnimatedChart';
import { WeeklyHealthChart } from '../components/WeeklyHealthChart';
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

      {/* Main KPI Stats Grid with Hover-responsive 3D Physics (Spacious, Big, Non-Compact) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Steps */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-5">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
                Daily Steps
              </span>
              <div className="w-11 h-11 rounded-2xl bg-orange-100/80 text-[#ff6b4a] flex items-center justify-center shrink-0 shadow-2xs">
                <Footprints className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading z-10 relative tracking-tight">
              {formattedStepsToday.toLocaleString()}
            </div>
            <div className="space-y-2 z-10 relative">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  style={{
                    width: `${Math.min(100, stepsPercent)}%`,
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all"
                />
              </div>
              <div className="text-xs text-slate-500 flex justify-between font-bold">
                <span>Goal: {stepsGoalVal.toLocaleString()}</span>
                <span className="font-black text-[#ff6b4a]">
                  {stepsPercent}%
                </span>
              </div>
            </div>
          </div>
        </TiltedCard>

        {/* Active Calories */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-5">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
                Active Burn
              </span>
              <div className="w-11 h-11 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Flame className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading z-10 relative tracking-tight">
              {formattedCalories} <span className="text-sm sm:text-base text-slate-400 font-normal">kcal</span>
            </div>
            <p className="text-xs text-slate-500 font-bold z-10 relative bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
              Base Daily Goal: <span className="text-rose-600 font-black">{formattedCaloriesGoal}</span> kcal
            </p>
          </div>
        </TiltedCard>

        {/* Hydration */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-5">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-sky-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
                Hydration
              </span>
              <button
                type="button"
                onClick={refreshWater}
                className="w-11 h-11 rounded-2xl bg-sky-100/80 hover:bg-sky-200 text-sky-600 flex items-center justify-center transition active:scale-95 shrink-0 shadow-2xs"
                title="Refresh bowl (+150ml)"
              >
                <Droplet className="w-5.5 h-5.5 animate-bounce" />
              </button>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading z-10 relative tracking-tight">
              {formattedHydrationPercent}%
            </div>
            <div className="text-xs text-slate-500 font-bold z-10 relative bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
              Vitals Intake: <span className="text-sky-600 font-black">{formattedHydrationMl}</span> / {formattedGoalMl} ml
            </div>
          </div>
        </TiltedCard>

        {/* Heart Rate */}
        <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
          <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-5">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
                Resting BPM
              </span>
              <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Heart className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading z-10 relative tracking-tight">
              {formattedRestingBpm} <span className="text-sm sm:text-base text-slate-400 font-normal">BPM</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold text-xs w-fit z-10 relative">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Normal cardiac sinus</span>
            </div>
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

      {/* Secondary Analytics Row: Interactive Weekly Health Area Chart + Sleep & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch animate-in slide-in-from-bottom duration-350 delay-150">
        <WeeklyHealthChart petName={activePet.name} species={activePet.species} />

        <div className="flex flex-col gap-6 lg:gap-8 h-full">
          {/* Sleep & Rest Analysis */}
          <div className="flex-1 bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-7 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-4 relative overflow-hidden flex flex-col justify-between">
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
          <div className="flex-1 bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-7 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-4 relative overflow-hidden flex flex-col justify-between">
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
              {(activePet.species === 'Cat' ? [
                {
                  title: 'Morning Scratching Post Session',
                  time: '08:00 AM',
                  duration: '15 mins',
                  steps: '400 steps',
                  calories: '25 kcal',
                  icon: '🐾',
                },
                {
                  title: 'Feather Wand & Laser Chase',
                  time: '01:30 PM',
                  duration: '12 mins',
                  steps: '800 steps',
                  calories: '45 kcal',
                  icon: '🪶',
                },
                {
                  title: 'Sunbeam Stretching & Groom',
                  time: '04:15 PM',
                  duration: '30 mins',
                  steps: '200 steps',
                  calories: '15 kcal',
                  icon: '☀️',
                },
              ] : [
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
              ]).map((act, i) => (
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

      {/* Interactive Biometric Conditioning Target Planner & Vet Threshold Reference Section */}
      <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-8 animate-in slide-in-from-bottom duration-350 delay-200">
        
        {/* Dynamic Header with Profile Switchers */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                <Activity className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b4a]">
                Biometric Planner
              </span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Interactive Conditioning Targets &amp; Clinical Thresholds
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Select an activity target profile to dynamically calibrate biometric goals, safety limits, and physiological targets.
            </p>
          </div>

          {/* Actionable Profile Buttons */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 shadow-2xs w-full sm:w-auto overflow-x-auto shrink-0">
            {[
              { id: 'active', label: 'Standard Active', icon: '🏃' },
              { id: 'conditioning', label: 'Athletic Builder', icon: '⚡' },
              { id: 'recovery', label: 'Low Impact / Rec', icon: '🍃' },
            ].map((prof) => {
              const isActive = (React as any).useMemo ? false : false; // Will check state below
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('stats-target-planner-root');
                    if (el) {
                      const event = new CustomEvent('change-profile', { detail: prof.id });
                      el.dispatchEvent(event);
                    }
                  }}
                  id={`btn-profile-${prof.id}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>{prof.icon}</span>
                  <span>{prof.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* State Holder Wrapper & Event Handler */}
        <div id="stats-target-planner-root" className="space-y-8">
          {(() => {
            const [activeProfile, setActiveProfile] = React.useState<'active' | 'conditioning' | 'recovery'>('active');

            React.useEffect(() => {
              const root = document.getElementById('stats-target-planner-root');
              const handleProfileChange = (e: Event) => {
                const newProfile = (e as CustomEvent).detail;
                setActiveProfile(newProfile);
                showToast(
                  `Calibrated biometric guidelines for ${newProfile === 'conditioning' ? 'Athletic Conditioning' : newProfile === 'recovery' ? 'Low-Impact Rest & Recovery' : 'Standard Daily Routine'}! 🚀`,
                  'success',
                  '📊'
                );
              };
              root?.addEventListener('change-profile', handleProfileChange);
              return () => {
                root?.removeEventListener('change-profile', handleProfileChange);
              };
            }, []);

            // Set up button active classes dynamically
            React.useEffect(() => {
              ['active', 'conditioning', 'recovery'].forEach((id) => {
                const btn = document.getElementById(`btn-profile-${id}`);
                if (btn) {
                  if (id === activeProfile) {
                    btn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition bg-slate-900 text-white shadow-sm";
                  } else {
                    btn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition text-slate-500 hover:text-slate-900 hover:bg-slate-200/50";
                  }
                }
              });
            }, [activeProfile]);

            // Calculated values depending on profile
            const targetSteps = activeProfile === 'conditioning'
              ? Math.round(stepsGoal * 1.4)
              : activeProfile === 'recovery'
              ? Math.round(stepsGoal * 0.6)
              : stepsGoal;

            const targetHydration = activeProfile === 'conditioning'
              ? Math.round(goalMl * 1.25)
              : activeProfile === 'recovery'
              ? Math.round(goalMl * 0.85)
              : goalMl;

            const targetBpm = activeProfile === 'conditioning'
              ? '110 - 150 bpm (Aerobic state)'
              : activeProfile === 'recovery'
              ? '60 - 85 bpm (Parasympathetic rest)'
              : '70 - 110 bpm (Active ambient)';

            const calculatedStepsPercent = Math.min(100, Math.round((stepsToday / targetSteps) * 100));
            const calculatedHydrationPercent = Math.min(100, Math.round((hydrationMl / targetHydration) * 100));

            return (
              <div className="space-y-8">
                {/* 3-Column Profile Guide Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                  
                  {/* Card 1: Steps & Daily Physical Loading */}
                  <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
                    <div className="bg-white/95 backdrop-blur-[12px] p-6 rounded-3xl border border-white/50 shadow-md shadow-slate-200/30 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-orange-500">
                            Physical Load Ratio
                          </span>
                          <span className="text-xl">🏃</span>
                        </div>
                        <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                          Daily Steps Target
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Today's progress against calibrated target profile:
                        </p>

                        {/* Progress display */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold text-slate-800">
                            <span>{stepsToday} steps</span>
                            <span>of {targetSteps} target</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${calculatedStepsPercent}%` }}
                              className="h-full bg-orange-500 rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700 font-semibold">
                          <div className="flex justify-between">
                            <span>Target Density</span>
                            <span className="font-mono text-slate-900">{calculatedStepsPercent}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Aerobic Multiplier</span>
                            <span className="font-mono text-orange-600">
                              {activeProfile === 'conditioning' ? '1.40x (Agility Focus)' : activeProfile === 'recovery' ? '0.60x (Light Joint Care)' : '1.00x (Standard)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        💡 <span className="font-bold text-slate-700">Calibrator Advisor:</span>{' '}
                        {activeProfile === 'conditioning'
                          ? 'Focus on dynamic hill walking to build athletic stamina and increase muscle tone.'
                          : activeProfile === 'recovery'
                          ? 'Prioritize flat terrain and gentle sniff walks to keep stress and joint impact low.'
                          : 'Standard daily walks provide high-quality heart health support and healthy core agility.'}
                      </div>
                    </div>
                  </TiltedCard>

                  {/* Card 2: Hydration Calibrator */}
                  <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
                    <div className="bg-white/95 backdrop-blur-[12px] p-6 rounded-3xl border border-white/50 shadow-md shadow-slate-200/30 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-500">
                            Water Intake Target
                          </span>
                          <span className="text-xl">💧</span>
                        </div>
                        <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                          Intake &amp; Renal Index
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Water intake requirements to maintain optimal cell hydration:
                        </p>

                        {/* Hydration progress bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold text-slate-800">
                            <span>{hydrationMl} ml</span>
                            <span>of {targetHydration} ml goal</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${calculatedHydrationPercent}%` }}
                              className="h-full bg-sky-500 rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700 font-semibold">
                          <div className="flex justify-between">
                            <span>Hydration Density</span>
                            <span className="font-mono text-slate-900">{calculatedHydrationPercent}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Renal sat score</span>
                            <span className="font-mono text-emerald-600">Stable</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        💡 <span className="font-bold text-slate-700">Hydration Tip:</span>{' '}
                        {activePet.species === 'Cat'
                          ? 'Cats rely on wet-food moisture or circulating fountains to activate hydration triggers.'
                          : 'Provide clean, oxygenated water bowl refills every 4-6 hours to encourage maximum volume intake.'}
                      </div>
                    </div>
                  </TiltedCard>

                  {/* Card 3: Vital Sign Thresholds */}
                  <TiltedCard className="w-full h-full rounded-3xl overflow-hidden relative group">
                    <div className="bg-white/95 backdrop-blur-[12px] p-6 rounded-3xl border border-white/50 shadow-md shadow-slate-200/30 ring-1 ring-slate-900/5 h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-500">
                            Clinical Safety Ranges
                          </span>
                          <span className="text-xl">🩺</span>
                        </div>
                        <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                          Veterinary Reference Zones
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Clinical biometric thresholds recommended by veterinarians for {activePet.species}s:
                        </p>

                        <div className="pt-1 space-y-2 text-xs font-semibold text-slate-700">
                          <div className="flex justify-between pb-1 border-b border-slate-100">
                            <span>Heart rate safety zone</span>
                            <span className="font-mono text-slate-950 font-bold">{targetBpm}</span>
                          </div>
                          <div className="flex justify-between pb-1 border-b border-slate-100">
                            <span>Body Temperature</span>
                            <span className="font-mono text-slate-950">101.0°F - 102.5°F</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Respiratory rate</span>
                            <span className="font-mono text-slate-950">15 - 30 breaths/min</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        ⚠️ <span className="font-bold text-slate-700">Emergency Alert:</span> If resting respiratory rate exceeds 40 breaths/min, seek urgent clinical care immediately.
                      </div>
                    </div>
                  </TiltedCard>

                </div>

                {/* Simulated Interactive Goals Calibration Console */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-rose-500/5 border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div className="space-y-0.5 text-left">
                      <h4 className="text-xs font-bold text-slate-900">
                        Calibrate Companion Health Passport
                      </h4>
                      <p className="text-[10px] text-slate-600">
                        Synchronize these target thresholds across all digital medical charts.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Calibrated and updated medical telemetry passport! ✨', 'success', '🛡️');
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold transition active:scale-95"
                  >
                    Apply New Metrics
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
}

