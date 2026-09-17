import React from 'react';
import { motion } from 'motion/react';
import { useElementPosition } from '../../hooks/useElementPosition';

interface PetGuideSpotlightProps {
  targetId: string;
}

export function PetGuideSpotlight({ targetId }: PetGuideSpotlightProps) {
  const position = useElementPosition(targetId);

  // Padding around target element
  const pad = 6;
  const left = Math.max(0, position.left - pad);
  const top = Math.max(0, position.top - pad);
  const width = position.width + pad * 2;
  const height = position.height + pad * 2;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* SVG Mask with Rounded Rectangular Cutout Hole */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="spotlight-rounded-mask">
            {/* White covers entire screen */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout with rounded corners matching the target shape */}
            {position.found && (
              <rect
                x={left}
                y={top}
                width={width}
                height={height}
                rx="20"
                ry="20"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dark dimming overlay masked with rounded cutout */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.78)"
          mask="url(#spotlight-rounded-mask)"
        />
      </svg>

      {/* Glowing active spotlight border around the target UI element with rounded corners */}
      {position.found && (
        <motion.div
          key={targetId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            boxShadow: [
              '0 0 16px rgba(255, 107, 74, 0.7), inset 0 0 12px rgba(255, 107, 74, 0.3)',
              '0 0 32px rgba(255, 140, 50, 0.95), inset 0 0 18px rgba(255, 140, 50, 0.5)',
              '0 0 16px rgba(255, 107, 74, 0.7), inset 0 0 12px rgba(255, 107, 74, 0.3)',
            ],
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            duration: 0.3,
          }}
          className="absolute rounded-[20px] border-3 border-orange-400 pointer-events-none z-50"
          style={{
            top,
            left,
            width,
            height,
          }}
        />
      )}
    </div>
  );
}
