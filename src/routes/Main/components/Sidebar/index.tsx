import React, { FC, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import Button from '../../../../components/Button';
import TabList from '../../../../components/Tab/TabList';
import TabPanel from '../../../../components/Tab/TabPanel';
import LogoIcon from '../../../../components/Svgs/Logos/Icon';
import Link from '../../../../components/Link';
import Icon from '../../../../components/Icon';
import UserAvatar from '../../../../components/UserAvatar';
import UserNickname from '../../../../components/UserNickname';
import UserDetails from '../../../../components/UserDetails';
import Menu, { MenuContentProps } from '../../../../components/Menu';
import MenuItem from '../../../../components/Menu/MenuItem';
import DialogFeedback from '../../../../components/DialogFeedback';
import useAuth from '../../../../hooks/useAuth';
import { useChats } from '../../../../hooks/useChatRecord';
import { useUserBlocks, useUsers } from '../../../../hooks/useUserRecord';
import useDrawer from '../../../../hooks/useDrawer';
import useNotifications from '../../../../hooks/useNotifications';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import { User } from '../../../../types/user';
import { ChatRecord } from '../../../../types/chat';

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
  closeMenu?: () => void;
}

const UserMenu: FC<UserMenuProps> = ({ isSheet, user, signOut, openGiveFeedback, closeMenu }) => (
  <>
    <div
      className={cn('flex items-start justify-between pb-2 mb-2 border-b border-gray-100', {
        'px-4': !isSheet,
      })}
    >
      <div className="flex items-center min-w-0">
        <UserAvatar user={user} className="flex-shrink-0 mr-2 border border-gray-200" />
        <div className="min-w-0">
          <UserNickname user={user} className="text-gray-800" />
          <UserDetails user={user} className="text-gray-400" shortCountry />
        </div>
      </div>
      {isSheet && (
        <Button size="sm" variant="muted" className="flex-shrink-0" onClick={closeMenu} outline>
          <Icon name="x-mark" size="sm" />
        </Button>
      )}
    </div>
    <MenuItem onClick={openGiveFeedback} isSheet={isSheet}>
      <Icon
        name="message-pen"
        size="sm"
        className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      Give us feedback
    </MenuItem>
    <MenuItem onClick={signOut} isSheet={isSheet}>
      <Icon
        name="right-from-bracket"
        size="sm"
        className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
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
  const { activeTab, closeDrawer } = useDrawer();
  const { numUnread } = useNotifications();
  const [userBlocks] = useUserBlocks(authUser?.uid);
  const [users, isLoadingUsers /*error*/] = useUsers();
  const [chats, isLoadingChats] = useChats(authUser?.uid);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<boolean>(false);

  const blockedIds = useMemo<string[]>(() => userBlocks?.map((b) => b.id) ?? [], [userBlocks]);

  const visibleChats = useMemo<ChatRecord[]>(
    () => chats?.filter((c) => !blockedIds.includes(c.id)) ?? [],
    [chats, blockedIds]
  );

  const closeMenu = useCallback(() => setIsUserMenuOpen(false), []);

  const openGiveFeedback = useCallback(() => {
    setIsUserMenuOpen(false);
    setIsFeedbackDialogOpen(true);
  }, []);

  const userMenuProps = useMemo(
    () => ({ user, signOut, openGiveFeedback, closeMenu }),
    [user, signOut, openGiveFeedback, closeMenu]
  );

  return (
    <div className={cn('flex-shrink-0 flex flex-col w-80 bg-gray-100', className)}>
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-3 bg-green-600 text-white">
        <Link to="/main" onClick={closeDrawer} className="py-1 px-2 bg-white border border-white">
          <LogoIcon className="h-8" />
        </Link>
        <Menu<UserMenuProps>
          isOpen={isUserMenuOpen}
          menuClassName="py-2 text-sm"
          sheetClassName="py-4 px-4 text-sm"
          onOutsideClick={() => setIsUserMenuOpen(false)}
          content={UserMenu}
          contentProps={userMenuProps}
          trigger={
            <Button
              variant="inverse"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              isActive={isUserMenuOpen}
              aria-haspopup={true}
              aria-expanded={isUserMenuOpen}
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
        <ChatsList chats={visibleChats} isLoading={isLoadingChats} />
      </TabPanel>
      <TabList className="flex-shrink-0 flex border-b bg-gray-200 border-gray-100">
        <SidebarTab tabId="tab-users" label="Users" count={users?.length} />
        <SidebarTab
          tabId="tab-chats"
          label="Chats"
          count={visibleChats?.length}
          numUnread={numUnread}
          unreadTooltip={
            numUnread
              ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
              : ''
          }
        />
      </TabList>
      <DialogFeedback
        isOpen={isFeedbackDialogOpen}
        onCancel={() => setIsFeedbackDialogOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
