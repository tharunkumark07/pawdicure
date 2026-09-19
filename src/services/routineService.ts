import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  CustomRoutine,
  RoutineItem,
  RoutineItemExecution,
  ScheduledRoutineItem,
  RoutineActivityType,
  RoutineCategory,
} from '../types';
import {
  getUserLocalDate,
  getUserLocalTime,
  getUserTimezone,
  parseTimeToMinutes,
  standardizeTimeFormat,
  isRoutineItemScheduledOnDate,
  computeRoutineItemStatus,
} from '../lib/timeUtils';
import { dailyCycleService } from './dailyCycleService';
import { activityService } from './activityService';

export interface RoutineTemplate {
  id: string;
  name: string;
  category: 'dog' | 'cat' | 'senior' | 'puppy' | 'health' | 'general';
  description: string;
  icon: string;
  accent: string;
  speciesRecommendation: 'Dog' | 'Cat' | 'All';
  items: Array<Omit<RoutineItem, 'id' | 'routineId' | 'userId' | 'petId' | 'createdAt' | 'updatedAt'>>;
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'tpl-basic-care',
    name: 'Essential Daily Care',
    category: 'general',
    description: 'A balanced daily rhythm with wholesome meals, hydration checks, and outdoor breaks.',
    icon: '☀️',
    accent: '#3b82f6',
    speciesRecommendation: 'All',
    items: [
      {
        title: 'Calibrated Breakfast & Hydration',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '07:30 AM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 180,
        unit: 'g',
        notes: 'Serve with fresh filtered water refill.',
        reminderEnabled: true,
        reminderOffset: 0,
        active: true,
        icon: '🍖',
      },
      {
        title: 'Morning Sniffari Walk',
        activityType: 'walk',
        category: 'activity',
        scheduledTime: '08:30 AM',
        durationMinutes: 30,
        repeatType: 'every_day',
        priority: 'medium',
        location: 'Neighborhood / Greenway',
        reminderEnabled: true,
        reminderOffset: 10,
        active: true,
        icon: '🐾',
      },
      {
        title: 'Midday Water Bowl Refresh',
        activityType: 'water',
        category: 'care',
        scheduledTime: '01:00 PM',
        durationMinutes: 5,
        repeatType: 'every_day',
        priority: 'medium',
        quantity: 350,
        unit: 'ml',
        reminderEnabled: false,
        reminderOffset: 0,
        active: true,
        icon: '💧',
      },
      {
        title: 'Evening Nourishing Supper',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '06:30 PM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 180,
        unit: 'g',
        notes: 'Add daily omega/topper supplement.',
        reminderEnabled: true,
        reminderOffset: 5,
        active: true,
        icon: '🍲',
      },
      {
        title: 'Nightly Coat Brushing & Wind Down',
        activityType: 'grooming',
        category: 'care',
        scheduledTime: '09:00 PM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'low',
        notes: 'Gentle strokes and paw pad inspection.',
        reminderEnabled: false,
        reminderOffset: 0,
        active: true,
        icon: '✨',
      },
    ],
  },
  {
    id: 'tpl-active-dog',
    name: 'High-Energy Canine Athlete',
    category: 'dog',
    description: 'Designed for energetic dogs with morning walks, agility training, and evening sprint sessions.',
    icon: '🏃',
    accent: '#10b981',
    speciesRecommendation: 'Dog',
    items: [
      {
        title: 'Morning Fuel & Joint Chew',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '07:00 AM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 200,
        unit: 'g',
        reminderEnabled: true,
        reminderOffset: 0,
        active: true,
        icon: '🍖',
      },
      {
        title: 'Brisk Sniffari Trail Run',
        activityType: 'walk',
        category: 'activity',
        scheduledTime: '08:00 AM',
        durationMinutes: 45,
        repeatType: 'every_day',
        priority: 'high',
        location: 'Crissy Field / Mountain Trail',
        reminderEnabled: true,
        reminderOffset: 15,
        active: true,
        icon: '🌲',
      },
      {
        title: 'Afternoon Frisbee & Agility Drills',
        activityType: 'exercise',
        category: 'activity',
        scheduledTime: '03:30 PM',
        durationMinutes: 25,
        repeatType: 'weekdays',
        priority: 'medium',
        location: 'Backyard / Dog Park',
        reminderEnabled: true,
        reminderOffset: 10,
        active: true,
        icon: '🎾',
      },
      {
        title: 'Evening Sunset Exploration Walk',
        activityType: 'walk',
        category: 'activity',
        scheduledTime: '06:00 PM',
        durationMinutes: 35,
        repeatType: 'every_day',
        priority: 'high',
        location: 'Riverside Path',
        reminderEnabled: true,
        reminderOffset: 10,
        active: true,
        icon: '🌅',
      },
      {
        title: 'Calibrated Recovery Dinner',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '07:30 PM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 200,
        unit: 'g',
        reminderEnabled: true,
        reminderOffset: 0,
        active: true,
        icon: '🥩',
      },
    ],
  },
  {
    id: 'tpl-indoor-cat',
    name: 'Indoor Feline Wellness & Play',
    category: 'cat',
    description: 'Enriching indoor schedule tailored for feline stimulation, raw/pate feedings, and feather wand play.',
    icon: '🐈',
    accent: '#8b5cf6',
    speciesRecommendation: 'Cat',
    items: [
      {
        title: 'Morning Feline Raw Feast',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '07:30 AM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 65,
        unit: 'g',
        notes: 'Serve with 1 pump wild salmon oil.',
        reminderEnabled: true,
        reminderOffset: 0,
        active: true,
        icon: '🐟',
      },
      {
        title: 'Laser Pointer & Vertical Agility',
        activityType: 'play',
        category: 'activity',
        scheduledTime: '12:30 PM',
        durationMinutes: 15,
        repeatType: 'every_day',
        priority: 'medium',
        reminderEnabled: false,
        reminderOffset: 0,
        active: true,
        icon: '🔴',
      },
      {
        title: 'Water Fountain Filter Check',
        activityType: 'water',
        category: 'care',
        scheduledTime: '04:00 PM',
        durationMinutes: 5,
        repeatType: 'every_day',
        priority: 'medium',
        reminderEnabled: false,
        reminderOffset: 0,
        active: true,
        icon: '⛲',
      },
      {
        title: 'Evening Gourmet Pate Dinner',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '06:30 PM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 65,
        unit: 'g',
        reminderEnabled: true,
        reminderOffset: 5,
        active: true,
        icon: '🍲',
      },
      {
        title: 'Velvet Ruff Slicker Brushing',
        activityType: 'grooming',
        category: 'care',
        scheduledTime: '09:00 PM',
        durationMinutes: 15,
        repeatType: 'every_day',
        priority: 'medium',
        notes: 'Prevents hairballs and relaxes companion.',
        reminderEnabled: false,
        reminderOffset: 0,
        active: true,
        icon: '✨',
      },
    ],
  },
  {
    id: 'tpl-senior-pet',
    name: 'Gentle Senior Pet Care',
    category: 'senior',
    description: 'Low-impact routine focusing on joint health, frequent gentle strolls, and timely medication.',
    icon: '🌿',
    accent: '#f59e0b',
    speciesRecommendation: 'All',
    items: [
      {
        title: 'Gentle Morning Stroll & Sniff',
        activityType: 'walk',
        category: 'activity',
        scheduledTime: '08:00 AM',
        durationMinutes: 15,
        repeatType: 'every_day',
        priority: 'medium',
        notes: 'Slow, easy pace. Avoid rough terrain.',
        reminderEnabled: true,
        reminderOffset: 5,
        active: true,
        icon: '🐾',
      },
      {
        title: 'Easy-Digest Breakfast & Joint Dosing',
        activityType: 'feeding',
        category: 'care',
        scheduledTime: '08:30 AM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        quantity: 160,
        unit: 'g',
        notes: 'Include Glucosamine + MSM chewable.',
        reminderEnabled: true,
        reminderOffset: 0,
        active: true,
        icon: '🥣',
      },
      {
        title: 'Midday Comfort Potty & Hydration',
        activityType: 'water',
        category: 'care',
        scheduledTime: '01:00 PM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'medium',
        reminderEnabled: false,
        reminderOffset: 0,
        active: true,
        icon: '💧',
      },
      {
        title: 'Orthopedic Massage & Heat Therapy',
        activityType: 'bonding',
        category: 'activity',
        scheduledTime: '05:00 PM',
        durationMinutes: 15,
        repeatType: 'every_day',
        priority: 'medium',
        notes: 'Gentle stifle and lower back soothing.',
        reminderEnabled: true,
        reminderOffset: 10,
        active: true,
        icon: '💆',
      },
      {
        title: 'Evening Supper & Night Meds',
        activityType: 'medication',
        category: 'health',
        scheduledTime: '07:00 PM',
        durationMinutes: 10,
        repeatType: 'every_day',
        priority: 'high',
        notes: 'Administer anti-inflammatory dose with meal.',
        reminderEnabled: true,
        reminderOffset: 5,
        active: true,
        icon: '💊',
      },
    ],
  },
  {
    id: 'tpl-medication-protocol',
    name: 'Prescription & Medical Care Protocol',
    category: 'health',
    description: 'Strict time-locked dosing routine for treatments, oral meds, and vitals monitoring.',
    icon: '💊',
    accent: '#ef4444',
    speciesRecommendation: 'All',
    items: [
      {
        title: 'Morning Oral Dose (Chew / Liquid)',
        activityType: 'medication',
        category: 'health',
        scheduledTime: '08:00 AM',
        durationMinutes: 5,
        repeatType: 'every_day',
        priority: 'high',
        notes: 'Give with breakfast or pill pocket.',
        reminderEnabled: true,
        reminderOffset: 15,
        active: true,
        icon: '💊',
      },
      {
        title: 'Midday Vitals & Temperature Check',
        activityType: 'temp_check',
        category: 'health',
        scheduledTime: '01:00 PM',
        durationMinutes: 5,
        repeatType: 'every_day',
        priority: 'medium',
        notes: 'Check resting breath rate & gum color.',
        reminderEnabled: true,
        reminderOffset: 5,
        active: true,
        icon: '🩺',
      },
      {
        title: 'Evening Medication Administration',
        activityType: 'medication',
        category: 'health',
        scheduledTime: '08:00 PM',
        durationMinutes: 5,
        repeatType: 'every_day',
        priority: 'high',
        notes: 'Administer 12 hours after morning dose.',
        reminderEnabled: true,
        reminderOffset: 15,
        active: true,
        icon: '💊',
      },
    ],
  },
];

