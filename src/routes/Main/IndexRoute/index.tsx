import React, { FC, useCallback } from 'react';

import Button from '../../../components/Button';
import useAuth from '../../../hooks/useAuth';
import useDrawer from '../../../hooks/useDrawer';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { userRecord } = useAuth();
  const { openDrawer, toggleDrawer, updateTab } = useDrawer();

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
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 border-b border-gray-200 md:hidden">
        {/* TODO show unread notification dot here too (for mobile) */}
        <Button variant="muted" className="mr-2 md:hidden" onClick={toggleDrawer}>
          ☰
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold">Welcome to babel chat!</h2>
          <p>
            Logged in as{' '}
            {!!userRecord && (
              <>
                <span className="font-bold">{userRecord.nickname}</span>
                <span className="text-gray-400 tracking-tighter">#{userRecord.uuid}</span>
              </>
            )}
          </p>
          <p className="mb-4">
            [TODO] main page content (newest users, view all users link, recent chats, view all
            chats link, tips/help, etc)
          </p>
          <div className="mb-4">
            <Button variant="secondary" className="md:hidden" onClick={showAllUsers}>
              View all users
            </Button>
          </div>
          <div className="mb-4">
            <Button variant="secondary" className="md:hidden" onClick={showAllChats}>
              View all chats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
