import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PetActivityRecord, ActivityType, ActivityIntensity } from '../types';
import { getUserLocalDate, getUserLocalTime } from '../lib/timeUtils';
import { dailyCycleService } from './dailyCycleService';

export interface ActivityTypeMeta {
  type: ActivityType;
  label: string;
  emoji: string;
  defaultTitle: string;
  defaultDuration: number; // in minutes
  baseXp: number;
  category: 'physical' | 'mental' | 'care' | 'bonding';
  hasDuration: boolean;
  hasIntensity: boolean;
  hasLocation: boolean;
}

export const ACTIVITY_TYPES_META: Record<ActivityType, ActivityTypeMeta> = {
  walk: {
    type: 'walk',
    label: 'Walk',
    emoji: '🐾',
    defaultTitle: 'Walk with companion',
    defaultDuration: 30,
    baseXp: 30,
    category: 'physical',
    hasDuration: true,
    hasIntensity: true,
    hasLocation: true,
  },
  play: {
    type: 'play',
    label: 'Play',
    emoji: '🎾',
    defaultTitle: 'Play Session',
    defaultDuration: 20,
    baseXp: 25,
    category: 'bonding',
    hasDuration: true,
    hasIntensity: true,
    hasLocation: false,
  },
  exercise: {
    type: 'exercise',
    label: 'Exercise',
    emoji: '🏃',
    defaultTitle: 'Exercise & Agility',
    defaultDuration: 30,
    baseXp: 35,
    category: 'physical',
    hasDuration: true,
    hasIntensity: true,
    hasLocation: true,
  },
  training: {
    type: 'training',
    label: 'Training',
    emoji: '🧠',
    defaultTitle: 'Commands & Focus Training',
    defaultDuration: 15,
    baseXp: 40,
    category: 'mental',
    hasDuration: true,
    hasIntensity: false,
    hasLocation: false,
  },
  outdoor: {
    type: 'outdoor',
    label: 'Outdoor Time',
    emoji: '🌳',
    defaultTitle: 'Park & Outdoor Exploration',
    defaultDuration: 25,
    baseXp: 25,
    category: 'physical',
    hasDuration: true,
    hasIntensity: true,
    hasLocation: true,
  },
  grooming: {
    type: 'grooming',
    label: 'Grooming',
    emoji: '🛁',
    defaultTitle: 'Brushing & Coat Care',
    defaultDuration: 15,
    baseXp: 30,
    category: 'care',
    hasDuration: true,
    hasIntensity: false,
    hasLocation: false,
  },
  indoor_play: {
    type: 'indoor_play',
    label: 'Indoor Play',
    emoji: '🧸',
    defaultTitle: 'Indoor Toy Play',
    defaultDuration: 15,
    baseXp: 20,
    category: 'bonding',
    hasDuration: true,
    hasIntensity: true,
    hasLocation: false,
  },
  bonding: {
    type: 'bonding',
    label: 'Bonding Time',
    emoji: '❤️',
    defaultTitle: 'Affection & Cuddle Time',
    defaultDuration: 20,
    baseXp: 25,
    category: 'bonding',
    hasDuration: true,
    hasIntensity: false,
    hasLocation: false,
  },
  feeding: {
    type: 'feeding',
    label: 'Feeding',
    emoji: '🍖',
    defaultTitle: 'Meal Portion Served',
    defaultDuration: 5,
    baseXp: 20,
    category: 'care',
    hasDuration: false,
    hasIntensity: false,
    hasLocation: false,
  },
  water: {
    type: 'water',
    label: 'Water',
    emoji: '💧',
    defaultTitle: 'Fresh Water Bowl Refill',
    defaultDuration: 2,
    baseXp: 15,
    category: 'care',
    hasDuration: false,
    hasIntensity: false,
    hasLocation: false,
  },
  medication: {
    type: 'medication',
    label: 'Medication',
    emoji: '💊',
    defaultTitle: 'Medication Administered',
    defaultDuration: 5,
    baseXp: 25,
    category: 'care',
    hasDuration: false,
    hasIntensity: false,
    hasLocation: false,
  },
  memory: {
    type: 'memory',
    label: 'Memory',
    emoji: '📸',
    defaultTitle: 'Special Moment Captured',
    defaultDuration: 5,
    baseXp: 30,
    category: 'bonding',
    hasDuration: false,
    hasIntensity: false,
    hasLocation: true,
  },
  health_check: {
    type: 'health_check',
    label: 'Health Check',
    emoji: '🩺',
    defaultTitle: 'General Wellness Check',
    defaultDuration: 10,
    baseXp: 35,
    category: 'care',
    hasDuration: true,
    hasIntensity: false,
    hasLocation: false,
  },
  custom: {
    type: 'custom',
    label: 'Custom Activity',
    emoji: '✏️',
    defaultTitle: 'Special Activity',
    defaultDuration: 20,
    baseXp: 20,
    category: 'bonding',
    hasDuration: true,
    hasIntensity: true,
    hasLocation: true,
  },
};

/**
 * Calculates estimated calorie burn based on activity duration and intensity
 */
