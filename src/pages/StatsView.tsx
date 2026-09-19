import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Gauge } from '../components/Gauge';
import { AnimatedChart } from '../components/AnimatedChart';
import { WeeklyHealthChart } from '../components/WeeklyHealthChart';
import { ShinyText } from '../components/ui/reactbits/ShinyText';
import { GradientText } from '../components/ui/reactbits/GradientText';
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

  const [activeMetric, setActiveMetric] = useState<'steps' | 'calories' | 'hydration' | 'heart'>('steps');
  const [activeTab, setActiveTab] = useState<'Biometrics' | 'Telemetry' | 'Wellness' | 'History'>('Biometrics');

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

  const weeklyCaloriesData = [
    { label: 'Mon', value: isDog ? 380 : 130, secondary: 'Agility Run' },
    { label: 'Tue', value: isDog ? 450 : 155, secondary: 'Active Catch' },
    { label: 'Wed', value: isDog ? 350 : 120, secondary: 'Daily Routine' },
    { label: 'Thu', value: isDog ? 510 : 175, secondary: 'Sniffari Walk' },
    { label: 'Fri', value: isDog ? 410 : 140, secondary: 'Lawn Agility' },
    { label: 'Sat', value: isDog ? 580 : 190, secondary: 'Park Hike' },
    { label: 'Sun', value: Math.round(activePet.caloriesBurned ?? (isDog ? 420 : 145)), secondary: 'Today' },
  ];

  const weeklyHydrationData = [
    { label: 'Mon', value: isDog ? 720 : 230, secondary: 'Goal Reached' },
    { label: 'Tue', value: isDog ? 780 : 260, secondary: 'Goal Reached' },
    { label: 'Wed', value: isDog ? 680 : 220, secondary: 'Optimal Level' },
    { label: 'Thu', value: isDog ? 820 : 280, secondary: 'Max Hydrated' },
    { label: 'Fri', value: isDog ? 750 : 240, secondary: 'Goal Reached' },
    { label: 'Sat', value: isDog ? 850 : 290, secondary: 'Max Hydrated' },
    { label: 'Sun', value: Math.round(activePet.currentMl ?? activePet.hydrationMl ?? (isDog ? 580 : 180)), secondary: 'Today' },
  ];

  const weeklyHeartData = [
    { label: 'Mon', value: isDog ? 72 : 110, secondary: 'Regular Sinus' },
    { label: 'Tue', value: isDog ? 74 : 112, secondary: 'Regular Sinus' },
    { label: 'Wed', value: isDog ? 75 : 115, secondary: 'Regular Sinus' },
    { label: 'Thu', value: isDog ? 71 : 108, secondary: 'Regular Sinus' },
    { label: 'Fri', value: isDog ? 73 : 111, secondary: 'Regular Sinus' },
    { label: 'Sat', value: isDog ? 76 : 114, secondary: 'Regular Sinus' },
    { label: 'Sun', value: Math.round(activePet.restingBpm ?? (isDog ? 74 : 110)), secondary: 'Today' },
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

  const TabButton = ({ label }: { label: 'Biometrics' | 'Telemetry' | 'Wellness' | 'History' }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`relative px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
        activeTab === label ? 'text-white' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {activeTab === label && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-[#ff6b4a] rounded-full shadow-md"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-16 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[var(--primary-light)] backdrop-blur-md rounded-3xl p-5 sm:p-6 lg:p-7 border border-[var(--primary-border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)] shadow-2xs mb-2 border border-[var(--primary-border)]">
            <Activity className="w-3.5 h-3.5 text-[var(--primary)] animate-pulse" />
            <ShinyText text="PAW Insights &amp; Analytics" speed={4} />
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            <span className="text-[var(--primary)]">{activePet.name}'s Premium Telemetry</span>
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

      {/* Segmented Tab Navigation */}
      <div className="flex bg-slate-100 p-1 rounded-full w-fit">
        <TabButton label="Biometrics" />
        <TabButton label="Telemetry" />
        <TabButton label="Wellness" />
        <TabButton label="History" />
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeTab === 'Biometrics' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              <Gauge 
                value={stepsPercent} 
                label="Daily Steps" 
                sublabel={`${stepsToday} / ${stepsGoal} steps`} 
                color="orange"
                unit="%"
                icon={<Footprints className="w-4 h-4" />}
              />
              <Gauge 
                value={(formattedCalories / formattedCaloriesGoal) * 100} 
                label="Calories Burned" 
                sublabel={`${formattedCalories} / ${formattedCaloriesGoal} kcal`} 
                color="rose"
                unit="%"
                icon={<Flame className="w-4 h-4" />}
              />
              <Gauge 
                value={formattedHydrationPercent} 
                label="Hydration Level" 
                sublabel={`${formattedHydrationMl} / ${formattedGoalMl} ml`} 
                color="sky"
                unit="%"
                icon={<Droplet className="w-4 h-4" />}
              />
              <Gauge 
                value={(formattedRestingBpm / (activePet.species === 'Cat' ? 160 : 120)) * 100} 
                label="Heart Rate" 
                sublabel={`${formattedRestingBpm} BPM`} 
                color="indigo"
                unit="%"
                icon={<Heart className="w-4 h-4" />}
              />
            </motion.div>
          )}

          {activeTab === 'Telemetry' && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Telemetry Selector */}
              <div className="flex flex-wrap items-center gap-2 bg-[var(--background-alt)] p-1.5 rounded-2xl border border-[var(--card-border)] w-fit">
                {[
                  { id: 'steps', label: 'Steps', icon: <Footprints className="w-3.5 h-3.5" />, color: 'orange' },
                  { id: 'calories', label: 'Calories', icon: <Flame className="w-3.5 h-3.5" />, color: 'rose' },
                  { id: 'hydration', label: 'Hydration', icon: <Droplet className="w-3.5 h-3.5" />, color: 'sky' },
                  { id: 'heart', label: 'Heart Rate', icon: <Heart className="w-3.5 h-3.5" />, color: 'indigo' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMetric(m.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      activeMetric === m.id 
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200 scale-102' 
                        : 'text-slate-500 hover:bg-white/50'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {activeMetric === 'steps' && (
                  <AnimatedChart 
                    data={weeklyStepsData} 
                    title="Step Dynamics" 
                    subtitle="High-fidelity step tracking over the active 7-day cycle"
                    color="orange"
                    unit="steps"
                    goalValue={stepsGoal}
                    icon={<Footprints className="w-4 h-4" />}
                  />
                )}
                {activeMetric === 'calories' && (
                  <AnimatedChart 
                    data={weeklyCaloriesData} 
                    title="Energy Expenditure" 
                    subtitle="Calibrated kcal burn based on activity intensity"
                    color="rose"
                    unit="kcal"
                    goalValue={formattedCaloriesGoal}
                    icon={<Flame className="w-4 h-4" />}
                  />
                )}
                {activeMetric === 'hydration' && (
                  <AnimatedChart 
                    data={weeklyHydrationData} 
                    title="Intracellular Hydration" 
                    subtitle="Volumetric water intake tracking & optimization"
                    color="indigo"
                    unit="ml"
                    goalValue={formattedGoalMl}
                    icon={<Droplet className="w-4 h-4" />}
                  />
                )}
                {activeMetric === 'heart' && (
                  <AnimatedChart 
                    data={weeklyHeartData} 
                    title="Cardiac Resonance" 
                    subtitle="Resting heart rate monitoring for early stress detection"
                    color="indigo"
                    unit="BPM"
                    icon={<Heart className="w-4 h-4" />}
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Wellness' && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
            >
              <div className="space-y-6">
                <Gauge 
                  value={overallWellness} 
                  label="Overall Wellness Quotient" 
                  sublabel="Aggregated health score" 
                  color="emerald"
                  unit="%"
                  icon={<ShieldCheck className="w-5 h-5" />}
                />
                <div className="bg-[var(--card-bg)] p-6 rounded-[2.5rem] border border-[var(--card-border)] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[var(--text)] uppercase tracking-wider">Predictive Insight</h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-0.5">
                      {activePet.name}'s wellness has improved by <span className="text-emerald-600 font-bold">4.2%</span> since last week. Optimal sleep cycles are contributing to lower cortisol markers.
                    </p>
                  </div>
                </div>
              </div>
              <WeeklyHealthChart petName={activePet.name} species={activePet.species} />
            </motion.div>
          )}

          {activeTab === 'History' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AnimatedChart 
                    data={weightHistoryData} 
                    title="Weight Management Profile" 
                    subtitle="6-month biometric weight tracking"
                    color="indigo"
                    unit="kg"
                    goalValue={targetWeight}
                    icon={<Scale className="w-4 h-4" />}
                  />
                </div>
                <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--card-border)] p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--card-border)]">
                    <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                    <h4 className="text-xs font-black text-[var(--text)] uppercase tracking-wider">Recent Biometrics</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Weight', value: `${currentWeight} kg`, change: '-0.1kg', status: 'stable' },
                      { label: 'Sleep', value: '9.4 hrs', change: '+0.5h', status: 'improving' },
                      { label: 'Activity', value: '52 mins', change: '+8m', status: 'peak' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{item.label}</p>
                          <p className="text-xs font-black text-[var(--text)]">{item.value}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-[10px] font-black ${item.status === 'stable' ? 'text-slate-400' : 'text-emerald-500'}`}>{item.change}</p>
                          <p className="text-[9px] text-[var(--text-muted)] opacity-40 uppercase font-bold">{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-[var(--background-alt)] border border-[var(--card-border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text)] transition">
                    View Full Clinical History
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="bg-white/70 backdrop-blur-[12px] p-6 sm:p-8 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/30 ring-1 ring-slate-900/5 space-y-6 animate-in slide-in-from-bottom duration-300 delay-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-600">
                <Award className="w-4 h-4 animate-bounce" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b4a]">
                Milestone Badges
              </span>
            </div>
            <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900 tracking-tight">
              {activePet.name}'s Fitness Achievements
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Track earned trophies and active badges by maintaining health targets.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Companion Tier: Elite Tracker</span>
          </div>
        </div>

        {/* 3-Column Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Morning Trailblazer */}
          <div className="bg-white/90 p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  Active Milestone
                </span>
                <span className="text-2xl">🌅</span>
              </div>
              
              <div className="space-y-0.5">
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Morning Trailblazer
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Earned for exceeding 5,000 steps logged during active early hours.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-700">
                  <span>{stepsToday} / 5,000 steps</span>
                  <span>{Math.min(100, Math.round((stepsToday / 5000) * 100))}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Math.round((stepsToday / 5000) * 100))}%` }}
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-400">STATUS:</span>
              <span className={stepsToday >= 5000 ? "text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full" : "text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full"}>
                {stepsToday >= 5000 ? "✓ Unlocked & Claimed" : "⏳ In Progress"}
              </span>
            </div>
          </div>

          {/* Card 2: Hydration Hero */}
          <div className="bg-white/90 p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                  Renal Milestone
                </span>
                <span className="text-2xl">💧</span>
              </div>
              
              <div className="space-y-0.5">
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Hydration Hero Badge
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Earned by meeting individual daily hydration goals consistently.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-700">
                  <span>{hydrationMl} / {goalMl} ml</span>
                  <span>{Math.min(100, Math.round((hydrationMl / goalMl) * 100))}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Math.round((hydrationMl / goalMl) * 100))}%` }}
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-400">STATUS:</span>
              <span className={hydrationMl >= goalMl ? "text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full" : "text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full"}>
                {hydrationMl >= goalMl ? "✓ Unlocked & Claimed" : "⏳ In Progress"}
              </span>
            </div>
          </div>

          {/* Card 3: Obedience Champion */}
          <div className="bg-white/90 p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  Training Milestone
                </span>
                <span className="text-2xl">🎓</span>
              </div>
              
              <div className="space-y-0.5">
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Obedience Champion
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Earned for practicing positive reinforcement and obedience skill triggers.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-700">
                  <span>3 / 3 daily trials</span>
                  <span>100%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: "100%" }}
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-400">STATUS:</span>
              <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                ✓ Unlocked &amp; Claimed
              </span>
            </div>
          </div>

        </div>

        {/* Android Friendly Info Footer Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
          <span className="text-xl shrink-0">🏆</span>
          <p className="text-[10px] sm:text-xs text-amber-900/90 leading-relaxed text-left">
            Milestone achievements are synced directly to your <strong>Companion Medical Passport</strong>. Reaching milestones boosts your total XP level and rewards extra Paw Points!
          </p>
        </div>
      </div>
    </div>
  );
}

