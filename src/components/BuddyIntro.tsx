import React from 'react';
import { motion } from 'motion/react';

export function BuddyIntro({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-white z-[100]"
    >
      <div className="text-center p-6 space-y-4">
        <div className="text-6xl">🐶</div>
        <h2 className="text-2xl font-bold">Hi! I'm Buddy.</h2>
        <p className="text-lg text-slate-600">I'm your personal AI assistant in PAWdiCURE.</p>
        <button
          onClick={onComplete}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold"
        >
          Let's Go!
        </button>
      </div>
    </motion.div>
  );
}