export const INITIAL_DEFAULT_ROUTINES: Record<string, CustomRoutine[]> = {
  milo: [
    {
      id: 'rt-milo-daily',
      userId: 'default-user',
      petId: 'milo',
      name: "Milo's Golden Daily Rhythm",
      description: 'Comprehensive daily routine with nutritious meals, scenic sniffaris, and evening paw balm.',
      icon: '🐕',
      accent: '#3b82f6',
      active: true,
      createdAt: Date.now() - 7 * 86400000,
      updatedAt: Date.now() - 86400000,
      items: [
        {
          id: 'item-milo-1',
          routineId: 'rt-milo-daily',
          petId: 'milo',
          userId: 'default-user',
          title: 'Morning Trail Sniffari Walk',
          activityType: 'walk',
          category: 'activity',
          scheduledTime: '07:15 AM',
          durationMinutes: 30,
          repeatType: 'every_day',
          priority: 'high',
          location: 'Mountain Creek Trail',
          notes: 'Sniffing exploration at steady pace.',
          reminderEnabled: true,
          reminderOffset: 10,
          active: true,
          icon: '🐾',
          createdAt: Date.now() - 7 * 86400000,
          updatedAt: Date.now() - 7 * 86400000,
        },
        {
          id: 'item-milo-2',
          routineId: 'rt-milo-daily',
          petId: 'milo',
          userId: 'default-user',
          title: 'Breakfast & Joint Cartilage Chew',
          activityType: 'feeding',
          category: 'care',
          scheduledTime: '08:15 AM',
          durationMinutes: 10,
          repeatType: 'every_day',
          priority: 'high',
          quantity: 180,
          unit: 'g',
          notes: '180g Pacific Salmon formula + 2 Glucosamine chews',
          reminderEnabled: true,
          reminderOffset: 0,
          active: true,
          icon: '🍖',
          createdAt: Date.now() - 7 * 86400000,
          updatedAt: Date.now() - 7 * 86400000,
        },
        {
          id: 'item-milo-3',
          routineId: 'rt-milo-daily',
          petId: 'milo',
          userId: 'default-user',
          title: 'Noon Hydration & Frisbee Toss',
          activityType: 'play',
          category: 'activity',
          scheduledTime: '12:30 PM',
          durationMinutes: 20,
          repeatType: 'every_day',
          priority: 'medium',
          location: 'Backyard Green',
          notes: 'Fresh bowl of cold water + fetch sprints.',
          reminderEnabled: false,
          reminderOffset: 0,
          active: true,
          icon: '🎾',
          createdAt: Date.now() - 7 * 86400000,
          updatedAt: Date.now() - 7 * 86400000,
        },
        {
          id: 'item-milo-4',
          routineId: 'rt-milo-daily',
          petId: 'milo',
          userId: 'default-user',
          title: 'Evening Coastal Beach Sprint',
          activityType: 'walk',
          category: 'activity',
          scheduledTime: '05:45 PM',
          durationMinutes: 35,
          repeatType: 'every_day',
          priority: 'high',
          location: 'Crissy Field Shoreline',
          reminderEnabled: true,
          reminderOffset: 15,
          active: true,
          icon: '🏖️',
          createdAt: Date.now() - 7 * 86400000,
          updatedAt: Date.now() - 7 * 86400000,
        },
        {
          id: 'item-milo-5',
          routineId: 'rt-milo-daily',
          petId: 'milo',
          userId: 'default-user',
          title: 'Evening Salmon Supper & Omega Boost',
          activityType: 'feeding',
          category: 'care',
          scheduledTime: '06:45 PM',
          durationMinutes: 10,
          repeatType: 'every_day',
          priority: 'high',
          quantity: 180,
          unit: 'g',
          notes: '180g portion with 2 pumps wild salmon oil.',
          reminderEnabled: true,
          reminderOffset: 5,
          active: true,
          icon: '🍲',
          createdAt: Date.now() - 7 * 86400000,
          updatedAt: Date.now() - 7 * 86400000,
        },
        {
          id: 'item-milo-6',
          routineId: 'rt-milo-daily',
          petId: 'milo',
          userId: 'default-user',
          title: 'Nightly Oatmeal Paw Balm & Detangle',
          activityType: 'grooming',
          category: 'care',
          scheduledTime: '08:45 PM',
          durationMinutes: 15,
          repeatType: 'every_day',
          priority: 'low',
          notes: 'Inspect pads for foxtails, apply soothing balm.',
          reminderEnabled: false,
          reminderOffset: 0,
          active: true,
          icon: '✨',
          createdAt: Date.now() - 7 * 86400000,
          updatedAt: Date.now() - 7 * 86400000,
        },
      ],
    },
  ],
  luna: [
    {
      id: 'rt-luna-daily',
      userId: 'default-user',
      petId: 'luna',
      name: "Luna's Feline Wellness Schedule",
      description: 'Raw feeding timetable, stimulating playtime, and coat grooming.',
      icon: '🐈',
      accent: '#8b5cf6',
      active: true,
      createdAt: Date.now() - 5 * 86400000,
      updatedAt: Date.now() - 86400000,
      items: [
        {
          id: 'item-luna-1',
          routineId: 'rt-luna-daily',
          petId: 'luna',
          userId: 'default-user',
          title: 'Morning Feline Raw Feast',
          activityType: 'feeding',
          category: 'care',
          scheduledTime: '07:30 AM',
          durationMinutes: 10,
          repeatType: 'every_day',
          priority: 'high',
          quantity: 65,
          unit: 'g',
          notes: 'Organic rabbit pate with probiotic pumpkin powder.',
          reminderEnabled: true,
          reminderOffset: 0,
          active: true,
          icon: '🐟',
          createdAt: Date.now() - 5 * 86400000,
          updatedAt: Date.now() - 5 * 86400000,
        },
        {
          id: 'item-luna-2',
          routineId: 'rt-luna-daily',
          petId: 'luna',
          userId: 'default-user',
          title: 'Laser Pointer & Feather Wand Agility',
          activityType: 'play',
          category: 'activity',
          scheduledTime: '01:00 PM',
          durationMinutes: 15,
          repeatType: 'every_day',
          priority: 'medium',
          notes: 'Vertical leaps and predatory sprint chase.',
          reminderEnabled: false,
          reminderOffset: 0,
          active: true,
          icon: '🪶',
          createdAt: Date.now() - 5 * 86400000,
          updatedAt: Date.now() - 5 * 86400000,
        },
        {
          id: 'item-luna-3',
          routineId: 'rt-luna-daily',
          petId: 'luna',
          userId: 'default-user',
          title: 'Evening Salmon Pate & Water Fountain Check',
          activityType: 'feeding',
          category: 'care',
          scheduledTime: '06:00 PM',
          durationMinutes: 10,
          repeatType: 'every_day',
          priority: 'high',
          quantity: 65,
          unit: 'g',
          notes: '65g portion with fresh filtered refill.',
          reminderEnabled: true,
          reminderOffset: 5,
          active: true,
          icon: '🍲',
          createdAt: Date.now() - 5 * 86400000,
          updatedAt: Date.now() - 5 * 86400000,
        },
        {
          id: 'item-luna-4',
          routineId: 'rt-luna-daily',
          petId: 'luna',
          userId: 'default-user',
          title: 'Velvet Ruff Slicker Brush & Chin Scratches',
          activityType: 'grooming',
          category: 'care',
          scheduledTime: '09:00 PM',
          durationMinutes: 15,
          repeatType: 'every_day',
          priority: 'medium',
          notes: '10 mins relaxing grooming strokes.',
          reminderEnabled: false,
          reminderOffset: 0,
          active: true,
          icon: '✨',
          createdAt: Date.now() - 5 * 86400000,
          updatedAt: Date.now() - 5 * 86400000,
        },
      ],
    },
  ],
};

