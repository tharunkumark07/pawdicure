import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { MainContentSkeleton } from './MainContentSkeleton';
import { PawLogo } from './PawLogo';

const LOADING_MESSAGES = [
  "Getting {name}'s day ready…",
  "Checking vitals for {name}…",
  "Tidying up {name}'s play space…",
  "Reviewing {name}'s nutritional needs…",
  "Polishing {name}'s achievements…",
  "Synchronizing heartbeats…",
  "Loading the love for {name}…",
  "Preparing the treats cabinet…",
  "Scanning the neighborhood for sniffs…",
  "Optimizing {name}'s nap schedule…"
];

interface PAWdiCURELoadingProps {
  route?: string;
  message?: string;
  fullscreen?: boolean;
}

export const PAWdiCURELoading: React.FC<PAWdiCURELoadingProps> = ({ route, message, fullscreen = true }) => {
  const { activePet } = useApp();
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const petName = activePet?.name || "your pet";
    const baseMessage = message || LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    setCurrentMessage(baseMessage.replace("{name}", petName));
    
    // Cycle messages every 2.5 seconds if loading is long
    const interval = setInterval(() => {
      if (message) return; // Don't cycle if a specific message is provided
      const nextMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      setCurrentMessage(nextMessage.replace("{name}", petName));
    }, 2500);

    return () => clearInterval(interval);
  }, [activePet, message]);

  const content = (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full flex flex-col items-center justify-center p-4 relative overflow-hidden ${fullscreen ? 'min-h-[60vh]' : ''}`}
    >
      {/* Background Skeleton - Blurred to maintain focus on the message but show structure */}
      <div className="w-full max-w-lg opacity-40 filter blur-[2px] select-none pointer-events-none">
         <MainContentSkeleton route={route} />
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col items-center gap-6 max-w-[280px] text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="w-14 h-14 text-[var(--primary)]"
          >
            <PawLogo className="w-full h-full" />
          </motion.div>
          
          <div className="h-14 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-slate-900 font-heading font-black text-lg leading-tight"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-full bg-[var(--card-border)] h-1.5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-[var(--primary)] w-1/3 rounded-full shadow-[0_0_8px_var(--primary)]"
              animate={{ left: ["-33%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[var(--background)] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
