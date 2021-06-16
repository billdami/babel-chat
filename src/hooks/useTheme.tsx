import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { lsGet, lsSet } from '../utils/localStorage';

const queryList = window.matchMedia('(prefers-color-scheme: dark)');

type Theme = 'light' | 'dark';
type ThemePref = Theme | null | undefined;

interface ThemeContext {
  theme: Theme;
  isDarkTheme: boolean;
  updateTheme: (newTheme: Theme, savePref: boolean) => void;
}

const getMatchedTheme = (q: MediaQueryList | MediaQueryListEvent): Theme =>
  q.matches ? 'dark' : 'light';

export const applyTheme = (theme: Theme, savePref: boolean = false) => {
  document.documentElement.classList[theme === 'dark' ? 'add' : 'remove']('dark');
  if (savePref) {
    lsSet('theme', theme);
  }
};

export const getTheme = () => {
  // initialize the theme by first checking localStorage,
  // and if no pref is saved fall back to the OS's pref
  const themePref = lsGet<ThemePref>('theme');
  return themePref || getMatchedTheme(queryList);
};

export const initializeTheme = () => {
  return applyTheme(getTheme(), false);
};

const initTheme = getTheme();

const themeContext = createContext<ThemeContext>({
  theme: initTheme,
  isDarkTheme: initTheme === 'dark',
  updateTheme: () => {},
});

const useProvideTheme = (): ThemeContext => {
  const [theme, setTheme] = useState<Theme>(getTheme());

  const isDarkTheme = useMemo(() => theme === 'dark', [theme]);

  const updateTheme = useCallback((newTheme: Theme, savePref: boolean = false) => {
    setTheme(newTheme);
    applyTheme(newTheme, savePref);
  }, []);

  const listener = useCallback(
    (event: MediaQueryListEvent) => updateTheme(getMatchedTheme(event)),
    [updateTheme]
  );

  queryList.addEventListener('change', listener);

  useEffect(
    () => () => queryList.removeEventListener('change', listener),
    // only run on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { theme, isDarkTheme, updateTheme };
};

export const ProvideTheme: FC<{}> = ({ children }) => {
  const media = useProvideTheme();
  return <themeContext.Provider value={media}>{children}</themeContext.Provider>;
};

const useTheme = () => {
  return useContext(themeContext);
};

export default useTheme;
