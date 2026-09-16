import { Pet, CareLimit } from '../types';

export const PET_CARE_LIMITS = {
  WARNING_THRESHOLD: 1.0,
  SAFETY_BLOCK_THRESHOLD: 1.2,
};

// Helper to determine base limits based on profile
const getBaseFeedingLimit = (pet: Pet): number => {
  const base = pet.species === 'Cat' ? 100 : 300;
  const sizeMultiplier = pet.sizeCategory === 'Large' ? 2 : pet.sizeCategory === 'Tiny' ? 0.5 : 1;
  return base * sizeMultiplier;
};

const getBaseActivityLimit = (pet: Pet): number => {
  const base = pet.activityLevel === 'High' ? 60 : pet.activityLevel === 'Low' ? 20 : 40;
  return base;
};

export const petCareLimitService = {
  calculateFeedingLimit: (pet: Pet): number => {
    return getBaseFeedingLimit(pet);
  },

  calculateActivityLimit: (pet: Pet): number => {
    return getBaseActivityLimit(pet);
  },

  // Validate activity entries
  validateActivity: (
    recordedDuration: number,
    dailyTotal: number,
    pet: Pet,
    guidance?: CareLimit
  ) => {
    const limit = guidance?.value || getBaseActivityLimit(pet);
    const newTotal = dailyTotal + recordedDuration;

    if (newTotal > limit * PET_CARE_LIMITS.SAFETY_BLOCK_THRESHOLD) return 'SAFETY_BLOCK';
    if (newTotal > limit * PET_CARE_LIMITS.WARNING_THRESHOLD) return 'WARNING';
    return 'NORMAL';
  },

  // Validate feeding entries
  validateFeeding: (
    recordedGrams: number,
    dailyTotal: number,
    pet: Pet,
    guidance?: CareLimit
  ) => {
    const limit = guidance?.value || getBaseFeedingLimit(pet);
    const newTotal = dailyTotal + recordedGrams;

    if (newTotal > limit * PET_CARE_LIMITS.SAFETY_BLOCK_THRESHOLD) return 'SAFETY_BLOCK';
    if (newTotal > limit * PET_CARE_LIMITS.WARNING_THRESHOLD) return 'WARNING';
    return 'NORMAL';
  }
};
