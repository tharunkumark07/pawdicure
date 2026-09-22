import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { GuideProgress } from '../types/petGuide';
import { safeStorage } from '../lib/safeStorage';

export const petGuideService = {
  getGuideProgress: async (userId: string, guideId: string): Promise<GuideProgress | null> => {
    try {
      // Direct local fallback for unauthenticated default session user to prevent network permission noise
      if (userId === 'sarah-caregiver' && (!auth.currentUser || auth.currentUser.uid !== 'sarah-caregiver')) {
        const localVal = safeStorage.getItem(`pawdicure_guide_progress_${guideId}`);
        return localVal ? JSON.parse(localVal) : null;
      }
      
      const docRef = doc(db, `users/${userId}/guideProgress/${guideId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as GuideProgress;
      }
    } catch (err) {
      console.info("[Guide] Skipping remote load (unauthenticated or restricted), reading local storage.");
      const localVal = safeStorage.getItem(`pawdicure_guide_progress_${guideId}`);
      return localVal ? JSON.parse(localVal) : null;
    }
    return null;
  },

  updateGuideProgress: async (userId: string, guideId: string, progress: Partial<GuideProgress>) => {
    const progressWithTime = { ...progress, lastSeenAt: Date.now() };
    safeStorage.setItem(`pawdicure_guide_progress_${guideId}`, JSON.stringify(progressWithTime));

    try {
      if (userId === 'sarah-caregiver' && (!auth.currentUser || auth.currentUser.uid !== 'sarah-caregiver')) {
        return;
      }
      const docRef = doc(db, `users/${userId}/guideProgress/${guideId}`);
      await setDoc(docRef, progressWithTime, { merge: true });
    } catch (err) {
      console.info("[Guide] Skipping remote update (unauthenticated or restricted), saved locally.");
    }
  },

  setUserGuidePreference: async (userId: string, character: string, enabled: boolean) => {
    safeStorage.setItem(`pawdicure_guide_pref_char`, character);
    safeStorage.setItem(`pawdicure_guide_pref_enabled`, String(enabled));

    try {
      if (userId === 'sarah-caregiver' && (!auth.currentUser || auth.currentUser.uid !== 'sarah-caregiver')) {
        return;
      }
      const docRef = doc(db, `users/${userId}`);
      await updateDoc(docRef, { petGuideCharacter: character, petGuideEnabled: enabled });
    } catch (err) {
      console.info("[Guide] Skipping remote preferences update, saved locally.");
    }
  }
};
