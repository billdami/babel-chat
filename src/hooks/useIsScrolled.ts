import { useState, UIEvent as ReactUIEvent, RefObject } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useIsScrolled = (container?: RefObject<HTMLDivElement | null>) => {
  const [isScrolled, setIsScrolled] = useState<boolean>((container?.current?.scrollTop ?? 0) > 0);

  const onScroll = useDebouncedCallback((event: ReactUIEvent<HTMLDivElement, UIEvent>) => {
    setIsScrolled((container?.current?.scrollTop ?? 0) > 0);
  }, 100);

  return {
    isScrolled,
    onScroll,
  };
};

export default useIsScrolled;
