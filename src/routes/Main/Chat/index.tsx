import React, { FC, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { createChat, createChatMessage } from '../../../utils/chat';
import useAuth from '../../../hooks/useAuth';
import { useChatByMembers } from '../../../hooks/useChatRecord';
import { useUser } from '../../../hooks/useUserRecord';

import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import MessageHeader from './components/MessageHeader';

export interface ChatRouteParams {
  userId: string;
}

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  const { userId } = useParams<ChatRouteParams>();
  const auth = useAuth();
  const [destUser] = useUser(userId);
  const [chat] = useChatByMembers(auth.user?.uid, userId);
  const [destChat] = useChatByMembers(userId, auth.user?.uid);

  // can't send if: not logged in, dest user doesn't exist, or dest user is yourself
  const canSendMessage = useMemo<boolean>(
    () => !!destUser?.id && !!auth.user && !!userId && destUser?.id !== auth.user?.uid,
    [destUser, auth.user, userId]
  );

  const onMessageSubmit = useCallback(
    (message: string) => {
      if (!canSendMessage || !auth.user || !userId) {
        return;
      }

      // create chat for origin user, if it doesnt exist
      if (!chat?.id) {
        createChat(auth.user.uid, userId, true);
      }

      // create chat for destination user, if it doesnt exist
      if (!destChat?.id) {
        createChat(userId, auth.user?.uid, false);
      }

      createChatMessage(auth.user.uid, userId, message);
    },
    [canSendMessage, chat, destChat, userId, auth.user]
  );

  return (
    <div className="Chat flex flex-col flex-1">
      <MessageHeader destUser={destUser} />
      <MessageList originUser={auth.userRecord} originChat={chat} destUser={destUser} />
      <MessageForm canSend={canSendMessage} onSubmit={onMessageSubmit} />
    </div>
  );
};

export default Chat;
