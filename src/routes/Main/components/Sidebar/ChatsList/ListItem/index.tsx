import React, { FC, MouseEvent as ReactMouseEvent, useCallback, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import Badge from '../../../../../../components/Badge';
import Button from '../../../../../../components/Button';
import Checkbox from '../../../../../../components/Checkbox';
import Icon from '../../../../../../components/Icon';
import Menu from '../../../../../../components/Menu';
import UserAvatar from '../../../../../../components/UserAvatar';
import UserNickname from '../../../../../../components/UserNickname';
import ActionsMenu, { ActionsMenuProps } from '../ActionsMenu';
import useDrawer from '../../../../../../hooks/useDrawer';
import useMedia from '../../../../../../hooks/useMedia';
import { ChatRecord } from '../../../../../../types/chat';

interface ListItemProps {
  chat: ChatRecord;
  selectedChatIds: string[];
  isEditing: boolean;
  toggleChatSelection: (chat: ChatRecord) => void;
  pinChat: (chatIds: string[]) => void;
  unpinChat: (chatIds: string[]) => void;
  markChatRead: (chatIds: string[]) => void;
  blockUser: (chatIds: string[]) => void;
  removeChat: (chatIds: string[]) => void;
}

const ListItem: FC<ListItemProps> = ({
  chat,
  selectedChatIds,
  isEditing,
  toggleChatSelection,
  unpinChat,
  pinChat,
  markChatRead,
  blockUser,
  removeChat,
}) => {
  const { closeDrawer } = useDrawer();
  const { isMobile } = useMedia();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const onMouseEnter = useCallback(
    (event: ReactMouseEvent<HTMLLIElement, MouseEvent>) => !isMobile && setIsFocused(true),
    [isMobile]
  );

  const onMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLLIElement, MouseEvent>) => !isMobile && setIsFocused(false),
    [isMobile]
  );

  const onTriggerClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsMenuOpen(!isMenuOpen);
    },
    [isMenuOpen]
  );

  const menuPinChat = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsMenuOpen(false);
      setIsFocused(false);
      pinChat([chat.id]);
    },
    [chat, pinChat]
  );

  const menuUnpinChat = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsMenuOpen(false);
      setIsFocused(false);
      unpinChat([chat.id]);
    },
    [chat, unpinChat]
  );

  const menuMarkChatRead = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsMenuOpen(false);
      setIsFocused(false);
      markChatRead([chat.id]);
    },
    [chat, markChatRead]
  );

  const menuBlockUser = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsMenuOpen(false);
      setIsFocused(false);
      blockUser([chat.id]);
    },
    [chat, blockUser]
  );

  const menuRemoveChat = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsMenuOpen(false);
      setIsFocused(false);
      removeChat([chat.id]);
    },
    [chat, removeChat]
  );

  const menuProps = useMemo(
    () => ({
      isPinned: chat.isPinned,
      pinChat: menuPinChat,
      unpinChat: menuUnpinChat,
      markChatRead: menuMarkChatRead,
      blockUser: menuBlockUser,
      removeChat: menuRemoveChat,
    }),
    [chat, menuPinChat, menuUnpinChat, menuMarkChatRead, menuBlockUser, menuRemoveChat]
  );

  return (
    <li
      className={cn(
        'relative hover:bg-opacity-50 hover:bg-gray-200 dark:hover:bg-gray-900 dark:hover:bg-opacity-30',
        { 'flex items-center': isEditing }
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isEditing && (
        <Checkbox
          checked={selectedChatIds.includes(chat.id)}
          onChange={() => toggleChatSelection(chat)}
          className="ml-3 mr-2 flex-shrink-0"
          standalone
        />
      )}
      <NavLink
        className={cn(
          `block flex-1  min-w-0
          pr-3 py-1
          text-left
          focus:outline-none
          focus:ring-inset focus:ring-2 focus:ring-opacity-50 dark:focus:ring-opacity-50 focus:ring-green-300 dark:focus:ring-green-500`,
          { 'pl-3': !isEditing, 'pl-1 rounded-l': isEditing }
        )}
        activeClassName="bg-gray-200 hover:bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-50 dark:hover:bg-opacity-50"
        to={`/main/chat/${chat.id}`}
        onClick={closeDrawer}
      >
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center min-w-0">
            <UserAvatar user={chat.toUserDetails} size={20} className="flex-shrink-0 mr-2" />
            <UserNickname user={chat.toUserDetails} className="text-gray-80 dark:text-gray-300" />
          </div>
          {(!chat.dateLastSeen || chat.dateLastSeen < chat.dateLastMessage) && (
            <Badge
              className="flex-shrink-0 ml-1"
              tooltip="There are unread message(s)"
              size="md"
              pulse={false}
            />
          )}
        </div>
      </NavLink>
      {(isMenuOpen || isFocused) && (
        <Menu<ActionsMenuProps>
          isOpen={isMenuOpen}
          menuClassName="py-2 text-sm"
          triggerClassName="absolute right-2 top-0 bottom-0 flex items-center"
          onOutsideClick={() => setIsMenuOpen(false)}
          content={ActionsMenu}
          contentProps={menuProps}
          trigger={
            <Button
              variant="muted"
              size="sm"
              className="relative"
              onClick={onTriggerClick}
              isActive={isMenuOpen}
              aria-haspopup={true}
              aria-expanded={isMenuOpen}
            >
              <Icon name="ellipsis" size="sm" className="inline-block" />
              {(!chat.dateLastSeen || chat.dateLastSeen < chat.dateLastMessage) && (
                <Badge
                  className="absolute -top-1 -right-1"
                  tooltip="There are unread message(s)"
                  size="md"
                  pulse={false}
                  deferRender={false}
                />
              )}
            </Button>
          }
        />
      )}
    </li>
  );
};

export default ListItem;
