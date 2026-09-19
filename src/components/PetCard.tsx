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
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(pet.applicationNumber);
    showToast('Companion ID copied.', 'success', '📋');
  };

  const handlePetAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);

    showToast(`🐾 *Purr!* ${pet.name} loves the head pats! +5 Bond XP`, 'success', '💖');
  };

  const dynamicCareScore = Math.min(
    100,
    Math.round(((pet.nutritionPercent ?? 50) * 0.4) + ((pet.hydrationPercent ?? 77) * 0.3) + 30)
  );

  return (
    <div
      id="pet-card"
      className={`relative bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 flex flex-col space-y-6 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 group ${className}`}
    >
      {/* Premium background accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-110 duration-700" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Primary Row: Beautiful Image & Meta Details */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        
        {/* Interactive Pet Photo Hub */}
        <div 
          className="relative shrink-0 cursor-pointer select-none group" 
          onClick={handlePetAvatarClick}
          title="Tap to give head pats!"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-orange-500/10 shadow-lg shadow-orange-500/10 transform transition-transform duration-500 group-hover:scale-102">
            {pet.avatarUrl ? (
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                <span className="text-4xl">🐾</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-black text-xs bg-slate-900/60 px-2 py-1 rounded-lg backdrop-blur-xs transition-opacity select-none">
                Pat Head 👋
              </span>
            </div>
          </div>
          
          {/* Paw status Badge on Photo */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-500 to-[#ff6b4a] border-2 border-white w-7 h-7 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-xs">✨</span>
          </div>

          <AnimatePresence>
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute text-2xl pointer-events-none z-30"
                style={{ left: h.x - 12, top: h.y - 12 }}
              >
                💖
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Pet Meta Information */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {pet.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ff6b4a] font-extrabold text-[10px] tracking-wider uppercase border border-orange-100 shrink-0">
                  {pet.species}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                {pet.breed} • {pet.age}
              </p>
            </div>
            
            {/* Companion ID block */}
            <div className="flex items-center justify-center sm:justify-start gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl self-center sm:self-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID:</span>
              <span className="font-mono text-xs font-bold text-slate-600">{pet.applicationNumber}</span>
              <button 
                type="button"
                onClick={copyToClipboard} 
                className="text-slate-400 hover:text-[#ff6b4a] p-0.5 transition active:scale-90"
                title="Copy Companion ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Premium Status Pill Dividers */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                <Heart className="w-3 h-3 text-[#ff6b4a] fill-[#ff6b4a]" />
                <span>Bond Level</span>
              </div>
              <span className="text-base font-black text-slate-800 font-heading mt-0.5">
                Level {pet.level} <span className="text-xs font-semibold text-slate-500">({pet.levelTitle || 'New Friend'})</span>
              </span>
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Care Score</span>
              </div>
              <span className="text-base font-black text-emerald-700 font-heading mt-0.5">
                {dynamicCareScore}/100 <span className="text-xs font-semibold text-slate-500">({dynamicCareScore >= 80 ? 'Excellent' : 'Healthy'})</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Progression XP Bar */}
      <div className="space-y-2 border-t border-slate-50 pt-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-500">Relationship Maturity</span>
          <span className="font-mono font-bold text-[#ff6b4a]">
            {Math.round(((pet.xp ?? 0) / (pet.nextLevelXp || 1000)) * 100)}% to next level
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#ff6b4a] to-amber-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round(((pet.xp ?? 0) / (pet.nextLevelXp || 1000)) * 100))}%` }}
          />
        </div>
      </div>

      {/* Main Call to Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate(`/pet/${pet.id}`)}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition duration-200 active:scale-99"
        >
          <span>Open Detailed Health Passport &amp; Profile</span>
          <ChevronRight className="w-4 h-4 text-orange-400" />
        </button>
      </div>

    </div>
  );
}

