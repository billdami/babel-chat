import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns true if the given element is visible in the viewport
 *
 * Usage:
 * ```
 * const elementRef = useRef<HTMLDivElement>(null)
 * const isVisible = useIsVisible(elementRef.current)
 *
 * useEffect(() => {
 *     console.log('am i visible?', isVisible)
 * }, [isVisible])
 *
 * return (<div ref={elementRef}></div>)
 * ```
 * @param target HTMLElement | null
 * @returns boolean
 */
const useIsVisible = (target: HTMLElement | null) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | undefined>();

  const listener = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  }, []);

  useEffect(() => {
    try {
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(listener, {});

      if (target) {
        observerRef.current.observe(target);
      }
    } catch (err) {
      // silently fail if IntersectionObserver isn't available
    }

    return () => observerRef.current?.disconnect();
  }, [target, listener]);

  return isVisible;
};

export default useIsVisible;
