import React from 'react';
import { Dog, Cat, Rabbit, Bird, Fish, HelpCircle } from 'lucide-react';

interface PetIllustrationProps {
  species: string;
  className?: string;
}

export function PetIllustration({ species, className = 'w-16 h-16' }: PetIllustrationProps) {
  const icons = {
    Dog: <Dog className={className} />,
    Cat: <Cat className={className} />,
    Rabbit: <Rabbit className={className} />,
    Bird: <Bird className={className} />,
    Fish: <Fish className={className} />,
    Other: <HelpCircle className={className} />
  };

  return (
    <div className={`flex items-center justify-center p-3 rounded-full bg-orange-100/50 text-[#ff6b4a] ${className.includes('w-') ? '' : 'w-20 h-20'}`}>
      {icons[species as keyof typeof icons] || icons.Other}
    </div>
  );
}
