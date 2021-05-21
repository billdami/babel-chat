import React, { FC, useCallback, useState } from 'react';

import TabList from '../../../../components/Tab/TabList';
import Tab from '../../../../components/Tab/TabList/Tab';
import TabPanel from '../../../../components/Tab/TabPanel';
import UsersList from '../../../../components/UsersList';
import useAuth from '../../../../hooks/useAuth';
import { useUsers } from '../../../../hooks/useUserRecord';

type SidebarTab = 'tab-users' | 'tab-chats';

interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ children, ...rest }) => {
  const auth = useAuth();

  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('tab-users');
  const [users, isLoading /*error*/] = useUsers();
  const chats = []; // TODO

  const updateSidebarTab = useCallback((tabId: SidebarTab) => {
    setActiveSidebarTab(tabId);
  }, []);

  return (
    <div className="SideBar flex-shrink-0 flex flex-col w-80 bg-gray-100">
      <div className="SidebarHeader flex-shrink-0 flex justify-between items-center py-2 px-4 border-b border-gray-200">
        <p>
          Logged in as{' '}
          {!!auth.userRecord && (
            <>
              <span className="font-bold">{auth.userRecord.nickname}</span>
              <span className="text-gray-400 tracking-tighter">#{auth.userRecord.uuid}</span>
            </>
          )}
        </p>
        <button
          type="button"
          className="text-center font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={auth.signOut}
          disabled={auth.isLoading}
        >
          {auth.isLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
      <TabPanel
        id="tab-users"
        className="flex-1 overflow-y-auto"
        activeTabId={activeSidebarTab}
        unmountWhenHidden={false}
      >
        {/* TODO maintain scroll position when reactivating tab */}
        <UsersList users={users} isLoading={isLoading} />
      </TabPanel>
      <TabPanel
        id="tab-chats"
        className="flex-1 overflow-y-auto"
        activeTabId={activeSidebarTab}
        unmountWhenHidden={false}
      >
        chats list
      </TabPanel>
      <TabList className="flex-shrink-0 flex bg-gray-200 border-b">
        <Tab
          className="block w-full px-6 py-4 text-center text-gray-800"
          liClassName="w-1/2 flex-none"
          activeClassName="bg-gray-100"
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
          className="block w-full px-6 py-4 text-center text-gray-800"
          liClassName="w-1/2 flex-none"
          activeClassName="bg-gray-100"
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
