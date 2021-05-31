import React, { FC, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { createChat, createChatMessage } from '../../../utils/chat';
import useAuth from '../../../hooks/useAuth';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { useChatByMembers } from '../../../hooks/useChatRecord';
import { useUser, useUserBlocks } from '../../../hooks/useUserRecord';
import { getFirebaseTimestamp } from '../../../utils/firebase';

import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import MessageHeader from './components/MessageHeader';

export interface ChatRouteParams {
  userId: string;
}

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  const { userId } = useParams<ChatRouteParams>();
  const { user: authUser } = useAuth();
  const { user, updateUser } = useCurrentUser();
  const [destUser, isLoadingDestUser] = useUser(userId);
  const [originChat, isLoadingOriginChat] = useChatByMembers(authUser?.uid, userId);
  const [destChat] = useChatByMembers(userId, authUser?.uid);
  const [userBlocks] = useUserBlocks(user?.id);

  const isBlocked = useMemo<boolean>(
    () => (userBlocks?.map((b) => b.id) ?? []).includes(userId),
    [userBlocks, userId]
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
      <MessageHeader
        destUser={destUser}
        originChat={originChat}
        isLoading={isLoadingDestUser || isLoadingOriginChat}
        isBlocked={isBlocked}
      />
      <MessageList
        originUser={user}
        originChat={originChat}
        destUser={destUser}
        destUserId={userId}
        isBlocked={isBlocked}
      />
      <MessageForm canSend={canSendMessage} onSubmit={onMessageSubmit} />
    </div>
  );
};

export default Chat;
