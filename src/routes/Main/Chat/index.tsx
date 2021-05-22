import React, { FC, useCallback, useMemo } from 'react';
import { createChat, createChatMessage } from '../../../utils/chat';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../../components/Button';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import useAuth from '../../../hooks/useAuth';
import { useChatByMembers } from '../../../hooks/useChatRecord';
import { useUser } from '../../../hooks/useUserRecord';

interface ChatRouteParams {
  userId: string;
}

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  const { userId } = useParams<ChatRouteParams>();
  const history = useHistory();
  const auth = useAuth();
  const [destUser] = useUser(userId);
  const [chat] = useChatByMembers(auth.user?.uid, userId);
  const [destChat] = useChatByMembers(userId, auth.user?.uid);

  // can't send if: not logged in, dest user doesn't exist, or dest user is yourself
  const canSendMessage = useMemo<boolean>(
    () => !!destUser?.id && !!auth.user && !!userId && destUser?.id !== auth.user?.uid,
    [destUser, auth.user, userId]
  );

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

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
      {/* TODO create <MessageHeader> */}
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-4 border-b border-gray-200">
        {/* TODO handle when destUser don't exist ("user not found" message) */}
        <div>
          <h2 className="text-lg">
            {/* TODO create <UserNickname> to format/display user nickname */}
            <span className="font-bold">{destUser?.nickname}</span>
            <span className="tracking-tighter font-light text-gray-400">#{destUser?.uuid}</span>
          </h2>
          <div className="text-sm leading-3 text-gray-400">
            {/* TODO create <UserDetailsLine> to format/display user details */}
            {destUser?.age} {destUser?.gender}, {destUser?.country}
          </div>
        </div>
        <Button variant="muted" onClick={closeChat}>
          &times;
        </Button>
      </div>
      <MessageList originUser={auth.userRecord} originChat={chat} destUser={destUser} />
      <MessageForm canSend={canSendMessage} onSubmit={onMessageSubmit} />
    </div>
  );
};

export default Chat;
