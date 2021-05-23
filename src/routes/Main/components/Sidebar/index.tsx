import React, { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Button from '../../../../components/Button';
import Tab from '../../../../components/Tab/TabList/Tab';
import TabList from '../../../../components/Tab/TabList';
import TabPanel from '../../../../components/Tab/TabPanel';
import useAuth from '../../../../hooks/useAuth';
import { useChats } from '../../../../hooks/useChatRecord';
import { useUsers } from '../../../../hooks/useUserRecord';

import ChatsList from './ChatsList';
import UsersList from './UsersList';

type SidebarTab = 'tab-users' | 'tab-chats';

interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ children, className = '' }) => {
  const auth = useAuth();

  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('tab-users');
  const [users, isLoadingUsers /*error*/] = useUsers();
  const [chats, isLoadingChats] = useChats(auth.user?.uid);

  const updateSidebarTab = useCallback((tabId: SidebarTab) => {
    setActiveSidebarTab(tabId);
  }, []);

  return (
    <div className={classNames('SideBar flex-shrink-0 flex flex-col w-80 bg-gray-100', className)}>
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
        <Button variant="muted" onClick={auth.signOut} disabled={auth.isLoading}>
          {auth.isLoading ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
      <TabPanel
        id="tab-users"
        className="flex-1 overflow-y-auto"
        activeTabId={activeSidebarTab}
        unmountWhenHidden={false}
      >
        <UsersList users={users} isLoading={isLoadingUsers} />
      </TabPanel>
      <TabPanel
        id="tab-chats"
        className="flex-1 overflow-y-auto"
        activeTabId={activeSidebarTab}
        unmountWhenHidden={false}
      >
        <ChatsList chats={chats} isLoading={isLoadingChats} />
      </TabPanel>
      <TabList className="flex-shrink-0 flex border-b bg-gray-200 border-gray-100">
        <Tab
          className="block w-full px-6 py-4 border-t border-b text-center text-gray-800 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
          liClassName="w-1/2 flex-none"
          activeClassName="bg-gray-100 border-transparent"
          tabId="tab-users"
          activeTabId={activeSidebarTab}
          onClick={updateSidebarTab}
        >
          Users
          {!!users?.length && (
            <span className="inline-block px-2 ml-2 rounded-sm bg-gray-300 text-gray-600 text-xs font-bold">
              {users?.length}
            </span>
          )}
        </Tab>
        <Tab
          className="block w-full px-6 py-4 border-t border-b text-center text-gray-800 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
          liClassName="w-1/2 flex-none"
          activeClassName="bg-gray-100 border-transparent"
          tabId="tab-chats"
          activeTabId={activeSidebarTab}
          onClick={updateSidebarTab}
        >
          Chats
          <span className="inline-block px-2 ml-2 rounded-sm bg-gray-300 text-gray-600 text-xs font-bold">
            {chats?.length}
          </span>
        </Tab>
      </TabList>
    </div>
  );
};

export default Sidebar;
