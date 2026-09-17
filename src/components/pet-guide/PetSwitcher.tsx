import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Pet } from '../../types';

interface PetSwitcherProps {
  onPetChange: (petId: string) => void;
}

export function PetSwitcher({ onPetChange }: PetSwitcherProps) {
  const { pets, activePetId } = useApp() as any;
  const [isOpen, setIsOpen] = useState(false);

  const petList = Array.isArray(pets) ? pets : Object.values(pets || {});
  const activePet = petList.find((p: any) => p.id === activePetId) || petList[0];

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100"
      >
        <img src={activePet?.avatarUrl || '/placeholder.png'} className="w-8 h-8 rounded-full" alt={activePet?.name} />
        <span className="font-medium text-slate-800">{activePet?.name}</span>
        <span className="text-slate-400">▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-64 z-50"
          >
            {petList.map((pet: any) => (
              <button 
                type="button"
                key={pet.id}
                onClick={() => { onPetChange(pet.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 p-2 rounded-xl ${activePetId === pet.id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
              >
                <img src={pet.avatarUrl || '/placeholder.png'} className="w-10 h-10 rounded-full" alt={pet.name} />
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-800">{pet.name}</p>
                  <p className="text-xs text-slate-500">{pet.species}</p>
                </div>
                {activePetId === pet.id && <span className="text-orange-500">✓</span>}
              </button>
            ))}
            <button type="button" className="w-full text-left p-2 text-sm text-slate-500 hover:text-orange-500">+ Add another pet</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
