import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DailyCycle } from '../types';
import { getTodayKey } from '../lib/dateService';

export const dailyCycleService = {
  getCurrentDailyCycle: async (userId: string, petId: string, timezone: string): Promise<DailyCycle | null> => {
    const today = getTodayKey(timezone);
    return dailyCycleService.getHistoricalCycle(userId, petId, today);
  },

  getHistoricalCycle: async (userId: string, petId: string, date: string): Promise<DailyCycle | null> => {
    const docRef = doc(db, `users/${userId}/pets/${petId}/dailyCycles/${date}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as DailyCycle;
    }
    return null;
  },

  createDailyCycle: async (userId: string, petId: string, date: string, timezone: string): Promise<DailyCycle> => {
    const docRef = doc(db, `users/${userId}/pets/${petId}/dailyCycles/${date}`);
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
    await setDoc(docRef, newCycle);
    return newCycle;
  },

  updateDailyCycle: async (userId: string, petId: string, date: string, updates: Partial<DailyCycle>) => {
    const docRef = doc(db, `users/${userId}/pets/${petId}/dailyCycles/${date}`);
    await updateDoc(docRef, { ...updates, updatedAt: Date.now() });
  }
};
