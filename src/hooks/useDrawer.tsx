import React, { FC, createContext, useCallback, useContext, useState } from 'react';

export type DrawerTab = 'tab-users' | 'tab-chats';

interface DrawerContext {
  isDrawerOpen: boolean;
  activeTab: DrawerTab;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  updateTab: (tab: DrawerTab) => void;
}

const drawerContext = createContext<DrawerContext>({
  isDrawerOpen: false,
  activeTab: 'tab-users',
  toggleDrawer: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
  updateTab: (tab: DrawerTab) => {},
});

const useProvideDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>('tab-users');

  const toggleDrawer = useCallback(() => setIsDrawerOpen(!isDrawerOpen), [isDrawerOpen]);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const updateTab = useCallback((tab: DrawerTab) => setActiveTab(tab), []);

  return {
    isDrawerOpen,
    activeTab,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    updateTab,
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
