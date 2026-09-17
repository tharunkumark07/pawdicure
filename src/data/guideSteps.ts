import { GuideStep } from '../types/petGuide';

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'nav-tab-home',
    page: 'home',
    targetId: 'nav-tab-home',
    message: "1. Home: This is your daily concierge overview and routine care checklist.",
    route: '/home',
  },
  {
    id: 'nav-tab-feed',
    page: 'home',
    targetId: 'nav-tab-feed',
    message: "2. Feed: Track your pet's kibble, wet food, treats, and water cycles for optimal nutrition.",
    route: '/feed',
  },
  {
    id: 'nav-tab-badges',
    page: 'home',
    targetId: 'nav-tab-badges',
    message: "3. Badges: Complete meaningful care missions and unlock achievements for outstanding pet parenthood!",
    route: '/badges',
  },
  {
    id: 'nav-tab-health',
    page: 'home',
    targetId: 'nav-tab-health',
    message: "4. Stats: Keep medical history, vaccination records, and vital stats organized in one spot.",
    route: '/health',
  },
  {
    id: 'nav-tab-bond',
    page: 'home',
    targetId: 'nav-tab-bond',
    message: "5. Relationship: Track your Affinity XP, milestones, and bonding activities as you grow together.",
    route: '/bond',
  },
  {
    id: 'nav-tab-rewards',
    page: 'home',
    targetId: 'nav-tab-rewards',
    message: "6. Rewards: Redeem your PAW Points in the Rewards store for special treats and exclusive perks!",
    route: '/rewards',
  },
  {
    id: 'nav-tab-care',
    page: 'home',
    targetId: 'nav-tab-care',
    message: "7. CARE: Tap this central floating Paw button anytime for instant 1-tap food, water, and walk logging on the go!",
    route: '/home',
  },
];
