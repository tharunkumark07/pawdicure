import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PawLogo } from './PawLogo';

export function ColdStartAnimation({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#fffaf5]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PawLogo className="w-24 h-24 text-orange-500" />
      </motion.div>
    </motion.div>
  );
}
