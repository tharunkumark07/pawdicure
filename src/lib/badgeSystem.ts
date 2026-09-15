import { Pet, AffinityPillar } from '../types';

export interface PetBadge {
  id: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Mythic' | 'Transcendent';
  icon: string;
  description: string;
  requirementText: string;
  requiredXp?: number;
  requiredPillarsMaxed?: number; // count of pillars at 100%
  requiredSpecificPillarId?: string;
  category: 'xp' | 'pillar' | 'devotion' | 'legendary';
  difficulty: 'Hard' | 'Extreme' | 'Insane' | 'Near Impossible';
  estimatedTime: string;
}

export const PET_BADGES_CATALOG: PetBadge[] = [
  // 1. Level 1 - The First Spark (Entry Milestone)
  {
    id: 'badge-novice-bond',
    name: 'Spark of Devotion',
    tier: 'Bronze',
    icon: '🌱',
    description: 'First milestone of true companion guardianship. Awarded upon accumulating 1,000 Bond XP.',
    requirementText: 'Reach 1,000 Total Bond XP',
    requiredXp: 1000,
    category: 'xp',
    difficulty: 'Hard',
    estimatedTime: '2 - 4 Weeks of Daily Care',
  },
  // 2. Play Master (Maximizing Play & Agility Pillar to 100%)
  {
    id: 'badge-play-zenith',
    name: 'Apex Playmaster',
    tier: 'Silver',
    icon: '⚡',
    description: 'Maximized Play & Agility Pillar to 100% resonance through hundreds of agility loops and flirt pole drills.',
    requirementText: 'Maximize Play & Agility Pillar to 100%',
    requiredSpecificPillarId: 'play',
    category: 'pillar',
    difficulty: 'Hard',
    estimatedTime: '1 - 2 Months',
  },
  // 3. Affection Sanctuary (Maximizing Affection Pillar to 100%)
  {
    id: 'badge-affection-zenith',
    name: 'Sanctuary of Heart',
    tier: 'Silver',
    icon: '💖',
    description: 'Maximized Affection & Cuddles Pillar to 100% resonance through months of uninterrupted morning rubs and soothing comfort.',
    requirementText: 'Maximize Affection & Cuddles Pillar to 100%',
    requiredSpecificPillarId: 'affection',
    category: 'pillar',
    difficulty: 'Hard',
    estimatedTime: '1 - 2 Months',
  },
  // 4. Centurion Guardian (10,000 XP)
  {
    id: 'badge-centurion-guardian',
    name: 'Centurion Guardian',
    tier: 'Gold',
    icon: '🛡️',
    description: 'Earned 10,000 Bond XP across feeding precision, clinical regimens, and daily companionship.',
    requirementText: 'Accumulate 10,000 Total Bond XP',
    requiredXp: 10000,
    category: 'xp',
    difficulty: 'Extreme',
    estimatedTime: '6 - 9 Months',
  },
  // 5. Quad-Pillar Harmonic (4 Pillars at 100%)
  {
    id: 'badge-quad-harmonic',
    name: 'Quad-Pillar Harmonic',
    tier: 'Gold',
    icon: '👑',
    description: 'Simultaneously maximized 4 separate bonding pillars to 100% resonance.',
    requirementText: 'Simultaneously reach 100% in 4 distinct pillars',
    requiredPillarsMaxed: 4,
    category: 'pillar',
    difficulty: 'Extreme',
    estimatedTime: '8 - 12 Months',
  },
  // 6. Mythic Patriarch / Matriarch (50,000 XP)
  {
    id: 'badge-celestial-keeper',
    name: 'Celestial Soulmate',
    tier: 'Mythic',
    icon: '🌌',
    description: 'Achieved 50,000 Total Bond XP. A bond transcending ordinary guardianship into profound mutual harmony.',
    requirementText: 'Accumulate 50,000 Total Bond XP',
    requiredXp: 50000,
    category: 'devotion',
    difficulty: 'Insane',
    estimatedTime: '1.5 - 2 Years of Flawless Care',
  },
  // 7. Full Spectrum Perfection (All 7 Pillars at 100%)
  {
    id: 'badge-septenary-ascendance',
    name: 'Septenary Ascendance',
    tier: 'Mythic',
    icon: '🌟',
    description: 'Maximized all 7 pillars (Affection, Nutrition, Play, Outdoors, Grooming, Health, Rest) to 100% resonance.',
    requirementText: 'Max out all 7 Affinity Pillars to 100%',
    requiredPillarsMaxed: 7,
    category: 'pillar',
    difficulty: 'Insane',
    estimatedTime: '2 - 3 Years of Unbroken Routine',
  },
  // 8. THE FINAL APEX BADGE - Near Impossible (100,000 XP + All 7 Pillars Maxed)
  {
    id: 'badge-eternal-transcendence',
    name: 'Eternal Bond of Eternity',
    tier: 'Transcendent',
    icon: '🪐',
    description: 'The absolute pinnacle of human-canine/feline companionship. Requires 100,000 Total Bond XP and absolute 100% resonance across every single affinity pillar. Legend has it fewer than 0.01% of guardians ever unlock this sacred icon.',
    requirementText: '100,000 Total XP & All 7 Pillars at 100%',
    requiredXp: 100000,
    requiredPillarsMaxed: 7,
    category: 'legendary',
    difficulty: 'Near Impossible',
    estimatedTime: '3 to 5+ Years of Dedicated Daily Devotion',
  },
];

/**
 * Calculates badge unlock state and progress for a given pet
 */
export function evaluatePetBadges(pet: Pet) {
  const pillars = pet.affinityPillars || [];
  const maxedPillarsCount = pillars.filter((p) => p.resonance >= 100).length;
  const currentXp = pet.xp || 0;

  return PET_BADGES_CATALOG.map((badge) => {
    let isUnlocked = false;
    let progressPercent = 0;
    let progressLabel = '';

    if (badge.id === 'badge-eternal-transcendence') {
      const xpPart = Math.min(1, currentXp / 100000);
      const pillarPart = maxedPillarsCount / 7;
      progressPercent = Math.min(100, Math.round(((xpPart + pillarPart) / 2) * 100));
      isUnlocked = currentXp >= 100000 && maxedPillarsCount >= 7;
      progressLabel = `${currentXp.toLocaleString()} / 100,000 XP • ${maxedPillarsCount}/7 Pillars Maxed`;
    } else if (badge.requiredXp) {
      progressPercent = Math.min(100, Math.round((currentXp / badge.requiredXp) * 100));
      isUnlocked = currentXp >= badge.requiredXp;
      progressLabel = `${currentXp.toLocaleString()} / ${badge.requiredXp.toLocaleString()} XP`;
    } else if (badge.requiredSpecificPillarId) {
      const targetPillar = pillars.find((p) => p.id === badge.requiredSpecificPillarId);
      const res = targetPillar ? targetPillar.resonance : 0;
      progressPercent = Math.min(100, res);
      isUnlocked = res >= 100;
      progressLabel = `${res}% / 100% Resonance`;
    } else if (badge.requiredPillarsMaxed) {
      progressPercent = Math.min(100, Math.round((maxedPillarsCount / badge.requiredPillarsMaxed) * 100));
      isUnlocked = maxedPillarsCount >= badge.requiredPillarsMaxed;
      progressLabel = `${maxedPillarsCount} / ${badge.requiredPillarsMaxed} Pillars Maxed (100%)`;
    }

    return {
      ...badge,
      isUnlocked,
      progressPercent,
      progressLabel,
    };
  });
}
