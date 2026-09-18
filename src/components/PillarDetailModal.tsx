import { X, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { AffinityPillar } from '../types';

interface PillarDetailModalProps {
  pillar: AffinityPillar | null;
  petName: string;
  onClose: () => void;
  onBoostPillar: (pillarId: string) => void;
}

export function PillarDetailModal({
  pillar,
  petName,
  onClose,
  onBoostPillar,
}: PillarDetailModalProps) {
  if (!pillar) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 text-[#ff6b4a] font-bold">
              ★
            </span>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                {pillar.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {petName}'s Affinity Pillar #{pillar.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level and Resonance Card */}
        <div className="mt-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Resonance Harmony
            </span>
            <span className="text-xs font-extrabold text-[#ff6b4a] bg-white px-2.5 py-0.5 rounded-full shadow-2xs">
              Level {pillar.level} ({pillar.resonance}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#ff6b4a] h-full rounded-full transition-all duration-700"
              style={{ width: `${pillar.resonance}%` }}
            />
          </div>

          <p className="text-xs text-slate-700 mt-3 leading-relaxed">
            {pillar.description}
          </p>
        </div>

        {/* Benefits & Impact */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Reduces cortisol & separation stress</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Contributes to Overall Bond Tier progression</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Synchronized across household member devices</span>
          </div>
        </div>

        {/* Interactive Boost Action */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              onBoostPillar(pillar.id);
              onClose();
            }}
            className="w-full py-3 rounded-full bg-[#ff6b4a] hover:bg-[#ed4d26] text-white font-heading font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Log Care Session (+25 XP &amp; +2% Resonance)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
