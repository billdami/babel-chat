import React, { FC, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';
import Menu from '../../../../../components/Menu';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import UserStatus from '../../../../../components/UserStatus';
import useAuth from '../../../../../hooks/useAuth';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import useDrawer from '../../../../../hooks/useDrawer';
import useNotifications from '../../../../../hooks/useNotifications';
import { ChatRecord } from '../../../../../types/chat';
import { UserRecord } from '../../../../../types/user';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { blockUser, unblockUser, reportSpamUser } from '../../../../../utils/user';
import DialogConfirm from '../../../../../components/DialogConfirm';

import ActionsMenu, { ActionsMenuProps } from './ActionsMenu';

interface MessageHeaderProps {
  destUser?: UserRecord;
  originChat?: ChatRecord | null;
  isLoading?: boolean;
  isBlocked?: boolean;
  isSpamReported?: boolean;
}

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
  const [isConfirmReportSpamOpen, setIsConfirmReportSpamOpen] = useState<boolean>(false);

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

  const confirmReporSpam = useCallback(() => {
    setIsMenuOpen(false);
    setIsConfirmReportSpamOpen(true);
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
      confirmReporSpam,
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
      confirmReporSpam,
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
      <DialogConfirm
        isOpen={isConfirmBlockOpen}
        onCancel={() => setIsConfirmBlockOpen(false)}
        onConfirm={toggleBlock}
        icon="ban"
        title={isBlocked ? 'Unblock user' : 'Block user'}
        confirmText={isBlocked ? 'Unblock' : 'Block'}
        message={
          isBlocked ? (
            <>
              <div className="mb-4">
                Are you sure you want to unblock <UserNickname user={user} className="inline" />?
              </div>
              <div className="mb-4">
                You will receive messages and notifications from this user again.
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                Are you sure you want to block <UserNickname user={user} className="inline" />?
              </div>
              <div className="mb-4">
                You will no longer receive messages from (or be able to send messages to) them,
                until you unblock them.
              </div>
            </>
          )
        }
      />
      <DialogConfirm
        isOpen={isConfirmReportSpamOpen}
        onCancel={() => setIsConfirmReportSpamOpen(false)}
        onConfirm={reportSpam}
        icon="octagon-exclamation"
        iconClassName="bg-red-100 text-red-400"
        title="Report spam"
        confirmText="Report"
        message={
          <>
            <div className="mb-4">
              <span className="text-red-500 font-bold uppercase">Warning!</span> This action is
              irreversible and <span className="font-bold">cannot be undone</span>.
            </div>
            <div className="mb-4">
              Are you sure you want to report <UserNickname user={user} className="inline" /> for
              spamming?
            </div>
            <div className="mb-4">
              This will also <span className="font-bold">permanently</span> block this user, and you
              will no longer receive messages from (or be able to send messages to) them.
            </div>
          </>
        }
      />
    </div>
  );
};

export default MessageHeader;
