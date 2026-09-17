import { useState, useEffect, useCallback } from 'react';

export interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
  found: boolean;
}

export function useElementPosition(targetId: string): ElementPosition {
  const [position, setPosition] = useState<ElementPosition>({
    top: 120,
    left: 20,
    width: 320,
    height: 180,
    bottom: 300,
    right: 340,
    found: false,
  });

  const updatePosition = useCallback(() => {
    if (!targetId) return;
    const element = document.getElementById(targetId);

    if (element) {
      const rect = element.getBoundingClientRect();
      // Scroll into view if element is off screen
      if (rect.top < 60 || rect.bottom > window.innerHeight - 80) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const currentRect = element.getBoundingClientRect();
      setPosition({
        top: Math.round(currentRect.top),
        left: Math.round(currentRect.left),
        width: Math.round(currentRect.width),
        height: Math.round(currentRect.height),
        bottom: Math.round(currentRect.bottom),
        right: Math.round(currentRect.right),
        found: true,
      });
    } else {
      const fallbackWidth = Math.min(360, window.innerWidth - 32);
      const fallbackLeft = Math.max(16, (window.innerWidth - fallbackWidth) / 2);
      setPosition({
        top: 140,
        left: fallbackLeft,
        width: fallbackWidth,
        height: 160,
        bottom: 300,
        right: fallbackLeft + fallbackWidth,
        found: false,
      });
    }
  }, [targetId]);

  useEffect(() => {
    updatePosition();
    const handleScrollOrResize = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    // Continuous smooth sync interval for zero-delay tracking during animations/scroll
    const syncInterval = setInterval(updatePosition, 30);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [targetId, updatePosition]);

  return position;
}
