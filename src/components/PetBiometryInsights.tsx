import React from 'react';
import { Pet } from '../types';
import { Cpu, Heart, Zap, Scale, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface PetBiometryInsightsProps {
  pet: Pet;
  onNavigate: (route: string) => void;
}

export function PetBiometryInsights({ pet, onNavigate }: PetBiometryInsightsProps) {
  return (
    <section aria-labelledby="biometry-insights-heading" className="space-y-3">
      <div className="flex justify-between items-baseline px-1">
        <h2
          id="biometry-insights-heading"
          className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5"
        >
          <Cpu className="w-3.5 h-3.5 text-[var(--primary)]" />
          Pet Biometry Insights
        </h2>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onNavigate('biometry');
          }}
          className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Full Telemetry</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 shadow-2xs space-y-4">
        {/* Biometry Quick-Look Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onNavigate('biometry');
            }}
            className="p-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition text-left cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-indigo-500" />
                Weight
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-black text-[var(--text)] font-heading">
                {pet.weight ? `${pet.weight} kg` : '12.4 kg'}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Stable</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onNavigate('biometry');
            }}
            className="p-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition text-left cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-black text-[var(--text)] font-heading">
                72 bpm
              </p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Optimal</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onNavigate('biometry');
            }}
            className="p-3 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition text-left cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Activity
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-black text-[var(--text)] font-heading">
                640 kcal
              </p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Active</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]/60 text-xs">
          <span className="text-[var(--text-muted)] font-medium">Smart Collar Sensors</span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onNavigate('biometry');
            }}
            className="font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
