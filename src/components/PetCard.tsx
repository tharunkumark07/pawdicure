import React from 'react';
import { Pet } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { PetIllustration } from './PetIllustration';
import { Copy, ChevronRight, Utensils, Activity, Heart, Camera, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PetCardProps {
  pet: Pet;
  className?: string;
}

export function PetCard({ pet, className = '' }: PetCardProps) {
  const { navigate, showToast } = useApp();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pet.applicationNumber);
    showToast('Pet ID copied.', 'success', '📋');
  };

  const quickActions = [
    { icon: Camera, label: 'Memories', route: '/memories' },
    { icon: Bell, label: 'Reminders', route: '/reminders' },
  ];

  return (
    <Card id="pet-card" className={`group hover:shadow-lg transition-all duration-300 ${className}`} padding="lg">
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          {pet.avatarUrl ? (
            <img src={pet.avatarUrl} alt={pet.name} className="w-20 h-20 rounded-3xl object-cover shadow-md" />
          ) : (
            <PetIllustration species={pet.species} />
          )}
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
