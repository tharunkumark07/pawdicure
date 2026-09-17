export interface AffinityPillar {
  id: string;
  name: string;
  level: number;
  resonance: number; // 0 - 100%
  icon: string;
  description: string;
  category: 'primary' | 'secondary' | 'tertiary' | 'neutral';
}

export interface BondMemory {
  id: string;
  petId: string;
  title: string;
  date: string;
  xp: number;
  location: string;
  desc: string;
  tags: string[];
  imageUrl: string;
  createdAt: number;
}

export interface Trophy {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  unlocked: boolean;
  category: string;
}

export interface VaccineRecord {
  id: string;
  petId: string;
  name: string;
  status: string;
  alert: boolean;
  dueDate: string;
  administeredDate: string;
  vet: string;
  tagNumber?: string;
  notes?: string;
  completed: boolean;
}

export interface MedicationRecord {
  id: string;
  petId: string;
  name: string;
  dose: string;
  schedule: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  takenToday: boolean;
  lastTakenTime?: string;
  snoozedUntil?: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  vetName: string;
  clinic: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  cost?: string;
  documents?: string[];
}

export interface Reminder {
  id: string;
  petId: string;
  type: 'feeding' | 'walk' | 'medication' | 'vaccination' | 'grooming' | 'vet' | 'custom';
  title: string;
  date: string;
  time: string;
  repeat: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  enabled: boolean;
  notes?: string;
}

export interface RoutineTask {
  id: string;
  petId: string;
  time: string;
  title: string;
  desc: string;
  completed: boolean;
  xp: number;
  category: 'walk' | 'feed' | 'med' | 'play' | 'groom' | 'sleep';
}

export interface HealthMilestone {
  id: string;
  petId: string;
  title: string;
  date: string;
  desc: string;
  status: 'completed' | 'upcoming' | 'scheduled';
  badgeText?: string;
}

export interface DocumentVaultItem {
  id: string;
  petId: string;
  title: string;
  type: string;
  subtitle: string;
  size?: string;
  code?: string;
  verified: boolean;
  date: string;
}

export interface FeedingRecord {
  id: string;
  petId: string;
  time: string;
  date: string;
  grams: number;
  calories: number;
  foodType: string;
  toppers: string[];
}

export interface WeightRecord {
  id: string;
  petId: string;
  date: string;
  weightKg: number;
}

export interface CareLimit {
  value: number;
  unit: string;
  source: 'GENERAL' | 'USER_DEFINED' | 'VETERINARIAN';
  updatedAt: number;
  notes?: string;
}

export interface CareSettings {
  id: string;
  petId: string;
  activityGuidance?: CareLimit;
  feedingGuidance?: CareLimit;
  treatGuidance?: CareLimit;
  medicationGuidance?: CareLimit;
  customRestrictions?: string[];
  veterinarianNotes?: string;
  updatedAt: number;
}

export interface Pet {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  dateOfBirth?: string;
  age: string;
  sizeCategory?: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Giant';
  activityLevel?: 'Low' | 'Moderate' | 'High';
  gender: 'Male' | 'Female' | 'Unknown';
  personality: string[];
  weight: number; // in kg
  restingBpm: number;
  mood: string;
  healthStatus: string;
  careScore: number;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  hungerPercent: number; // 0 is full, 100 is empty
  targetPortionGrams: number;
  dailyGramsFed: number; // Cumulative food weight consumed today
  dailyGramsGoal: number; // Calibrated daily target
  dailyCaloriesFed: number; // Cumulative kcal consumed today
  dailyCaloriesGoal: number; // Calibrated daily energy requirement
  nutritionPercent: number; // % of daily nutritional target met
  lastFed: string;
  mealsToday: number;
  maxMeals: number;
  hydrationPercent: number;
  hydrationMl: number;
  goalMl: number;
  pantryKg: number;
  avatarUrl: string;
  vetClinic: string;
  microchipId: string;
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  emergencyContact: string;
  emergencyPhone: string;
  affinityPillars: AffinityPillar[];
  stepsToday?: number;
  stepsGoal?: number;
  caloriesBurned?: number;
  currentMl?: number;
  sleepHours?: number;
  careSettingsId?: string;
  applicationNumber?: string;
}


