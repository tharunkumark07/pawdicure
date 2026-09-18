export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    const isEnabled = localStorage.getItem('pawdicure_haptics_enabled') !== 'false';
    if (!isEnabled) return;

    switch (type) {
      case 'light':
        window.navigator.vibrate(10);
        break;
      case 'medium':
        window.navigator.vibrate(25);
        break;
      case 'heavy':
        window.navigator.vibrate(50);
        break;
      default:
        window.navigator.vibrate(10);
    }
  }
};
