import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import BetaBadge from '../../../../components/BetaBadge';
import Button from '../../../../components/Button';
import DialogConfirm from '../../../../components/DialogConfirm';
import DialogFeedback from '../../../../components/DialogFeedback';
import Icon from '../../../../components/Icon';
import Link from '../../../../components/Link';
import LogoIcon from '../../../../components/LogoIcon';
import Menu from '../../../../components/Menu';
import ScrollShadow from '../../../../components/ScrollShadow';
import TabList from '../../../../components/Tab/TabList';
import TabPanel from '../../../../components/Tab/TabPanel';
import useAuth from '../../../../hooks/useAuth';
import { useChats } from '../../../../hooks/useChatRecord';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useDrawer from '../../../../hooks/useDrawer';
import useIsScrolled from '../../../../hooks/useIsScrolled';
import useNotifications from '../../../../hooks/useNotifications';
import { useUserBlocks, useUsers } from '../../../../hooks/useUserRecord';
import { ChatRecord } from '../../../../types/chat';

import ChatsList from './ChatsList';
import SidebarTab from './SidebarTab';
import UsersList from './UsersList';
import UserMenu, { UserMenuProps } from './UserMenu';

interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ className = '' }) => {
  const usersEl = useRef<HTMLDivElement>(null);
  const chatsEl = useRef<HTMLDivElement>(null);

  const { user: authUser, signOut } = useAuth();
  const { user } = useCurrentUser();
  const { activeTab, closeDrawer } = useDrawer();
  const { numUnread, unreadChats } = useNotifications();
  const [userBlocks] = useUserBlocks(authUser?.uid);
  const [users, isLoadingUsers /*error*/] = useUsers();
  const [chats, isLoadingChats] = useChats(authUser?.uid);
  const { isScrolled: isUsersScrolled, onScroll: onUsersScroll } = useIsScrolled(usersEl);
  const { isScrolled: isChatsScrolled, onScroll: onChatsScroll } = useIsScrolled(chatsEl);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<boolean>(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState<boolean>(false);

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

  const openConfirmSignOut = useCallback(() => {
    setIsUserMenuOpen(false);
    setIsSignOutConfirmOpen(true);
  }, []);

  const closeConfirmSignOut = useCallback(() => {
    setIsSignOutConfirmOpen(false);
  }, []);

  const confirmSignOut = useCallback(() => {
    closeConfirmSignOut();
    signOut();
  }, [closeConfirmSignOut, signOut]);

  const userMenuProps = useMemo(
    () => ({ user, openConfirmSignOut, openGiveFeedback, closeMenu }),
    [user, openConfirmSignOut, openGiveFeedback, closeMenu]
  );

  return (
    <div className={cn('flex-shrink-0 flex flex-col w-80 bg-gray-100 dark:bg-gray-800', className)}>
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-3 bg-green-600 dark:bg-gray-700 text-white dark:text-gray-200">
        <div className="relative flex-shrink-0">
          <Link
            to="/main"
            onClick={closeDrawer}
            className="block py-1 px-2 bg-white dark:bg-gray-800 border border-white dark:border-gray-800"
          >
            <LogoIcon className="h-8" />
          </Link>
          <BetaBadge className="-top-1 -right-6" target="_blank" small />
        </div>
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
        className="flex-1 flex relative overflow-hidden"
        activeTabId={activeTab}
        unmountWhenHidden={false}
      >
        <ScrollShadow
          isVisible={isUsersScrolled}
          gradClassName="from-gray-700 dark:from-gray-900"
        />
        <div
          className="flex-1 overflow-y-scroll md:overflow-y-auto"
          ref={usersEl}
          onScroll={onUsersScroll}
        >
          <UsersList
            users={users}
            isLoading={isLoadingUsers}
            blockedIds={blockedIds}
            activeChats={visibleChats}
            unreadChats={unreadChats}
          />
        </div>
      </TabPanel>
      <TabPanel
        id="tab-chats"
        className="flex-1 flex relative overflow-hidden"
        activeTabId={activeTab}
        unmountWhenHidden={false}
      >
        <ScrollShadow
          isVisible={isChatsScrolled}
          gradClassName="from-gray-700 dark:from-gray-900"
        />
        <div
          className="flex-1 overflow-y-scroll md:overflow-y-auto"
          ref={chatsEl}
          onScroll={onChatsScroll}
        >
          <ChatsList chats={visibleChats} isLoading={isLoadingChats} />
        </div>
      </TabPanel>
      <TabList className="flex-shrink-0 flex border-b bg-gray-200 dark:bg-gray-900 border-gray-100 dark:border-gray-900 dark:border-opacity-60 dark:bg-opacity-60">
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
      <DialogConfirm
        isOpen={isSignOutConfirmOpen}
        onCancel={closeConfirmSignOut}
        onConfirm={confirmSignOut}
        confirmText="Sign out"
        title="Sign out"
        icon="right-from-bracket"
        message="Are you sure you want to sign out?"
      />
    </div>
  );
};

export default Sidebar;
