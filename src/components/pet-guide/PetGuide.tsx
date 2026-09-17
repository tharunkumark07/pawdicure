import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PetCharacter } from './PetCharacter';
import { PetGuideControls } from './PetGuideControls';
import { PetGuideProgress } from './PetGuideProgress';
import { PetGuideSpotlight } from './PetGuideSpotlight';
import { useElementPosition } from '../../hooks/useElementPosition';

interface PetGuideProps {
  characterId: string;
  message: string;
  targetId: string;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  onToggleCharacter?: () => void;
}

export function PetGuide({
  characterId = 'dog',
  message,
  targetId,
  onNext,
  onSkip,
  onBack,
  currentStep,
  totalSteps,
  onToggleCharacter,
}: PetGuideProps) {
  const position = useElementPosition(targetId);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 400
  );
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute layout dimensions
  const guideWidth = Math.min(windowWidth - 24, 420);
  const targetCenterX = position.left + position.width / 2;

  // Decide whether to place above or below the target element
  // If target is near bottom (e.g. bottom navigation bar), position above!
  const isTargetNearBottom = position.bottom > windowHeight - 160;
  
  let top = isTargetNearBottom
    ? Math.max(16, position.top - 230)
    : Math.min(windowHeight - 240, position.bottom + 16);

  // Center horizontally relative to target center, clamped to screen bounds
  let left = Math.max(
    12,
    Math.min(windowWidth - guideWidth - 12, targetCenterX - guideWidth / 2)
  );

  return (
    <>
      {/* Full screen dimming backdrop with cutout spotlight */}
      <PetGuideSpotlight targetId={targetId} />

      {/* Interactive Pet Companion & Speech Bubble Container with smooth layout spring animation */}
      <motion.div
        className="fixed z-50 pointer-events-auto flex flex-col items-center"
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          left,
          top,
        }}
        transition={{
          layout: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
        style={{ width: guideWidth }}
      >
        {/* Main Guide Content: Pet mascot on left + Speech Bubble on right */}
        <div className="relative w-full flex items-start gap-3">
          {/* 3D Pet Animal Mascot (Dog or Cat) with transparent background */}
          <PetCharacter
            characterId={characterId}
            onToggleCharacter={onToggleCharacter}
            isSpeaking={true}
          />

          {/* Speech Bubble Container with callout tail originating directly from pet's mouth */}
          <div className="relative flex-1 bg-white/98 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-[0_16px_40px_rgba(44,24,16,0.22)] border-2 border-orange-200 text-slate-800">
            {/* Comic Speech Bubble Tail pointing directly at the Pet's mouth */}
            <div
              className="absolute -left-3 top-10 w-0 h-0 border-t-8 border-t-transparent border-r-[13px] border-r-white border-b-8 border-b-transparent pointer-events-none drop-shadow-[-2px_0_1px_rgba(251,146,60,0.4)]"
            />

            {/* Speech Bubble Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-orange-100">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#ff6b4a] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/70">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <span>🐾</span>
                <span>Guide Walkthrough</span>
              </span>
            </div>

            {/* Contextual Message spoken from mouth */}
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-relaxed min-h-[3rem]"
            >
              {message}
            </motion.p>

            {/* Progress Dots */}
            <PetGuideProgress current={currentStep} total={totalSteps} />

            {/* Interactive Step Navigation Controls */}
            <PetGuideControls
              onNext={onNext}
              onSkip={onSkip}
              onBack={onBack}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === totalSteps - 1}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