export interface StoreProduct {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Food & Nutrition' | 'Wellness & Care' | 'Toys & Agility' | 'Gear & Beds' | string;
  points: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  desc: string;
  specs?: string[];
  inStock: boolean;
  badge?: string;
  retailValue?: string;
  requiredLevel?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'alert' | 'reward' | 'info' | 'health';
  read: boolean;
  actionRoute?: string;
  timestamp: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Family Member' | 'Caregiver';
  avatar: string;
  isPrimary?: boolean;
}

export interface CareActivity {
  id: string;
  petId: string;
  actorName: string;
  action: string;
  time: string;
  timestamp: number;
  xp?: number;
  icon?: string;
}

export interface PlaceItem {
  id: string;
  name: string;
  category: 'park' | 'vet' | 'groomer' | 'store' | 'cafe' | 'boarding';
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  phone: string;
  openNow: boolean;
  image: string;
  isFavorite?: boolean;
  features?: string[];
}

export interface NotificationSettings {
  notifyFeeding: boolean;
  notifyMeds: boolean;
  notifyVaccinations: boolean;
  notifyVet: boolean;
  notifyAchievements: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    feeding: boolean;
    medications: boolean;
    walks: boolean;
    health: boolean;
    achievements: boolean;
  };
  privacy: {
    locationSharing: boolean;
    cloudSync: boolean;
    publicProfile: boolean;
  };
  notificationSettings?: NotificationSettings;
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  title: string;
  pointsSpent: number;
  redeemedAt: string;
  code: string;
}

export interface HouseholdData {
  householdId: string;
  syncCode: string;
  activePetId: string;
  streakDays: number;
  pawPoints: number;
  pets: Record<string, Pet>;
  memories: BondMemory[];
  vaccines: VaccineRecord[];
  medications: MedicationRecord[];
  vetVisits: VetVisit[];
  reminders: Reminder[];
  routineTasks: RoutineTask[];
  healthMilestones: HealthMilestone[];
  documents: DocumentVaultItem[];
  feedingHistory: FeedingRecord[];
  weightHistory: WeightRecord[];
  cart: CartItem[];
  wishlist: string[];
  familyMembers: FamilyMember[];
  careActivities: CareActivity[];
  places: PlaceItem[];
  redeemedRewards: RedeemedReward[];
  userProfile: UserProfile;
  trophies: Trophy[];
  lastSyncedAt: number;
  lastCheckInDate?: string;
  rewards?: RewardItem[];
  products?: StoreProduct[];
  careStreakDays?: number;
  userRank?: string;
  currentXp?: number;
  settings?: any;
  syncStatus?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
}

export type MemoryItem = BondMemory;
export type ProductItem = StoreProduct;
export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
  retailValue?: string;
  requiredLevel?: number;
  requiredLevelTitle?: string;
  category?: 'clinical' | 'diagnostic' | 'therapeutic' | 'wellness' | 'gear';
  image?: string;
  terms?: string;
  partnerClinic?: string;
}

export interface DailyCycle {
  id: string; // YYYY-MM-DD
  date: string; // YYYY-MM-DD
  petId: string;
  userId: string;
  timezone: string;
  feeding: {
    breakfast: { quantity: number; unit: string; recorded: boolean; timestamp?: string };
    lunch: { quantity: number; unit: string; recorded: boolean; timestamp?: string };
    dinner: { quantity: number; unit: string; recorded: boolean; timestamp?: string };
    treats: { quantity: number; unit: string; recorded: boolean; timestamp?: string };
    totalGrams: number;
    totalCalories: number;
  };
  water: {
    entries: { amount: number; timestamp: string }[];
    totalMl: number;
  };
  activities: {
    walkingMinutes: number;
    playMinutes: number;
    exerciseMinutes: number;
    trainingMinutes: number;
    totalMinutes: number;
  };
  care: {
    medicationsTaken: string[]; // IDs of meds taken
    remindersCompleted: string[]; // IDs of reminders completed
    groomingDone: boolean;
    healthChecksDone: boolean;
  };
  stats: {
    careScore: number;
    relationshipXpEarned: number;
    pawPointsEarned: number;
    completedTaskIds: string[];
    completedMissionIds: string[];
  };
  createdAt: number;
  updatedAt: number;
}
