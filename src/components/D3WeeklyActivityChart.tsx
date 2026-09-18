import React, { useState } from 'react';
import { Pet } from '../types';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface D3WeeklyActivityChartProps {
  pet: Pet;
}

export function D3WeeklyActivityChart({ pet }: D3WeeklyActivityChartProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const goal = pet.stepsGoal || 10000;
  const isDog = pet.species !== 'Cat';

  // 7-day step history data
  const days = [
    { day: 'Mon', steps: isDog ? 8400 : 3100, calories: isDog ? 410 : 135, activeMins: 40 },
    { day: 'Tue', steps: isDog ? 10200 : 3800, calories: isDog ? 490 : 160, activeMins: 55 },
    { day: 'Wed', steps: isDog ? 7600 : 2900, calories: isDog ? 370 : 120, activeMins: 35 },
    { day: 'Thu', steps: isDog ? 11500 : 4200, calories: isDog ? 540 : 180, activeMins: 65 },
    { day: 'Fri', steps: isDog ? 9100 : 3400, calories: isDog ? 430 : 145, activeMins: 45 },
    { day: 'Sat', steps: isDog ? 12800 : 4500, calories: isDog ? 610 : 195, activeMins: 75 },
    { day: 'Sun', steps: pet.stepsToday ?? (isDog ? 8250 : 3200), calories: pet.caloriesBurned ?? (isDog ? 420 : 145), activeMins: 50 },
  ];

  const maxSteps = Math.max(...days.map((d) => d.steps), goal);

  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const weeklyAvg = Number((days.reduce((acc, curr) => acc + curr.steps, 0) / 7).toFixed(3));
  const activeTimeTotal = Number((days.reduce((acc, curr) => acc + curr.activeMins, 0)).toFixed(3));

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-8 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 relative overflow-hidden w-full h-full min-h-[380px] max-w-xl mx-auto flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
    >
      {/* Background ambient glass glows */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      {/* ReactBits Spotlight overlay */}
      {isCardHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(245, 158, 11, 0.08), transparent 80%)`,
          }}
        />
      )}

      <div className="flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-xl bg-orange-100/80 text-[#ff6b4a] shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              7-Day Activity &amp; Step Telemetry
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Daily mobility breakdown vs. {goal.toLocaleString()} target steps
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/60 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700 shrink-0 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#ff6b4a]" />
          <span>This Week</span>
        </div>
      </div>

      {/* SVG Bar Chart with Goal Line */}
      <div className="relative pt-6 pb-2 z-10 my-auto">
        <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-3 px-1">
          {days.map((d, index) => {
            const heightPercent = Math.min(100, Math.max(12, (d.steps / maxSteps) * 100));
            const hitGoal = d.steps >= goal;
            const isHovered = hoveredDay === index;

            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center h-full justify-end group/bar cursor-pointer relative"
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white text-[10px] py-1.5 px-3 rounded-2xl shadow-xl whitespace-nowrap animate-in zoom-in-95 duration-150 pointer-events-none">
                    <div className="font-bold text-slate-100">{d.day}: {Number(d.steps.toFixed(3)).toLocaleString()} steps</div>
                    <div className="text-orange-300 font-mono text-[9px] mt-0.5">
                      {Number(d.calories.toFixed(3))} kcal • {Number(d.activeMins.toFixed(3))}m active
                    </div>
                  </div>
                )}

                {/* Step Bar Track */}
                <div className="w-full max-w-[28px] bg-slate-100/90 border border-slate-200/50 rounded-t-2xl overflow-hidden h-full flex items-end relative shadow-inner">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full transition-all duration-500 rounded-t-2xl ${
                      hitGoal
                        ? 'bg-gradient-to-t from-orange-500 via-amber-500 to-amber-300 shadow-md shadow-orange-500/20'
                        : 'bg-gradient-to-t from-slate-300 to-slate-400/80'
                    } ${isHovered ? 'brightness-110 scale-105 shadow-lg' : ''}`}
                  />
                </div>

                {/* Day Label */}
                <span
                  className={`text-[10px] sm:text-[11px] font-bold mt-2.5 transition-colors ${
                    index === 6 ? 'text-[#ff6b4a] font-black' : 'text-slate-500'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Goal Indicator Dotted Line */}
        <div
          style={{
            bottom: `${Math.min(85, Math.max(15, (goal / maxSteps) * 100))}%`,
          }}
          className="absolute left-0 right-0 border-b-2 border-dashed border-orange-400/70 pointer-events-none flex items-center justify-end pr-1 z-0"
        >
          <span className="text-[9px] font-extrabold text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-lg border border-orange-200 shadow-2xs -mt-5 font-mono">
            Goal: {goal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-200/60 text-center z-10">
        <div className="bg-slate-50/90 border border-slate-100 p-2.5 rounded-2xl shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Avg</div>
          <div className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">
            {Math.round(weeklyAvg).toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-50/90 border border-slate-100 p-2.5 rounded-2xl shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Time</div>
          <div className="text-xs sm:text-sm font-black text-[#ff6b4a] mt-0.5">
            {activeTimeTotal} mins
          </div>
        </div>

        <div className="bg-slate-50/90 border border-slate-100 p-2.5 rounded-2xl shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goal Streak</div>
          <div className="text-xs sm:text-sm font-black text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> 5 Days
          </div>
        </div>
      </div>
    </div>
  );
}
