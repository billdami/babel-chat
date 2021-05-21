import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createChat, createChatMessage } from '../../../utils/chat';
import { useHistory, useParams } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { useChatByMembers } from '../../../hooks/useChatRecord';
import { useChatMessages } from '../../../hooks/useChatMessageRecord';
import { useUser } from '../../../hooks/useUserRecord';

interface ChatRouteParams {
  userId: string;
}

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  const { userId } = useParams<ChatRouteParams>();
  const history = useHistory();
  const auth = useAuth();
  const [user] = useUser(userId);
  const [chat] = useChatByMembers(auth.user?.uid, userId);
  const [destChat] = useChatByMembers(userId, auth.user?.uid);
  const [messages, isMessagesLoading] = useChatMessages(auth.user?.uid, userId);

  const newMessageInput = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState<string>('');

  const canSendMessage = useMemo<boolean>(
    () => newMessage?.trim().length > 0 && !!user?.id && !!auth.user,
    [newMessage, user, auth.user]
  );

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  const onNewMessageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  }, []);

  const onMessageSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

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

      createChatMessage(auth.user.uid, userId, newMessage.trim());
      setNewMessage('');
      newMessageInput.current?.focus();
    },
    [newMessage, canSendMessage, chat, destChat, userId, auth.user]
  );

  // TODO create useOnMountCallback hook
  useEffect(() => {
    if (chat?.id) {
      //TODO update dateLastSeen of current user's chat record on mount
    }
  }, [chat]);

  return (
    <div className="Chat flex flex-col flex-1">
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-4 border-b border-gray-200">
        {/* TODO handle when user/chat.toUserDetails don't exist ("user not found" message) */}
        <div>
          <h2 className="text-lg">
            {/* TODO create <UserNickname> to format/display user nickname */}
            <span className="font-bold">{user?.nickname}</span>
            <span className="tracking-tighter font-light text-gray-400">#{user?.uuid}</span>
          </h2>
          <div className="text-sm leading-3 text-gray-400">
            {/* TODO create <UserDetailsLine> to format/display user details */}
            {user?.age} {user?.gender}, {user?.country}
          </div>
        </div>
        <button
          type="button"
          className="text-center font-bold text-gray-500 bg-white border border-gray-200 rounded px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={closeChat}
        >
          &times;
        </button>
      </div>
      {/* TODO create <MessagesList> */}
      <div className="flex-1 overflow-y-auto">
        {/* Push messages list to bottom of parent */}
        <div className="py-1">
          {messages?.map((message) => (
            <div key={message.id} className="px-4">
              {message.author}: {message.content}
            </div>
          ))}
          {isMessagesLoading && (
            // TODO create <LoadingSpinner />
            <div className="px-4">Loading&hellip;</div>
          )}
        </div>
      </div>
      {/* create <MessageForm> */}
      <form
        className="flex-shrink-0 flex py-2 px-4 border-t border-gray-200"
        onSubmit={onMessageSubmit}
      >
        <input
          type="text"
          className="block flex-1 px-3 py-1 mr-4 rounded-sm border border-gray-300"
          placeholder="Type a message..."
          id="signup-nickname"
          autoComplete="off"
          value={newMessage}
          onChange={onNewMessageChange}
          ref={newMessageInput}
        />
        <button
          type="submit"
          className="block text-center font-bold text-white bg-green-400 rounded px-8 py-2 shadow active:shadow-none disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canSendMessage}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
