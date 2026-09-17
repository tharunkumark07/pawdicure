import React from 'react';

interface PetGuideControlsProps {
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PetGuideControls({ onNext, onSkip, onBack, isFirstStep, isLastStep }: PetGuideControlsProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button onClick={onSkip} className="text-xs text-slate-400 hover:text-slate-600">Skip</button>
      <div className="flex gap-2">
        {!isFirstStep && <button onClick={onBack} className="text-xs text-slate-600 px-3 py-1 rounded-full border border-slate-200">Back</button>}
        <button onClick={onNext} className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600">
          {isLastStep ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
