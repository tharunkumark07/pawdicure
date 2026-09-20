import React, { useState } from 'react';
import { Pet } from '../types';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  Scale, 
  Moon, 
  Cpu, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Calendar,
  Sparkles
} from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface BiometryViewProps {
  pet: Pet;
  onShowToast: (msg: string, icon?: string) => void;
}

export function BiometryView({ pet, onShowToast }: BiometryViewProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'24h' | '7d' | '30d'>('7d');

  const handleManualSync = () => {
    triggerHaptic('medium');
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onShowToast('Biometry telemetry synced successfully!', '📡');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-5 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
            📡
          </div>
          <div>
            <h2 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
              Biometry &amp; Telemetry Hub
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Continuous health sensors &amp; vital signs for {pet.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text)] shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[var(--primary)] ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Sensors'}</span>
        </button>
      </div>

      {/* Sensor Status Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-[var(--primary)]/5 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text)]">Smart Collar v3.4 Active</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Battery: 92% • Last synced 2m ago • Bluetooth LE connected
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Sampling Rate</span>
          <p className="text-xs font-extrabold text-[var(--text)]">100Hz Real-time</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-1.5">
        <span className="text-xs font-bold text-[var(--text-muted)] px-3">Telemetry Range</span>
        <div className="flex items-center gap-1">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSelectedRange(range);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedRange === range
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Vitals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Heart Rate */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Resting Heart Rate
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Normal
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-heading text-[var(--text)]">72</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">bpm</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">Range: 68–84 bpm (Optimal)</p>
        </div>

        {/* Respiration Rate */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-blue-500" />
              Respiration
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Stable
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-heading text-[var(--text)]">18</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">bpm</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">At rest (Sleep phase)</p>
        </div>

        {/* Body Temperature */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Skin Temp
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              38.5°C
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-heading text-[var(--text)]">101.3</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">°F</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">Target: 100.5–102.5°F</p>
        </div>

        {/* Weight Telemetry */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              Weight Sensor
            </span>
            <span className="text-[10px] text-purple-600 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">
              Smart Scale
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-heading text-[var(--text)]">{pet.weight || '12.4'}</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">kg</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">-0.2 kg since last month</p>
        </div>

        {/* Sleep Score */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Sleep Quality
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              94%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-heading text-[var(--text)]">8.5</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">hrs</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">Deep sleep: 3.2 hrs</p>
        </div>

        {/* Activity Level */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Energy Burn
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-heading text-[var(--text)]">640</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">kcal</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">Goal: 600 kcal/day</p>
        </div>
      </div>

      {/* Advanced Telemetry Insights Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-black text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
          AI Biometric Summary &amp; Recommendations
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--text)]">Cardiovascular Resilience Optimal</h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {pet.name}'s resting heart rate variations remain within the top 5th percentile for {pet.breed || 'dog'}s of this age and weight class. Continue standard daily walks.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--text)]">Hydration &amp; Temperature Regulation</h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Skin temperature sensors indicate optimal thermal comfort. Hydration index is robust at 77%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
