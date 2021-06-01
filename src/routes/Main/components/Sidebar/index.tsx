import React, { FC, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import Button from '../../../../components/Button';
import TabList from '../../../../components/Tab/TabList';
import TabPanel from '../../../../components/Tab/TabPanel';
import useAuth from '../../../../hooks/useAuth';
import { useChats } from '../../../../hooks/useChatRecord';
import { useUserBlocks, useUsers } from '../../../../hooks/useUserRecord';
import useDrawer from '../../../../hooks/useDrawer';
import useNotifications from '../../../../hooks/useNotifications';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import LogoIcon from '../../../../components/Svgs/Logos/Icon';
import Link from '../../../../components/Link';
import Icon from '../../../../components/Icon';
import UserAvatar from '../../../../components/UserAvatar';
import UserNickname from '../../../../components/UserNickname';
import UserDetails from '../../../../components/UserDetails';
import Menu, { MenuContentProps } from '../../../../components/Menu';
import MenuItem from '../../../../components/Menu/MenuItem';
import { User } from '../../../../types/user';

import ChatsList from './ChatsList';
import UsersList from './UsersList';
import SidebarTab from './Tab';

interface SidebarProps {
  className?: string;
}

interface UserMenuProps extends MenuContentProps {
  user?: User | null;
  signOut?: () => void;
  openGiveFeedback?: () => void;
}

const UserMenu: FC<UserMenuProps> = ({ user, signOut, openGiveFeedback }) => (
  <>
    <div className="flex items-center px-4 pb-2 mb-2 border-b border-gray-100">
      <UserAvatar user={user} className="mr-2 border border-gray-200" />
      <div>
        <UserNickname user={user} className="text-gray-800" />
        <UserDetails user={user} className="text-gray-400" shortCountry />
      </div>
    </div>
    <MenuItem onClick={openGiveFeedback}>
      <Icon name="message-pen" size="sm" className="inline-block mr-2 text-gray-400" />
      Give us feedback!
    </MenuItem>
    <MenuItem onClick={signOut}>
      <Icon name="right-from-bracket" size="sm" className="inline-block mr-2 text-gray-400" />
      Sign out
    </MenuItem>
    {/* TODO [future] avatar editor */}
    {/* TODO [future] mute sounds toggle */}
    {/* TODO [future] dark mode switch */}
  </>
);

const Sidebar: FC<SidebarProps> = ({ className = '' }) => {
  const { user: authUser, signOut } = useAuth();
  const { user } = useCurrentUser();
  const { activeTab } = useDrawer();
  const { numUnread } = useNotifications();
  const [userBlocks] = useUserBlocks(authUser?.uid);
  const [users, isLoadingUsers /*error*/] = useUsers();
  const [chats, isLoadingChats] = useChats(authUser?.uid);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const blockedIds = useMemo<string[]>(() => userBlocks?.map((b) => b.id) ?? [], [userBlocks]);

  const openGiveFeedback = useCallback(() => {
    //TODO
    setIsUserMenuOpen(false);
  }, []);

  const userMenuProps = useMemo(
    () => ({ user, signOut, openGiveFeedback }),
    [user, signOut, openGiveFeedback]
  );

  return (
    <div className={cn('flex-shrink-0 flex flex-col w-80 bg-gray-100', className)}>
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-3 bg-green-600 text-white">
        <Link to="/main" className="py-1 px-2 bg-white border border-white">
          <LogoIcon className="h-8" />
        </Link>
        <Menu<UserMenuProps>
          isOpen={isUserMenuOpen}
          menuClassName="py-2 text-sm"
          onOutsideClick={() => setIsUserMenuOpen(false)}
          content={UserMenu}
          contentProps={userMenuProps}
          trigger={
            <Button
              variant="inverse"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              isActive={isUserMenuOpen}
              outline
            >
              <Icon name="user" size="sm" className="inline-block" />
            </Button>
          }
        />
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
