import { useState, useEffect } from 'react';
import { pageTransitionEvent } from '@/components/motion/events';

/**
 * Hook to handle page exit animations.
 * Listens for the 'exit' event triggered by TransitionLink and sets isExiting to true.
 * Resolves the transition promise after the specified duration.
 * 
 * @param duration Duration of the exit animation in milliseconds
 * @returns boolean isExiting
 */
export function usePageExit(duration: number = 600) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleExit = (e: any) => {
      setIsExiting(true);
      
      // Delay resolving the promise until the animation is complete
      const timeout = setTimeout(() => {
        if (e.detail && typeof e.detail.resolve === 'function') {
          e.detail.resolve();
        }
      }, duration);

      return () => clearTimeout(timeout);
    };

    pageTransitionEvent.addEventListener('exit', handleExit as EventListener);
    return () => {
      pageTransitionEvent.removeEventListener('exit', handleExit as EventListener);
    };
  }, [duration]);

  return isExiting;
}
