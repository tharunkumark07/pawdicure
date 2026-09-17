import React from 'react';
import { motion } from 'motion/react';

interface PetSpeechBubbleProps {
  message: string;
  onNext?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function PetSpeechBubble({
  message,
  onNext,
  onSkip,
  onBack,
  currentStep = 0,
  totalSteps = 1,
}: PetSpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 4 }}
      className="relative bg-white p-4 rounded-3xl shadow-xl border-2 border-orange-200 text-slate-800 max-w-xs"
    >
      {/* Comic speech bubble tail pointing directly to the pet's mouth on the left */}
      <div className="absolute -left-3 top-8 w-0 h-0 border-t-8 border-t-transparent border-r-[12px] border-r-white border-b-8 border-b-transparent drop-shadow-[-2px_0_1px_rgba(251,146,60,0.4)] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-orange-100">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
          🐾 Guide
        </span>
      </div>

      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed mb-3">
        {message}
      </p>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
          >
            Skip
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-1.5">
          {onBack && currentStep > 0 && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-slate-600 px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 cursor-pointer font-bold"
            >
              Back
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="text-xs bg-[#ff6b4a] hover:bg-[#e05333] text-white px-3.5 py-1 rounded-full font-extrabold shadow-sm transition-colors cursor-pointer"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
