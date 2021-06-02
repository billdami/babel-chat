import React, { FC, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

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
  toggleBlock?: () => void;
  reportSpam?: () => void;
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
  toggleBlock,
  reportSpam,
}) => (
  <>
    <div className="flex items-center px-4 pb-2 mb-2 border-b border-gray-100">
      <UserAvatar user={user} className="mr-2 border border-gray-200" />
      <div>
        <UserNickname user={user} className="text-gray-800" />
        <UserDetails user={user} className="text-gray-400" shortCountry />
      </div>
    </div>
    <MenuItem onClick={removeChat} disabled={!canRemove}>
      <Icon name="trash-can" size="sm" className="inline-block mr-2 text-gray-400" />
      Remove from list
    </MenuItem>
    <MenuItem onClick={toggleBlock} disabled={!canBlock}>
      <Icon name="ban" size="sm" className="inline-block mr-2 text-gray-400" />
      {isBlocked ? 'Unblock user' : 'Block user'}
    </MenuItem>
    <MenuItem onClick={reportSpam} disabled={!canReportSpam}>
      <Icon name="octagon-exclamation" size="sm" className="inline-block mr-2 text-red-400" />
      Report spam
    </MenuItem>
    <div className="mt-2 pt-2 border-t border-gray-100">
      <MenuItem onClick={closeChat}>
        <Icon name="x-mark" size="sm" className="inline-block mr-2 text-gray-400" />
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

  // use the main user record to display details, but fall back to the chat's copy (e.g. if they signed out)
  const isOffline = !destUser?.id;
  const user = isOffline ? originChat?.toUserDetails : destUser;
  const userDetailsExist = !!user?.nickname;
  const isSelf = user?.id === authUser?.uid;

  const canRemove = !isSelf && !!originChat?.id;
  const canBlock = !isSelf && !isOffline && !isSpamReported && !!authUser?.uid && !!user?.id;
  const canReportSpam =
    !isSelf &&
    !isOffline &&
    !isSpamReported &&
    originChat?.hasMessagesFromOtherUser &&
    !!authUser?.uid &&
    !!user?.id;

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
      setIsMenuOpen(false);

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

  const actionsMenuProps = useMemo<ActionsMenuProps>(
    () => ({
      user,
      isBlocked,
      canRemove,
      canBlock,
      canReportSpam,
      closeChat,
      removeChat,
      toggleBlock,
      reportSpam,
    }),
    [
      user,
      isBlocked,
      canRemove,
      canBlock,
      canReportSpam,
      closeChat,
      removeChat,
      toggleBlock,
      reportSpam,
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
                  className="absolute -top-1 -left-1 ml-px mt-px shadow"
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
                  <UserStatus user={user} className="md:hidden ml-2 flex-shrink-0" />
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
          onOutsideClick={() => setIsMenuOpen(false)}
          content={ActionsMenu}
          contentProps={actionsMenuProps}
          trigger={
            <Button
              variant="inverse"
              className="ml-2 flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              isActive={isMenuOpen}
              outline
            >
              <span className="hidden md:inline mr-2 text-sm">Chat options</span>
              <Icon name="ellipsis-vertical" size="sm" className="inline-block" />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default MessageHeader;
