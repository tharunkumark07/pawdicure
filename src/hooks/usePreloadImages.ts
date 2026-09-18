import { useState, useEffect } from 'react';

export function usePreloadImages(imageUrls: string[]): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const total = imageUrls.length;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;

      const handleLoad = () => {
        // Use decode if available for smooth GPU rasterization before render
        if ('decode' in img) {
          img.decode().catch(() => {}).finally(() => {
            if (!isMounted) return;
            loadedCount++;
            if (loadedCount === total) {
              setIsLoaded(true);
            }
          });
        } else {
          if (!isMounted) return;
          loadedCount++;
          if (loadedCount === total) {
            setIsLoaded(true);
          }
        }
      };

      const handleError = () => {
        if (!isMounted) return;
        loadedCount++;
        if (loadedCount === total) {
          setIsLoaded(true);
        }
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.onload = handleLoad;
        img.onerror = handleError;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imageUrls.join(',')]);

  return isLoaded;
}
