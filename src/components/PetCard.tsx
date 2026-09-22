import React, { useState } from 'react';
import { Pet } from '../types';
import { Copy, ChevronRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface PetCardProps {
  pet: Pet;
  className?: string;
}

export function PetCard({ pet, className = '' }: PetCardProps) {
  const { navigate, showToast } = useApp();
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string; angle: number; velocity: number }[]>([]);
  const [avatarAnim, setAvatarAnim] = useState<any>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(pet.applicationNumber);
    showToast('Companion ID copied.', 'success', '📋');
  };

  const handlePetAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate overall average affinity resonance score (0 - 100%)
    const pillars = pet.affinityPillars || [];
    const averageResonance = pillars.length > 0
      ? Math.round(pillars.reduce((acc, p) => acc + (p.resonance ?? 50), 0) / pillars.length)
      : 50;

    let level: 'exalted' | 'strong' | 'developing' = 'developing';
    let emojis = ['🌱', '✨', '🐾', '💛'];
    let toastMsg = `🌱 Nurturing Trust! ${pet.name} feels safe and appreciates the gentle pats! +5 Bond XP`;
    let toastIcon = '🐾';
    let animConfig = {};

    if (averageResonance >= 85) {
      level = 'exalted';
      emojis = ['👑', '🌟', '💖', '🔥', '🌈', '🐾'];
      toastMsg = `🌟 Divine Connection! ${pet.name} does a joyful double spin! You share an exalted bond! +5 Bond XP`;
      toastIcon = '👑';
      animConfig = {
        scale: [1, 1.25, 0.85, 1.15, 1],
        rotate: [0, -15, 15, -8, 8, 0],
        y: [0, -25, 4, -10, 0],
      };
    } else if (averageResonance >= 60) {
      level = 'strong';
      emojis = ['💖', '✨', '🌸', '🐾'];
      toastMsg = `💖 Warm devotion! ${pet.name} leans into your hand with happy vertical wiggles! +5 Bond XP`;
      toastIcon = '✨';
      animConfig = {
        scale: [1, 1.15, 0.92, 1.05, 1],
        y: [0, -12, 2, -4, 0],
        rotate: [0, -4, 4, 0],
      };
    } else {
      level = 'developing';
      emojis = ['🌱', '✨', '🐾', '💛'];
      toastMsg = `🌱 Trust growing! ${pet.name} looks up with soft eyes and gentle wiggles. +5 Bond XP`;
      toastIcon = '🐾';
      animConfig = {
        scale: [1, 1.08, 0.96, 1.02, 1],
        rotate: [0, -3, 3, 0],
      };
    }

    // Trigger physical reaction animation
    setAvatarAnim(animConfig);

    // Spawn rich radial particles
    const particleCount = level === 'exalted' ? 8 : level === 'strong' ? 5 : 3;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      // Direct velocity angle spreading upwards and outwards (-120deg to -60deg)
      const angle = (-90 + (Math.random() - 0.5) * 60) * (Math.PI / 180);
      const velocity = 40 + Math.random() * 50;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        id: Date.now() + i + Math.random(),
        x,
        y,
        emoji,
        angle,
        velocity,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup animations and particles
    setTimeout(() => {
      setAvatarAnim({});
      setIsAnimating(false);
    }, 600);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1100);

    // Provide premium vibration patterns if available
    if (navigator.vibrate) {
      if (level === 'exalted') {
        navigator.vibrate([40, 30, 40]);
      } else if (level === 'strong') {
        navigator.vibrate(30);
      } else {
        navigator.vibrate(15);
      }
    }

    showToast(toastMsg, 'success', toastIcon);
  };

  const dynamicCareScore = Math.min(
    100,
    Math.round(((pet.nutritionPercent ?? 50) * 0.4) + ((pet.hydrationPercent ?? 77) * 0.3) + 30)
  );

  return (
    <div
      id="pet-card"
      className={`relative bg-[var(--card-bg)] backdrop-blur-xl rounded-3xl border border-[var(--card-border)] shadow-xl shadow-[var(--primary)]/5 p-6 sm:p-8 flex flex-col space-y-6 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--primary)]/10 group ${className}`}
    >
      {/* Premium background accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-110 duration-700" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[var(--primary)]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Primary Row: Beautiful Image & Meta Details */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        
        {/* Interactive Pet Photo Hub */}
        <div 
          className="relative shrink-0 cursor-pointer select-none group" 
          onClick={handlePetAvatarClick}
          title="Tap to give head pats!"
        >
          <motion.div 
            animate={avatarAnim.scale ? avatarAnim : { 
              scale: [1, 1.02, 1],
              y: [0, -1, 0]
            }}
            transition={avatarAnim.scale ? { duration: 0.6, ease: "easeOut" } : { 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-[var(--primary)]/10 shadow-lg shadow-[var(--primary)]/10 transform transition-transform duration-500 group-hover:scale-102"
          >
            {pet.avatarUrl ? (
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[var(--primary)]/5 flex items-center justify-center">
                <span className="text-4xl">🐾</span>
              </div>
            )}
            
            {/* Eye Blinks overlay */}
            <motion.div
              animate={{ opacity: [0, 0, 1, 0, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                times: [0, 0.9, 0.92, 0.94, 1] 
              }}
              className="absolute inset-0 bg-slate-900/10 pointer-events-none"
            />

            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-black text-xs bg-slate-900/60 px-2 py-1 rounded-lg backdrop-blur-xs transition-opacity select-none">
                Pat Head 👋
              </span>
            </div>
          </motion.div>
          
          {/* Paw status Badge on Photo */}
          <div className="absolute -bottom-2 -right-2 bg-[var(--primary)] border-2 border-white w-7 h-7 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-xs">✨</span>
          </div>

          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, scale: 0.4, x: p.x, y: p.y }}
                animate={{ 
                  opacity: [1, 1, 0], 
                  scale: [0.4, 1.5, 0.8],
                  x: p.x + (Math.sin(p.angle) * p.velocity),
                  y: p.y - p.velocity,
                  rotate: [0, (Math.random() - 0.5) * 60]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="absolute text-2xl pointer-events-none z-30 select-none"
                style={{ left: -12, top: -12 }}
              >
                {p.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Pet Meta Information */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-[var(--text)] tracking-tight">
                  {pet.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-extrabold text-[10px] tracking-wider uppercase border border-[var(--primary)]/20 shrink-0">
                  {pet.species}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] mt-1">
                {pet.breed} • {pet.age}
              </p>
            </div>
            
            {/* Companion ID block */}
            <div className="flex items-center justify-center sm:justify-start gap-1 bg-[var(--background)]/50 border border-[var(--card-border)] px-3 py-1 rounded-xl self-center sm:self-start">
              <span className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-wider">ID:</span>
              <span className="font-mono text-xs font-bold text-[var(--text-muted)]">{pet.applicationNumber}</span>
              <button 
                type="button"
                onClick={copyToClipboard} 
                className="text-[var(--text-muted)] opacity-60 hover:text-[var(--primary)] p-0.5 transition active:scale-90"
                title="Copy Companion ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Premium Status Pill Dividers */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[var(--primary)]/5 rounded-2xl p-3 border border-[var(--primary)]/10 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] opacity-60 font-extrabold uppercase tracking-wider">
                <Heart className="w-3 h-3 text-[var(--primary)] fill-[var(--primary)]" />
                <span>Bond Level</span>
              </div>
              <span className="text-base font-black text-[var(--text)] font-heading mt-0.5">
                Level {pet.level} <span className="text-xs font-semibold text-[var(--text-muted)]">({pet.levelTitle || 'New Friend'})</span>
              </span>
            </div>

            <div className="bg-[var(--primary)]/5 rounded-2xl p-3 border border-[var(--primary)]/10 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] opacity-60 font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Care Score</span>
              </div>
              <span className="text-base font-black text-emerald-700 font-heading mt-0.5">
                {dynamicCareScore}/100 <span className="text-xs font-semibold text-[var(--text-muted)]">({dynamicCareScore >= 80 ? 'Excellent' : 'Healthy'})</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Progression XP Bar */}
      <div className="space-y-2 border-t border-[var(--primary)]/10 pt-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-[var(--text-muted)] opacity-70">Relationship Maturity</span>
          <span className="font-mono font-bold text-[var(--primary)]">
            {Math.round(((pet.xp ?? 0) / (pet.nextLevelXp || 1000)) * 100)}% to next level
          </span>
        </div>
        <div className="w-full h-2.5 bg-[var(--primary)]/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round(((pet.xp ?? 0) / (pet.nextLevelXp || 1000)) * 100))}%` }}
          />
        </div>
      </div>

      {/* Main Call to Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate(`/pet/${pet.id}`)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition duration-200 active:scale-99 cursor-pointer"
        >
          <span>View Pet Profile &amp; Health Passport</span>
          <ChevronRight className="w-4 h-4 text-white/80" />
        </button>
      </div>

    </div>
  );
}