export const routineService = {
  /**
   * Fetch custom routines for a specific pet from Firebase with fallback
   */
  fetchPetRoutines: async (userId: string, petId: string): Promise<CustomRoutine[]> => {
    try {
      if (userId && petId) {
        const colRef = collection(db, `users/${userId}/pets/${petId}/routines`);
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const routines: CustomRoutine[] = [];
          snapshot.forEach((d) => {
            routines.push({ id: d.id, ...d.data() } as CustomRoutine);
          });
          return routines;
        }
      }
    } catch (err) {
      console.warn('Firebase routine fetch error, using memory state:', err);
    }
    return INITIAL_DEFAULT_ROUTINES[petId] || [];
  },

  /**
   * Save or update a custom routine in Firebase
   */
  savePetRoutine: async (
    userId: string,
    petId: string,
    routine: CustomRoutine
  ): Promise<CustomRoutine> => {
    const routineId = routine.id || `routine-${Date.now()}`;
    const cleanedRoutine: CustomRoutine = {
      ...routine,
      id: routineId,
      userId: userId || 'default-user',
      petId,
      items: (routine.items || []).map((item, idx) => ({
        ...item,
        id: item.id || `item-${routineId}-${idx + 1}-${Date.now()}`,
        routineId,
        petId,
        userId: userId || 'default-user',
        scheduledTime: standardizeTimeFormat(item.scheduledTime),
        active: item.active !== false,
        createdAt: item.createdAt || Date.now(),
        updatedAt: Date.now(),
      })),
      createdAt: routine.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    try {
      if (userId && petId) {
        const docRef = doc(db, `users/${userId}/pets/${petId}/routines/${routineId}`);
        await setDoc(docRef, cleanedRoutine);
      }
    } catch (err) {
      console.warn('Could not save routine to Firebase:', err);
    }

    return cleanedRoutine;
  },

  /**
   * Delete a custom routine from Firebase
   */
  deletePetRoutine: async (userId: string, petId: string, routineId: string): Promise<void> => {
    try {
      if (userId && petId && routineId) {
        const docRef = doc(db, `users/${userId}/pets/${petId}/routines/${routineId}`);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('Could not delete routine from Firebase:', err);
    }
  },

  /**
   * Toggle routine active / paused state
   */
  togglePetRoutineActive: async (
    userId: string,
    petId: string,
    routineId: string,
    active: boolean
  ): Promise<void> => {
    try {
      if (userId && petId && routineId) {
        const docRef = doc(db, `users/${userId}/pets/${petId}/routines/${routineId}`);
        await updateDoc(docRef, { active, updatedAt: Date.now() });
      }
    } catch (err) {
      console.warn('Could not update routine active status in Firebase:', err);
    }
  },

  /**
   * Duplicate an existing routine
   */
  duplicatePetRoutine: async (
    userId: string,
    petId: string,
    routineToDuplicate: CustomRoutine
  ): Promise<CustomRoutine> => {
    const newRoutineId = `routine-${Date.now()}`;
    const duplicated: CustomRoutine = {
      ...routineToDuplicate,
      id: newRoutineId,
      name: `${routineToDuplicate.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: (routineToDuplicate.items || []).map((item, idx) => ({
        ...item,
        id: `item-${newRoutineId}-${idx + 1}-${Date.now()}`,
        routineId: newRoutineId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })),
    };

    return routineService.savePetRoutine(userId, petId, duplicated);
  },

  /**
   * Fetch executions (completions/skips) for a pet on a specific date
   */
  fetchRoutineExecutions: async (
    userId: string,
    petId: string,
    dateKey: string
  ): Promise<RoutineItemExecution[]> => {
    try {
      if (userId && petId) {
        const colRef = collection(db, `users/${userId}/pets/${petId}/routineExecutions`);
        const snapshot = await getDocs(colRef);
        const executions: RoutineItemExecution[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as RoutineItemExecution;
          if (data.date === dateKey) {
            executions.push({ id: d.id, ...data });
          }
        });
        return executions;
      }
    } catch (err) {
      console.warn('Could not fetch routine executions from Firebase:', err);
    }
    return [];
  },

  /**
   * Save or update an execution record in Firestore
   */
  saveRoutineExecution: async (
    userId: string,
    petId: string,
    execution: RoutineItemExecution
  ): Promise<RoutineItemExecution> => {
    try {
      if (userId && petId && execution.id) {
        const docRef = doc(
          db,
          `users/${userId}/pets/${petId}/routineExecutions/${execution.id}`
        );
        await setDoc(docRef, execution, { merge: true });
      }
    } catch (err) {
      console.warn('Could not save routine execution in Firebase:', err);
    }
    return execution;
  },

  /**
   * Remove an execution record from Firestore
   */
  removeRoutineExecution: async (
    userId: string,
    petId: string,
    executionId: string
  ): Promise<void> => {
    try {
      if (userId && petId && executionId) {
        const docRef = doc(
          db,
          `users/${userId}/pets/${petId}/routineExecutions/${executionId}`
        );
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('Could not delete routine execution from Firebase:', err);
    }
  },

  /**
   * Compute scheduled items for a target date
   */
  getScheduledRoutineItemsForDate: (
    routines: CustomRoutine[],
    executions: RoutineItemExecution[] = [],
    dateKey: string = getUserLocalDate(),
    timezone: string = getUserTimezone()
  ): ScheduledRoutineItem[] => {
    const scheduled: ScheduledRoutineItem[] = [];
    const execMap = new Map<string, RoutineItemExecution>();

    executions.forEach((e) => {
      if (e.date === dateKey) {
        execMap.set(e.routineItemId, e);
      }
    });

    (routines || [])
      .filter((r) => r.active !== false)
      .forEach((routine) => {
        (routine.items || [])
          .filter((item) => item.active !== false)
          .forEach((item) => {
            const isScheduledToday = isRoutineItemScheduledOnDate(
              item.repeatType,
              item.repeatDays,
              dateKey,
              timezone
            );

            if (isScheduledToday) {
              const execution = execMap.get(item.id);
              const computedStatus = computeRoutineItemStatus(
                item.scheduledTime,
                dateKey,
                execution?.status,
                timezone
              );

              const minutes = parseTimeToMinutes(item.scheduledTime);

              scheduled.push({
                item,
                routine,
                status: computedStatus,
                execution,
                displayTime: standardizeTimeFormat(item.scheduledTime),
                minutesFromMidnight: minutes,
                isDueNow: computedStatus === 'due',
                isUpcoming: computedStatus === 'upcoming',
                isMissed: computedStatus === 'missed',
                isCompleted: computedStatus === 'completed',
                isSkipped: computedStatus === 'skipped',
              });
            }
          });
      });

    // Chronological sorting by time from midnight
    scheduled.sort((a, b) => a.minutesFromMidnight - b.minutesFromMidnight);
    return scheduled;
  },

  /**
   * Helper to map an activity type to its high-level routine category
   */
  getActivityCategory: (type: RoutineActivityType): RoutineCategory => {
    switch (type) {
      case 'feeding':
      case 'water':
      case 'grooming':
      case 'bath':
      case 'brushing':
      case 'nail_care':
        return 'care';
      case 'walk':
      case 'play':
      case 'exercise':
      case 'training':
      case 'outdoor':
      case 'indoor_play':
      case 'bonding':
        return 'activity';
      case 'medication':
      case 'health_check':
      case 'temp_check':
      case 'vet_visit':
      case 'vaccination':
        return 'health';
      default:
        return 'custom';
    }
  },
};
