import { useCallback, useEffect, useState } from 'react';

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
  let observer: IntersectionObserver | undefined;

  const listener = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  }, []);

  try {
    observer = new IntersectionObserver(listener, {});

    if (target) {
      observer.observe(target);
    }
  } catch (err) {
    // silently fail if IntersectionObserver isn't available
  }

  useEffect(
    () => () => observer?.disconnect(),
    // only run on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return isVisible;
};

export default useIsVisible;
