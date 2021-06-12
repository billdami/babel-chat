import React, { FC, MouseEvent as ReactMouseEvent, useCallback, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import Badge from '../../../../../../components/Badge';
import Button from '../../../../../../components/Button';
import Checkbox from '../../../../../../components/Checkbox';
import Icon from '../../../../../../components/Icon';
import Menu, { MenuContentProps } from '../../../../../../components/Menu';
import MenuItem from '../../../../../../components/Menu/MenuItem';
import UserAvatar from '../../../../../../components/UserAvatar';
import UserNickname from '../../../../../../components/UserNickname';
import useDrawer from '../../../../../../hooks/useDrawer';
import useMedia from '../../../../../../hooks/useMedia';
import { ChatRecord } from '../../../../../../types/chat';

interface ListItemProps {
  chat: ChatRecord;
  selectedChatIds: string[];
  isEditing: boolean;
  toggleChatSelection: (chat: ChatRecord) => void;
  markChatRead: (chatIds: string[]) => void;
  blockUser: (chatIds: string[]) => void;
  removeChat: (chatIds: string[]) => void;
}

interface ChatMenuProps extends MenuContentProps {
  markChatRead?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  blockUser?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  removeChat?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ChatMenu: FC<ChatMenuProps> = ({ markChatRead, blockUser, removeChat }) => (
  <>
    <MenuItem onClick={markChatRead}>
      <Icon name="message-check" size="sm" className="inline-block mr-2 text-gray-400" />
      Mark as read
    </MenuItem>
    <MenuItem onClick={blockUser}>
      <Icon name="ban" size="sm" className="inline-block mr-2 text-gray-400" />
      Block user
    </MenuItem>
    <MenuItem onClick={removeChat}>
      <Icon name="trash-can" size="sm" className="inline-block mr-2 text-gray-400" />
      Remove
    </MenuItem>
  </>
);

const ListItem: FC<ListItemProps> = ({
  chat,
  selectedChatIds,
  isEditing,
  toggleChatSelection,
  markChatRead,
  blockUser,
  removeChat,
}) => {
  const { closeDrawer } = useDrawer();
  const { isMobile } = useMedia();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const onMouseEnter = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => !isMobile && setIsFocused(true),
    [isMobile]
  );

  const onMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => !isMobile && setIsFocused(false),
    [isMobile]
  );

  const onTriggerClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    },
    [isMenuOpen]
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
      markChatRead: menuMarkChatRead,
      blockUser: menuBlockUser,
      removeChat: menuRemoveChat,
    }),
    [menuMarkChatRead, menuBlockUser, menuRemoveChat]
  );

  return (
    <li className={cn({ 'flex items-center': isEditing })}>
      {isEditing && (
        <Checkbox
          checked={selectedChatIds.includes(chat.id)}
          onChange={() => toggleChatSelection(chat)}
          className="ml-3 mr-1 flex-shrink-0"
          standalone
        />
      )}
      <NavLink
        className={cn(
          `relative
          block flex-1  min-w-0
          pr-3 py-1
          text-left
          hover:bg-opacity-50 hover:bg-gray-200
          focus:outline-none
          focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300`,
          { 'pl-3': !isEditing, 'pl-1 rounded-l': isEditing }
        )}
        activeClassName="bg-gray-200 hover:bg-opacity-100"
        to={`/main/chat/${chat.id}`}
        onClick={closeDrawer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center min-w-0">
            <UserAvatar user={chat.toUserDetails} size={20} className="flex-shrink-0 mr-2" />
            <UserNickname user={chat.toUserDetails} className="text-gray-800" />
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
        {(isMenuOpen || isFocused) && (
          <Menu<ChatMenuProps>
            isOpen={isMenuOpen}
            menuClassName="py-2 text-sm"
            triggerClassName="absolute right-2 top-0 bottom-0 flex items-center"
            onOutsideClick={() => setIsMenuOpen(false)}
            content={ChatMenu}
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
      </NavLink>
    </li>
  );
};

export default ListItem;
