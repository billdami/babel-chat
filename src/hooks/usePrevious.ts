import { useEffect, useRef } from 'react';

/**
 * Convenience hook and synatic sugar that allows using
 * and comparing against the previous value of a prop or state
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * @param value T
 * @returns T
 */
const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;
