import React, { FC, useCallback } from 'react';

import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Link from '../../../components/Link';
import UserNickname from '../../../components/UserNickname';
import { copyrightLine } from '../../../constants/app';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useDrawer from '../../../hooks/useDrawer';
import useNotifications from '../../../hooks/useNotifications';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { user } = useCurrentUser();
  const { openDrawer, toggleDrawer, updateTab } = useDrawer();
  const { numUnread } = useNotifications();

  const showAllUsers = useCallback(() => {
    openDrawer();
    updateTab('tab-users');
  }, [openDrawer, updateTab]);

  const showAllChats = useCallback(() => {
    openDrawer();
    updateTab('tab-chats');
  }, [openDrawer, updateTab]);

  return (
    <div className="Index flex flex-col flex-1">
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
            <div className="p-4">
              {/*
                TODO real content:
                  - heading
                  - logged in as details
                  - general info / caution blurb ('give us feeback' link)
                  - last 5 newest users (view all link)
                  - last 5 most recently active chats (view all link)
              */}
              <h2 className="text-lg font-bold">Welcome to babel chat!</h2>
              <div className="mb-4">
                Logged in as {!!user && <UserNickname user={user} className="inline" />}
              </div>
              <div className="mb-4">
                <Button variant="secondary" className="md:hidden" onClick={showAllUsers} outline>
                  View all users
                </Button>
              </div>
              <div className="mb-4">
                <Button variant="secondary" className="md:hidden" onClick={showAllChats} outline>
                  View all chats
                </Button>
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
    </div>
  );
};

export default Index;
