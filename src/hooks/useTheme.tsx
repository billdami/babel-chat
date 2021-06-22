import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { lsGet, lsRemove, lsSet } from '../utils/localStorage';

type Theme = 'light' | 'dark';
type ThemePref = Theme | null | undefined;

interface ThemeContext {
  theme: Theme;
  isDarkTheme: boolean;
  hasLocalThemePref: boolean;
  updateTheme: (newTheme: Theme, savePref: boolean) => void;
  clearThemePref: () => void;
}

const getQueryList = () => window.matchMedia('(prefers-color-scheme: dark)');

const getMatchedTheme = (q: MediaQueryList | MediaQueryListEvent): Theme =>
  q.matches ? 'dark' : 'light';

export const applyTheme = (theme: Theme, savePref: boolean = false) => {
  document.documentElement.classList[theme === 'dark' ? 'add' : 'remove']('dark');
  if (savePref) {
    lsSet('theme', theme);
  }
};

export const clearTheme = () => {
  lsRemove('theme');
  applyTheme(getMatchedTheme(getQueryList()), false);
};

export const getTheme = () => {
  // initialize the theme by first checking localStorage,
  // and if no pref is saved fall back to the OS's pref
  const themePref = lsGet<ThemePref>('theme');
  return themePref || getMatchedTheme(getQueryList());
};

export const initializeTheme = () => {
  return applyTheme(getTheme(), false);
};

const queryList = getQueryList();
const initTheme = getTheme();

const themeContext = createContext<ThemeContext>({
  theme: initTheme,
  isDarkTheme: initTheme === 'dark',
  hasLocalThemePref: !!lsGet<ThemePref>('theme'),
  updateTheme: () => {},
  clearThemePref: () => {},
});

const useProvideTheme = (): ThemeContext => {
  const [theme, setTheme] = useState<Theme>(getTheme());
  const [hasLocalThemePref, setHasLocalThemePref] = useState<boolean>(!!lsGet<ThemePref>('theme'));

  const isDarkTheme = useMemo(() => theme === 'dark', [theme]);

  const updateTheme = useCallback(
    (newTheme: Theme, savePref: boolean = false) => {
      // if not saving the new preference (i.e. the change was from the OS level)
      // only apply it if the user doesn't have a local pref saved
      if (savePref || !hasLocalThemePref) {
        setTheme(newTheme);
        setHasLocalThemePref(savePref);
        applyTheme(newTheme, savePref);
      }
    },
    [hasLocalThemePref]
  );

  const clearThemePref = useCallback(() => {
    setTheme(getMatchedTheme(getQueryList()));
    setHasLocalThemePref(false);
    clearTheme();
  }, []);

  const listener = useCallback(
    (event: MediaQueryListEvent) => updateTheme(getMatchedTheme(event), false),
    [updateTheme]
  );

  queryList.addEventListener('change', listener);

  useEffect(
    () => () => queryList.removeEventListener('change', listener),
    // only run on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { theme, isDarkTheme, hasLocalThemePref, updateTheme, clearThemePref };
};

export const ProvideTheme: FC<{}> = ({ children }) => {
  const media = useProvideTheme();
  return <themeContext.Provider value={media}>{children}</themeContext.Provider>;
};

const useTheme = () => {
  return useContext(themeContext);
};

export default useTheme;
