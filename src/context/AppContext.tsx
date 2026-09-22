import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  HouseholdData,
  Pet,
  BondMemory,
  VaccineRecord,
  MedicationRecord,
  VetVisit,
  Reminder,
  StoreProduct,
  CartItem,
  ToastMessage,
  UserProfile,
  AppNotification,
  RewardItem,
  DailyCycle,
  PetActivityRecord,
  ActivityType,
  ActivityIntensity,
  CustomRoutine,
  RoutineItem,
  RoutineItemExecution,
  ScheduledRoutineItem,
} from '../types';
import { INITIAL_HOUSEHOLD_DATA, INITIAL_EMPTY_HOUSEHOLD_DATA, INITIAL_PRODUCTS, INITIAL_REWARDS } from '../lib/mockData';
import { subscribeToHousehold, syncHouseholdToCloud, initFirebaseAuth, db, auth, getUserProfileDoc, createUserProfileDoc, updateUserProfileDoc, sendPasswordReset, mapAuthErrorMessage, clearUserCachedState, loginWithGoogle, determineInitialRoute } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { dailyCycleService } from '../services/dailyCycleService';
import { activityService } from '../services/activityService';
import { routineService } from '../services/routineService';
import { pawPointsService } from '../services/pawPointsService';
import { getUserLocalDate, getUserLocalTime } from '../lib/timeUtils';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateDocumentFavicon } from '../lib/favicon';

const STORAGE_KEY = 'pawdicure_household_state_v2';

interface AppContextType {
  householdData: HouseholdData;
  activePet: Pet;
  currentRoute: string;
  routeParams: Record<string, string>;
  isSyncing: boolean;
  isOnline: boolean;
  toasts: ToastMessage[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigate: (route: string, options?: { replace?: boolean }) => void;
  showToast: (title: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: string) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  
  // Pet Actions
  setActivePetId: (petId: string) => void;
  addPet: (newPet: Pet) => void;
  updatePet: (updatedPet: Pet) => void;
  deletePet: (petId: string) => Promise<void>;

  // Care & Feed Actions
  feedPet: (grams: number, toppers: string[]) => void;
  refreshWater: () => void;
  orderFoodRefill: () => void;
  toggleTask: (taskId: string) => void;
  boostPillar: (pillarId: string) => void;
  addXp: (amount: number, reason: string) => void;

  // Memories
  addMemory: (memory: Omit<BondMemory, 'id' | 'createdAt'>) => void;
  deleteMemory: (id: string) => void;

  // Health: Vaccines, Meds, Visits
  addVaccine: (vaccine: Omit<VaccineRecord, 'id'>) => void;
  toggleVaccine: (id: string) => void;
  deleteVaccine: (id: string) => void;
  addMedication: (med: Omit<MedicationRecord, 'id'>) => void;
  toggleMedication: (id: string) => void;
  snoozeMedication: (id: string) => void;
  deleteMedication: (id: string) => void;
  addVetVisit: (visit: Omit<VetVisit, 'id'>) => void;
  deleteVetVisit: (id: string) => void;

  // Reminders
  addReminder: (rem: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  snoozeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Store & Cart & Wishlist
  products: StoreProduct[];
  cart: CartItem[];
  cartCount: number;
  addToCart: (productOrId: string | StoreProduct, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  redeemReward: (item: StoreProduct | RewardItem | string) => boolean;
  claimDailyQuest: (questId: string, pts: number) => void;

  // Family & Care Activities
  inviteFamilyMember: (member: { name: string; email: string; role: 'Owner' | 'Family Member' | 'Caregiver' }) => void;
  addCareActivity: (action: string, xp?: number, icon?: string) => void;
  awardPawPoints: (activityType: string, sourceRecordId: string, description?: string) => Promise<void>;
  activities: PetActivityRecord[];
  logPetActivity: (activity: Omit<PetActivityRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<PetActivityRecord>;
  updatePetActivity: (activityId: string, updates: Partial<PetActivityRecord>) => Promise<void>;
  deletePetActivity: (activityId: string) => Promise<void>;
  logActivity: (type: ActivityType, duration: number, notes?: string, intensity?: ActivityIntensity) => void;

  // Places / Explorer
  togglePlaceFavorite: (placeId: string) => void;

  // User Profile & Settings
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateHouseholdSettings: (settings: any) => void;
  resetDemoData: () => void;
  exportData: () => void;
  performDailyCheckIn: () => { success: boolean; message: string; pointsEarned: number };
  verifyVaccine: (vaccineId: string) => Promise<boolean>;

  // Realtime Firebase Auth Actions & State
  currentUser: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;
  loginUserWithFirebase: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  loginUserWithGoogle: () => Promise<{ success: boolean; error?: any }>;
  loginUserAnonymously: () => Promise<{ success: boolean; error?: any }>;
  signupUserWithFirebase: (
    email: string,
    password: string,
    name: string,
    extraFields?: { preferredName?: string; phone?: string; photoURL?: string }
  ) => Promise<{ success: boolean; error?: any }>;
  logoutUserWithFirebase: () => Promise<{ success: boolean; error?: any }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  updateOnboardingStep: (step: number) => Promise<void>;
  completeUserOnboarding: (userUpdates?: Partial<UserProfile>, petData?: Partial<Pet>) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;

  // Badges & Missions
  userId: string | null;
  badgeProgress: any[];
  missionProgress: any[];
  toggleBadgeShowcase: (badgeId: string) => Promise<void>;
  evaluateAchievements: () => Promise<void>;

  // Daily Care Cycle
  dailyCycle: DailyCycle | null;
  refreshDailyCycle: () => Promise<void>;

  // Custom Routines Orchestration
  routines: CustomRoutine[];
  routineExecutions: RoutineItemExecution[];
  todayScheduledRoutineItems: ScheduledRoutineItem[];
  activePetRoutines: CustomRoutine[];
  createRoutine: (routine: Partial<CustomRoutine>) => Promise<CustomRoutine>;
  updateRoutine: (routineId: string, updates: Partial<CustomRoutine>) => Promise<void>;
  deleteRoutine: (routineId: string) => Promise<void>;
  duplicateRoutine: (routineId: string) => Promise<CustomRoutine>;
  toggleRoutineActive: (routineId: string, active: boolean) => Promise<void>;
  completeRoutineItem: (
    routineItemId: string,
    options?: { quantity?: number; duration?: number; notes?: string }
  ) => Promise<void>;
  skipRoutineItem: (routineItemId: string, reason?: string) => Promise<void>;
  uncompleteRoutineItem: (routineItemId: string) => Promise<void>;
  refreshRoutines: () => Promise<void>;

  // Push Notifications State & Operations
  isPushEnabled: boolean;
  pushPermissionStatus: 'default' | 'granted' | 'denied';
  registerPushNotifications: () => Promise<boolean>;
  triggerTestPushNotification: () => Promise<boolean>;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  updateFavicon: (color: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or mock
  const [householdData, setHouseholdData] = useState<HouseholdData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse local storage data', e);
    }
    return INITIAL_HOUSEHOLD_DATA;
  });

  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/home';
  });
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Centralized Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  // Badges & Missions state
  const [userId, setUserId] = useState<string | null>(null);
  const [badgeProgress, setBadgeProgress] = useState<any[]>([]);
  const [missionProgress, setMissionProgress] = useState<any[]>([]);

  // Daily Care Cycle State
  const [dailyCycle, setDailyCycle] = useState<DailyCycle | null>(null);

  const refreshDailyCycle = async () => {
    if (!userId) return;
    const petId = householdData.activePetId || 'milo';
    const cycle = await dailyCycleService.getCurrentDailyCycle(userId, petId, 'UTC');
    setDailyCycle(cycle);
  };

  useEffect(() => {
    refreshDailyCycle();
  }, [userId, householdData.activePetId]);

