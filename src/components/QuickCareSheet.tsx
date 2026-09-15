import { Utensils, Footprints, Pill, Camera, Sparkles, Stethoscope, X } from 'lucide-react';
import { Pet } from '../types';

interface QuickCareSheetProps {
  isOpen: boolean;
  activePet: Pet;
  onClose: () => void;
  onQuickAction: (action: 'feed' | 'walk' | 'med' | 'memory' | 'play' | 'health') => void;
}

export function QuickCareSheet({
  isOpen,
  activePet,
  onClose,
  onQuickAction,
}: QuickCareSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Floating Action Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 z-10 mx-2 mb-2 sm:mb-6 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b4a]" />
            <h3 className="font-heading font-bold text-base text-slate-800">
              Quick Care for {activePet.name}
            </h3>
          </div>
          <button
            id="close-quick-care-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Quick Action Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            id="quick-action-feed"
            type="button"
            onClick={() => onQuickAction('feed')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-orange-50/70 hover:bg-orange-100/70 border border-orange-100 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-orange-950 mt-2">Fill Bowl</span>
            <span className="text-[10px] text-orange-700 font-semibold">+25 XP</span>
          </button>

          <button
            id="quick-action-walk"
            type="button"
            onClick={() => onQuickAction('walk')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 transition">
              <Footprints className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-950 mt-2">Log Walk</span>
            <span className="text-[10px] text-emerald-700 font-semibold">+30 XP</span>
          </button>

          <button
            id="quick-action-med"
            type="button"
            onClick={() => onQuickAction('med')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
              <Pill className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-950 mt-2">Give Meds</span>
            <span className="text-[10px] text-blue-700 font-semibold">+20 XP</span>
          </button>

          <button
            id="quick-action-memory"
            type="button"
            onClick={() => onQuickAction('memory')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-100 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-rose-500 group-hover:scale-110 transition">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-950 mt-2">Add Memory</span>
            <span className="text-[10px] text-rose-700 font-semibold">+50 XP</span>
          </button>

          <button
            id="quick-action-play"
            type="button"
            onClick={() => onQuickAction('play')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-amber-500 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-950 mt-2">Play Session</span>
            <span className="text-[10px] text-amber-700 font-semibold">+25 XP</span>
          </button>

          <button
            id="quick-action-health"
            type="button"
            onClick={() => onQuickAction('health')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-purple-500 group-hover:scale-110 transition">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-950 mt-2">Health Hub</span>
            <span className="text-[10px] text-purple-700 font-semibold">Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}
