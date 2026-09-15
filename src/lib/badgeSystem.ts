import { Pet } from '../types';

export interface PetBadge {
  id: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Mythic' | 'Transcendent';
  icon: string;
  description: string;
  requirementText: string;
  category: 'CARE' | 'HEALTH' | 'NUTRITION' | 'ACTIVITY' | 'RELATIONSHIP' | 'MEMORIES' | 'EXPLORATION' | 'CONSISTENCY' | 'SAFETY' | 'RESPONSIBILITY' | 'COMMUNITY' | 'MASTERY' | 'LEGENDARY';
  difficulty: 'Hard' | 'Extreme' | 'Insane' | 'Near Impossible';
  estimatedTime: string;
  isUnlocked?: boolean;
  progressPercent?: number;
  progressLabel?: string;
  unlockedAt?: number | null;
  showcase?: boolean;
}

export const PET_BADGES_CATALOG: PetBadge[] = [
  // 1. CARE
  {
    id: 'badge-nurturing-guardian',
    name: 'Nurturing Guardian',
    tier: 'Bronze',
    icon: '🌱',
    description: 'Awarded for completing 10 daily routine care tasks for your companion.',
    requirementText: 'Complete 10 routine care tasks',
    category: 'CARE',
    difficulty: 'Hard',
    estimatedTime: '2 - 3 Days',
  },
  {
    id: 'badge-absolute-caregiver',
    name: 'Absolute Caregiver',
    tier: 'Gold',
    icon: '💖',
    description: 'Recognizes outstanding care and persistence in routine task logging.',
    requirementText: 'Complete 100 routine care tasks',
    category: 'CARE',
    difficulty: 'Extreme',
    estimatedTime: '1 - 2 Months',
  },

  // 2. HEALTH
  {
    id: 'badge-shield-immunity',
    name: 'Shield of Immunity',
    tier: 'Silver',
    icon: '🛡️',
    description: 'Awarded when your companion has all core vaccination records completed and verified current.',
    requirementText: 'Verify 3 vaccination records as current',
    category: 'HEALTH',
    difficulty: 'Hard',
    estimatedTime: 'Clinical Schedule',
  },
  {
    id: 'badge-regimen-specialist',
    name: 'Regimen Specialist',
    tier: 'Gold',
    icon: '💊',
    description: 'Successfully complete 15 scheduled medication doses on time.',
    requirementText: 'Administer 15 medication doses on time',
    category: 'HEALTH',
    difficulty: 'Extreme',
    estimatedTime: 'Multi-week regime',
  },

  // 3. NUTRITION
  {
    id: 'badge-culinary-master',
    name: 'Culinary Master',
    tier: 'Bronze',
    icon: '🍲',
    description: 'Nourish your companion with 20 carefully portioned and balanced meals.',
    requirementText: 'Log 20 feeding records with toppers',
    category: 'NUTRITION',
    difficulty: 'Hard',
    estimatedTime: '1 - 2 Weeks',
  },
  {
    id: 'badge-hydration-champion',
    name: 'Hydration Champion',
    tier: 'Silver',
    icon: '💧',
    description: 'Ensure continuous fresh, cool water fountain access, satisfying hydration goals.',
    requirementText: 'Maintain hydration targets 7 times',
    category: 'NUTRITION',
    difficulty: 'Hard',
    estimatedTime: '1 Week',
  },

  // 4. ACTIVITY
  {
    id: 'badge-trail-blazer',
    name: 'Trail Blazer',
    tier: 'Gold',
    icon: '🏃',
    description: 'Walk long loops with your pet to cover significant distances over active outdoor expeditions.',
    requirementText: 'Reach Level 8 Outdoor Activity',
    category: 'ACTIVITY',
    difficulty: 'Extreme',
    estimatedTime: '3 - 6 Months',
  },

  // 5. RELATIONSHIP
  {
    id: 'badge-twin-flame',
    name: 'Twin Flame',
    tier: 'Mythic',
    icon: '🔥',
    description: 'Forge an unbreakable lifepath bond. Unlocked upon reaching Level 15 Bond tier.',
    requirementText: 'Reach Level 15 Bond Tier',
    category: 'RELATIONSHIP',
    difficulty: 'Insane',
    estimatedTime: '6 - 12 Months',
  },

  // 6. MEMORIES
  {
    id: 'badge-chronicle-keeper',
    name: 'Chronicle Keeper',
    tier: 'Bronze',
    icon: '📸',
    description: 'Commemorate the milestones of pet companionship by adding 5 memories to your journal.',
    requirementText: 'Record 5 journal memories',
    category: 'MEMORIES',
    difficulty: 'Hard',
    estimatedTime: '2 - 4 Weeks',
  },
  {
    id: 'badge-lifelong-archivist',
    name: 'Lifelong Archivist',
    tier: 'Gold',
    icon: '📚',
    description: 'Assemble a rich personal gallery of 20 unforgettable companionship memories.',
    requirementText: 'Record 20 journal memories',
    category: 'MEMORIES',
    difficulty: 'Extreme',
    estimatedTime: '6 - 12 Months',
  },

  // 7. EXPLORATION
  {
    id: 'badge-global-wanderer',
    name: 'Global Wanderer',
    tier: 'Silver',
    icon: '🗺️',
    description: 'Save 5 favorite pet-friendly parks, clinics, groomers, or cafes in your local exploration list.',
    requirementText: 'Favorite 5 local places',
    category: 'EXPLORATION',
    difficulty: 'Hard',
    estimatedTime: '2 - 4 Weeks',
  },

  // 8. CONSISTENCY
  {
    id: 'badge-daily-devotee',
    name: 'Daily Devotee',
    tier: 'Silver',
    icon: '⭐',
    description: 'Log into PAWdiCURE and perform care operations for 14 consecutive days.',
    requirementText: 'Maintain a 14-day check-in streak',
    category: 'CONSISTENCY',
    difficulty: 'Hard',
    estimatedTime: '14 Days Unbroken',
  },
  {
    id: 'badge-yearly-sentinel',
    name: 'Yearly Sentinel',
    tier: 'Mythic',
    icon: '⏳',
    description: 'The standard of supreme reliability. Maintain daily check-ins for 30 consecutive days.',
    requirementText: 'Maintain a 30-day check-in streak',
    category: 'CONSISTENCY',
    difficulty: 'Insane',
    estimatedTime: '30 Days Unbroken',
  },

  // 9. SAFETY
  {
    id: 'badge-fortress-commander',
    name: 'Fortress Commander',
    tier: 'Silver',
    icon: '🔐',
    description: 'Provide total legal and medical safety precautions: Microchip, Emergency Contact, and Vet registry completely filled out.',
    requirementText: 'Complete all safety profile fields',
    category: 'SAFETY',
    difficulty: 'Hard',
    estimatedTime: 'Immediate Setup',
  },

  // 10. COMMUNITY
  {
    id: 'badge-household-synergy',
    name: 'Household Synergy',
    tier: 'Silver',
    icon: '👥',
    description: 'Collaborate with your family. Invite at least 2 family members or caregivers to synchronize care duties.',
    requirementText: 'Invite 2 family members',
    category: 'COMMUNITY',
    difficulty: 'Hard',
    estimatedTime: '1 Day',
  },

  // 11. MASTERY
  {
    id: 'badge-septenary-ascendance',
    name: 'Septenary Ascendance',
    tier: 'Mythic',
    icon: '🌟',
    description: 'Simultaneously reach 100% resonance in all 7 bonding pillars through flawless continuous care.',
    requirementText: 'Max out all 7 affinity pillars to 100%',
    category: 'MASTERY',
    difficulty: 'Insane',
    estimatedTime: '2 - 3 Years',
  },

  // 12. LEGENDARY
  {
    id: 'badge-eternal-transcendence',
    name: 'Eternal Bond of Eternity',
    tier: 'Transcendent',
    icon: '🪐',
    description: 'The supreme lifetime achievement. Accumulate 100,000 Total Bond XP and maintain absolute 100% resonance across every single affinity pillar.',
    requirementText: '100,000 XP & All 7 Pillars at 100%',
    category: 'LEGENDARY',
    difficulty: 'Near Impossible',
    estimatedTime: '3 - 5+ Years',
  }
];

