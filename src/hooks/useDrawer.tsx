import React, { FC, createContext, useCallback, useContext, useState } from 'react';

export type DrawerTab = 'tab-users' | 'tab-chats';

interface DrawerContext {
  isDrawerOpen: boolean;
  isDrawerDragging: boolean;
  isDrawerDragEnabled: boolean;
  activeTab: DrawerTab;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  updateDrawerDragging: (drag: boolean) => void;
  toggleDrawerDrag: (enabled: boolean) => void;
  updateTab: (tab: DrawerTab) => void;
}

const drawerContext = createContext<DrawerContext>({
  isDrawerOpen: false,
  isDrawerDragging: false,
  isDrawerDragEnabled: true,
  activeTab: 'tab-users',
  toggleDrawer: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
  updateDrawerDragging: () => {},
  toggleDrawerDrag: () => {},
  updateTab: (tab: DrawerTab) => {},
});

const useProvideDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDrawerDragging, setIsDrawerDragging] = useState<boolean>(false);
  const [isDrawerDragEnabled, setIsDrawerDragEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<DrawerTab>('tab-users');

  const toggleDrawer = useCallback(() => setIsDrawerOpen(!isDrawerOpen), [isDrawerOpen]);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const updateTab = useCallback((tab: DrawerTab) => setActiveTab(tab), []);
  const updateDrawerDragging = useCallback((drag: boolean) => setIsDrawerDragging(drag), []);
  const toggleDrawerDrag = useCallback((drag: boolean) => setIsDrawerDragEnabled(drag), []);

  return {
    isDrawerOpen,
    isDrawerDragging,
    isDrawerDragEnabled,
    activeTab,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    updateDrawerDragging,
    toggleDrawerDrag,
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
