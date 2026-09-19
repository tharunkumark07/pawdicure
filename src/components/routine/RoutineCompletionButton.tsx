import React from 'react';
import { Check } from 'lucide-react';
import { triggerHaptic } from '../../lib/haptics';

interface RoutineCompletionButtonProps {
  completed: boolean;
  onComplete: () => void;
  xpReward?: number;
}

export function RoutineCompletionButton({ completed, onComplete, xpReward = 25 }: RoutineCompletionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        triggerHaptic('medium');
        onComplete();
      }}
      className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
        completed
          ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
          : 'bg-[var(--primary)] text-white hover:opacity-90'
      }`}
    >
      <Check className={`w-4 h-4 ${completed ? 'stroke-[3]' : ''}`} />
      <span>{completed ? 'Completed ✓' : `Complete (+${xpReward} XP)`}</span>
    </button>
  );
}
