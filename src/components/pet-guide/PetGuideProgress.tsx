import React from 'react';

interface PetGuideProgressProps {
  current: number;
  total: number;
}

export function PetGuideProgress({ current, total }: PetGuideProgressProps) {
  return (
    <div className="flex gap-1 mt-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full ${i === current ? 'w-4 bg-orange-500' : 'w-1 bg-slate-200'}`} />
      ))}
    </div>
  );
}
