import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';

// WelcomeBackground
function WelcomeBackground() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0, 0.5, 0.3, 0.5], scale: [0.8, 1.2, 1, 1.2] }}
      transition={{ delay: 0.4, duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-white/60 blur-3xl rounded-full"
    />
  );
}

// WelcomeSpeechBubble
function WelcomeSpeechBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{ delay: 3.6, type: "spring", stiffness: 260, damping: 20 }}
      className="absolute -top-16 sm:-top-20 right-[-40px] sm:right-[-60px] bg-white px-5 py-3 sm:px-6 sm:py-4 rounded-3xl rounded-bl-sm shadow-xl shadow-orange-900/10 text-slate-800 font-bold font-heading text-sm sm:text-base border border-white/60 z-20 whitespace-nowrap"
    >
      Buddy : Bow! Welcome!
      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45 border-r border-b border-white/0" />
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
    >
      {children}
      <BarkEffect />
    </motion.div>
  );
}

// BuddyCharacter
function BuddyCharacter() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 120, damping: 14 }}
      className="relative z-10"
    >
      <BuddyReaction>
        <img 
          src="/assets/pet-guides/buddy-welcome.png" 
          alt="Buddy" 
          className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-2xl mix-blend-darken"
          style={{ WebkitFilter: 'drop-shadow(0 20px 20px rgba(255, 107, 74, 0.15))' }}
        />
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF1E6] overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WelcomeAnimation({ onComplete }: { onComplete: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 5.5 seconds hold before starting the exit transition
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  if (shouldReduceMotion) {
    return (
      <WelcomeTransition isExiting={isExiting} onComplete={onComplete}>
        <div className="flex flex-col items-center">
          <img 
            src="/assets/pet-guides/buddy-welcome.png" 
            alt="Buddy" 
            className="w-48 h-48 object-contain mb-8 mix-blend-darken"
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
      <div className="relative flex flex-col items-center">
        <WelcomeSpeechBubble />
        <BuddyCharacter />
      </div>
    </WelcomeTransition>
  );
}
