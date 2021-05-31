import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import Button from '../../../../components/Button';
import TabList from '../../../../components/Tab/TabList';
import TabPanel from '../../../../components/Tab/TabPanel';
import useAuth from '../../../../hooks/useAuth';
import { useChats } from '../../../../hooks/useChatRecord';
import { useUserBlocks, useUsers } from '../../../../hooks/useUserRecord';
import useDrawer from '../../../../hooks/useDrawer';
import useNotifications from '../../../../hooks/useNotifications';
import LogoIcon from '../../../../components/Svgs/Logos/Icon';
import Link from '../../../../components/Link';
import Icon from '../../../../components/Icon';

import ChatsList from './ChatsList';
import UsersList from './UsersList';
import SidebarTab from './Tab';

interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { activeTab } = useDrawer();
  const { numUnread } = useNotifications();
  const [userBlocks] = useUserBlocks(user?.uid);
  const [users, isLoadingUsers /*error*/] = useUsers();
  const [chats, isLoadingChats] = useChats(user?.uid);

  const blockedIds = useMemo<string[]>(() => userBlocks?.map((b) => b.id) ?? [], [userBlocks]);

  return (
    <div className={cn('SideBar flex-shrink-0 flex flex-col w-80 bg-gray-100', className)}>
      <div className="SidebarHeader flex-shrink-0 flex justify-between items-center py-2 px-3 bg-green-600 text-white">
        <Link to="/main" className="py-1 px-2 bg-white border border-white">
          <LogoIcon className="h-8" />
        </Link>
        {/* TODO user menu */}
        <Button variant="inverse" outline>
          <Icon name="ellipsis-vertical" size="sm" className="my-1" />
        </Button>
      </div>
      <TabPanel
        id="tab-users"
        className="flex-1 overflow-y-auto"
        activeTabId={activeTab}
        unmountWhenHidden={false}
      >
        <UsersList users={users} isLoading={isLoadingUsers} blockedIds={blockedIds} />
      </TabPanel>
      <TabPanel
        id="tab-chats"
        className="flex-1 overflow-y-auto"
        activeTabId={activeTab}
        unmountWhenHidden={false}
      >
        <ChatsList chats={chats} isLoading={isLoadingChats} blockedIds={blockedIds} />
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
