import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { petGuideService } from '../services/petGuideService';
import { GUIDE_STEPS } from '../data/guideSteps';
import { safeStorage } from '../lib/safeStorage';

export const usePetGuide = () => {
  const { userId, navigate } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    const localCompleted = safeStorage.getItem('pawdicure_guide_completed');
    const localSkipped = safeStorage.getItem('pawdicure_guide_skipped');
    return !localCompleted && !localSkipped;
  });
  const [characterId, setCharacterId] = useState('dog');

  const currentStep = GUIDE_STEPS[currentStepIndex];

  useEffect(() => {
    const checkGuideStatus = async () => {
      if (userId) {
        try {
          const progress = await petGuideService.getGuideProgress(userId, 'home-tour');
          if (progress && (progress.completed || progress.skipped)) {
            setIsVisible(false);
            safeStorage.setItem('pawdicure_guide_completed', 'true');
          } else {
            const localCompleted = safeStorage.getItem('pawdicure_guide_completed');
            const localSkipped = safeStorage.getItem('pawdicure_guide_skipped');
            if (localCompleted || localSkipped) {
              setIsVisible(false);
              await petGuideService.updateGuideProgress(userId, 'home-tour', { completed: true });
            }
          }
        } catch (err) {
          console.info("[Guide] Skipping remote guide sync, falling back to local state.");
        }
      }
    };
    checkGuideStatus();
  }, [userId]);

  const handleNext = () => {
    if (currentStepIndex < GUIDE_STEPS.length - 1) {
      const nextStepIndex = currentStepIndex + 1;
      const nextStep = GUIDE_STEPS[nextStepIndex];
      
      if (nextStep.route) {
        navigate(nextStep.route);
      }
      setCurrentStepIndex(nextStepIndex);
    } else {
      setIsVisible(false);
      safeStorage.setItem('pawdicure_guide_completed', 'true');
      if (userId) petGuideService.updateGuideProgress(userId, 'home-tour', { completed: true, currentStep: GUIDE_STEPS.length - 1 });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStepIndex = currentStepIndex - 1;
      const prevStep = GUIDE_STEPS[prevStepIndex];
      if (prevStep.route) navigate(prevStep.route);
      setCurrentStepIndex(prevStepIndex);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    safeStorage.setItem('pawdicure_guide_skipped', 'true');
    if (userId) petGuideService.updateGuideProgress(userId, 'home-tour', { skipped: true });
  };

  const restartGuide = (charId?: string) => {
    if (charId) setCharacterId(charId);
    setCurrentStepIndex(0);
    setIsVisible(true);
    navigate('/home');
  };

  return {
    isVisible,
    currentStep: currentStepIndex,
    totalSteps: GUIDE_STEPS.length,
    step: currentStep,
    handleNext,
    handleBack,
    handleSkip,
    restartGuide,
    characterId,
    setCharacterId
  };
};

