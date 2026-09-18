import React, { useState } from 'react';
import { Pet } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { PetIllustration } from './PetIllustration';
import { Copy, ChevronRight, Utensils, Activity, Heart, Camera, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface PetCardProps {
  pet: Pet;
  className?: string;
}

export function PetCard({ pet, className = '' }: PetCardProps) {
  const { navigate, showToast } = useApp();
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pet.applicationNumber);
    showToast('Pet ID copied.', 'success', '📋');
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

  const quickActions = [
    { icon: Camera, label: 'Memories', route: '/memories' },
    { icon: Bell, label: 'Reminders', route: '/reminders' },
  ];

  return (
    <Card id="pet-card" className={`group hover:shadow-lg transition-all duration-300 ${className}`} padding="lg">
      <div className="flex justify-between items-start mb-4">
        <div className="relative cursor-pointer" onClick={handlePetAvatarClick} title="Tap to give head pats!">
          {pet.avatarUrl ? (
            <motion.img
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.92 }}
              src={pet.avatarUrl}
              alt={pet.name}
              className="w-20 h-20 rounded-3xl object-cover shadow-md"
            />
          ) : (
            <PetIllustration species={pet.species} />
          )}
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -45, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute text-xl pointer-events-none select-none z-30"
                style={{ left: h.x - 10, top: h.y - 10 }}
              >
                💖
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pet ID</div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs font-bold text-slate-700">{pet.applicationNumber}</span>
            <button onClick={copyToClipboard} className="text-slate-400 hover:text-[#ff6b4a]">
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <h3 className="font-heading font-black text-2xl text-slate-900 mb-0.5">{pet.name}</h3>
      <p className="text-sm text-slate-500 font-semibold mb-4">
        {pet.breed} • {pet.age}
      </p>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.route)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition"
            title={action.label}
          >
            <action.icon className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-bold text-slate-500">{action.label}</span>
          </button>
        ))}
      </div>

      <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`/pet/${pet.id}`)}>
        View Profile <ChevronRight className="w-4 h-4" />
      </Button>
    </Card>
  );
}
