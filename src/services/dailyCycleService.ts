import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { DailyCycle } from '../types';
import { getTodayKey } from '../lib/dateService';
import { safeStorage } from '../lib/safeStorage';

export const dailyCycleService = {
  getCurrentDailyCycle: async (userId: string, petId: string, timezone: string): Promise<DailyCycle | null> => {
    const today = getTodayKey(timezone);
    return dailyCycleService.getHistoricalCycle(userId, petId, today);
  },

  getHistoricalCycle: async (userId: string, petId: string, date: string): Promise<DailyCycle | null> => {
    try {
      if (userId === 'sarah-caregiver' && (!auth.currentUser || auth.currentUser.uid !== 'sarah-caregiver')) {
        const localVal = safeStorage.getItem(`pawdicure_daily_cycle_${petId}_${date}`);
        return localVal ? JSON.parse(localVal) : null;
      }

      const docRef = doc(db, `users/${userId}/pets/${petId}/dailyCycles/${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as DailyCycle;
        safeStorage.setItem(`pawdicure_daily_cycle_${petId}_${date}`, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.info("[DailyCycle] Skipping remote daily cycle fetch, reading local cache.");
      const localVal = safeStorage.getItem(`pawdicure_daily_cycle_${petId}_${date}`);
      return localVal ? JSON.parse(localVal) : null;
    }
    return null;
  },

  createDailyCycle: async (userId: string, petId: string, date: string, timezone: string): Promise<DailyCycle> => {
    const newCycle: DailyCycle = {
      id: date,
      date,
      petId,
      userId,
      timezone,
      feeding: {
        breakfast: { quantity: 0, unit: 'g', recorded: false },
        lunch: { quantity: 0, unit: 'g', recorded: false },
        dinner: { quantity: 0, unit: 'g', recorded: false },
        treats: { quantity: 0, unit: 'g', recorded: false },
        totalGrams: 0,
        totalCalories: 0
      },
      water: { entries: [], totalMl: 0 },
      activities: { walkingMinutes: 0, playMinutes: 0, exerciseMinutes: 0, trainingMinutes: 0, totalMinutes: 0 },
      care: { medicationsTaken: [], remindersCompleted: [], groomingDone: false, healthChecksDone: false },
      stats: { careScore: 0, relationshipXpEarned: 0, pawPointsEarned: 0, completedTaskIds: [], completedMissionIds: [] },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    safeStorage.setItem(`pawdicure_daily_cycle_${petId}_${date}`, JSON.stringify(newCycle));

    try {
      if (userId === 'sarah-caregiver' && (!auth.currentUser || auth.currentUser.uid !== 'sarah-caregiver')) {
        return newCycle;
      }
      const docRef = doc(db, `users/${userId}/pets/${petId}/dailyCycles/${date}`);
      await setDoc(docRef, newCycle);
    } catch (err) {
      console.info("[DailyCycle] Created daily cycle locally.");
    }
    return newCycle;
  },

  updateDailyCycle: async (userId: string, petId: string, date: string, updates: Partial<DailyCycle>) => {
    const localVal = safeStorage.getItem(`pawdicure_daily_cycle_${petId}_${date}`);
    let existingCycle: DailyCycle | null = localVal ? JSON.parse(localVal) : null;
    if (existingCycle) {
      const merged = { ...existingCycle, ...updates, updatedAt: Date.now() };
      safeStorage.setItem(`pawdicure_daily_cycle_${petId}_${date}`, JSON.stringify(merged));
    }

    try {
      if (userId === 'sarah-caregiver' && (!auth.currentUser || auth.currentUser.uid !== 'sarah-caregiver')) {
        return;
      }
      const docRef = doc(db, `users/${userId}/pets/${petId}/dailyCycles/${date}`);
      await updateDoc(docRef, { ...updates, updatedAt: Date.now() });
    } catch (err) {
      console.info("[DailyCycle] Updated daily cycle locally.");
    }
  }
};
