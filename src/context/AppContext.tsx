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
} from '../types';
import { INITIAL_HOUSEHOLD_DATA, INITIAL_PRODUCTS, INITIAL_REWARDS } from '../lib/mockData';
import { subscribeToHousehold, syncHouseholdToCloud, initFirebaseAuth, db } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

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
  navigate: (route: string) => void;
  showToast: (title: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: string) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  
  // Pet Actions
  setActivePetId: (petId: string) => void;
  addPet: (newPet: Pet) => void;
  updatePet: (updatedPet: Pet) => void;

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

  // Places / Explorer
  togglePlaceFavorite: (placeId: string) => void;

  // User Profile & Settings
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateHouseholdSettings: (settings: any) => void;
  resetDemoData: () => void;
  exportData: () => void;
  performDailyCheckIn: () => { success: boolean; message: string; pointsEarned: number };

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

  // Push Notifications State & Operations
  isPushEnabled: boolean;
  pushPermissionStatus: 'default' | 'granted' | 'denied';
  registerPushNotifications: () => Promise<boolean>;
  triggerTestPushNotification: () => Promise<boolean>;
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

  // Badges & Missions state
  const [userId, setUserId] = useState<string | null>(null);
  const [badgeProgress, setBadgeProgress] = useState<any[]>([]);
  const [missionProgress, setMissionProgress] = useState<any[]>([]);

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
  const activePetId = householdData.activePetId || 'milo';
  const activePet: Pet = householdData.pets[activePetId] || Object.values(householdData.pets)[0];

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

  // Boot Firebase anonymous authentication
  useEffect(() => {
    initFirebaseAuth((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
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

  // Sync real-time badge and mission collections from Firestore
  useEffect(() => {
    if (!userId) return;

    const badgesRef = collection(db, 'users', userId, 'badgeProgress');
    const unsubBadges = onSnapshot(badgesRef, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBadgeProgress(items);
    });

    const missionsRef = collection(db, 'users', userId, 'missionProgress');
    const unsubMissions = onSnapshot(missionsRef, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setMissionProgress(items);
    });

    return () => {
      unsubBadges();
      unsubMissions();
    };
  }, [userId]);

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
  const navigate = (route: string) => {
    window.location.hash = route;
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
        pawPoints: prev.pawPoints + Math.round(amount * 0.4),
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

  const feedPet = (grams: number, toppers: string[]) => {
    const baseKcal = Math.round(grams * 3.44);
    const salmonKcal = toppers.some((t) => t.toLowerCase().includes('salmon')) ? 45 : 0;
    const jointKcal = toppers.some((t) => t.toLowerCase().includes('glucosamine')) ? 25 : 0;
    const mealKcal = baseKcal + salmonKcal + jointKcal;

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

  const toggleTask = (taskId: string) => {
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
      vaccines: [...prev.vaccines, newVac],
    }));
    triggerConfetti();
    addXp(50, `Recorded vaccination: ${vaccine.name}`);
    addCareActivity(`Logged vaccination "${vaccine.name}"`, 50, 'healing');
    showToast(`Vaccination record for "${vaccine.name}" saved!`, 'success', '💉');
  };

  const toggleVaccine = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      vaccines: prev.vaccines.map((v) =>
        v.id === id ? { ...v, completed: !v.completed, status: !v.completed ? 'Verified Current' : 'Pending Booster' } : v
      ),
    }));
    showToast('Vaccination status updated', 'success', '💉');
  };

  const deleteVaccine = (id: string) => {
    updateHousehold((prev) => ({
      ...prev,
      vaccines: prev.vaccines.filter((v) => v.id !== id),
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

  const redeemReward = (itemOrId: StoreProduct | RewardItem | string) => {
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

    if (householdData.pawPoints < pointsCost) {
      const diff = pointsCost - householdData.pawPoints;
      showToast(
        `Exclusive perk! You need ${diff.toLocaleString()} more PAW Points to unlock "${itemTitle}".`,
        'warning',
        '🔒'
      );
      return false;
    }

    const redemptionCode =
      'PAW-' +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      '-' +
      Date.now().toString().slice(-4);

    const newRedemption = {
      id: 'red-' + Date.now(),
      rewardId: rewardId,
      title: itemTitle,
      pointsSpent: pointsCost,
      redeemedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      code: redemptionCode,
    };

    updateHousehold((prev) => ({
      ...prev,
      pawPoints: prev.pawPoints - pointsCost,
      redeemedRewards: [newRedemption, ...(prev.redeemedRewards || [])],
    }));

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

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHouseholdData(INITIAL_HOUSEHOLD_DATA);
    showToast('Demo data reset to factory default', 'info', '🔄');
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
    if (householdData.lastCheckInDate === todayStr) {
      showToast('You already checked in today! Come back tomorrow for +12 pts ✨', 'info', '📅');
      return { success: false, message: 'Already checked in today', pointsEarned: 0 };
    }

    const nextStreak = (householdData.streakDays || 0) + 1;
    updateHousehold((prev) => ({
      ...prev,
      pawPoints: (prev.pawPoints || 0) + 12,
      streakDays: nextStreak,
      lastCheckInDate: todayStr,
    }));

    triggerConfetti();
    addXp(20, `Daily check-in streak Day ${nextStreak}`);
    addCareActivity(`Completed Daily Check-In (Day ${nextStreak})`, 20, 'sparkles');
    showToast(`🎉 Daily Check-In Complete! +12 Paw Points earned! (Streak: ${nextStreak} Days)`, 'success', '⭐');

    addNotification({
      title: `Daily Check-In: +12 Points!`,
      message: `You maintained your ${nextStreak}-day care streak and earned +12 Paw Points!`,
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
        togglePlaceFavorite,
        updateUserProfile,
        updateHouseholdSettings,
        resetDemoData,
        exportData,
        performDailyCheckIn,
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
        isPushEnabled,
        pushPermissionStatus,
        registerPushNotifications,
        triggerTestPushNotification,
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
