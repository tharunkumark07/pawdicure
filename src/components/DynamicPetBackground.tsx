import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DynamicPetBackgroundProps {
  route: string;
}

// Configured pet silhouettes, 50% opacity background images, and decorative illustration patterns for each route
const ROUTE_PET_THEMES: Record<
  string,
  {
    petType: 'golden' | 'corgi' | 'siamese' | 'frenchie' | 'husky' | 'shiba' | 'calico';
    name: string;
    description: string;
    ambientEmoji: string;
    secondaryEmoji: string;
    bgTint: string;
    bgAccentGlow: string;
    pawPatternColor: string;
    bgImageUrl: string;
  }
> = {
  '/home': {
    petType: 'golden',
    name: 'Milo the Golden Retriever',
    description: 'Happy & Gentle Companion',
    ambientEmoji: '🐕',
    secondaryEmoji: '🦮',
    bgTint: 'from-[#fff7ed] via-[#fffaf5] to-[#fff4ea]',
    bgAccentGlow: 'bg-orange-300/15',
    pawPatternColor: 'text-orange-900/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  },
  '/feed': {
    petType: 'corgi',
    name: 'Oliver the Corgi',
    description: 'Foodie & Nutrition Champion',
    ambientEmoji: '🦊',
    secondaryEmoji: '🐶',
    bgTint: 'from-[#fff5eb] via-[#fff9f2] to-[#ffedd5]',
    bgAccentGlow: 'bg-amber-400/15',
    pawPatternColor: 'text-amber-900/5',
    bgImageUrl: 'https://images.unsplash.com/photo-1612536057862-ffa10618a5bc?auto=format&fit=crop&w=800&q=80',
  },
  '/health': {
    petType: 'siamese',
    name: 'Luna the Siamese',
    description: 'Wellness & Clinical Vitality',
    ambientEmoji: '🐈',
    secondaryEmoji: '🐱',
    bgTint: 'from-[#fff8f0] via-[#fffaf6] to-[#feeadd]',
    bgAccentGlow: 'bg-rose-300/15',
    pawPatternColor: 'text-rose-900/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  },
  '/relationship': {
    petType: 'frenchie',
    name: 'Bella the Frenchie',
    description: 'Deep Resonance & Bond',
    ambientEmoji: '🐾',
    secondaryEmoji: '🐕‍🦺',
    bgTint: 'from-[#fff6ed] via-[#fffbf7] to-[#fed7aa]/20',
    bgAccentGlow: 'bg-orange-400/15',
    pawPatternColor: 'text-orange-950/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  },
  '/bond': {
    petType: 'frenchie',
    name: 'Bella the Frenchie',
    description: 'Deep Resonance & Bond',
    ambientEmoji: '🐾',
    secondaryEmoji: '🐕‍🦺',
    bgTint: 'from-[#fff6ed] via-[#fffbf7] to-[#fed7aa]/20',
    bgAccentGlow: 'bg-orange-400/15',
    pawPatternColor: 'text-orange-950/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  },
  '/rewards': {
    petType: 'shiba',
    name: 'Kiko the Shiba Inu',
    description: 'Perks & Loyalty Hero',
    ambientEmoji: '🦊',
    secondaryEmoji: '🐕',
    bgTint: 'from-[#fff7ed] via-[#fffaf0] to-[#fde8d7]',
    bgAccentGlow: 'bg-amber-300/20',
    pawPatternColor: 'text-amber-900/5',
    bgImageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
  },
  '/store': {
    petType: 'husky',
    name: 'Ghost the Siberian Husky',
    description: 'Care Gear & Nutrition',
    ambientEmoji: '🐺',
    secondaryEmoji: '🐶',
    bgTint: 'from-[#fff8f2] via-[#fffcf9] to-[#fed7aa]/25',
    bgAccentGlow: 'bg-orange-300/15',
    pawPatternColor: 'text-orange-900/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2fea4?auto=format&fit=crop&w=800&q=80',
  },
  '/explore': {
    petType: 'corgi',
    name: 'Scout the Explorer Dog',
    description: 'Parks & Trails Adventurer',
    ambientEmoji: '🐕',
    secondaryEmoji: '🦮',
    bgTint: 'from-[#fff5eb] via-[#fffaf5] to-[#fef3c7]/20',
    bgAccentGlow: 'bg-amber-400/15',
    pawPatternColor: 'text-amber-900/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
  },
  '/pet-profile': {
    petType: 'calico',
    name: 'Mochi the Calico Cat',
    description: 'Household Royalty',
    ambientEmoji: '🐈‍⬛',
    secondaryEmoji: '🐱',
    bgTint: 'from-[#fff7ee] via-[#fffaf5] to-[#fed7aa]/25',
    bgAccentGlow: 'bg-orange-300/15',
    pawPatternColor: 'text-orange-900/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
  },
  '/notifications': {
    petType: 'golden',
    name: 'Milo Alert Mode',
    description: 'Scheduled Care Guardian',
    ambientEmoji: '🐕',
    secondaryEmoji: '🐾',
    bgTint: 'from-[#fff8f2] via-[#fffaf6] to-[#fed7aa]/20',
    bgAccentGlow: 'bg-orange-400/15',
    pawPatternColor: 'text-orange-900/4',
    bgImageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  },
};

export function DynamicPetBackground({ route }: DynamicPetBackgroundProps) {
  // Normalize path
  const normalizedRoute = Object.keys(ROUTE_PET_THEMES).find((k) =>
    route.startsWith(k)
  ) || '/home';

  const theme = ROUTE_PET_THEMES[normalizedRoute] || ROUTE_PET_THEMES['/home'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={normalizedRoute}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`absolute inset-0 bg-gradient-to-b ${theme.bgTint} transition-colors duration-500`}
        >
          {/* Ambient Warm Orange Lighting Glows */}
          <div
            className={`absolute -top-16 -right-16 w-80 h-80 rounded-full ${theme.bgAccentGlow} blur-3xl`}
          />
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-amber-200/15 blur-3xl" />
          <div className="absolute -bottom-16 right-0 w-80 h-80 rounded-full bg-orange-300/15 blur-3xl" />



          {/* Artistic Ambient Pet Silhouette / Graphic watermark in background */}
          <div className="absolute right-2 top-24 opacity-[0.045] select-none pointer-events-none">
            {theme.petType === 'golden' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-orange-950">
                <path d="M20 70 Q30 30 50 25 Q70 20 80 45 Q85 65 75 85 Q50 90 20 70 Z M70 30 Q75 15 85 25 Q80 40 70 30 Z" />
              </svg>
            )}
            {theme.petType === 'corgi' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-amber-950">
                <ellipse cx="50" cy="55" rx="35" ry="25" />
                <polygon points="25,40 30,10 45,35" />
                <polygon points="55,35 70,10 75,40" />
                <circle cx="50" cy="45" r="22" />
              </svg>
            )}
            {theme.petType === 'siamese' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-rose-950">
                <path d="M35 80 Q30 45 45 35 Q50 20 60 35 Q75 45 70 80 Z" />
                <polygon points="40,35 45,15 50,30" />
                <polygon points="55,30 60,15 65,35" />
              </svg>
            )}
            {theme.petType === 'frenchie' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-orange-950">
                <circle cx="50" cy="55" r="28" />
                <ellipse cx="30" cy="30" rx="10" ry="18" transform="rotate(-15 30 30)" />
                <ellipse cx="70" cy="30" rx="10" ry="18" transform="rotate(15 70 30)" />
              </svg>
            )}
            {theme.petType === 'shiba' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-amber-950">
                <circle cx="50" cy="50" r="28" />
                <polygon points="30,35 35,15 48,28" />
                <polygon points="52,28 65,15 70,35" />
                <path d="M70 65 Q85 55 85 75 Q75 80 65 75 Z" />
              </svg>
            )}
            {theme.petType === 'husky' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-orange-950">
                <circle cx="50" cy="52" r="30" />
                <polygon points="26,38 32,12 46,30" />
                <polygon points="54,30 68,12 74,38" />
              </svg>
            )}
            {theme.petType === 'calico' && (
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor" className="text-orange-950">
                <ellipse cx="50" cy="60" rx="30" ry="24" />
                <circle cx="50" cy="40" r="18" />
                <polygon points="36,32 40,15 48,28" />
                <polygon points="52,28 60,15 64,32" />
              </svg>
            )}
          </div>

          {/* Floating Subtle Paw Prints across the background */}
          <div className="absolute inset-0 opacity-[0.035] select-none">
            <div className="absolute top-12 left-6 text-2xl rotate-12">🐾</div>
            <div className="absolute top-48 right-8 text-xl -rotate-15">🐾</div>
            <div className="absolute top-96 left-12 text-3xl rotate-45">🐾</div>
            <div className="absolute bottom-40 right-10 text-2xl -rotate-12">🐾</div>
            <div className="absolute bottom-8 left-8 text-xl rotate-6">🐾</div>
          </div>

          {/* Ambient Route Mini-Indicator Badge (Top Right Subtlety) */}
          <div className="absolute top-18 right-3 px-2 py-0.5 rounded-full bg-orange-100/40 border border-orange-200/40 text-[9px] font-bold text-orange-800/60 backdrop-blur-xs flex items-center gap-1">
            <span>{theme.ambientEmoji}</span>
            <span>{theme.name.split(' ')[0]}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
