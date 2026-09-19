import React from 'react';
import { Pet } from '../../types';

interface RoutinePetSwitcherProps {
  pets: Pet[];
  activePetId: string;
  onSelectPet: (petId: string) => void;
}

export function RoutinePetSwitcher({ pets, activePetId, onSelectPet }: RoutinePetSwitcherProps) {
  if (pets.length <= 1) return null;

  return (
    <div className="flex bg-[var(--background-alt)] p-1 rounded-2xl border border-[var(--card-border)] overflow-x-auto">
      {pets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelectPet(p.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activePetId === p.id
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <span>{p.species === 'Cat' ? '🐱' : '🐶'}</span>
          <span>{p.name}</span>
        </button>
      ))}
    </div>
  );
}
