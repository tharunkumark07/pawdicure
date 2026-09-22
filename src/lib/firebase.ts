import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { HouseholdData, UserProfile } from '../types';
import { INITIAL_HOUSEHOLD_DATA, INITIAL_EMPTY_HOUSEHOLD_DATA } from './mockData';

// Central routing decision helper
export function determineInitialRoute(user: User | null, profile: UserProfile | null): string {
  if (!user || user.isAnonymous) {
    return '/auth';
  }
  if (!profile) {
    return '/onboarding';
  }
  if (!profile.onboardingCompleted) {
    return '/onboarding';
  }
  return '/home';
}

const LOCAL_STORAGE_KEY_PREFIX = 'PAWdiCURE_SYNCED_HOUSEHOLD_V3';

// 1. Initialize Firebase App securely
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.error("Firebase App initialization failed, falling back to empty config:", err);
  app = initializeApp({
    projectId: "crested-quasar-zt3g1",
    apiKey: "dummy-key"
  });
}

// 2. Initialize Firestore with specific database ID, auto-detecting and healing personal project mismatches
let dbInstance: Firestore;
try {
  const isPersonalProject = firebaseConfig.projectId !== "crested-quasar-zt3g1";
  const configuredDbId = firebaseConfig.firestoreDatabaseId;
  
  // If the user connects their personal project, force standard "(default)" database to prevent crash
  const targetDbId = (isPersonalProject || !configuredDbId) ? "(default)" : configuredDbId;
  
  try {
    dbInstance = getFirestore(app, targetDbId);
  } catch (innerErr) {
    console.warn(`Failed to initialize Firestore with database ID '${targetDbId}', falling back to '(default)':`, innerErr);
    dbInstance = getFirestore(app);
  }
} catch (err) {
  console.error("Firestore initialization failed entirely. Using basic fallback:", err);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

// 3. Initialize Firebase Auth safely
let authInstance;
try {
  authInstance = getAuth(app);
} catch (err) {
  console.error("Firebase Auth initialization failed:", err);
  authInstance = getAuth();
}

export const auth = authInstance;

// Keep track of current user and sync connection
let currentUser: User | null = null;
let currentHouseholdId: string =
  localStorage.getItem('PAWdiCURE_HOUSEHOLD_ID') || 'household-milo-sarah';

// Error Code Mapper for User-Friendly Authentication Messages
export function mapAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const fullErrorStr = `${error.code || ''} ${error.message || ''} ${String(error)}`.toLowerCase();

  if (fullErrorStr.includes('operation-not-allowed') || fullErrorStr.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in is disabled in this Firebase project settings. Please click "Continue with Google" above or "Continue as Guest".';
  }
  if (fullErrorStr.includes('auth/invalid-credential') || fullErrorStr.includes('auth/wrong-password') || fullErrorStr.includes('auth/user-not-found')) {
    return 'Email or password is incorrect. Please check your details and try again.';
  }
  if (fullErrorStr.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (fullErrorStr.includes('auth/weak-password')) {
    return 'Password should be at least 6 characters long.';
  }
  if (fullErrorStr.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (fullErrorStr.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please wait a moment and try again.';
  }
  if (fullErrorStr.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.';
  }
  if (fullErrorStr.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection.';
  }

  return error.message || 'Authentication failed. Please verify your details.';
}

// Google Sign-In helper
export async function loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    return { success: true, user: cred.user };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { success: false, error: mapAuthErrorMessage(err) };
  }
}

// Password Reset helper
export async function sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true, message: 'Password reset link sent! Please check your email inbox.' };
  } catch (err: any) {
    return { success: false, message: mapAuthErrorMessage(err) };
  }
}

// User Profile Firestore Operations (/users/{uid})
export async function getUserProfileDoc(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Error reading user profile document:', err);
  }
  return null;
}

