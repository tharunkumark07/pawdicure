import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BiometryProfile } from '../types';

export const userService = {
  initializeNewUser: async (uid: string) => {
    // 1. Initialize Biometry Profile
    const biometryProfile: BiometryProfile = {
      biometryEnabled: false,
      wearableConnected: false,
      biometricDataAvailable: false,
      biometryOnboardingShown: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await setDoc(doc(db, 'users', uid, 'biometry', 'profile'), biometryProfile);
    
    // 2. Initialize other base states here as needed
  }
};
