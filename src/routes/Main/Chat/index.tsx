import React, { FC, useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import DialogConfirm from '../../../components/DialogConfirm';
import UserNickname from '../../../components/UserNickname';
import useAuth from '../../../hooks/useAuth';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { useChatByMembers } from '../../../hooks/useChatRecord';
import { useUser, useUserBlocks, useUserSpamReports } from '../../../hooks/useUserRecord';
import { createChat, createChatMessage } from '../../../utils/chat';
import { getFirebaseTimestamp } from '../../../utils/firebase';
import { blockUser, unblockUser, reportSpamUser } from '../../../utils/user';

import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import MessageHeader from './components/MessageHeader';

export interface ChatRouteParams {
  userId: string;
}

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  const history = useHistory();
  const { userId } = useParams<ChatRouteParams>();
  const { user: authUser } = useAuth();
  const { user, updateUser } = useCurrentUser();
  const [destUser, isLoadingDestUser] = useUser(userId);
  const [originChat, isLoadingOriginChat] = useChatByMembers(authUser?.uid, userId);
  const [destChat] = useChatByMembers(userId, authUser?.uid);
  const [userBlocks] = useUserBlocks(user?.id);
  const [userSpamReports] = useUserSpamReports(user?.id);

  const [isConfirmBlockOpen, setIsConfirmBlockOpen] = useState<boolean>(false);
  const [isConfirmReportSpamOpen, setIsConfirmReportSpamOpen] = useState<boolean>(false);

  const isBlocked = useMemo<boolean>(
    () => (userBlocks?.map((b) => b.id) ?? []).includes(userId),
    [userBlocks, userId]
  );

  const isSpamReported = useMemo<boolean>(
    () => (userSpamReports?.map((b) => b.id) ?? []).includes(userId),
    [userSpamReports, userId]
  );

  // can't send if:
  // - not logged in
  // - dest user doesn't exist
  // - dest user is blocked
  // - dest user is yourself
  const canSendMessage = useMemo<boolean>(
    () => !!destUser?.id && !isBlocked && !!authUser && !!userId && destUser?.id !== authUser?.uid,
    [destUser, authUser, userId, isBlocked]
  );

  // use the main user record to display details, but fall back to the chat's copy (e.g. if they signed out)
  const isOffline = !destUser?.id;
  const userDetails = isOffline ? originChat?.toUserDetails : destUser;
  const isSelf = userDetails?.id === authUser?.uid;

  const canRemove = !isSelf && !!originChat?.id;
  const canBlock = !isSelf && !isOffline && !isSpamReported && !!authUser?.uid && !!userDetails?.id;
  // TODO [BUG] if a user removes or blocks a chat containing messages from the other user
  // on re-open of the chat view for that user, they can no longer report as spam until
  // the other messages them again (not a huge deal, but probably should fix eventually)
  const canReportSpam =
    !isSelf &&
    !isOffline &&
    !isSpamReported &&
    !!originChat?.hasMessagesFromOtherUser &&
    !!authUser?.uid &&
    !!userDetails?.id;

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  const removeChat = useCallback(() => {
    if (canRemove) {
      originChat?.ref?.remove();
      updateUser({ dateLastActive: getFirebaseTimestamp() });
      closeChat();
    }
  }, [canRemove, originChat, updateUser, closeChat]);

  const toggleBlock = useCallback(() => {
    if (canBlock && authUser?.uid && userDetails?.id) {
      if (isBlocked) {
        unblockUser(authUser.uid, userDetails.id);
      } else {
        blockUser(authUser.uid, userDetails.id);
        originChat?.ref?.remove();
      }

      updateUser({ dateLastActive: getFirebaseTimestamp() });
      setIsConfirmBlockOpen(false);

      if (!isBlocked) {
        closeChat();
      }
    }
  }, [canBlock, isBlocked, authUser, updateUser, userDetails, originChat, closeChat]);

  const reportSpam = useCallback(() => {
    if (canReportSpam && authUser?.uid && userDetails?.id) {
      blockUser(authUser.uid, userDetails.id);
      reportSpamUser(authUser.uid, userDetails.id);
      originChat?.ref?.remove();
      updateUser({ dateLastActive: getFirebaseTimestamp() });
      closeChat();
    }
  }, [canReportSpam, authUser, userDetails, updateUser, originChat, closeChat]);

  const confirmToggleBlock = useCallback(() => {
    setIsConfirmBlockOpen(true);
  }, []);

  const confirmReporSpam = useCallback(() => {
    setIsConfirmReportSpamOpen(true);
  }, []);

  const onMessageSubmit = useCallback(
    (message: string) => {
      if (!canSendMessage || !authUser || !userId) {
        return;
      }

      // create chat for origin user, if it doesnt exist
      if (!originChat?.id) {
        createChat(authUser.uid, userId, true);
      }

      // create chat for destination user, if it doesnt exist
      if (!destChat?.id) {
        createChat(userId, authUser?.uid, false);
      }

      // create the message itself in the shared chat messages collection
      createChatMessage(authUser.uid, userId, message);

      // update the last active date for the user
      updateUser({ dateLastActive: getFirebaseTimestamp() });
    },
    [canSendMessage, originChat, destChat, userId, authUser, updateUser]
  );

  return (
    <div className="Chat flex flex-col flex-1 min-w-0">
      <Helmet>
        <title>
          {userDetails ? `${userDetails.nickname}#${userDetails.uuid} - ` : ''}chat | babel chat
        </title>
      </Helmet>
      <MessageHeader
        userDetails={userDetails}
        destUser={destUser}
        originChat={originChat}
        isLoading={isLoadingDestUser || isLoadingOriginChat}
        isOffline={isOffline}
        isBlocked={isBlocked}
        canRemove={canRemove}
        canBlock={canBlock}
        canReportSpam={canReportSpam}
        closeChat={closeChat}
        removeChat={removeChat}
        confirmToggleBlock={confirmToggleBlock}
        confirmReporSpam={confirmReporSpam}
      />
      <MessageList
        // the `key` prop here forces the MessageList to un-mount/re-mount and completely re-render
        // whenever the dest user ID (i.e. the chat route) changes. this is a necessary workaround
        // for issues with resetting the list limit/firebase query when switching between chats
        key={userId}
        originUser={user}
        originChat={originChat}
        destUser={destUser}
        destUserId={userId}
        isBlocked={isBlocked}
        isSpamReported={isSpamReported}
        confirmToggleBlock={confirmToggleBlock}
      />
      <MessageForm canSend={canSendMessage} onSubmit={onMessageSubmit} />
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
                Are you sure you want to unblock{' '}
                <UserNickname user={userDetails} className="inline" />?
              </div>
              <div className="mb-4">
                You will receive messages and notifications from this user again.
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                Are you sure you want to block{' '}
                <UserNickname user={userDetails} className="inline" />?
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
              Are you sure you want to report <UserNickname user={userDetails} className="inline" />{' '}
              for spamming?
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

export default Chat;