export const estimateActivityCalories = (
  type: ActivityType,
  durationMinutes: number = 0,
  intensity: ActivityIntensity = 'moderate',
  isDog: boolean = true
): number => {
  if (durationMinutes <= 0) return 0;

  const intensityMultiplier = intensity === 'high' ? 1.4 : intensity === 'light' ? 0.7 : 1.0;
  const speciesMultiplier = isDog ? 1.0 : 0.4;

  let baseKcalPerMinute = 3.5;
  switch (type) {
    case 'walk':
      baseKcalPerMinute = 4.0;
      break;
    case 'exercise':
    case 'play':
    case 'indoor_play':
      baseKcalPerMinute = 5.5;
      break;
    case 'outdoor':
      baseKcalPerMinute = 4.5;
      break;
    case 'training':
      baseKcalPerMinute = 2.5;
      break;
    default:
      baseKcalPerMinute = 2.0;
      break;
  }

  return Math.round(durationMinutes * baseKcalPerMinute * intensityMultiplier * speciesMultiplier);
};

export const activityService = {
  /**
   * Creates and persists a new PetActivityRecord to Firestore:
   * /users/{userId}/pets/{petId}/activities/{activityId}
   * and synchronizes into the daily cycle document:
   * /users/{userId}/pets/{petId}/dailyCycles/{date}
   */
  async saveActivity(
    userId: string,
    petId: string,
    activityData: Omit<PetActivityRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<PetActivityRecord> {
    const activityId = activityData.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const date = activityData.date || getUserLocalDate();
    const startTime = activityData.startTime || getUserLocalTime();
    const meta = ACTIVITY_TYPES_META[activityData.activityType] || ACTIVITY_TYPES_META.custom;

    const calories =
      activityData.calories !== undefined
        ? activityData.calories
        : estimateActivityCalories(
            activityData.activityType,
            activityData.durationMinutes || 0,
            activityData.intensity || 'moderate',
            true
          );

    const record: PetActivityRecord = {
      id: activityId,
      petId,
      userId,
      activityType: activityData.activityType,
      title: activityData.title || meta.defaultTitle,
      durationMinutes: activityData.durationMinutes ?? (meta.hasDuration ? meta.defaultDuration : 0),
      intensity: activityData.intensity || 'moderate',
      date,
      startTime,
      endTime: activityData.endTime,
      notes: (activityData.notes || '').trim(),
      location: (activityData.location || '').trim(),
      calories,
      distanceKm: activityData.distanceKm,
      amountGrams: activityData.amountGrams,
      waterMl: activityData.waterMl,
      medicationName: activityData.medicationName,
      medicationDose: activityData.medicationDose,
      source: activityData.source || 'manual',
      xpEarned: activityData.xpEarned ?? meta.baseXp,
      icon: activityData.icon || meta.emoji,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // 1. Save to /users/{userId}/pets/{petId}/activities/{activityId}
    if (userId) {
      try {
        const docRef = doc(db, `users/${userId}/pets/${petId}/activities/${activityId}`);
        await setDoc(docRef, {
          ...record,
          serverTimestamp: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore activity save note (persisting in local cycle):', err);
      }
    }

    // 2. Update the daily care cycle
    if (userId) {
      try {
        const cycle = await dailyCycleService.getHistoricalCycle(userId, petId, date);
        const durationToAdd = record.durationMinutes || 0;
        if (cycle) {
          const updatedActivities = {
            ...cycle.activities,
            totalMinutes: (cycle.activities?.totalMinutes || 0) + durationToAdd,
            walkingMinutes:
              (cycle.activities?.walkingMinutes || 0) + (record.activityType === 'walk' ? durationToAdd : 0),
            playMinutes:
              (cycle.activities?.playMinutes || 0) +
              (record.activityType === 'play' || record.activityType === 'indoor_play' ? durationToAdd : 0),
            exerciseMinutes:
              (cycle.activities?.exerciseMinutes || 0) + (record.activityType === 'exercise' ? durationToAdd : 0),
            trainingMinutes:
              (cycle.activities?.trainingMinutes || 0) + (record.activityType === 'training' ? durationToAdd : 0),
          };

          await dailyCycleService.updateDailyCycle(userId, petId, date, {
            activities: updatedActivities,
            stats: {
              ...cycle.stats,
              relationshipXpEarned: (cycle.stats?.relationshipXpEarned || 0) + record.xpEarned,
            },
          });
        }
      } catch (cycleErr) {
        console.warn('DailyCycle update note:', cycleErr);
      }
    }

    return record;
  },

  /**
   * Updates an existing activity in Firestore
   */
  async updateActivity(
    userId: string,
    petId: string,
    activityId: string,
    updates: Partial<PetActivityRecord>
  ): Promise<void> {
    if (!userId) return;
    try {
      const docRef = doc(db, `users/${userId}/pets/${petId}/activities/${activityId}`);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Date.now(),
        serverTimestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore activity update note:', err);
    }
  },

  /**
   * Deletes an activity record from Firestore
   */
  async deleteActivity(
    userId: string,
    petId: string,
    activityId: string
  ): Promise<void> {
    if (!userId) return;
    try {
      const docRef = doc(db, `users/${userId}/pets/${petId}/activities/${activityId}`);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore activity delete note:', err);
    }
  },

  /**
   * Fetches activities for a specific pet and date
   */
  async getActivitiesForDate(
    userId: string,
    petId: string,
    date: string
  ): Promise<PetActivityRecord[]> {
    if (!userId) return [];
    try {
      const colRef = collection(db, `users/${userId}/pets/${petId}/activities`);
      const q = query(colRef, where('date', '==', date), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as PetActivityRecord);
    } catch (err) {
      console.warn('Firestore fetch activities note:', err);
      return [];
    }
  },
};
