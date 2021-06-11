import React, { FC, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Badge from '../../../components/Badge';
import BetaBadge from '../../../components/BetaBadge';
import Button from '../../../components/Button';
import DialogConfirm from '../../../components/DialogConfirm';
import DialogFeedback from '../../../components/DialogFeedback';
import Icon from '../../../components/Icon';
import Link from '../../../components/Link';
import LogoIcon from '../../../components/Svgs/Logos/Icon';
import UserNickname from '../../../components/UserNickname';
import { copyrightLine } from '../../../constants/app';
import useAuth from '../../../hooks/useAuth';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useDrawer from '../../../hooks/useDrawer';
import useNotifications from '../../../hooks/useNotifications';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { signOut } = useAuth();
  const { user } = useCurrentUser();
  const { openDrawer, toggleDrawer, updateTab } = useDrawer();
  const { numUnread } = useNotifications();

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<boolean>(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState<boolean>(false);

  const openGiveFeedback = useCallback(() => {
    setIsFeedbackDialogOpen(true);
  }, []);

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

  const showAllUsers = useCallback(() => {
    openDrawer();
    updateTab('tab-users');
    // TODO focus on users list search input
  }, [openDrawer, updateTab]);

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
          <div className="flex-1">
            <div>
              <div className="mx-4 mt-4 mb-6 py-4 pr-8 bg-gradient-to-l from-green-200 rounded-r-lg">
                <div className="text-right text-sm">
                  Signed in as {!!user && <UserNickname user={user} className="inline" />} (
                  <Button variant="link" size="sm" onClick={openConfirmSignOut} inline>
                    Sign out
                  </Button>
                  )
                </div>
                <div className="relative flex justify-end py-4">
                  {/* TODO subtle looping floating animation w/CSS animations */}
                  <LogoIcon className="h-40 opacity-50" />
                  <div className="absolute inset-0 py-8">
                    <h1 className="text-4xl font-light mb-2">
                      <span className="relative">
                        Welcome to <span className="font-normal text-gray-600">babel</span>{' '}
                        <span className="font-normal text-green-500">chat</span>
                        <BetaBadge className="-top-1 -right-8" target="_blank" small />
                      </span>
                    </h1>
                    <h2 className="text-lg text-gray-500 mb-6">
                      Meet and chat with people from around the world.
                    </h2>
                    <Button variant="primary" size="md" onClick={showAllUsers}>
                      <Icon name="magnifying-glass" size="sm" className="inline-block" /> Search
                      users
                    </Button>
                  </div>
                </div>
              </div>
              {/* 2nd row */}
              <div className="flex px-2">
                <div className="w-1/3">
                  <div className="px-2 mb-4">
                    <h3 className="text-xl text-gray-600">New here?</h3>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="px-2 mb-4">
                    <h3 className="text-xl text-gray-600">Heading 2</h3>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="px-2 mb-4">
                    <h3 className="text-xl text-gray-600">Heading 3</h3>
                  </div>
                </div>
              </div>
              {/* 3rd row */}
              <div className="flex p-4 mx-4 bg-gray-50 rounded">
                <div className="w-1/2">
                  <div className="px-2">
                    <h3 className="">Newest users</h3>
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="px-2">
                    <h3 className="">Latest chats</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 px-4 py-4 text-sm text-gray-400">
            {copyrightLine} <span className="hidden md:inline">&bull;</span>{' '}
            <span className="block md:inline">
              <Link to="/privacy-policy" target="_blank">
                privacy policy
              </Link>{' '}
              &bull;{' '}
              <Link to="/terms-of-use" target="_blank">
                terms of use
              </Link>
            </span>
          </div>
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
