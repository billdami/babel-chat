import React, { FC, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { createChat, createChatMessage } from '../../../utils/chat';
import useAuth from '../../../hooks/useAuth';
import { useChatByMembers } from '../../../hooks/useChatRecord';
import { useUser } from '../../../hooks/useUserRecord';
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
  const { user, userRecord, updateUser } = useAuth();
  const [destUser, isLoadingDestUser] = useUser(userId);
  const [chat] = useChatByMembers(user?.uid, userId);
  const [destChat] = useChatByMembers(userId, user?.uid);

  // can't send if: not logged in, dest user doesn't exist, or dest user is yourself
  const canSendMessage = useMemo<boolean>(
    () => !!destUser?.id && !!user && !!userId && destUser?.id !== user?.uid,
    [destUser, user, userId]
  );

  const onMessageSubmit = useCallback(
    (message: string) => {
      if (!canSendMessage || !user || !userId) {
        return;
      }

      // create chat for origin user, if it doesnt exist
      if (!chat?.id) {
        createChat(user.uid, userId, true);
      }

      // create chat for destination user, if it doesnt exist
      if (!destChat?.id) {
        createChat(userId, user?.uid, false);
      }

      // create the message itself in the shared chat messages collection
      createChatMessage(user.uid, userId, message);

      // update the last active date for the user
      updateUser({ dateLastActive: getFirebaseTimestamp() });
    },
    [canSendMessage, chat, destChat, userId, user, updateUser]
  );

  return (
    <div className="Chat flex flex-col flex-1">
      <MessageHeader destUser={destUser} originChat={chat} isLoading={isLoadingDestUser} />
      <MessageList originUser={userRecord} originChat={chat} destUser={destUser} />
      <MessageForm canSend={canSendMessage} onSubmit={onMessageSubmit} />
    </div>
  );
};

export default Chat;
