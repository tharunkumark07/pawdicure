import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Footprints, Camera, Stethoscope, Calendar, Sparkles, X } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface RadialQuickCareProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: 'feed' | 'walk' | 'med' | 'memory' | 'play' | 'health' | 'water' | 'reminder' | 'routine') => void;
}

export function RadialQuickCare({ isOpen, onClose, onAction }: RadialQuickCareProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      triggerHaptic('medium');
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const actions = [
    { id: 'feed' as const, icon: Utensils, label: 'Feed Pet', color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 'walk' as const, icon: Footprints, label: 'Activity', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'routine' as const, icon: Sparkles, label: 'Routine', color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 'memory' as const, icon: Camera, label: 'Memory', color: 'text-pink-500', bg: 'bg-pink-100' },
    { id: 'health' as const, icon: Stethoscope, label: 'Health', color: 'text-teal-600', bg: 'bg-teal-100' },
    { id: 'reminder' as const, icon: Calendar, label: 'Reminder', color: 'text-indigo-500', bg: 'bg-indigo-100' },
  ];

  // Calculate positions for a semi-circle/fan above the center bottom
  const radius = 120; // distance from center button
  const startAngle = Math.PI; // left
  const endAngle = 0; // right
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          {/* Radial Items */}
          <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-0 h-0 flex items-center justify-center">
            {actions.map((action, i) => {
              const angle = startAngle + (i / (actions.length - 1)) * (endAngle - startAngle);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius - 20;

              return (
                <motion.button
                  key={action.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ 
                    x, y, scale: 1, opacity: 1,
                    transition: { type: 'spring', damping: 15, stiffness: 200, delay: i * 0.03 }
                  }}
                  exit={{ 
                    x: 0, y: 0, scale: 0, opacity: 0,
                    transition: { type: 'spring', damping: 20, stiffness: 300, delay: (actions.length - 1 - i) * 0.02 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('medium');
                    onAction(action.id as any);
                    onClose();
                  }}
                  className="absolute pointer-events-auto flex flex-col items-center justify-center gap-1.5"
                  style={{ width: '60px', height: '60px', marginLeft: '-30px', marginTop: '-30px' }}
                >
                  <div className={`w-12 h-12 rounded-full ${action.bg} shadow-lg flex items-center justify-center border-2 border-white`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Central Close Button */}
            <motion.button
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0, transition: { type: 'spring', damping: 20 } }}
              exit={{ scale: 0, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                onClose();
              }}
              className="absolute pointer-events-auto w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center border-3 border-orange-50 text-slate-800"
              style={{ marginLeft: '-28px', marginTop: '-28px' }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
