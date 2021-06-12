import React, { FC, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
import DialogConfirm from '../../../components/DialogConfirm';
import DialogFeedback from '../../../components/DialogFeedback';
import Icon from '../../../components/Icon';
import useAuth from '../../../hooks/useAuth';
import useDrawer from '../../../hooks/useDrawer';
import useNotifications from '../../../hooks/useNotifications';

import Footer from './components/Footer';
import Hero from './components/Hero';
import LatestChats from './components/LatestChats';
import NewestUsers from './components/NewestUsers';
import QuickActions from './components/QuickActions';
import TipsAndTricks from './components/TipsAndTricks';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { signOut } = useAuth();

  const { openDrawer, toggleDrawer, updateTab } = useDrawer();
  const { numUnread } = useNotifications();

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
    <div className="Index flex flex-col flex-1">
      <Helmet>
        <title>Dashboard | babel chat</title>
      </Helmet>
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-3 min-h-navbar bg-green-500 text-white">
        <Button
          onClick={toggleDrawer}
          variant="inverse"
          className="relative mr-2 md:hidden"
          outline
        >
          <Icon name="bars" size="sm" className="inline-block" />
          {!!numUnread && (
            <Badge
              className="absolute -right-1 -top-1"
              tooltip={
                numUnread
                  ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
                  : ''
              }
            />
          )}
        </Button>
        {/* TODO [future] dark mode switch and mute toggle in (right aligned in navbar) */}
      </div>
      <div className="flex-1 flex overflow-y-auto">
        <div className="flex-1 flex flex-col">
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
  );
};

export default Index;
