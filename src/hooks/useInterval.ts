import { useEffect, useRef } from 'react';

/**
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback Function
 * @param delay number | null | undefined
 */
const useInterval = (callback: Function, delay?: number | null) => {
  const callbackRef = useRef<Function>();

  // remember the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // set up the interval
  useEffect(() => {
    function tick() {
      callbackRef.current?.();
    }

    if (delay !== null && delay !== undefined) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
