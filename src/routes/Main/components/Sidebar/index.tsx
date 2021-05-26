import React, { FC } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import Button from '../../../../components/Button';
import TabList from '../../../../components/Tab/TabList';
import TabPanel from '../../../../components/Tab/TabPanel';
import useAuth from '../../../../hooks/useAuth';
import { useChats } from '../../../../hooks/useChatRecord';
import { useUsers } from '../../../../hooks/useUserRecord';
import useDrawer from '../../../../hooks/useDrawer';
import useNotifications from '../../../../hooks/useNotifications';

import ChatsList from './ChatsList';
import UsersList from './UsersList';
import SidebarTab from './Tab';

interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ children, className = '' }) => {
  const { user, isSigningOut, signOut } = useAuth();
  const { activeTab } = useDrawer();
  const { numUnread } = useNotifications();

  const [users, isLoadingUsers /*error*/] = useUsers();
  const [chats, isLoadingChats] = useChats(user?.uid);

  return (
    <div className={cn('SideBar flex-shrink-0 flex flex-col w-80 bg-gray-100', className)}>
      <div className="SidebarHeader flex-shrink-0 flex justify-between items-center py-2 px-4 border-b border-gray-200">
        <Link
          to="/main"
          className="focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-green-300"
        >
          <img
            src="https://fakeimg.pl/42x42/4b5563/fff?text=BCO"
            alt="babel chat"
            width="42"
            height="42"
          />
        </Link>
        <Button variant="muted" onClick={signOut} disabled={isSigningOut}>
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
      <TabPanel
        id="tab-users"
        className="flex-1 overflow-y-auto"
        activeTabId={activeTab}
        unmountWhenHidden={false}
      >
        <UsersList users={users} isLoading={isLoadingUsers} />
      </TabPanel>
      <TabPanel
        id="tab-chats"
        className="flex-1 overflow-y-auto"
        activeTabId={activeTab}
        unmountWhenHidden={false}
      >
        <ChatsList chats={chats} isLoading={isLoadingChats} />
      </TabPanel>
      <TabList className="flex-shrink-0 flex border-b bg-gray-200 border-gray-100">
        <SidebarTab tabId="tab-users" label="Users" count={users?.length} />
        <SidebarTab
          tabId="tab-chats"
          label="Chats"
          count={chats?.length}
          numUnread={numUnread}
          unreadTooltip={
            numUnread
              ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
              : ''
          }
        />
      </TabList>
    </div>
  );
};

export default Sidebar;
