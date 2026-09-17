import { PetGuideCharacter, GuideStep } from '../types/petGuide';

export const PET_GUIDE_CHARACTERS: PetGuideCharacter[] = [
  { id: 'dog', name: 'Buddy', description: 'Energetic and friendly', assetPath: '/assets/pet-guides/dog-guide.png' },
  { id: 'cat', name: 'Luna', description: 'Calm and clever', assetPath: '/assets/pet-guides/cat-guide.png' }
];

export const HOME_GUIDE_STEPS: GuideStep[] = [
  { page: 'home', targetId: 'pet-card', message: "Hey! I'm your guide! This is your pet's identity card." },
  { page: 'home', targetId: 'care-progress', message: "Here you can track your pet's daily care progress." }
];