/**
 * Fallback / simulation evaluator of badges for offline use or instant client state updates
 */
export function evaluatePetBadges(pet: Pet, household: any = {}): PetBadge[] {
  const pillars = pet.affinityPillars || [];
  const maxedPillarsCount = pillars.filter((p) => p.resonance >= 100).length;
  const currentXp = pet.xp || 0;
  const streakDays = household.streakDays || 12; // fallback to 12 if not provided
  const tasksCompletedCount = household.routineTasks?.filter((t: any) => t.completed).length || 0;
  const remindersCompletedCount = household.reminders?.filter((r: any) => r.completed).length || 0;
  const memoriesCount = household.memories?.length || 0;
  const medsCount = household.medications?.filter((m: any) => m.takenToday).length || 0;
  const vacsCount = household.vaccines?.filter((v: any) => v.completed).length || 0;
  const familyCount = household.familyMembers?.length || 1;
  const favoritesCount = household.places?.filter((pl: any) => pl.isFavorite).length || 0;
  const isSafetyComplete = !!(pet.microchipId && pet.vetClinic && pet.emergencyContact && pet.emergencyPhone);

  return PET_BADGES_CATALOG.map((badge) => {
    let isUnlocked = false;
    let progressPercent = 0;
    let progressLabel = '';

    switch (badge.id) {
      case 'badge-nurturing-guardian':
        isUnlocked = tasksCompletedCount >= 10;
        progressPercent = Math.min(100, Math.round((tasksCompletedCount / 10) * 100));
        progressLabel = `${tasksCompletedCount} / 10 Tasks`;
        break;
      case 'badge-absolute-caregiver':
        isUnlocked = tasksCompletedCount >= 100;
        progressPercent = Math.min(100, Math.round((tasksCompletedCount / 100) * 100));
        progressLabel = `${tasksCompletedCount} / 100 Tasks`;
        break;
      case 'badge-shield-immunity':
        isUnlocked = vacsCount >= 3;
        progressPercent = Math.min(100, Math.round((vacsCount / 3) * 100));
        progressLabel = `${vacsCount} / 3 Vaccinations`;
        break;
      case 'badge-regimen-specialist':
        isUnlocked = medsCount >= 15;
        progressPercent = Math.min(100, Math.round((medsCount / 15) * 100));
        progressLabel = `${medsCount} / 15 Doses`;
        break;
      case 'badge-culinary-master':
        const feeds = household.feedingHistory?.length || 0;
        isUnlocked = feeds >= 20;
        progressPercent = Math.min(100, Math.round((feeds / 20) * 100));
        progressLabel = `${feeds} / 20 Feeds`;
        break;
      case 'badge-hydration-champion':
        isUnlocked = pet.hydrationPercent >= 100;
        progressPercent = pet.hydrationPercent >= 100 ? 100 : pet.hydrationPercent;
        progressLabel = `${pet.hydrationPercent}% hydration status`;
        break;
      case 'badge-trail-blazer':
        isUnlocked = currentXp >= 8000;
        progressPercent = Math.min(100, Math.round((currentXp / 8000) * 100));
        progressLabel = `${currentXp.toLocaleString()} / 8,000 XP`;
        break;
      case 'badge-twin-flame':
        isUnlocked = pet.level >= 15;
        progressPercent = Math.min(100, Math.round((pet.level / 15) * 100));
        progressLabel = `Level ${pet.level} / 15`;
        break;
      case 'badge-chronicle-keeper':
        isUnlocked = memoriesCount >= 5;
        progressPercent = Math.min(100, Math.round((memoriesCount / 5) * 100));
        progressLabel = `${memoriesCount} / 5 Memories`;
        break;
      case 'badge-lifelong-archivist':
        isUnlocked = memoriesCount >= 20;
        progressPercent = Math.min(100, Math.round((memoriesCount / 20) * 100));
        progressLabel = `${memoriesCount} / 20 Memories`;
        break;
      case 'badge-global-wanderer':
        isUnlocked = favoritesCount >= 5;
        progressPercent = Math.min(100, Math.round((favoritesCount / 5) * 100));
        progressLabel = `${favoritesCount} / 5 Favorites`;
        break;
      case 'badge-daily-devotee':
        isUnlocked = streakDays >= 14;
        progressPercent = Math.min(100, Math.round((streakDays / 14) * 100));
        progressLabel = `${streakDays} / 14 Days`;
        break;
      case 'badge-yearly-sentinel':
        isUnlocked = streakDays >= 30;
        progressPercent = Math.min(100, Math.round((streakDays / 30) * 100));
        progressLabel = `${streakDays} / 30 Days`;
        break;
      case 'badge-fortress-commander':
        isUnlocked = isSafetyComplete;
        progressPercent = isSafetyComplete ? 100 : 50;
        progressLabel = isSafetyComplete ? 'Setup Complete' : 'Incomplete Fields';
        break;
      case 'badge-household-synergy':
        isUnlocked = familyCount >= 2;
        progressPercent = Math.min(100, Math.round((familyCount / 2) * 100));
        progressLabel = `${familyCount} / 2 Members`;
        break;
      case 'badge-septenary-ascendance':
        isUnlocked = maxedPillarsCount >= 7;
        progressPercent = Math.min(100, Math.round((maxedPillarsCount / 7) * 100));
        progressLabel = `${maxedPillarsCount} / 7 Pillars Maxed`;
        break;
      case 'badge-eternal-transcendence':
        isUnlocked = currentXp >= 100000 && maxedPillarsCount >= 7;
        const xpRatio = Math.min(1, currentXp / 100000);
        const pillarRatio = maxedPillarsCount / 7;
        progressPercent = Math.min(100, Math.round(((xpRatio + pillarRatio) / 2) * 100));
        progressLabel = `${currentXp.toLocaleString()} / 100,000 XP • ${maxedPillarsCount}/7 Pillars`;
        break;
      default:
        break;
    }

    return {
      ...badge,
      isUnlocked,
      progressPercent,
      progressLabel,
      unlockedAt: isUnlocked ? Date.now() - 3600000 * 24 : null,
      showcase: false
    };
  });
}
