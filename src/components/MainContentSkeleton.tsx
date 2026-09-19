import React from 'react';
import { motion } from 'motion/react';

interface MainContentSkeletonProps {
  route?: string;
}

function SkeletonPulse({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden bg-[var(--primary)]/10 rounded-2xl animate-pulse ${className}`}
      style={style}
    />
  );
}

export function MainContentSkeleton({ route = '/home' }: MainContentSkeletonProps) {
  // Determine layout archetype based on route
  const isHome = route === '/home' || route === '/';
  const isFeed = route === '/feed' || route.startsWith('/care');
  const isHealth = route === '/health' || route === '/records' || route === '/emergency';
  const isBond = route.startsWith('/relationship') || route === '/bond' || route === '/memories' || route === '/family';
  const isBadges = route === '/badges' || route === '/achievements';
  const isRewards = route.startsWith('/rewards') || route.startsWith('/store');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full space-y-4 select-none pointer-events-none"
      aria-label="Loading content"
      role="status"
    >
      {/* 1. HOME VIEW SKELETON */}
      {isHome && (
        <>
          {/* Quick Action Navigation Pills Skeleton */}
          <div className="flex gap-2 overflow-hidden py-1">
            <SkeletonPulse className="h-8 w-24 rounded-xl shrink-0" />
            <SkeletonPulse className="h-8 w-28 rounded-xl shrink-0" />
            <SkeletonPulse className="h-8 w-32 rounded-xl shrink-0" />
            <SkeletonPulse className="h-8 w-28 rounded-xl shrink-0" />
          </div>

          {/* Pet ID & Care Card Skeleton */}
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <SkeletonPulse className="w-16 h-16 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <SkeletonPulse className="h-5 w-28 rounded-lg" />
                  <SkeletonPulse className="h-5 w-16 rounded-full" />
                </div>
                <SkeletonPulse className="h-3.5 w-40 rounded-md" />
              </div>
            </div>

            {/* Vital Care Metric Progress Bars */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--primary)]/5">
              <div className="space-y-1.5 p-2 rounded-2xl bg-[var(--primary)]/5">
                <SkeletonPulse className="h-3 w-12 rounded" />
                <SkeletonPulse className="h-2 w-full rounded-full" />
              </div>
              <div className="space-y-1.5 p-2 rounded-2xl bg-orange-50/40">
                <SkeletonPulse className="h-3 w-12 rounded" />
                <SkeletonPulse className="h-2 w-full rounded-full" />
              </div>
              <div className="space-y-1.5 p-2 rounded-2xl bg-orange-50/40">
                <SkeletonPulse className="h-3 w-12 rounded" />
                <SkeletonPulse className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>

          {/* Daily Streak Card Skeleton */}
          <div className="p-4 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-10 h-10 rounded-2xl shrink-0" />
              <div className="space-y-1.5">
                <SkeletonPulse className="h-4 w-32 rounded-md" />
                <SkeletonPulse className="h-3 w-20 rounded" />
              </div>
            </div>
            <SkeletonPulse className="h-8 w-24 rounded-full" />
          </div>

          {/* Routine Daily Tasks Skeleton */}
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between mb-2">
              <SkeletonPulse className="h-4 w-28 rounded-md" />
              <SkeletonPulse className="h-3.5 w-14 rounded-full" />
            </div>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/10"
              >
                <div className="flex items-center gap-3">
                  <SkeletonPulse className="w-5 h-5 rounded-lg shrink-0" />
                  <SkeletonPulse className="h-3.5 w-36 rounded-md" />
                </div>
                <SkeletonPulse className="h-4 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 2. FEED & CARE VIEW SKELETON */}
      {isFeed && (
        <>
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonPulse className="h-5 w-36 rounded-md" />
              <SkeletonPulse className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2.5">
              <SkeletonPulse className="h-3 w-full rounded-full" />
              <SkeletonPulse className="h-3 w-4/5 rounded-full" />
              <SkeletonPulse className="h-3 w-3/4 rounded-full" />
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs flex flex-col items-center space-y-2"
              >
                <SkeletonPulse className="w-12 h-12 rounded-2xl" />
                <SkeletonPulse className="h-4 w-20 rounded-md" />
                <SkeletonPulse className="h-3 w-14 rounded" />
              </div>
            ))}
          </div>

          {/* Feeding Log Card */}
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-3">
            <SkeletonPulse className="h-4 w-32 rounded-md" />
            <SkeletonPulse className="h-12 w-full rounded-2xl" />
            <SkeletonPulse className="h-12 w-full rounded-2xl" />
          </div>
        </>
      )}

      {/* 3. HEALTH & RECORDS VIEW SKELETON */}
      {isHealth && (
        <>
          {/* Health Score Overview */}
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonPulse className="h-5 w-32 rounded-md" />
              <SkeletonPulse className="h-3 w-44 rounded" />
              <SkeletonPulse className="h-6 w-24 rounded-full" />
            </div>
            <SkeletonPulse className="w-20 h-20 rounded-full shrink-0" />
          </div>

          {/* Vaccine Checklist */}
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between mb-1">
              <SkeletonPulse className="h-4 w-36 rounded-md" />
              <SkeletonPulse className="h-4 w-16 rounded-full" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/10 flex items-center justify-between"
              >
                <div className="space-y-1.5">
                  <SkeletonPulse className="h-3.5 w-28 rounded" />
                  <SkeletonPulse className="h-2.5 w-20 rounded" />
                </div>
                <SkeletonPulse className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 4. BOND & RELATIONSHIP VIEW SKELETON */}
      {isBond && (
        <>
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <SkeletonPulse className="h-5 w-32 rounded-md" />
                <SkeletonPulse className="h-3 w-40 rounded" />
              </div>
            </div>
            <SkeletonPulse className="h-2.5 w-full rounded-full" />
          </div>

          {/* Memories 2x2 Photo Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs p-2 flex flex-col justify-end"
              >
                <SkeletonPulse className="w-full h-full rounded-2xl" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 5. BADGES & ACHIEVEMENTS VIEW SKELETON */}
      {isBadges && (
        <>
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-2">
            <SkeletonPulse className="h-5 w-40 rounded-md" />
            <SkeletonPulse className="h-3.5 w-56 rounded" />
            <SkeletonPulse className="h-3 w-full rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs flex flex-col items-center space-y-2"
              >
                <SkeletonPulse className="w-12 h-12 rounded-full" />
                <SkeletonPulse className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 6. REWARDS & STORE VIEW SKELETON */}
      {isRewards && (
        <>
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-28 rounded-md" />
              <SkeletonPulse className="h-7 w-32 rounded-lg" />
            </div>
            <SkeletonPulse className="h-9 w-24 rounded-2xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-2.5"
              >
                <SkeletonPulse className="w-full h-28 rounded-2xl" />
                <SkeletonPulse className="h-4 w-24 rounded-md" />
                <div className="flex items-center justify-between pt-1">
                  <SkeletonPulse className="h-4 w-12 rounded" />
                  <SkeletonPulse className="h-7 w-16 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 7. GENERIC FALLBACK FOR SUB-PAGES */}
      {!isHome && !isFeed && !isHealth && !isBond && !isBadges && !isRewards && (
        <>
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-3">
            <SkeletonPulse className="h-5 w-44 rounded-md" />
            <SkeletonPulse className="h-3.5 w-64 rounded" />
            <SkeletonPulse className="h-20 w-full rounded-2xl mt-2" />
          </div>
          <div className="p-5 rounded-3xl bg-white/90 border border-[var(--primary)]/10 shadow-xs space-y-3">
            <SkeletonPulse className="h-4 w-36 rounded-md" />
            <SkeletonPulse className="h-10 w-full rounded-xl" />
            <SkeletonPulse className="h-10 w-full rounded-xl" />
          </div>
        </>
      )}
    </motion.div>
  );
}
