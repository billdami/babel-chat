import React, { FC, useCallback, useRef, useState } from 'react';

import Button from '../../../components/Button';
import DarkModeToggle from '../../../components/DarkModeToggle';
import DialogConfirm from '../../../components/DialogConfirm';
import DialogFeedback from '../../../components/DialogFeedback';
import DrawerToggleButton from '../../../components/DrawerToggleButton';
import Icon from '../../../components/Icon';
import ForceScrollable from '../../../components/ForceScrollable';
import NavBar from '../../../components/NavBar';
import NotificationHeadTags from '../../../components/NotificationHeadTags';
import ScrollShadow from '../../../components/ScrollShadow';
import useAuth from '../../../hooks/useAuth';
import useDrawer from '../../../hooks/useDrawer';
import useNotifications from '../../../hooks/useNotifications';
import useIsScrolled from '../../../hooks/useIsScrolled';

import Footer from './components/Footer';
import Hero from './components/Hero';
import LatestChats from './components/LatestChats';
import NewestUsers from './components/NewestUsers';
import QuickActions from './components/QuickActions';
import TipsAndTricks from './components/TipsAndTricks';

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const { signOut } = useAuth();
  const { openDrawer, updateTab } = useDrawer();
  const { isMuted, toggleMute } = useNotifications();
  const { isScrolled, onScroll } = useIsScrolled(scrollContainer);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<boolean>(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState<boolean>(false);

  const openConfirmSignOut = useCallback(() => {
    setIsSignOutConfirmOpen(true);
  }, []);

  const closeConfirmSignOut = useCallback(() => {
    setIsSignOutConfirmOpen(false);
  }, []);

  const confirmSignOut = useCallback(() => {
    closeConfirmSignOut();
    signOut();
  }, [closeConfirmSignOut, signOut]);

  const openAllUsers = useCallback(() => {
    openDrawer();
    updateTab('tab-users');
  }, [openDrawer, updateTab]);

  const openAllChats = useCallback(() => {
    openDrawer();
    updateTab('tab-chats');
  }, [openDrawer, updateTab]);

  const openGiveFeedback = useCallback(() => {
    setIsFeedbackDialogOpen(true);
  }, []);

  return (
    <>
      <NotificationHeadTags title="Home | babel chat" />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar>
          <DrawerToggleButton />
          <div className="flex flex-shrink-0 ml-auto">
            <DarkModeToggle
              className="text-green-200 dark:text-yellow-300"
              toggleClassName="border border-green-400 dark:border-0"
            />
            <Button onClick={() => toggleMute(!isMuted)} variant="inverse" className="ml-3" outline>
              <Icon
                name={isMuted ? 'volume-x-mark' : 'volume'}
                size="sm"
                className="inline-block"
              />
            </Button>
          </div>
        </NavBar>
        <div className="flex-1 flex relative overflow-hidden">
          <ScrollShadow isVisible={isScrolled} />
          <div
            className="relative flex-1 flex overflow-y-auto"
            ref={scrollContainer}
            onScroll={onScroll}
          >
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 2xl:flex">
                <div className="2xl:w-2/3 mx-4 mt-4">
                  <Hero openConfirmSignOut={openConfirmSignOut} />
                  <QuickActions openAllUsers={openAllUsers} openGiveFeedback={openGiveFeedback} />
                  <TipsAndTricks />
                </div>
                <div className="my-4 mr-4 ml-4 block lg:flex 2xl:block 2xl:flex-1">
                  <NewestUsers openAllUsers={openAllUsers} />
                  <LatestChats openAllChats={openAllChats} />
                </div>
              </div>
              <Footer />
            </div>
            <ForceScrollable />
          </div>
        </div>
        <DialogFeedback
          isOpen={isFeedbackDialogOpen}
          onCancel={() => setIsFeedbackDialogOpen(false)}
        />
        <DialogConfirm
          isOpen={isSignOutConfirmOpen}
          onCancel={closeConfirmSignOut}
          onConfirm={confirmSignOut}
          confirmText="Sign out"
          title="Sign out"
          icon="right-from-bracket"
          message="Are you sure you want to sign out?"
        />
      </div>
    </>
  );
};

export default Dashboard;
