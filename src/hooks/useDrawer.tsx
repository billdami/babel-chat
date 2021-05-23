import React, { FC, createContext, useCallback, useContext, useState } from 'react';

interface DrawerContext {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const drawerContext = createContext<DrawerContext>({
  isDrawerOpen: false,
  toggleDrawer: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
});

const useProvideDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = useCallback(() => setIsDrawerOpen(!isDrawerOpen), [isDrawerOpen]);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return {
    isDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };
};

export const ProvideDrawer: FC<{}> = ({ children }) => {
  const drawer = useProvideDrawer();
  return <drawerContext.Provider value={drawer}>{children}</drawerContext.Provider>;
};

const useDrawer = () => {
  return useContext(drawerContext);
};

export default useDrawer;
