import React, { FC, useCallback } from 'react';

import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
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
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 bg-green-500 text-white md:hidden">
        <Button
          onClick={toggleDrawer}
          variant="inverse"
          className="relative mr-2 md:hidden"
          outline
        >
          ☰
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
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold">Welcome to babel chat!</h2>
          <p>
            Logged in as{' '}
            {!!user && (
              <>
                <span className="font-bold">{user.nickname}</span>
                <span className="text-gray-400 tracking-tighter">#{user.uuid}</span>
              </>
            )}
          </p>
          <p className="mb-4">
            [TODO] main page content (newest users, view all users link, recent chats, view all
            chats link, tips/help, etc)
          </p>
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
    </div>
  );
};

export default Index;
