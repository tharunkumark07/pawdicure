import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { usePreloadImages } from '../hooks/usePreloadImages';

const BUDDY_IMAGES = [
  '/assets/pet-guides/buddy-closed.png',
  '/assets/pet-guides/buddy-open.png'
];

// WelcomeBackground
function WelcomeBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.5, 0.3, 0.5], scale: [0.8, 1.2, 1, 1.2] }}
        transition={{ delay: 0.4, duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="w-64 h-64 sm:w-80 sm:h-80 bg-white/60 blur-3xl rounded-full"
      />
    </div>
  );
}

// WelcomeSpeechBubble
function WelcomeSpeechBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.35, y: 25, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{ delay: 3.6, type: "spring", duration: 0.5, bounce: 0.35 }}
      className="absolute -top-18 sm:-top-22 right-[-30px] sm:right-[-45px] z-30 font-['Fredoka',sans-serif]"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-white px-5 py-3.5 sm:px-6 sm:py-4 rounded-3xl rounded-bl-sm shadow-xl shadow-orange-900/15 border-2 border-orange-100 flex items-center gap-2.5 text-slate-800 font-bold text-base sm:text-lg whitespace-nowrap"
      >
        <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-bold text-xs tracking-wide">
          Buddy
        </span>
        <span className="text-orange-300 font-bold">:</span>
        <span className="text-[#ff6b4a] font-bold tracking-wide">
          Bow! Welcome!
        </span>
        <div className="absolute -bottom-2.5 left-7 w-4 h-4 bg-white border-r-2 border-b-2 border-orange-100 rotate-45" />
      </motion.div>
    </motion.div>
  );
}

// BarkEffect
function BarkEffect() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0, 0.6, 0],
        scale: [0.8, 0.8, 1.4, 2]
      }}
      transition={{
        times: [0, 2.8 / 5.5, 3.1 / 5.5, 3.6 / 5.5],
        duration: 5.5,
        ease: "easeOut"
      }}
      className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl -z-10"
    />
  );
}

// BuddyReaction
function BuddyReaction({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        rotate: [0, 0, 5, 0, 0, -4, 4, 0, 0],
        y: [0, 0, -5, 0, 0, -15, 0, 0, 0],
        scale: [1, 1, 1.02, 1, 1, 1.05, 0.98, 1, 1]
      }}
      transition={{
        times: [
          0,           // 0s
          2.0 / 5.5,   // 2.0s
          2.4 / 5.5,   // 2.4s
          2.7 / 5.5,   // 2.7s
          2.9 / 5.5,   // 2.9s
          3.1 / 5.5,   // 3.1s
          3.3 / 5.5,   // 3.3s
          3.6 / 5.5,   // 3.6s
          1            // 5.5s
        ],
        duration: 5.5,
        ease: "easeInOut"
      }}
      className="relative flex flex-col items-center"
    >
      {children}
      <BarkEffect />
    </motion.div>
  );
}

// BuddyCharacter
function BuddyCharacter({ isOpenMouth }: { isOpenMouth: boolean }) {
  const currentImage = isOpenMouth 
    ? '/assets/pet-guides/buddy-open.png' 
    : '/assets/pet-guides/buddy-closed.png';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 120, damping: 14 }}
      className="relative z-10 flex flex-col items-center"
    >
      <BuddyReaction>
        <div className="relative w-48 h-48 sm:w-60 sm:h-60">
          <img 
            src={currentImage} 
            alt="Buddy" 
            className="w-full h-full object-contain filter drop-shadow-[0_16px_24px_rgba(255,107,74,0.18)]"
          />
        </div>
      </BuddyReaction>
    </motion.div>
  );
}

// WelcomeTransition
function WelcomeTransition({ children, isExiting, onComplete }: { children: React.ReactNode, isExiting: boolean, onComplete: () => void }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-[#FFF1E6] overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WelcomeAnimation({ onComplete }: { onComplete: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const imagesLoaded = usePreloadImages(BUDDY_IMAGES);
  const [isExiting, setIsExiting] = useState(false);
  const [isOpenMouth, setIsOpenMouth] = useState(false);

  useEffect(() => {
    if (!imagesLoaded) return;

    // 1. Bark moment mouth flap (2.9s - 3.2s)
    const barkStart = setTimeout(() => setIsOpenMouth(true), 2900);
    const barkEnd = setTimeout(() => setIsOpenMouth(false), 3200);

    // 2. Speech bubble phase (starts at 3.6s): alternate mouth open/closed every 250ms to simulate talking
    let talkInterval: NodeJS.Timeout;
    const speechStart = setTimeout(() => {
      let toggleCount = 0;
      setIsOpenMouth(true);
      talkInterval = setInterval(() => {
        toggleCount++;
        setIsOpenMouth(prev => !prev);
        if (toggleCount >= 6) { // 6 toggles * 250ms = 1.5 seconds of talking
          clearInterval(talkInterval);
          setIsOpenMouth(false);
        }
      }, 250);
    }, 3600);

    // 3. 5.5 seconds hold before starting the exit transition
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 5500);

    return () => {
      clearTimeout(barkStart);
      clearTimeout(barkEnd);
      clearTimeout(speechStart);
      if (talkInterval) clearInterval(talkInterval);
      clearTimeout(timer);
    };
  }, [imagesLoaded]);

  if (shouldReduceMotion) {
    return (
      <WelcomeTransition isExiting={isExiting} onComplete={onComplete}>
        <div className="flex flex-col items-center">
          <img 
            src="/assets/pet-guides/buddy-closed.png" 
            alt="Buddy" 
            className="w-48 h-48 object-contain mb-8 filter drop-shadow-md"
          />
          <div className="bg-white px-6 py-3 rounded-3xl shadow-sm text-slate-800 font-bold font-heading text-lg border border-orange-100">
            Buddy : Bow! Welcome!
          </div>
        </div>
      </WelcomeTransition>
    );
  }

  return (
    <WelcomeTransition isExiting={isExiting} onComplete={onComplete}>
      <WelcomeBackground />
      <div className="relative flex flex-col items-center justify-center">
        <WelcomeSpeechBubble />
        <BuddyCharacter isOpenMouth={isOpenMouth} />
      </div>
    </WelcomeTransition>
  );
}