export async function createUserProfileDoc(
  uid: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> {
  const fullProfile: UserProfile = {
    uid,
    name: profile.name || 'Pet Parent',
    displayName: profile.displayName || profile.name || 'Pet Parent',
    preferredName: profile.preferredName || profile.displayName || profile.name || 'Pet Parent',
    email: profile.email || '',
    phone: profile.phone || '',
    photoURL: profile.photoURL || profile.avatar || '',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    theme: 'light',
    onboardingCompleted: profile.onboardingCompleted ?? false,
    onboardingStep: profile.onboardingStep ?? 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastLoginAt: Date.now(),
    notifications: {
      feeding: true,
      medications: true,
      walks: true,
      health: true,
      achievements: true,
    },
    privacy: {
      locationSharing: true,
      cloudSync: true,
      publicProfile: false,
    },
    ...profile,
  };

  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, fullProfile, { merge: true });
  } catch (err) {
    console.warn('Failed to write user profile to Firestore:', err);
  }

  return fullProfile;
}

export async function updateUserProfileDoc(
  uid: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn('Failed to update user profile in Firestore:', err);
    // Fallback setDoc
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { ...updates, updatedAt: Date.now() }, { merge: true });
      return true;
    } catch (e) {
      console.error('Fallback setDoc user profile failed:', e);
      return false;
    }
  }
}

// Authenticate anonymously or track auth state
export function initFirebaseAuth(onUserReady?: (user: User) => void) {
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      if (onUserReady) onUserReady(user);
    }
  });
}

// Load cached data from local storage for a specific UID
export function getCachedHouseholdData(uid?: string): HouseholdData {
  const key = uid ? `${LOCAL_STORAGE_KEY_PREFIX}_${uid}` : LOCAL_STORAGE_KEY_PREFIX;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.pets && typeof parsed.pets === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading cached data:', e);
  }
  return { ...INITIAL_HOUSEHOLD_DATA };
}

// Save data locally for a specific UID
export function cacheHouseholdData(data: HouseholdData, uid?: string) {
  const key = uid ? `${LOCAL_STORAGE_KEY_PREFIX}_${uid}` : LOCAL_STORAGE_KEY_PREFIX;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Local storage cache warning:', e);
  }
}

// Clear local cache for a UID on logout
export function clearUserCachedState(uid?: string) {
  try {
    if (uid) {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}_${uid}`);
      localStorage.removeItem(`PAWdiCURE_ACTIVE_PET_${uid}`);
    }
    localStorage.removeItem('PAWdiCURE_HOUSEHOLD_ID');
    localStorage.removeItem('PAWdiCURE_AUTH_COMPLETED_V1');
    localStorage.removeItem('PAWdiCURE_USER_NAME');
    localStorage.removeItem('PAWdiCURE_USER_EMAIL');
  } catch (e) {
    console.warn('Error clearing cached state:', e);
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
        // Document doesn't exist yet on Cloud Firestore, initialize clean empty structure
        const initial: HouseholdData = {
          ...INITIAL_EMPTY_HOUSEHOLD_DATA,
          householdId,
          syncCode: `PAW-${Math.floor(1000 + Math.random() * 9000)}`,
          lastSyncedAt: Date.now(),
        };
        setDoc(docRef, initial).catch((err) => {
          console.warn('Failed to seed cloud household:', err);
        });
        cacheHouseholdData(initial);
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
export async function syncHouseholdToCloud(data: HouseholdData, uid?: string): Promise<boolean> {
  const updatedData: HouseholdData = {
    ...data,
    lastSyncedAt: Date.now(),
  };

  cacheHouseholdData(updatedData, uid);

  try {
    const targetId = updatedData.householdId || currentHouseholdId;
    const docRef = doc(db, 'households', targetId);
    await setDoc(docRef, updatedData, { merge: true });
    return true;
  } catch (err) {
    console.warn('Sync to Cloud Firestore pending or offline:', err);
    return false;
  }
}

// Device Pairing & Multi-device Sync Code:
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
