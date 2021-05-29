import { useCallback, useEffect, useState } from 'react';

import { MOBILE_MAX_WIDTH } from '../constants/app';

const queryList = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

// TODO if this ends up being used in too many places,
// create a <ProvideMedia> context to have single listener

/**
 * Returns true if the current viewport width is considered a mobile device
 *
 * Usage:
 * ```
 * const isMobile = useIsMobile()
 *
 * return isMobile ?
 *  (
 *    <div>mobile only</div>
 *  ) : (
 *    <div>desktop only</div>
 *  );
 * ```
 *
 * @returns boolean
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(queryList.matches);

  const listener = useCallback((event: MediaQueryListEvent) => setIsMobile(event.matches), []);

  queryList.addEventListener('change', listener);

  useEffect(
    () => () => queryList.removeEventListener('change', listener),
    // only run on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return isMobile;
};

export default useIsMobile;
