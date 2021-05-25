import { useEffect, useRef, useState } from 'react';

export const pageIsVisible = () => document.visibilityState === 'visible';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
 * @param callback Function optional callback, called when the visibility state changes
 * @returns boolean whether or not the page is currently visible
 */
const usePageVisibility = (callback?: (isVisible: boolean) => void): boolean => {
  const callbackRef = useRef<(isVisible: boolean) => void>();

  const [isVisible, setIsVisible] = useState<boolean>(pageIsVisible());

  // remember the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // set up the listener
  useEffect(() => {
    const listener = () => {
      setIsVisible(pageIsVisible());
      callbackRef.current?.(pageIsVisible());
    };

    document.addEventListener('visibilitychange', listener);

    // remove listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', listener);
    };
  }, []);

  return isVisible;
};

export default usePageVisibility;
