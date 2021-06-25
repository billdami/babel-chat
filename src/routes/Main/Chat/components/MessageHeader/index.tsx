import React, { FC, useCallback, useMemo, useState } from 'react';

import Button from '../../../../../components/Button';
import DrawerToggleButton from '../../../../../components/DrawerToggleButton';
import Icon from '../../../../../components/Icon';
import Menu from '../../../../../components/Menu';
import NavBar from '../../../../../components/NavBar';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import UserStatus from '../../../../../components/UserStatus';
import { ChatRecord } from '../../../../../types/chat';
import { User, UserRecord } from '../../../../../types/user';

import ActionsMenu, { ActionsMenuProps } from './ActionsMenu';

interface MessageHeaderProps {
  destUser?: UserRecord;
  originChat?: ChatRecord | null;
  userDetails?: User;
  isOffline?: boolean;
  isLoading?: boolean;
  isBlocked?: boolean;
  canRemove: boolean;
  canBlock: boolean;
  canReportSpam: boolean;
  closeChat: () => void;
  removeChat: () => void;
  toggleChatPinned: () => void;
  confirmToggleBlock: () => void;
  confirmReporSpam: () => void;
}

const MessageHeader: FC<MessageHeaderProps> = ({
  originChat,
  userDetails,
  isBlocked = false,
  isLoading = false,
  isOffline = false,
  canRemove,
  canBlock,
  canReportSpam,
  closeChat,
  removeChat,
  toggleChatPinned,
  confirmToggleBlock,
  confirmReporSpam,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const userDetailsExist = !!userDetails?.nickname;
  const isPinned = !!originChat?.isPinned;

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const onCloseChat = useCallback(() => {
    closeMenu();
    closeChat();
  }, [closeMenu, closeChat]);

  const onRemoveChat = useCallback(() => {
    if (canRemove) {
      closeMenu();
      removeChat();
    }
  }, [canRemove, closeMenu, removeChat]);

  const onToggleChatPinned = useCallback(() => {
    closeMenu();
    toggleChatPinned();
  }, [closeMenu, toggleChatPinned]);

  const onConfirmReportSpam = useCallback(() => {
    if (canReportSpam) {
      closeMenu();
      confirmReporSpam();
    }
  }, [canReportSpam, closeMenu, confirmReporSpam]);

  const onConfirmToggleBlock = useCallback(() => {
    if (canBlock) {
      closeMenu();
      confirmToggleBlock();
    }
  }, [canBlock, closeMenu, confirmToggleBlock]);

  const actionsMenuProps = useMemo<ActionsMenuProps>(
    () => ({
      isPinned,
      isBlocked,
      canRemove,
      canBlock,
      canReportSpam,
      closeMenu,
      user: userDetails,
      closeChat: onCloseChat,
      toggleChatPinned: onToggleChatPinned,
      removeChat: onRemoveChat,
      confirmToggleBlock: onConfirmToggleBlock,
      confirmReporSpam: onConfirmReportSpam,
    }),
    [
      userDetails,
      isPinned,
      isBlocked,
      canRemove,
      canBlock,
      canReportSpam,
      onCloseChat,
      onToggleChatPinned,
      onRemoveChat,
      onConfirmToggleBlock,
      onConfirmReportSpam,
      closeMenu,
    ]
  );

  return (
    <NavBar>
      <div className="flex items-center min-w-0">
        <DrawerToggleButton />
        {!isLoading &&
          (userDetailsExist ? (
            <div className="flex items-center min-w-0">
              <div className="hidden md:block relative flex-shrink-0 mr-2">
                <UserAvatar user={userDetails} />
                <UserStatus
                  user={!isOffline ? userDetails : null}
                  className="absolute -bottom-1 -right-1 mb-px mr-px border-white shadow"
                />
              </div>
              <div className="truncate">
                <div className="flex items-center">
                  <UserNickname
                    user={userDetails}
                    isOffline={isOffline}
                    className="md:text-lg md:leading-5"
                    mutedClassName="text-green-200 dark:text-gray-400"
                  />
                  <UserStatus
                    user={!isOffline ? userDetails : null}
                    className="md:hidden ml-2 flex-shrink-0 border-white shadow"
                  />
                </div>
                <UserDetails
                  user={userDetails}
                  className="text-xs md:text-sm leading-3 text-green-200 dark:text-gray-400"
                />
              </div>
            </div>
          ) : (
            <div className="min-w-0">
              <h2 className="truncate md:leading-5 font-bold text-yellow-200">User not found</h2>
              <h3 className="text-xs md:text-sm leading-3 text-green-200">
                This user no longer exists.
              </h3>
            </div>
          ))}
      </div>
      <div>
        <Menu<ActionsMenuProps>
          isOpen={isMenuOpen}
          menuClassName="py-2 text-sm"
          sheetClassName="py-4 px-4 text-sm"
          onOutsideClick={() => setIsMenuOpen(false)}
          content={ActionsMenu}
          contentProps={actionsMenuProps}
          trigger={
            // TODO create <MenuTrigger> component
            <Button
              variant="inverse"
              className="ml-2 flex-shrink-0 whitespace-nowrap"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-haspopup={true}
              aria-expanded={isMenuOpen}
              isActive={isMenuOpen}
              outline
            >
              <span className="hidden md:inline mr-2 text-sm">Chat options</span>
              <Icon name="ellipsis-vertical" size="sm" className="inline-block" />
            </Button>
          }
        />
      </div>
    </NavBar>
  );
};

export default MessageHeader;
