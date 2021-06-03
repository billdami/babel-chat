import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';

import { MOBILE_MAX_WIDTH } from '../constants/app';

const queryList = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

interface MediaContext {
  isMobile: boolean;
}

const mediaContext = createContext<MediaContext>({
  isMobile: queryList.matches,
});

const useProvideMedia = (): MediaContext => {
  const [isMobile, setIsMobile] = useState<boolean>(queryList.matches);

  const listener = useCallback((event: MediaQueryListEvent) => setIsMobile(event.matches), []);

  queryList.addEventListener('change', listener);

  useEffect(
    () => () => queryList.removeEventListener('change', listener),
    // only run on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { isMobile };
};

export const ProvideMedia: FC<{}> = ({ children }) => {
  const media = useProvideMedia();
  return <mediaContext.Provider value={media}>{children}</mediaContext.Provider>;
};

const useMedia = () => {
  return useContext(mediaContext);
};

export default useMedia;
