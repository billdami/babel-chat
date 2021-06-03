import React, { FC, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';
import Menu, { MenuContentProps } from '../../../../../components/Menu';
import MenuItem from '../../../../../components/Menu/MenuItem';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import UserStatus from '../../../../../components/UserStatus';
import useAuth from '../../../../../hooks/useAuth';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import useDrawer from '../../../../../hooks/useDrawer';
import useNotifications from '../../../../../hooks/useNotifications';
import { ChatRecord } from '../../../../../types/chat';
import { User, UserRecord } from '../../../../../types/user';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { blockUser, unblockUser, reportSpamUser } from '../../../../../utils/user';
import Dialog from '../../../../../components/Dialog';

interface MessageHeaderProps {
  destUser?: UserRecord;
  originChat?: ChatRecord | null;
  isLoading?: boolean;
  isBlocked?: boolean;
  isSpamReported?: boolean;
}

interface ActionsMenuProps extends MenuContentProps {
  user?: User;
  isBlocked?: boolean;
  canRemove?: boolean;
  canBlock?: boolean;
  canReportSpam?: boolean;
  closeChat?: () => void;
  removeChat?: () => void;
  confirmToggleBlock?: () => void;
  reportSpam?: () => void;
  closeMenu?: () => void;
}

const ActionsMenu: FC<ActionsMenuProps> = ({
  isSheet,
  user,
  isBlocked,
  canRemove,
  canBlock,
  canReportSpam,
  closeChat,
  removeChat,
  confirmToggleBlock,
  reportSpam,
  closeMenu,
}) => (
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
    <MenuItem isSheet={isSheet} onClick={removeChat} disabled={!canRemove}>
      <Icon
        name="trash-can"
        size="sm"
        className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      Remove from list
    </MenuItem>
    <MenuItem isSheet={isSheet} onClick={confirmToggleBlock} disabled={!canBlock}>
      <Icon
        name="ban"
        size="sm"
        className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      {isBlocked ? 'Unblock user' : 'Block user'}
    </MenuItem>
    <MenuItem isSheet={isSheet} onClick={reportSpam} disabled={!canReportSpam}>
      <Icon
        name="octagon-exclamation"
        size="sm"
        className={cn('inline-block text-red-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      Report spam
    </MenuItem>
    <div className="mt-2 pt-2 border-t border-gray-100">
      <MenuItem isSheet={isSheet} onClick={closeChat}>
        <Icon
          name="x-mark"
          size="sm"
          className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
        />
        Close chat
      </MenuItem>
    </div>
  </>
);

const MessageHeader: FC<MessageHeaderProps> = ({
  destUser,
  originChat,
  isBlocked = false,
  isSpamReported = false,
  isLoading = false,
}) => {
  const history = useHistory();
  const { user: authUser } = useAuth();
  const { updateUser } = useCurrentUser();
  const { toggleDrawer } = useDrawer();
  const { numUnread } = useNotifications();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isConfirmBlockOpen, setIsConfirmBlockOpen] = useState<boolean>(false);

  // use the main user record to display details, but fall back to the chat's copy (e.g. if they signed out)
  const isOffline = !destUser?.id;
  const user = isOffline ? originChat?.toUserDetails : destUser;
  const userDetailsExist = !!user?.nickname;
  const isSelf = user?.id === authUser?.uid;

  const canRemove = !isSelf && !!originChat?.id;
  const canBlock = !isSelf && !isOffline && !isSpamReported && !!authUser?.uid && !!user?.id;
  // TODO [BUG] if a user removes or blocks a chat containing messages from the other user
  // on re-open of the chat view for that user, they can no longer report as spam until
  // the other messages them again (not a huge deal, but probably should fix eventually)
  const canReportSpam =
    !isSelf &&
    !isOffline &&
    !isSpamReported &&
    originChat?.hasMessagesFromOtherUser &&
    !!authUser?.uid &&
    !!user?.id;

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const closeChat = useCallback(() => {
    setIsMenuOpen(false);
    history.push('/main');
  }, [history]);

  const removeChat = useCallback(() => {
    if (canRemove) {
      originChat?.ref?.remove();
      updateUser({ dateLastActive: getFirebaseTimestamp() });
      setIsMenuOpen(false);
      closeChat();
    }
  }, [canRemove, originChat, updateUser, closeChat]);

  const toggleBlock = useCallback(() => {
    if (canBlock && authUser?.uid && user?.id) {
      // TODO modal confirm
      if (isBlocked) {
        unblockUser(authUser.uid, user.id);
      } else {
        blockUser(authUser.uid, user.id);
        originChat?.ref?.remove();
      }

      updateUser({ dateLastActive: getFirebaseTimestamp() });
      setIsConfirmBlockOpen(false);

      if (!isBlocked) {
        closeChat();
      }
    }
  }, [canBlock, isBlocked, authUser, updateUser, user, originChat, closeChat]);

  const reportSpam = useCallback(() => {
    if (canReportSpam && authUser?.uid && user?.id) {
      // TODO modal confirm
      blockUser(authUser.uid, user.id);
      reportSpamUser(authUser.uid, user.id);
      originChat?.ref?.remove();
      updateUser({ dateLastActive: getFirebaseTimestamp() });
      setIsMenuOpen(false);
      closeChat();
    }
  }, [canReportSpam, authUser, user, updateUser, originChat, closeChat]);

  const confirmToggleBlock = useCallback(() => {
    setIsMenuOpen(false);
    setIsConfirmBlockOpen(true);
  }, []);

  const actionsMenuProps = useMemo<ActionsMenuProps>(
    () => ({
      user,
      isBlocked,
      canRemove,
      canBlock,
      canReportSpam,
      closeChat,
      removeChat,
      confirmToggleBlock,
      reportSpam,
      closeMenu,
    }),
    [
      user,
      isBlocked,
      canRemove,
      canBlock,
      canReportSpam,
      closeChat,
      removeChat,
      confirmToggleBlock,
      reportSpam,
      closeMenu,
    ]
  );

  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-3 bg-green-500 text-white">
      <div className="flex items-center min-w-0">
        <Button
          onClick={toggleDrawer}
          variant="inverse"
          className="mr-2 md:hidden relative flex-shrink-0"
          outline
        >
          <Icon name="bars" size="sm" className="inline-block" />
          {!!numUnread && (
            <Badge
              className="absolute -right-1 -top-1"
              tooltip={
                numUnread
                  ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
                  : ''
              }
            />
          )}
        </Button>
        {!isLoading &&
          (userDetailsExist ? (
            <div className="flex items-center min-w-0">
              <div className="hidden md:block relative flex-shrink-0 mr-2">
                <UserAvatar user={user} />
                <UserStatus
                  user={!isOffline ? user : null}
                  className="absolute -bottom-1 -right-1 mb-px mr-px border-white shadow"
                />
              </div>
              <div className="truncate">
                <div className="flex items-center">
                  <UserNickname
                    user={user}
                    isOffline={isOffline}
                    className="md:text-lg md:leading-5"
                    mutedClassName="text-green-200"
                  />
                  <UserStatus
                    user={!isOffline ? user : null}
                    className="md:hidden ml-2 flex-shrink-0 border-white shadow"
                  />
                </div>
                <UserDetails user={user} className="text-xs md:text-sm leading-3 text-green-200" />
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
            // create a <MenuTrigger> component
            <Button
              variant="inverse"
              className="ml-2 flex-shrink-0"
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
      {/* TODO create generic <ConfirmDialog> */}
      <Dialog
        isOpen={isConfirmBlockOpen}
        onOutsideClick={() => setIsConfirmBlockOpen(false)}
        onEscapeKey={() => setIsConfirmBlockOpen(false)}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
              <Icon name="ban" className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <div className="text-lg leading-6 text-gray-900">
                  {isBlocked ? 'Unblock user' : 'Block user'}
                </div>
                <Button
                  size="sm"
                  variant="muted"
                  className="flex-shrink-0"
                  onClick={() => setIsConfirmBlockOpen(false)}
                  outline
                >
                  <Icon name="x-mark" size="sm" />
                </Button>
              </div>
              <div className="my-2 text-sm text-gray-600">
                {isBlocked ? (
                  <>
                    <div className="mb-4">
                      Are you sure you want to unblock{' '}
                      <UserNickname user={user} className="inline" />?
                    </div>
                    <div className="mb-4">
                      You will receive messages and notifications from this user again.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      Are you sure you want to block <UserNickname user={user} className="inline" />
                      ?
                    </div>
                    <div className="mb-4">
                      You will no longer receive messages from (or send messages to) them, until you
                      unblock them.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-4 py-3 bg-gray-50">
          {/* TODO focus on "Cancel" button on open */}
          <Button variant="link" onClick={() => setIsConfirmBlockOpen(false)}>
            Nevermind
          </Button>
          <Button className="ml-2" onClick={toggleBlock}>
            {isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default MessageHeader;
