import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { HouseholdData } from '../types';
import { INITIAL_HOUSEHOLD_DATA } from './mockData';

const LOCAL_STORAGE_KEY = 'PAWdiCURE_SYNCED_HOUSEHOLD_V2';

// 1. Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Initialize Firestore with specific database ID from config
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// 3. Initialize Firebase Auth
export const auth = getAuth(app);

// Keep track of current user and sync connection
let currentUser: User | null = null;
let currentHouseholdId: string =
  localStorage.getItem('PAWdiCURE_HOUSEHOLD_ID') || 'household-milo-sarah';

// Authenticate anonymously so every device has a secure Firebase connection
export function initFirebaseAuth(onUserReady?: (user: User) => void) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      if (onUserReady) onUserReady(user);
    } else {
      signInAnonymously(auth)
        .then((cred) => {
          currentUser = cred.user;
          if (onUserReady) onUserReady(cred.user);
        })
        .catch((err) => {
          console.warn('Anonymous auth note (offline or sandboxed):', err);
        });
    }
  });
}

// Load cached data from local storage
export function getCachedHouseholdData(): HouseholdData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.pets && typeof parsed.pets === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading cached data:', e);
  }
  return INITIAL_HOUSEHOLD_DATA;
}

// Save data locally
export function cacheHouseholdData(data: HouseholdData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Local storage cache warning:', e);
  }
}

// Real-time Firestore synchronizer
export function subscribeToHousehold(
  householdId: string,
  onUpdate: (data: HouseholdData) => void,
  onError?: (err: Error) => void
) {
  currentHouseholdId = householdId;
  localStorage.setItem('PAWdiCURE_HOUSEHOLD_ID', householdId);

  const docRef = doc(db, 'households', householdId);

  // Real-time sync listener across all devices
  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as HouseholdData;
        cacheHouseholdData(remoteData);
        onUpdate(remoteData);
      } else {
        // Document doesn't exist yet on Cloud Firestore, initialize it with default/local data
        const initial = getCachedHouseholdData();
        initial.householdId = householdId;
        setDoc(docRef, initial).catch((err) => {
          console.warn('Failed to seed cloud household:', err);
        });
        onUpdate(initial);
      }
    },
    (error) => {
      console.warn('Firestore real-time subscription note (falling back to local cache):', error);
      if (onError) onError(error);
      onUpdate(getCachedHouseholdData());
    }
  );

  return unsubscribe;
}

// Push local changes to Firestore Cloud & localStorage
export async function syncHouseholdToCloud(data: HouseholdData): Promise<boolean> {
  const updatedData: HouseholdData = {
    ...data,
    lastSyncedAt: Date.now(),
  };

  cacheHouseholdData(updatedData);

  try {
    const docRef = doc(db, 'households', updatedData.householdId || currentHouseholdId);
    await setDoc(docRef, updatedData);
    return true;
  } catch (err) {
    console.warn('Sync to Cloud Firestore pending or offline:', err);
    return false;
  }
}

// Device Pairing & Multi-device Sync Code:
// Connect another device using a 6-character Code (e.g. "MILO-88")
export async function connectBySyncCode(
  syncCode: string
): Promise<{ success: boolean; data?: HouseholdData; message: string }> {
  const cleanCode = syncCode.trim().toUpperCase();

  try {
    // Look up household document with this sync code
    const q = query(
      collection(db, 'households'),
      where('syncCode', '==', cleanCode)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const data = docSnap.data() as HouseholdData;
      currentHouseholdId = docSnap.id;
      localStorage.setItem('PAWdiCURE_HOUSEHOLD_ID', docSnap.id);
      cacheHouseholdData(data);
      return { success: true, data, message: `Connected to household: ${data.syncCode}!` };
    }
  } catch (err) {
    console.warn('Sync code lookup failed, trying local fallback:', err);
  }

  // Fallback: If matching the current code locally
  const local = getCachedHouseholdData();
  if (local.syncCode.toUpperCase() === cleanCode) {
    return { success: true, data: local, message: `Connected locally to ${cleanCode}` };
  }

  return { success: false, message: `No household found with code "${cleanCode}". Please verify code.` };
}

export function getCurrentHouseholdId() {
  return currentHouseholdId;
}
