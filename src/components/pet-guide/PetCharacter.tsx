import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

const DOG_AVATAR = '/assets/pet-guides/dog-guide.png';
const CAT_AVATAR = '/assets/pet-guides/cat-guide.png';

interface PetCharacterProps {
  characterId: string;
  onToggleCharacter?: () => void;
  isSpeaking?: boolean;
}

export function PetCharacter({
  characterId = 'dog',
  onToggleCharacter,
  isSpeaking = true,
}: PetCharacterProps) {
  const isDog = characterId === 'dog';
  const petName = isDog ? 'Buddy' : 'Luna';
  const petSpecies = isDog ? 'Puppy Guide' : 'Kitty Guide';
  const avatarSrc = isDog ? DOG_AVATAR : CAT_AVATAR;

  return (
    <div className="relative flex flex-col items-center shrink-0 select-none">
      {/* 3D Pet Character Mascot Frame */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [-1, 1, -1],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className="relative flex items-center justify-center"
      >
        {/* Transparent Character Cutout */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <img
            src={avatarSrc}
            alt={`${petName} 3D Pet Guide`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] filter hover:scale-105 transition-transform duration-300 pointer-events-none"
          />

          {/* Sound waves emerging near mouth when speaking */}
          {isSpeaking && (
            <div
              className="absolute right-0 bottom-6 pointer-events-none flex items-center gap-0.5"
              title="Speaking"
            >
              <motion.span
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-xs"
              />
              <motion.span
                animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-amber-400 shadow-xs"
              />
              <motion.span
                animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.3, 0.9, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
                className="w-2.5 h-2.5 rounded-full bg-orange-400/80 shadow-xs"
              />
            </div>
          )}
        </div>

        {/* Comic Speech trail dots originating directly from pet's mouth */}
        <div className="absolute -right-2 top-11 flex flex-col items-center pointer-events-none z-20">
          <motion.div
            animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-2 h-2 rounded-full bg-white border border-orange-200 shadow-sm"
          />
          <motion.div
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
            className="w-3 h-3 -mt-0.5 rounded-full bg-white border border-orange-200 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Pet Name & Switcher Pill */}
      <div className="mt-1 flex items-center gap-1.5">
        <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 font-extrabold text-[11px] shadow-sm border border-orange-200/80 flex items-center gap-1">
          <span>{isDog ? '🐶' : '🐱'}</span>
          <span>{petName}</span>
        </span>

        {onToggleCharacter && (
          <button
            type="button"
            onClick={onToggleCharacter}
            title="Switch to Cat or Dog Guide"
            className="p-1 rounded-full bg-white/90 hover:bg-orange-50 border border-orange-200 text-orange-600 shadow-xs transition-colors cursor-pointer"
            aria-label="Switch Guide Mascot"
          >
            <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-300" />
          </button>
        )}
      </div>

      <span className="text-[10px] font-semibold text-orange-800/80 mt-0.5">
        {petSpecies}
      </span>
    </div>
  );
}
