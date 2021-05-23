import React, { FC } from 'react';

import Button from '../../../components/Button';
import useAuth from '../../../hooks/useAuth';
import useDrawer from '../../../hooks/useDrawer';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const auth = useAuth();
  const { openDrawer, toggleDrawer } = useDrawer();

  return (
    <div className="Index flex flex-col flex-1">
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 border-b border-gray-200 md:hidden">
        <Button variant="muted" className="mr-2 md:hidden" onClick={toggleDrawer}>
          ☰
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold">Welcome to babel chat!</h2>
          <p>
            Logged in as{' '}
            {!!auth.userRecord && (
              <>
                <span className="font-bold">{auth.userRecord.nickname}</span>
                <span className="text-gray-400 tracking-tighter">#{auth.userRecord.uuid}</span>
              </>
            )}
          </p>
          <p className="mb-4">
            [TODO] main page content (newest users, view all users link, recent chats, view all
            chats link, tips/help, etc)
          </p>
          <Button variant="secondary" onClick={openDrawer}>
            View all users
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