  // Push Notifications State
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<'default' | 'granted' | 'denied'>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Supper Time Alert',
      message: 'Milo is due for evening Pacific Salmon supper portion (180g).',
      timeAgo: '15m ago',
      type: 'alert',
      read: false,
      actionRoute: '/feed',
      timestamp: Date.now() - 15 * 60 * 1000,
    },
    {
      id: 'notif-2',
      title: 'DHPP Booster Due Soon',
      message: 'Core immunization booster window opens in 33 days with Dr. Rostova.',
      timeAgo: '2h ago',
      type: 'health',
      read: false,
      actionRoute: '/health/vaccinations',
      timestamp: Date.now() - 2 * 3600 * 1000,
    },
    {
      id: 'notif-3',
      title: 'Care Streak: 12 Days Unbroken! 🔥',
      message: 'You earned 50 bonus Paw Points for consistent routine logging.',
      timeAgo: '1d ago',
      type: 'reward',
      read: true,
      actionRoute: '/rewards',
      timestamp: Date.now() - 24 * 3600 * 1000,
    },
  ]);

  // Derived active pet
  const availablePetIds = Object.keys(householdData.pets || {});
  const activePetId = availablePetIds.includes(householdData.activePetId)
    ? householdData.activePetId
    : availablePetIds[0] || '';
  const activePet: Pet = householdData.pets[activePetId] || Object.values(householdData.pets || {})[0] || {
    id: 'empty',
    name: 'No Companion',
    species: 'Dog',
    breed: 'None',
    ageYears: 0,
    ageMonths: 0,
    weight: 0,
    restingBpm: 0,
    careScore: 0,
    microchipId: 'N/A',
    vetClinic: 'N/A',
    emergencyContact: 'N/A',
    emergencyPhone: 'N/A',
    avatarUrl: '/buddy-closed.png',
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    pillars: {
      hygiene: { level: 100, name: 'Hygiene' },
      nutrition: { level: 100, name: 'Nutrition' },
      hydration: { level: 100, name: 'Hydration' },
      activity: { level: 100, name: 'Activity' },
      medical: { level: 100, name: 'Medical' },
    },
    allergies: [],
    mood: 'Happy',
  };

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/home';
      // Match route patterns like /store/product/:id
      if (hash.startsWith('/store/product/')) {
        const id = hash.replace('/store/product/', '');
        setRouteParams({ id });
        setCurrentRoute('/store/product/:id');
      } else {
        setRouteParams({});
        setCurrentRoute(hash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save to localStorage whenever householdData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(householdData));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [householdData]);

  // Real-time Firebase Auth State Manager
  useEffect(() => {
    let unsubscribeHousehold: (() => void) | null = null;
    let unsubscribeProfile: (() => void) | null = null;
    setAuthLoading(true);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubscribeHousehold) {
        unsubscribeHousehold();
        unsubscribeHousehold = null;
      }
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user && !user.isAnonymous) {
        setCurrentUser(user);
        setUserId(user.uid);
        setIsAuthenticated(true);

        try {
          let profile = await getUserProfileDoc(user.uid);
          if (!profile) {
            profile = await createUserProfileDoc(user.uid, {
              name: user.displayName || 'Pet Parent',
              displayName: user.displayName || 'Pet Parent',
              preferredName: user.displayName || 'Pet Parent',
              email: user.email || '',
              photoURL: user.photoURL || '',
              onboardingCompleted: false,
              onboardingStep: 1,
              pawPoints: 0, // Starts at zero for every new user
            });
          } else {
            updateUserProfileDoc(user.uid, { lastLoginAt: Date.now() });
          }

          setUserProfile(profile);
          setOnboardingCompleted(!!profile.onboardingCompleted);

          // Subscribe to profile doc in real-time
          const userDocRef = doc(db, 'users', user.uid);
          unsubscribeProfile = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const updatedProfile = snap.data() as UserProfile;
              setUserProfile(updatedProfile);
              setOnboardingCompleted(!!updatedProfile.onboardingCompleted);
            }
          });

          // Subscribe to isolated household data for user's UID
          const userHouseholdId = `household-${user.uid}`;
          unsubscribeHousehold = subscribeToHousehold(userHouseholdId, (data) => {
            setHouseholdData(data);
          });

          // Route determination
          const targetRoute = determineInitialRoute(user, profile);
          const currentHash = window.location.hash.replace('#', '') || '/home';
          if (currentHash === '/auth' || !profile.onboardingCompleted || currentHash === '') {
            navigate(targetRoute, { replace: true });
          }
        } catch (err) {
          console.error('Error synchronizing user profile or household:', err);
        }
      } else if (user && user.isAnonymous) {
        // Guest mode
        setCurrentUser(user);
        setUserProfile(null);
        setUserId(user.uid);
        setIsAuthenticated(true);
        setOnboardingCompleted(true);

        try {
          // Subscribe to isolated household data for user's UID
          const userHouseholdId = `household-${user.uid}`;
          unsubscribeHousehold = subscribeToHousehold(userHouseholdId, (data) => {
            setHouseholdData(data);
          });
        } catch (err) {
          console.error('Error starting guest household subscription:', err);
        }
      } else {
        // Unauthenticated
        setCurrentUser(null);
        setUserProfile(null);
        setUserId(null);
        setIsAuthenticated(false);
        setOnboardingCompleted(false);
        setHouseholdData(INITIAL_EMPTY_HOUSEHOLD_DATA);
      }
      setAuthLoading(false);
    });

    return () => {
      if (unsubscribeHousehold) unsubscribeHousehold();
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  // Base64 helper for VAPID key conversion
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Service Worker Registration & Push listener
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('PAWdiCURE background service worker active:', reg.scope);
          reg.pushManager.getSubscription().then((sub) => {
            setIsPushEnabled(!!sub);
          });
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped/failed:', err);
        });
    }

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE_TO_ROUTE') {
        navigate(event.data.route);
      }
    };
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  // Request browser permission and register Web Push Subscription
  const registerPushNotifications = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      showToast('Native Push Notifications are not supported in this frame context.', 'warning', '⏰');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermissionStatus(permission);

      if (permission !== 'granted') {
        showToast('Notification permission was denied.', 'error', '🔒');
        return false;
      }

      // Retrieve public VAPID key from full-stack server
      const response = await fetch('/api/vapid-public-key');
      if (!response.ok) throw new Error('VAPID key retrieval failed');
      const { publicKey } = await response.json();

      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      let deviceId = localStorage.getItem('pawdicure_device_id');
      if (!deviceId) {
        deviceId = 'dev-' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('pawdicure_device_id', deviceId);
      }

      // Register subscription on our backend database mapping
      const regResponse = await fetch('/api/register-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous-user',
          deviceId,
          subscription,
          platform: 'Web/PWA',
          browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Safari',
          notificationsEnabled: true
        })
      });

      if (regResponse.ok) {
        setIsPushEnabled(true);
        showToast('Real Device Push Notifications configured successfully!', 'success', '🔔');
        addCareActivity('Activated real device push notifications', 30, 'notifications_active');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Push subscription failed:', err);
      showToast('Could not register device push subscription.', 'error', '❌');
      return false;
    }
  };

  // Trigger test push notification
  const triggerTestPushNotification = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/trigger-test-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous-user',
          title: '🐾 PAWdiCURE OS Notification!',
          body: 'Test Successful! Real OS-level push notifications are fully configured and functional for Milo.',
          route: '/feed'
        })
      });
      if (response.ok) {
        showToast('Push alert sent! Verify on your physical phone lockscreen.', 'info', '📲');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Test push request failure:', err);
      return false;
    }
  };

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const saved = localStorage.getItem('pawdicure_app_theme');
    if (saved) return saved;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'forest';
    if (hour >= 12 && hour < 18) return 'royal';
    return 'sunset';
  });

  useEffect(() => {
    localStorage.setItem('pawdicure_app_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeStyles: Record<string, { primary: string; background: string; text: string; primaryLight: string; primaryBorder: string; textMuted: string; cardBg: string; cardBorder: string }> = {
      sunset: { 
        primary: '#ff6b4a', 
        background: '#fffaf5', 
        text: '#2c1810',
        primaryLight: 'rgba(255, 107, 74, 0.1)',
        primaryBorder: 'rgba(255, 107, 74, 0.2)',
        textMuted: '#574e4a',
        cardBg: 'rgba(255, 255, 255, 0.92)',
        cardBorder: 'rgba(254, 215, 170, 0.6)'
      },
      forest: { 
        primary: '#059669', 
        background: '#f0fdf4', 
        text: '#064e3b',
        primaryLight: 'rgba(5, 150, 105, 0.1)',
        primaryBorder: 'rgba(5, 150, 105, 0.2)',
        textMuted: '#1e3a34',
        cardBg: 'rgba(255, 255, 255, 0.92)',
        cardBorder: 'rgba(187, 247, 208, 0.6)'
      },
      royal: { 
        primary: '#2563eb', 
        background: '#eff6ff', 
        text: '#1e3a8a',
        primaryLight: 'rgba(37, 99, 235, 0.1)',
        primaryBorder: 'rgba(37, 99, 235, 0.2)',
        textMuted: '#334155',
        cardBg: 'rgba(255, 255, 255, 0.92)',
        cardBorder: 'rgba(191, 219, 254, 0.6)'
      },
      purple: { 
        primary: '#7c3aed', 
        background: '#f5f3ff', 
        text: '#5b21b6',
        primaryLight: 'rgba(124, 58, 237, 0.1)',
        primaryBorder: 'rgba(124, 58, 237, 0.2)',
        textMuted: '#4c1d95',
        cardBg: 'rgba(255, 255, 255, 0.92)',
        cardBorder: 'rgba(221, 214, 254, 0.6)'
      },
      'glossy-black': {
        primary: '#09090b',
        background: '#f8fafc',
        text: '#09090b',
        primaryLight: 'rgba(9, 9, 11, 0.08)',
        primaryBorder: 'rgba(9, 9, 11, 0.2)',
        textMuted: '#64748b',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(226, 232, 240, 0.9)'
      },
    };
    const style = themeStyles[currentTheme] || themeStyles.sunset;
    document.documentElement.style.setProperty('--primary', style.primary);
    document.documentElement.style.setProperty('--primary-rgb', style.primary.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ') || '255, 107, 74');
    document.documentElement.style.setProperty('--primary-light', style.primaryLight);
    document.documentElement.style.setProperty('--primary-border', style.primaryBorder);
    document.documentElement.style.setProperty('--background', style.background);
    document.documentElement.style.setProperty('--background-rgb', style.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ') || '255, 250, 245');
    document.documentElement.style.setProperty('--text', style.text);
    document.documentElement.style.setProperty('--text-rgb', style.text.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ') || '44, 24, 16');
    document.documentElement.style.setProperty('--text-muted', style.textMuted);
    document.documentElement.style.setProperty('--card-bg', style.cardBg);
    document.documentElement.style.setProperty('--card-border', style.cardBorder);
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update document favicon and browser theme-color to match active theme
    updateDocumentFavicon(style.primary);
  }, [currentTheme]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Respect user's explicit theme choice if saved
      if (localStorage.getItem('pawdicure_app_theme')) return;
      const hour = new Date().getHours();
      let newTheme = 'sunset';
      if (hour >= 5 && hour < 12) newTheme = 'forest';
      else if (hour >= 12 && hour < 18) newTheme = 'royal';
      setCurrentTheme(newTheme);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Firebase real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToHousehold(
      householdData.householdId,
      (cloudData) => {
        if (cloudData && cloudData.lastSyncedAt > (householdData.lastSyncedAt || 0)) {
          setHouseholdData(cloudData);
        }
      }
    );
    return () => unsubscribe();
  }, [householdData.householdId]);

  // Network online listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Custom navigate function
  const navigate = (route: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.location.replace(`#${route}`);
    } else {
      window.location.hash = route;
    }
    if (route.startsWith('/store/product/')) {
      const id = route.replace('/store/product/', '');
      setRouteParams({ id });
      setCurrentRoute('/store/product/:id');
    } else {
      setRouteParams({});
      setCurrentRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast System
  const showToast = (title: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', icon?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    const newToast: ToastMessage = { id, title, type, icon };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      // Main celebratory burst
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#ff6b4a', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
        ticks: 200,
        gravity: 1.1,
        scalar: 0.9,
      });

      // Subtle side particle sparkles
      setTimeout(() => {
        confetti({
          particleCount: 25,
          angle: 60,
          spread: 45,
          origin: { x: 0.1, y: 0.8 },
          colors: ['#ff6b4a', '#f59e0b', '#10b981'],
          scalar: 0.75,
        });
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 45,
          origin: { x: 0.9, y: 0.8 },
          colors: ['#ff6b4a', '#3b82f6', '#8b5cf6'],
          scalar: 0.75,
        });
      }, 120);
    } catch (e) {
      // Ignore in non-DOM test env
    }
  };

  // Central Household State Updater with Cloud Sync
  const updateHousehold = (fn: (prev: HouseholdData) => HouseholdData) => {
    setHouseholdData((prev) => {
      const updated = fn(prev);
      const withTimestamp = {
        ...updated,
        lastSyncedAt: Date.now(),
      };
      // Trigger cloud sync
      setIsSyncing(true);
      syncHouseholdToCloud(withTimestamp)
        .then(() => {
          setIsSyncing(false);
          evaluateAchievements();
        })
        .catch(() => setIsSyncing(false));
      return withTimestamp;
    });
  };

  // Evaluate achievements on our secure full-stack backend
  const evaluateAchievements = async () => {
    const hId = householdData.householdId;
    if (!userId || !hId) return;

    try {
      const response = await fetch('/api/evaluate-achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ householdId: hId, userId: userId })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.newlyUnlocked && result.newlyUnlocked.length > 0) {
          result.newlyUnlocked.forEach((unlocked: any) => {
            if (unlocked.type === 'badge') {
              showToast(`🏆 UNLOCKED: "${unlocked.item.name}"!`, 'success', unlocked.item.icon);
            } else if (unlocked.type === 'mission') {
              showToast(`🗺️ MISSION COMPLETE: "${unlocked.item.title}"!`, 'success', '🎉');
            }
          });
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error("Backend evaluation request failed", err);
    }
  };

  // Showcase / Pinned Badges feature toggler (strict limit: 3 pins max)
  const toggleBadgeShowcase = async (badgeId: string) => {
    if (!userId) return;
    const badgeDocRef = doc(db, 'users', userId, 'badgeProgress', badgeId);
    const existingBadge = badgeProgress.find((b: any) => b.badgeId === badgeId);
    const currentShowcasedCount = badgeProgress.filter((b: any) => b.showcase).length;

    if (existingBadge?.showcase) {
      await updateDoc(badgeDocRef, { showcase: false });
      showToast('Badge removed from your companion showcase.', 'info', '📌');
    } else {
      if (currentShowcasedCount >= 3) {
        showToast('Showcase limit reached. Unpin another badge first.', 'warning', '🔒');
        return;
      }
      await updateDoc(badgeDocRef, { showcase: true });
      showToast('Badge pinned to your companion showcase!', 'success', '📌');
    }
  };

  // -------------------------------------------------------------
  // ACTION DISPATCHERS
  // -------------------------------------------------------------

  const setActivePetId = (petId: string) => {
    if (householdData.pets[petId]) {
      updateHousehold((prev) => ({ ...prev, activePetId: petId }));
      showToast(`Switched active companion to ${householdData.pets[petId].name}!`, 'info', '🐾');
    }
  };

  const addPet = (newPet: Pet) => {
    updateHousehold((prev) => ({
      ...prev,
      pets: {
        ...prev.pets,
        [newPet.id]: newPet,
      },
      activePetId: newPet.id,
    }));
    triggerConfetti();
    showToast(`Welcome ${newPet.name} to the PAWdiCURE family!`, 'success', '💖');
    addCareActivity(`Welcomed new companion ${newPet.name} (${newPet.breed})`, 100);
  };

  const updatePet = (updatedPet: Pet) => {
    updateHousehold((prev) => ({
      ...prev,
      pets: {
        ...prev.pets,
        [updatedPet.id]: updatedPet,
      },
    }));
    showToast(`Updated profile for ${updatedPet.name}!`, 'success', '✨');
  };

  const deletePet = async (petId: string) => {
    const petToDelete = householdData.pets[petId];
    if (!petToDelete) return;

    const petName = petToDelete.name;

    // Delete Firestore subcollections/documents if user is authenticated
    if (userId) {
      try {
        const careSettingsRef = doc(db, 'users', userId, 'pets', petId, 'careSettings', 'default');
        await deleteDoc(careSettingsRef).catch(() => {});
        const petDocRef = doc(db, 'users', userId, 'pets', petId);
        await deleteDoc(petDocRef).catch(() => {});
      } catch (err) {
        console.warn('Non-fatal Firestore error on pet deletion:', err);
      }
    }

    // Update local state and trigger cloud sync
    updateHousehold((prev) => {
      const updatedPets = { ...prev.pets };
      delete updatedPets[petId];

      let newActivePetId = prev.activePetId;
      if (prev.activePetId === petId) {
        const remainingIds = Object.keys(updatedPets);
        newActivePetId = remainingIds.length > 0 ? remainingIds[0] : '';
      }

      return {
        ...prev,
        activePetId: newActivePetId,
        pets: updatedPets,
        memories: (prev.memories || []).filter((m) => m.petId !== petId),
        vaccinationHistory: (prev.vaccinationHistory || []).filter((v) => v.petId !== petId),
        medications: (prev.medications || []).filter((med) => med.petId !== petId),
        vetVisits: (prev.vetVisits || []).filter((vv) => vv.petId !== petId),
        reminders: (prev.reminders || []).filter((rem) => rem.petId !== petId),
        routineTasks: (prev.routineTasks || []).filter((rt) => rt.petId !== petId),
        healthMilestones: (prev.healthMilestones || []).filter((hm) => hm.petId !== petId),
        documents: (prev.documents || []).filter((doc) => doc.petId !== petId),
        feedingHistory: (prev.feedingHistory || []).filter((fh) => fh.petId !== petId),
        weightHistory: (prev.weightHistory || []).filter((wh) => wh.petId !== petId),
        careActivities: (prev.careActivities || []).filter((ca) => ca.petId !== petId),
      };
    });

    showToast(`Profile for ${petName} permanently erased!`, 'info', '🗑️');
    addCareActivity(`Permanently deleted pet profile for ${petName}`, 0, 'delete');
  };

  const addXp = (amount: number, reason: string) => {
    let leveledUp = false;
    let newLevel = activePet.level;

    updateHousehold((prev) => {
      const pet = { ...prev.pets[prev.activePetId] };
      const totalXp = pet.xp + amount;
      let nextThreshold = pet.nextLevelXp;

      if (totalXp >= nextThreshold) {
        leveledUp = true;
        newLevel = pet.level + 1;
        pet.level = newLevel;
        pet.xp = totalXp;
        pet.nextLevelXp = Math.round(nextThreshold * 1.35);
        pet.careScore = Math.min(100, pet.careScore + 2);
      } else {
        pet.xp = totalXp;
      }

      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pet.id]: pet,
        },
      };
    });

    if (leveledUp) {
      triggerConfetti();
      showToast(`🎉 LEVEL UP! ${activePet.name} reached Level ${newLevel}!`, 'success', '🏆');
      addNotification({
        title: `Level ${newLevel} Unlocked!`,
        message: `${activePet.name} reached Level ${newLevel}. Check your new tier rewards!`,
        timeAgo: 'Just now',
        type: 'reward',
        read: false,
        actionRoute: '/relationship/levels',
      });
    } else {
      showToast(`+${amount} Bond XP: ${reason}`, 'info', '✨');
    }
  };

  const feedPet = async (grams: number, toppers: string[]) => {
    const baseKcal = Math.round(grams * 3.44);
    const salmonKcal = toppers.some((t) => t.toLowerCase().includes('salmon')) ? 45 : 0;
    const jointKcal = toppers.some((t) => t.toLowerCase().includes('glucosamine')) ? 25 : 0;
    const mealKcal = baseKcal + salmonKcal + jointKcal;

    if (userId && activePetId && dailyCycle) {
      const updatedFeeding = {
        ...dailyCycle.feeding,
        totalGrams: dailyCycle.feeding.totalGrams + grams,
        totalCalories: dailyCycle.feeding.totalCalories + mealKcal,
      };
      
      await dailyCycleService.updateDailyCycle(userId, activePetId, dailyCycle.date, {
        feeding: updatedFeeding
      });
      await refreshDailyCycle();
    }

    updateHousehold((prev) => {
      const pet = { ...prev.pets[prev.activePetId] };
      const newDailyGrams = (pet.dailyGramsFed || 0) + grams;
      const newDailyKcal = (pet.dailyCaloriesFed || 0) + mealKcal;
      const targetGoal = pet.dailyGramsGoal || 360;
      const newNutritionPct = Math.min(100, Math.round((newDailyGrams / targetGoal) * 100));

      pet.dailyGramsFed = newDailyGrams;
      pet.dailyCaloriesFed = newDailyKcal;
      pet.nutritionPercent = newNutritionPct;
      pet.hungerPercent = Math.max(0, 100 - newNutritionPct);
      pet.mealsToday = (pet.mealsToday || 0) + 1;
      pet.lastFed = 'Just now';
      pet.pantryKg = Math.max(0, parseFloat(((pet.pantryKg || 5.2) - grams / 1000).toFixed(2)));

      // Boost Nutrition Affinity Pillar
      pet.affinityPillars = pet.affinityPillars.map((p) => {
        if (p.id === 'nutrition') {
          const res = Math.min(100, p.resonance + Math.max(2, Math.round(grams / 40)));
          return { ...p, resonance: res };
        }
        return p;
      });

      const newFeedingRecord = {
        id: 'feed-' + Date.now(),
        petId: pet.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        grams,
        calories: mealKcal,
        foodType: 'Pacific Salmon & Sweet Potato',
        toppers,
      };

      return {
        ...prev,
        feedingHistory: [newFeedingRecord, ...(prev.feedingHistory || [])],
        pets: {
          ...prev.pets,
          [pet.id]: pet,
        },
      };
    });

    triggerConfetti();
    const xp = Math.round(25 + grams / 15);
    addXp(xp, `Fed +${grams}g meal (+${mealKcal} kcal)`);
    addCareActivity(`Fed ${activePet.name} +${grams}g meal (+${mealKcal} kcal)`, xp, 'restaurant');
    awardPawPoints('FEEDING', 'feed-' + Date.now(), `Fed ${activePet.name} +${grams}g meal`);
  };

  const refreshWater = () => {
    updateHousehold((prev) => {
      const pet = { ...prev.pets[prev.activePetId] };
      pet.hydrationMl = Math.min(pet.goalMl, pet.hydrationMl + 170);
      pet.hydrationPercent = Math.min(100, Math.round((pet.hydrationMl / pet.goalMl) * 100));
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pet.id]: pet,
        },
      };
    });
    addXp(15, 'Smart water fountain refreshed (+170ml)');
    showToast('Fountain refilled with filtered cool water (+170ml)', 'success', '💧');
  };

  const orderFoodRefill = () => {
    updateHousehold((prev) => {
      const pet = { ...prev.pets[prev.activePetId] };
      pet.pantryKg = 10.0;
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pet.id]: pet,
        },
      };
    });
    triggerConfetti();
    showToast('New 10 kg Salmon Formula bag dispatched to household!', 'success', '📦');
  };

  const toggleTask = async (taskId: string) => {
    let earnedXp = 0;
    let completedTitle = '';
    let isCompleted = false;

    updateHousehold((prev) => {
      const tasks = prev.routineTasks.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          isCompleted = nextState;
          if (nextState) {
            earnedXp = t.xp;
            completedTitle = t.title;
          }
          return { ...t, completed: nextState };
        }
        return t;
      });
      return { ...prev, routineTasks: tasks };
    });

    if (userId && activePetId && dailyCycle) {
      const completedTaskIds = isCompleted 
        ? [...dailyCycle.stats.completedTaskIds, taskId]
        : dailyCycle.stats.completedTaskIds.filter(id => id !== taskId);
      
      await dailyCycleService.updateDailyCycle(userId, activePetId, dailyCycle.date, {
        stats: { ...dailyCycle.stats, completedTaskIds }
      });
      await refreshDailyCycle();
    }

    if (isCompleted && earnedXp > 0) {
      triggerConfetti();
      addXp(earnedXp, `Completed "${completedTitle}"`);
      addCareActivity(`Completed routine "${completedTitle}"`, earnedXp);
      showToast(`Completed "${completedTitle}"! (+${earnedXp} XP) 🐾`, 'success', '🎉');
    } else {
      showToast('Task status updated', 'info');
    }
  };

  const boostPillar = (pillarId: string) => {
    updateHousehold((prev) => {
      const pet = { ...prev.pets[prev.activePetId] };
      pet.affinityPillars = pet.affinityPillars.map((p) => {
        if (p.id === pillarId) {
          const res = Math.min(100, p.resonance + 4);
          return {
            ...p,
            resonance: res,
            level: p.level + (res >= 100 ? 1 : 0),
          };
        }
        return p;
      });
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pet.id]: pet,
        },
      };
    });
    addXp(25, 'Care vector boosted');
  };

  // Memories
  const addMemory = (memory: Omit<BondMemory, 'id' | 'createdAt'>) => {
    const newMemory: BondMemory = {
      ...memory,
      id: 'mem-' + Date.now(),
      createdAt: Date.now(),
    };
    updateHousehold((prev) => ({
      ...prev,
      memories: [newMemory, ...prev.memories],
    }));
    triggerConfetti();
    addXp(memory.xp || 100, `Recorded memory: ${memory.title}`);
    addCareActivity(`Saved memory "${memory.title}"`, 100, 'photo_camera');
    showToast(`Memory "${memory.title}" added to journal!`, 'success', '📸');
    awardPawPoints('MEMORY', newMemory.id, `Recorded memory: ${memory.title}`);
  };

  const deleteMemory = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
    showToast('Memory removed from journal', 'info');
  };

  // Health
  const addVaccine = (vaccine: Omit<VaccineRecord, 'id'>) => {
    const newVac: VaccineRecord = {
      ...vaccine,
      id: 'vac-' + Date.now(),
    };
    updateHousehold((prev) => ({
      ...prev,
      vaccinationHistory: [...prev.vaccinationHistory, newVac],
    }));
    triggerConfetti();
    addXp(50, `Recorded vaccination: ${vaccine.name}`);
    addCareActivity(`Logged vaccination "${vaccine.name}"`, 50, 'healing');
    showToast(`Vaccination record for "${vaccine.name}" saved!`, 'success', '💉');
    awardPawPoints('VACCINATION', newVac.id, `Recorded vaccination: ${vaccine.name}`);
  };

  const toggleVaccine = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      vaccinationHistory: prev.vaccinationHistory.map((v) =>
        v.id === id ? { ...v, completed: !v.completed, status: !v.completed ? 'Administered' : 'Due' } : v
      ),
    }));
    showToast('Vaccination status updated', 'success', '💉');
  };

  const deleteVaccine = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      vaccinationHistory: prev.vaccinationHistory.filter((v) => v.id !== id),
    }));
    showToast('Vaccine record deleted', 'info');
  };

  const addMedication = (med: Omit<MedicationRecord, 'id'>) => {
    const newMed: MedicationRecord = {
      ...med,
      id: 'med-' + Date.now(),
    };
    updateHousehold((prev) => ({
      ...prev,
      medications: [...prev.medications, newMed],
    }));
    triggerConfetti();
    addXp(30, `Added medication schedule: ${med.name}`);
    showToast(`Medication "${med.name}" schedule active!`, 'success', '💊');
  };

  const toggleMedication = (id: string) => {
    let isNowTaken = false;
    let medName = '';

    updateHousehold((prev) => ({
      ...prev,
      medications: prev.medications.map((m) => {
        if (m.id === id) {
          const next = !m.takenToday;
          isNowTaken = next;
          medName = m.name;
          return {
            ...m,
            takenToday: next,
            lastTakenTime: next ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return m;
      }),
    }));

    if (isNowTaken) {
      triggerConfetti();
      addXp(20, `Administered ${medName}`);
      addCareActivity(`Administered medication "${medName}"`, 20, 'medication');
      showToast(`Dose recorded for ${medName}! +20 XP`, 'success', '💊');
    } else {
      showToast(`Marked ${medName} as pending today`, 'info');
    }
  };

  const snoozeMedication = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      medications: prev.medications.map((m) =>
        m.id === id ? { ...m, snoozedUntil: 'In 1 hour' } : m
      ),
    }));
    showToast('Medication dose reminder snoozed by 1 hour', 'info', '⏰');
  };

  const deleteMedication = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id),
    }));
    showToast('Medication removed', 'info');
  };

  const addVetVisit = (visit: Omit<VetVisit, 'id'>) => {
    const newVisit: VetVisit = {
      ...visit,
      id: 'visit-' + Date.now(),
    };
    updateHousehold((prev) => ({
      ...prev,
      vetVisits: [newVisit, ...(prev.vetVisits || [])],
    }));
    triggerConfetti();
    addXp(60, `Logged clinical vet visit at ${visit.clinic}`);
    addCareActivity(`Logged veterinary visit with ${visit.vetName}`, 60, 'local_hospital');
    showToast(`Vet visit record for ${visit.vetName} saved!`, 'success', '🩺');
  };

  const deleteVetVisit = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      vetVisits: (prev.vetVisits || []).filter((v) => v.id !== id),
    }));
    showToast('Vet visit record removed', 'info');
  };

  // Reminders
  const addReminder = (rem: Omit<Reminder, 'id'>) => {
    const newRem: Reminder = {
      ...rem,
      id: 'rem-' + Date.now(),
    };
    updateHousehold((prev) => ({
      ...prev,
      reminders: [...(prev.reminders || []), newRem],
    }));
    showToast(`Smart reminder "${rem.title}" set for ${rem.time}!`, 'success', '🔔');
  };

  const toggleReminder = (id: string) => {
    let nowDone = false;
    let title = '';

    updateHousehold((prev) => ({
      ...prev,
      reminders: (prev.reminders || []).map((r) => {
        if (r.id === id) {
          const next = !r.completed;
          nowDone = next;
          title = r.title;
          return { ...r, completed: next };
        }
        return r;
      }),
    }));

    if (nowDone) {
      triggerConfetti();
      addXp(25, `Completed reminder: ${title}`);
      addCareActivity(`Completed reminder "${title}"`, 25, 'task_alt');
      showToast(`Reminder "${title}" completed! +25 XP 🐾`, 'success', '✅');
    } else {
      showToast(`Marked "${title}" as pending`, 'info');
    }
  };

  const snoozeReminder = (id: string) => {
    showToast('Reminder snoozed for 30 minutes', 'info', '⏰');
  };

  const deleteReminder = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      reminders: (prev.reminders || []).filter((r) => r.id !== id),
    }));
    showToast('Reminder removed', 'info');
  };

  // Store, Cart & Wishlist
  const products =
    householdData.products && householdData.products.length > 0
      ? householdData.products
      : INITIAL_PRODUCTS;
  const cart = householdData.cart || [];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (productOrId: string | StoreProduct, quantity = 1) => {
    const productId = typeof productOrId === 'string' ? productOrId : productOrId.id;
    updateHousehold((prev) => {
      const existing = (prev.cart || []).find((item) => item.productId === productId);
      let nextCart: CartItem[];
      if (existing) {
        nextCart = (prev.cart || []).map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        nextCart = [...(prev.cart || []), { productId, quantity }];
      }
      return { ...prev, cart: nextCart };
    });
    const product = products.find((p) => p.id === productId);
    showToast(`Added ${quantity}x "${product?.title || 'item'}" to cart!`, 'success', '🛒');
  };

  const updateCartQty = (productId: string, quantity: number) => {
    updateHousehold((prev) => {
      let nextCart: CartItem[];
      if (quantity <= 0) {
        nextCart = (prev.cart || []).filter((item) => item.productId !== productId);
      } else {
        nextCart = (prev.cart || []).map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      return { ...prev, cart: nextCart };
    });
  };

  const removeFromCart = (productId: string) => {
    updateHousehold((prev) => ({
      ...prev,
      cart: (prev.cart || []).filter((item) => item.productId !== productId),
    }));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    updateHousehold((prev) => ({ ...prev, cart: [] }));
  };

  const toggleWishlist = (productId: string) => {
    let added = false;
    updateHousehold((prev) => {
      const isWished = (prev.wishlist || []).includes(productId);
      added = !isWished;
      const nextWishlist = isWished
        ? (prev.wishlist || []).filter((id) => id !== productId)
        : [...(prev.wishlist || []), productId];
      return { ...prev, wishlist: nextWishlist };
    });
    const product = products.find((p) => p.id === productId);
    showToast(
      added ? `Saved "${product?.title}" to wishlist ❤️` : `Removed from wishlist`,
      'info'
    );
  };

  const isWishlisted = (productId: string) => {
    return (householdData.wishlist || []).includes(productId);
  };

  const redeemReward = async (itemOrId: StoreProduct | RewardItem | string) => {
    let itemTitle = 'Reward';
    let pointsCost = 0;
    let rewardId = '';

    if (typeof itemOrId === 'string') {
      const allRewards = householdData.rewards || INITIAL_REWARDS;
      const allProds = householdData.products || INITIAL_PRODUCTS;
      const foundRew = allRewards.find((r) => r.id === itemOrId);
      const foundProd = allProds.find((p) => p.id === itemOrId);

      if (foundRew) {
        itemTitle = foundRew.title;
        pointsCost = foundRew.pointsCost;
        rewardId = foundRew.id;
      } else if (foundProd) {
        itemTitle = foundProd.title;
        pointsCost = foundProd.points;
        rewardId = foundProd.id;
      } else {
        showToast('Reward item not found', 'error');
        return false;
      }
    } else if ('pointsCost' in itemOrId) {
      itemTitle = itemOrId.title;
      pointsCost = itemOrId.pointsCost;
      rewardId = itemOrId.id;
    } else {
      itemTitle = itemOrId.title;
      pointsCost = itemOrId.points;
      rewardId = itemOrId.id;
    }

    const currentPoints = userProfile ? (userProfile.pawPoints ?? 0) : 0;
    if (currentPoints < pointsCost) {
      const diff = pointsCost - currentPoints;
      showToast(
        `Exclusive perk! You need ${diff.toLocaleString()} more PAW Points to unlock "${itemTitle}".`,
        'warning',
        '🔒'
      );
      return false;
    }

    if (!userId) {
      showToast('Please sign in to redeem rewards', 'error');
      return false;
    }

    showToast('Processing redemption securely...', 'info', '⏳');

    const result = await pawPointsService.redeemReward(userId, rewardId, itemTitle, pointsCost);
    if (!result.success) {
      showToast(result.error || 'Redemption failed', 'error');
      return false;
    }

    const redemptionCode = result.code || 'PAW-ERROR';

    triggerConfetti();
    showToast(`🎉 Clinical Voucher Unlocked! Code: ${redemptionCode}`, 'success', '🎁');
    addNotification({
      title: 'Reward Redeemed',
      message: `You unlocked "${itemTitle}". Clinical Voucher code: ${redemptionCode}`,
      timeAgo: 'Just now',
      type: 'reward',
      read: false,
      actionRoute: '/rewards',
    });
    return true;
  };

  const claimDailyQuest = (questId: string, pts: number) => {
    updateHousehold((prev) => ({
      ...prev,
      pawPoints: prev.pawPoints + pts,
    }));
    triggerConfetti();
    showToast(`Claimed +${pts} Paw Points! ✨`, 'success', '🪙');
  };

  // Family Care
  const inviteFamilyMember = (member: { name: string; email: string; role: 'Owner' | 'Family Member' | 'Caregiver' }) => {
    const newMember = {
      ...member,
      id: 'fam-' + Date.now(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    updateHousehold((prev) => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), newMember],
    }));
    triggerConfetti();
    showToast(`Invite sent to ${member.name} (${member.email}) as ${member.role}!`, 'success', '📬');
  };

  const addCareActivity = (action: string, xp = 20, icon = 'pets') => {
    const newAct = {
      id: 'act-' + Date.now(),
      petId: activePet.id,
      actorName: householdData.userProfile?.name?.split(' ')[0] || 'You',
      action,
      time: 'Just now',
      timestamp: Date.now(),
      xp,
      icon,
    };
    updateHousehold((prev) => ({
      ...prev,
      careActivities: [newAct, ...(prev.careActivities || [])].slice(0, 30),
    }));
  };

  const awardPawPoints = async (activityType: string, sourceRecordId: string, description?: string) => {
    if (!userId) return;
    try {
      const result = await pawPointsService.awardPoints(userId, activityType, sourceRecordId, description);
      if (result.success && result.pointsAwarded > 0) {
        showToast(`+${result.pointsAwarded} PAW Points! 🐾`, 'success', '🪙');
      }
    } catch (err) {
      console.warn('Error awarding PAW Points via backend:', err);
    }
  };

  const logPetActivity = async (
    activityData: Omit<PetActivityRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<PetActivityRecord> => {
    const targetPetId = activityData.petId || activePet.id;
    const savedRecord = await activityService.saveActivity(
      userId || 'local_user',
      targetPetId,
      activityData
    );

    updateHousehold((prev) => {
      const existing = prev.activities || [];
      const updatedList = [savedRecord, ...existing.filter((a) => a.id !== savedRecord.id)];
      return {
        ...prev,
        activities: updatedList,
        pawPoints: (prev.pawPoints || 0) + (savedRecord.xpEarned || 20),
        currentXp: (prev.currentXp || 0) + (savedRecord.xpEarned || 20),
      };
    });

    // Mirror to careActivities for legacy components
    addCareActivity(
      `${savedRecord.title}${savedRecord.durationMinutes ? ` (${savedRecord.durationMinutes}m)` : ''}`,
      savedRecord.xpEarned,
      savedRecord.icon || 'pets'
    );

    triggerConfetti();
    showToast(
      `${savedRecord.title} recorded! +${savedRecord.xpEarned} XP`,
      'success',
      savedRecord.icon || '🐾'
    );

    // Securely award points on the server based on activityType
    awardPawPoints(savedRecord.activityType.toUpperCase(), savedRecord.id, `Recorded activity: ${savedRecord.title}`);

    refreshDailyCycle();
    evaluateAchievements();

    return savedRecord;
  };

  const updatePetActivity = async (
    activityId: string,
    updates: Partial<PetActivityRecord>
  ): Promise<void> => {
    await activityService.updateActivity(
      userId || 'local_user',
      activePet.id,
      activityId,
      updates
    );

    updateHousehold((prev) => ({
      ...prev,
      activities: (prev.activities || []).map((act) =>
        act.id === activityId ? { ...act, ...updates, updatedAt: Date.now() } : act
      ),
    }));

    showToast('Activity updated successfully', 'success', '✏️');
    refreshDailyCycle();
    evaluateAchievements();
  };

  const deletePetActivity = async (activityId: string): Promise<void> => {
    const target = (householdData.activities || []).find((a) => a.id === activityId);
    const date = target?.date || getUserLocalDate();

    await activityService.deleteActivity(
      userId || 'local_user',
      activePet.id,
      activityId
    );

    updateHousehold((prev) => {
      const xpToDeduct = target?.xpEarned || 0;
      return {
        ...prev,
        activities: (prev.activities || []).filter((act) => act.id !== activityId),
        pawPoints: Math.max(0, (prev.pawPoints || 0) - xpToDeduct),
        currentXp: Math.max(0, (prev.currentXp || 0) - xpToDeduct),
      };
    });

    showToast('Activity removed and care statistics updated', 'info', '🗑️');
    refreshDailyCycle();
    evaluateAchievements();
  };

  // -------------------------------------------------------------
  // CUSTOM ROUTINES ORCHESTRATION ENGINE
  // -------------------------------------------------------------

  const activePetRoutines: CustomRoutine[] = (householdData.routines || []).filter(
    (r) => r.petId === activePet.id
  );

  const todayDateKey = getUserLocalDate();
  const todayScheduledRoutineItems: ScheduledRoutineItem[] = routineService.getScheduledRoutineItemsForDate(
    activePetRoutines,
    householdData.routineExecutions || [],
    todayDateKey
  );

  const refreshRoutines = async () => {
    if (userId && activePet.id) {
      try {
        const fetchedRoutines = await routineService.fetchPetRoutines(userId, activePet.id);
        const fetchedExecutions = await routineService.fetchRoutineExecutions(userId, activePet.id, todayDateKey);
        updateHousehold((prev) => {
          const otherPetRoutines = (prev.routines || []).filter((r) => r.petId !== activePet.id);
          const otherPetExecutions = (prev.routineExecutions || []).filter((e) => e.petId !== activePet.id);
          return {
            ...prev,
            routines: [...otherPetRoutines, ...fetchedRoutines],
            routineExecutions: [...otherPetExecutions, ...fetchedExecutions],
          };
        });
      } catch (err) {
        console.warn('Could not refresh routines from Firestore:', err);
      }
    }
  };

  const createRoutine = async (routineData: Partial<CustomRoutine>): Promise<CustomRoutine> => {
    const routineId = routineData.id || `routine-${Date.now()}`;
    const newRoutine: CustomRoutine = {
      id: routineId,
      userId: userId || 'default-user',
      petId: routineData.petId || activePet.id,
      name: routineData.name || `${activePet.name}'s Daily Care`,
      description: routineData.description || '',
      icon: routineData.icon || '🐾',
      accent: routineData.accent || '#3b82f6',
      active: routineData.active !== false,
      items: (routineData.items || []).map((item, idx) => ({
        ...item,
        id: item.id || `item-${routineId}-${idx + 1}-${Date.now()}`,
        routineId,
        petId: routineData.petId || activePet.id,
        userId: userId || 'default-user',
        category: item.category || routineService.getActivityCategory(item.activityType),
        scheduledTime: item.scheduledTime || '08:00 AM',
        repeatType: item.repeatType || 'every_day',
        priority: item.priority || 'medium',
        reminderEnabled: item.reminderEnabled !== false,
        reminderOffset: typeof item.reminderOffset === 'number' ? item.reminderOffset : 0,
        active: item.active !== false,
        createdAt: item.createdAt || Date.now(),
        updatedAt: Date.now(),
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await routineService.savePetRoutine(userId || 'default-user', newRoutine.petId, newRoutine);

    updateHousehold((prev) => ({
      ...prev,
      routines: [...(prev.routines || []).filter((r) => r.id !== newRoutine.id), newRoutine],
    }));

    triggerConfetti();
    showToast(`Routine "${newRoutine.name}" created! ✨`, 'success', newRoutine.icon || '🗓️');
    addCareActivity(`Created custom routine "${newRoutine.name}" with ${newRoutine.items.length} activities`, 40);
    return newRoutine;
  };

  const updateRoutine = async (routineId: string, updates: Partial<CustomRoutine>): Promise<void> => {
    const existing = (householdData.routines || []).find((r) => r.id === routineId);
    if (!existing) return;

    const updatedRoutine: CustomRoutine = {
      ...existing,
      ...updates,
      items: updates.items
        ? updates.items.map((item, idx) => ({
            ...item,
            id: item.id || `item-${routineId}-${idx + 1}-${Date.now()}`,
            routineId,
            petId: existing.petId,
            userId: userId || 'default-user',
            category: item.category || routineService.getActivityCategory(item.activityType),
            scheduledTime: item.scheduledTime || '08:00 AM',
            active: item.active !== false,
            createdAt: item.createdAt || Date.now(),
            updatedAt: Date.now(),
          }))
        : existing.items,
      updatedAt: Date.now(),
    };

    await routineService.savePetRoutine(userId || 'default-user', updatedRoutine.petId, updatedRoutine);

    updateHousehold((prev) => ({
      ...prev,
      routines: (prev.routines || []).map((r) => (r.id === routineId ? updatedRoutine : r)),
    }));

    showToast(`Routine "${updatedRoutine.name}" updated!`, 'success', '✏️');
  };

  const deleteRoutine = async (routineId: string): Promise<void> => {
    const target = (householdData.routines || []).find((r) => r.id === routineId);
    const routineName = target?.name || 'Routine';

    await routineService.deletePetRoutine(userId || 'default-user', target?.petId || activePet.id, routineId);

    updateHousehold((prev) => ({
      ...prev,
      routines: (prev.routines || []).filter((r) => r.id !== routineId),
    }));

    showToast(`Routine "${routineName}" deleted. Completed activity history is preserved.`, 'info', '🗑️');
  };

  const duplicateRoutine = async (routineId: string): Promise<CustomRoutine> => {
    const target = (householdData.routines || []).find((r) => r.id === routineId);
    if (!target) throw new Error('Routine not found');

    const duplicated = await routineService.duplicatePetRoutine(
      userId || 'default-user',
      target.petId,
      target
    );

    updateHousehold((prev) => ({
      ...prev,
      routines: [...(prev.routines || []), duplicated],
    }));

    triggerConfetti();
    showToast(`Routine duplicated as "${duplicated.name}"!`, 'success', '📋');
    return duplicated;
  };

  const toggleRoutineActive = async (routineId: string, active: boolean): Promise<void> => {
    const target = (householdData.routines || []).find((r) => r.id === routineId);
    if (!target) return;

    await routineService.togglePetRoutineActive(
      userId || 'default-user',
      target.petId,
      routineId,
      active
    );

    updateHousehold((prev) => ({
      ...prev,
      routines: (prev.routines || []).map((r) => (r.id === routineId ? { ...r, active, updatedAt: Date.now() } : r)),
    }));

    showToast(
      active ? `Routine "${target.name}" resumed!` : `Routine "${target.name}" paused.`,
      active ? 'success' : 'info',
      active ? '▶️' : '⏸️'
    );
  };

  const completeRoutineItem = async (
    routineItemId: string,
    options?: { quantity?: number; duration?: number; notes?: string }
  ): Promise<void> => {
    let foundItem: RoutineItem | null = null;
    let parentRoutine: CustomRoutine | null = null;

    for (const r of householdData.routines || []) {
      const match = (r.items || []).find((it) => it.id === routineItemId);
      if (match) {
        foundItem = match;
        parentRoutine = r;
        break;
      }
    }

    if (!foundItem) {
      showToast('Scheduled task not found', 'warning');
      return;
    }

    const today = getUserLocalDate();
    const existingExec = (householdData.routineExecutions || []).find(
      (e) => e.routineItemId === routineItemId && e.date === today
    );

    if (existingExec && existingExec.status === 'completed') {
      showToast(`"${foundItem.title}" was already completed today!`, 'info', '✅');
      return;
    }

    const targetPetId = foundItem.petId || activePet.id;
    const petObj = householdData.pets[targetPetId] || activePet;
    const execId = `exec-${routineItemId}-${today}-${Date.now()}`;
    const xpReward = foundItem.priority === 'high' ? 35 : foundItem.priority === 'medium' ? 25 : 20;

    let linkedRecordId: string | undefined = undefined;

    // Single source of truth system linking
    if (foundItem.activityType === 'feeding') {
      const grams = options?.quantity || foundItem.quantity || petObj.targetPortionGrams || 180;
      feedPet(grams, [foundItem.title]);
      linkedRecordId = `feed-routine-${Date.now()}`;
    } else if (foundItem.activityType === 'water') {
      refreshWater();
      linkedRecordId = `water-routine-${Date.now()}`;
      awardPawPoints('COMPLETED_ROUTINE', execId, `Completed task: ${foundItem.title}`);
    } else if (
      ['walk', 'play', 'exercise', 'training', 'outdoor', 'indoor_play', 'bonding'].includes(
        foundItem.activityType
      )
    ) {
      const duration = options?.duration || foundItem.durationMinutes || 25;
      const rec = await logPetActivity({
        petId: targetPetId,
        activityType: foundItem.activityType as any,
        title: foundItem.title,
        durationMinutes: duration,
        intensity: foundItem.priority === 'high' ? 'high' : 'moderate',
        date: today,
        startTime: getUserLocalTime(),
        notes: options?.notes || foundItem.notes,
        location: foundItem.location,
        source: 'routine',
        xpEarned: xpReward,
        icon: foundItem.icon || '🐾',
      });
      linkedRecordId = rec.id;
    } else if (foundItem.activityType === 'medication') {
      addCareActivity(`Administered scheduled dose: "${foundItem.title}"`, xpReward, 'medication');
      addXp(xpReward, `Completed routine medication: ${foundItem.title}`);
      linkedRecordId = `med-routine-${Date.now()}`;
      awardPawPoints('COMPLETED_ROUTINE', execId, `Completed task: ${foundItem.title}`);
    } else {
      addCareActivity(`Completed routine care: "${foundItem.title}"`, xpReward, foundItem.icon || 'task_alt');
      addXp(xpReward, `Completed scheduled routine task: ${foundItem.title}`);
      linkedRecordId = `care-routine-${Date.now()}`;
      awardPawPoints('COMPLETED_ROUTINE', execId, `Completed task: ${foundItem.title}`);
    }

    const executionRecord: RoutineItemExecution = {
      id: execId,
      routineId: foundItem.routineId,
      routineItemId,
      petId: targetPetId,
      userId: userId || 'default-user',
      date: today,
      status: 'completed',
      completedAt: Date.now(),
      completedBy: householdData.userProfile?.name?.split(' ')[0] || 'You',
      linkedRecordId,
      notes: options?.notes || foundItem.notes,
      xpEarned: xpReward,
      createdAt: Date.now(),
    };

    await routineService.saveRoutineExecution(userId || 'default-user', targetPetId, executionRecord);

    updateHousehold((prev) => {
      const filtered = (prev.routineExecutions || []).filter(
        (e) => !(e.routineItemId === routineItemId && e.date === today)
      );
      return {
        ...prev,
        routineExecutions: [...filtered, executionRecord],
        pawPoints: (prev.pawPoints || 0) + xpReward,
        currentXp: (prev.currentXp || 0) + xpReward,
      };
    });

    triggerConfetti();
    showToast(`✓ Completed "${foundItem.title}"! +${xpReward} XP`, 'success', foundItem.icon || '🎉');
    refreshDailyCycle();
    evaluateAchievements();
  };

  const skipRoutineItem = async (routineItemId: string, reason?: string): Promise<void> => {
    let foundItem: RoutineItem | null = null;
    for (const r of householdData.routines || []) {
      const match = (r.items || []).find((it) => it.id === routineItemId);
      if (match) {
        foundItem = match;
        break;
      }
    }

    const today = getUserLocalDate();
    const targetPetId = foundItem?.petId || activePet.id;
    const execId = `exec-skip-${routineItemId}-${today}-${Date.now()}`;

    const executionRecord: RoutineItemExecution = {
      id: execId,
      routineId: foundItem?.routineId || '',
      routineItemId,
      petId: targetPetId,
      userId: userId || 'default-user',
      date: today,
      status: 'skipped',
      notes: reason || 'Skipped by user',
      createdAt: Date.now(),
    };

    await routineService.saveRoutineExecution(userId || 'default-user', targetPetId, executionRecord);

    updateHousehold((prev) => {
      const filtered = (prev.routineExecutions || []).filter(
        (e) => !(e.routineItemId === routineItemId && e.date === today)
      );
      return {
        ...prev,
        routineExecutions: [...filtered, executionRecord],
      };
    });

    showToast(`Skipped "${foundItem?.title || 'task'}" for today.`, 'info', '⏭️');
  };

  const uncompleteRoutineItem = async (routineItemId: string): Promise<void> => {
    const today = getUserLocalDate();
    const existingExec = (householdData.routineExecutions || []).find(
      (e) => e.routineItemId === routineItemId && e.date === today
    );

    if (existingExec) {
      await routineService.removeRoutineExecution(
        userId || 'default-user',
        existingExec.petId,
        existingExec.id
      );

      updateHousehold((prev) => {
        const xpDeduct = existingExec.xpEarned || 0;
        return {
          ...prev,
          routineExecutions: (prev.routineExecutions || []).filter((e) => e.id !== existingExec.id),
          pawPoints: Math.max(0, (prev.pawPoints || 0) - xpDeduct),
          currentXp: Math.max(0, (prev.currentXp || 0) - xpDeduct),
        };
      });

      showToast('Activity marked as pending.', 'info', '↩️');
      refreshDailyCycle();
    }
  };

  const logActivity = (
    type: ActivityType,
    duration: number,
    notes?: string,
    intensity: ActivityIntensity = 'moderate'
  ) => {
    logPetActivity({
      petId: activePet.id,
      activityType: type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Session`,
      durationMinutes: duration,
      intensity,
      date: getUserLocalDate(),
      startTime: getUserLocalTime(),
      notes,
      source: 'manual',
      xpEarned: 25,
    });
  };

  // Places / Explorer
  const togglePlaceFavorite = (placeId: string) => {
    updateHousehold((prev) => ({
      ...prev,
      places: (prev.places || []).map((p) =>
        p.id === placeId ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    }));
    showToast('Saved place preference updated', 'info');
  };

  // Settings
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    updateHousehold((prev) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profile,
      },
    }));
    showToast('Settings saved successfully', 'success', '⚙️');
  };

  const updateHouseholdSettings = (settings: any) => {
    updateHousehold((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || {}),
        ...settings,
      },
    }));

    // Sync notificationSettings to the backend user profile API layer
    if (userId) {
      const notifSettings = {
        notifyFeeding: settings.notifyFeeding !== false,
        notifyMeds: settings.notifyMeds !== false,
        notifyVaccinations: settings.notifyVaccinations !== false,
        notifyVet: settings.notifyVet !== false,
        notifyAchievements: settings.notifyAchievements !== false,
        quietHoursEnabled: !!settings.quietHoursEnabled,
        quietHoursStart: settings.quietHoursStart || '22:00',
        quietHoursEnd: settings.quietHoursEnd || '07:00'
      };

      fetch('/api/user/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          notificationSettings: notifSettings
        })
      })
      .then((res) => {
        if (res.ok) {
          console.log('User profile notification settings synced.');
        }
      })
      .catch((err) => {
        console.warn('Background notification settings sync deferred:', err);
      });
    }
  };

  const loginUserWithFirebase = async (emailStr: string, passwordStr: string) => {
    try {
      setIsSyncing(true);
      const cred = await signInWithEmailAndPassword(auth, emailStr.trim(), passwordStr);
      const uid = cred.user.uid;
      let profile = await getUserProfileDoc(uid);
      if (!profile) {
        profile = await createUserProfileDoc(uid, {
          name: cred.user.displayName || 'Pet Parent',
          displayName: cred.user.displayName || 'Pet Parent',
          preferredName: cred.user.displayName || 'Pet Parent',
          email: cred.user.email || emailStr.trim(),
          photoURL: cred.user.photoURL || '',
          onboardingCompleted: false,
          onboardingStep: 1,
        });
      }
      setUserProfile(profile);
      setOnboardingCompleted(!!profile.onboardingCompleted);
      
      const targetRoute = determineInitialRoute(cred.user, profile);
      showToast('Welcome back to PAWdiCURE! ✨', 'success', '🔐');
      navigate(targetRoute, { replace: true });
      return { success: true };
    } catch (err: any) {
      console.error('Firebase sign-in error:', err);
      const userMsg = mapAuthErrorMessage(err);
      showToast(userMsg, 'error', '❌');
      return { success: false, error: userMsg };
    } finally {
      setIsSyncing(false);
    }
  };

  const loginUserWithGoogle = async () => {
    try {
      setIsSyncing(true);
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        const uid = res.user.uid;
        let profile = await getUserProfileDoc(uid);
        if (!profile) {
          profile = await createUserProfileDoc(uid, {
            name: res.user.displayName || 'Pet Parent',
            displayName: res.user.displayName || 'Pet Parent',
            preferredName: res.user.displayName || 'Pet Parent',
            email: res.user.email || '',
            photoURL: res.user.photoURL || '',
            onboardingCompleted: false,
            onboardingStep: 1,
          });
        }
        setUserProfile(profile);
        setOnboardingCompleted(!!profile.onboardingCompleted);

        const targetRoute = determineInitialRoute(res.user, profile);
        showToast('Signed in with Google! Welcome to PAWdiCURE. ✨', 'success', '🔑');
        navigate(targetRoute, { replace: true });
        return { success: true };
      } else {
        const userMsg = res.error || 'Google Sign-In failed.';
        showToast(userMsg, 'error', '❌');
        return { success: false, error: userMsg };
      }
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      const userMsg = mapAuthErrorMessage(err);
      showToast(userMsg, 'error', '❌');
      return { success: false, error: userMsg };
    } finally {
      setIsSyncing(false);
    }
  };

  const loginUserAnonymously = async () => {
    try {
      setIsSyncing(true);
      await signInAnonymously(auth);
      showToast('Continuing as Guest Sandbox User! 🐾', 'info', '🔑');
      return { success: true };
    } catch (err: any) {
      console.error('Anonymous sign-in error:', err);
      const userMsg = mapAuthErrorMessage(err);
      showToast(userMsg, 'error', '❌');
      return { success: false, error: userMsg };
    } finally {
      setIsSyncing(false);
    }
  };

  const signupUserWithFirebase = async (
    emailStr: string,
    passwordStr: string,
    nameStr: string,
    extraFields?: { preferredName?: string; phone?: string; photoURL?: string }
  ) => {
    try {
      setIsSyncing(true);
      const cred = await createUserWithEmailAndPassword(auth, emailStr.trim(), passwordStr);
      const uid = cred.user.uid;
      await updateProfile(cred.user, { displayName: nameStr.trim() });

      const profile = await createUserProfileDoc(uid, {
        name: nameStr.trim(),
        displayName: nameStr.trim(),
        preferredName: extraFields?.preferredName?.trim() || nameStr.trim(),
        email: emailStr.trim(),
        phone: extraFields?.phone?.trim() || null,
        photoURL: extraFields?.photoURL || null,
        onboardingCompleted: false,
        onboardingStep: 1,
      });

      setUserProfile(profile);
      setOnboardingCompleted(false);
      showToast('Account created! Welcome to PAWdiCURE. 🐾', 'success', '🎉');
      navigate('/onboarding', { replace: true });
      return { success: true };
    } catch (err: any) {
      console.error('Firebase sign-up error:', err);
      const userMsg = mapAuthErrorMessage(err);
      showToast(userMsg, 'error', '❌');
      return { success: false, error: userMsg };
    } finally {
      setIsSyncing(false);
    }
  };

  const logoutUserWithFirebase = async () => {
    try {
      setIsSyncing(true);
      const currentUid = userId;
      await signOut(auth);

      if (currentUid) {
        clearUserCachedState(currentUid);
      }

      setCurrentUser(null);
      setUserProfile(null);
      setUserId(null);
      setIsAuthenticated(false);
      setOnboardingCompleted(false);

      // Reset local household state to empty
      setHouseholdData(INITIAL_EMPTY_HOUSEHOLD_DATA);

      showToast('Logged out of PAWdiCURE.', 'info', '🚪');
      navigate('/auth', { replace: true });
      return { success: true };
    } catch (err: any) {
      console.error('Firebase sign-out error:', err);
      const userMsg = mapAuthErrorMessage(err);
      showToast(userMsg, 'error', '❌');
      return { success: false, error: userMsg };
    } finally {
      setIsSyncing(false);
    }
  };

  const updateOnboardingStep = async (stepNum: number) => {
    if (userId) {
      await updateUserProfileDoc(userId, { onboardingStep: stepNum });
      setUserProfile((prev) => (prev ? { ...prev, onboardingStep: stepNum } : null));
    }
  };

  const completeUserOnboarding = async (userUpdates?: Partial<UserProfile>, petData?: Partial<Pet>) => {
    if (userId) {
      const updates: Partial<UserProfile> = {
        onboardingCompleted: true,
        onboardingStep: 3,
        ...userUpdates,
        updatedAt: Date.now(),
      };
      await updateUserProfileDoc(userId, updates);
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }

    if (petData && petData.name) {
      const newPet: Pet = {
        id: petData.id || `pet-${Date.now()}`,
        name: petData.name.trim(),
        species: petData.species || 'Dog',
        breed: petData.breed?.trim() || 'Companion',
        age: petData.age?.trim() || '1 year',
        gender: petData.gender || 'Male',
        weight: petData.weight || 10,
        restingBpm: 68,
        personality: petData.personality || ['Friendly', 'Playful'],
        avatarUrl: petData.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300',
        careScore: 90,
        level: 1,
        levelTitle: 'New Companion',
        xp: 100,
        nextLevelXp: 500,
        mood: 'Happy',
        healthStatus: 'Excellent',
        hungerPercent: 20,
        targetPortionGrams: petData.targetPortionGrams || 180,
        dailyGramsFed: 0,
        dailyGramsGoal: petData.targetPortionGrams || 180,
        dailyCaloriesFed: 0,
        dailyCaloriesGoal: 450,
        nutritionPercent: 100,
        lastFed: 'Just now',
        mealsToday: 0,
        maxMeals: 2,
        hydrationPercent: 90,
        hydrationMl: 400,
        goalMl: 600,
        pantryKg: 5,
        vetClinic: 'Paws Medical Center',
        microchipId: '9851410029381',
        bloodType: 'DEA 1.1 Positive',
        allergies: petData.allergies || [],
        medicalConditions: [],
        emergencyContact: 'Dr. Sarah Smith',
        emergencyPhone: '(555) 019-2831',
        affinityPillars: [],
        stepsToday: 0,
        stepsGoal: petData.stepsGoal || 8500,
        streakDays: 1,
        lastCheckInDate: getUserLocalDate(),
        ...petData,
      };
      addPet(newPet);
    }

    setOnboardingCompleted(true);
    navigate('/home', { replace: true });
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHouseholdData(INITIAL_HOUSEHOLD_DATA);
    showToast('Demo data reset to factory default', 'info', '🔄');
  };

  const verifyVaccine = async (vaccineId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/verify-vaccine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdId: householdData.householdId,
          vaccineId
        })
      });
      
      const result = await response.json();
      if (result.success) {
        showToast('Clinical record verified by backend!', 'success', '🛡️');
        // The real-time listener will pick up the changes from Firestore, 
        // but we can also update local state immediately for better UX
        updateHousehold((prev) => ({
          ...prev,
          vaccinationHistory: prev.vaccinationHistory.map(v => v.id === vaccineId ? result.vaccine : v)
        }));
        triggerConfetti();
        return true;
      } else {
        showToast(result.error || 'Verification failed.', 'error', '❌');
        return false;
      }
    } catch (err) {
      console.error('Vaccine verification request failed', err);
      showToast('Backend verification service unavailable.', 'error', '⚠️');
      return false;
    }
  };

  const exportData = () => {
    const jsonStr = JSON.stringify(householdData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawdicure_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Household data backup downloaded', 'success', '💾');
  };

  const performDailyCheckIn = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const petLastCheckIn = activePet.lastCheckInDate || '';
    if (petLastCheckIn === todayStr) {
      showToast('You already checked in today! Come back tomorrow for +12 pts ✨', 'info', '📅');
      return { success: false, message: 'Already checked in today', pointsEarned: 0 };
    }

    const nextStreak = (activePet.streakDays || 0) + 1;
    updateHousehold((prev) => {
      const updatedPets = { ...prev.pets };
      if (updatedPets[activePetId]) {
        updatedPets[activePetId] = {
          ...updatedPets[activePetId],
          streakDays: nextStreak,
          lastCheckInDate: todayStr,
        };
      }
      return {
        ...prev,
        pawPoints: (prev.pawPoints || 0) + 12,
        pets: updatedPets,
        // Legacy top-level sync for safety/compatibility
        streakDays: nextStreak,
        lastCheckInDate: todayStr,
      };
    });

    triggerConfetti();
    addXp(20, `Daily check-in streak Day ${nextStreak}`);
    addCareActivity(`Completed Daily Check-In (Day ${nextStreak})`, 20, 'sparkles');
    showToast(`🎉 Daily Check-In Complete! (Streak: ${nextStreak} Days)`, 'success', '⭐');
    
    // Secure points award
    awardPawPoints('DAILY_CHECK_IN', 'checkin-' + todayStr, `Daily check-in streak Day ${nextStreak}`);

    addNotification({
      title: `Daily Check-In: +12 Points!`,
      message: `You maintained your ${nextStreak}-day care streak for ${activePet.name} and earned +12 Paw Points!`,
      timeAgo: 'Just now',
      type: 'reward',
      read: false,
      actionRoute: '/rewards',
    });

    return { success: true, message: `Checked in! +12 Points (Day ${nextStreak})`, pointsEarned: 12 };
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: Date.now(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        householdData,
        activePet,
        currentRoute,
        routeParams,
        isSyncing,
        isOnline,
        toasts,
        searchQuery,
        setSearchQuery,
        navigate,
        showToast,
        removeToast,
        triggerConfetti,
        setActivePetId,
        addPet,
        updatePet,
        deletePet,
        feedPet,
        refreshWater,
        orderFoodRefill,
        toggleTask,
        boostPillar,
        addXp,
        addMemory,
        deleteMemory,
        addVaccine,
        toggleVaccine,
        deleteVaccine,
        addMedication,
        toggleMedication,
        snoozeMedication,
        deleteMedication,
        addVetVisit,
        deleteVetVisit,
        addReminder,
        toggleReminder,
        snoozeReminder,
        deleteReminder,
        products,
        cart,
        cartCount,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        redeemReward,
        claimDailyQuest,
        inviteFamilyMember,
        addCareActivity,
        awardPawPoints,
        activities: householdData.activities || [],
        logPetActivity,
        updatePetActivity,
        deletePetActivity,
        logActivity,
        togglePlaceFavorite,
        updateUserProfile,
        updateHouseholdSettings,
        resetDemoData,
        exportData,
        performDailyCheckIn,
        verifyVaccine,
        currentUser,
        userProfile,
        authLoading,
        isAuthenticated,
        onboardingCompleted,
        onboardingStep: (userProfile?.onboardingStep as number) || 1,
        loginUserWithFirebase,
        loginUserWithGoogle,
        loginUserAnonymously,
        signupUserWithFirebase,
        logoutUserWithFirebase,
        sendPasswordReset,
        updateOnboardingStep,
        completeUserOnboarding,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,
        userId,
        badgeProgress,
        missionProgress,
        toggleBadgeShowcase,
        evaluateAchievements,
        dailyCycle,
        refreshDailyCycle,
        routines: householdData.routines || [],
        routineExecutions: householdData.routineExecutions || [],
        todayScheduledRoutineItems,
        activePetRoutines,
        createRoutine,
        updateRoutine,
        deleteRoutine,
        duplicateRoutine,
        toggleRoutineActive,
        completeRoutineItem,
        skipRoutineItem,
        uncompleteRoutineItem,
        refreshRoutines,
        isPushEnabled,
        pushPermissionStatus,
        registerPushNotifications,
        triggerTestPushNotification,
        currentTheme,
        setCurrentTheme,
        updateFavicon: updateDocumentFavicon,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useAuth() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return { userId: context.userId };
}

export { updateDocumentFavicon };
