import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GuideProgress } from '../types/petGuide';

export const petGuideService = {
  getGuideProgress: async (userId: string, guideId: string): Promise<GuideProgress | null> => {
    const docRef = doc(db, `users/${userId}/guideProgress/${guideId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as GuideProgress;
    }
    return null;
  },

  updateGuideProgress: async (userId: string, guideId: string, progress: Partial<GuideProgress>) => {
    const docRef = doc(db, `users/${userId}/guideProgress/${guideId}`);
    await setDoc(docRef, { ...progress, lastSeenAt: Date.now() }, { merge: true });
  },

  setUserGuidePreference: async (userId: string, character: string, enabled: boolean) => {
    const docRef = doc(db, `users/${userId}`);
    await updateDoc(docRef, { petGuideCharacter: character, petGuideEnabled: enabled });
  }
};
