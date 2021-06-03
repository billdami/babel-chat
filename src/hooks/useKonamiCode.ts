import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const KONAMI_CODE =
  'ARROWUP ARROWUP ARROWDOWN ARROWDOWN ARROWLEFT ARROWRIGHT ARROWLEFT ARROWRIGHT B A ENTER';

// @see https://dev.to/gabe_ragland/how-to-create-a-usekonamicode-react-hook-259a
const useKonamiCode = (handler: () => void) => {
  const timeout = useRef<number>();
  const [keys, setKeys] = useState<string[]>([]);
  const isKonamiCode = useMemo(() => keys.join(' ').toUpperCase() === KONAMI_CODE, [keys]);

  const listener = useCallback((e) => {
    // Update array of keys in state with new key
    setKeys((currentKeys) => [...currentKeys, e.key]);
    // Clear 1s timeout since key was just pressed
    window.clearTimeout(timeout.current);
    // Reset keys if 1s passes so user can try again
    timeout.current = window.setTimeout(() => setKeys([]), 1000);
  }, []);

  useEffect(() => {
    // When a key is pressed
    window.document.addEventListener('keydown', listener);
    return () => window.document.removeEventListener('keydown', listener);
  }, [listener]);

  // Once konami code is entered call handler function
  // and reset keys so user can do it again
  useEffect(() => {
    if (isKonamiCode) {
      handler();
      setKeys([]);
    }
  }, [isKonamiCode, handler]);

  return isKonamiCode;
};

export default useKonamiCode;
