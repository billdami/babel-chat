import React, { ChangeEvent, FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ChatRouteParams {
  userId: string;
}

interface ChatProps {}

const FIXTURE = {
  user: 'user1',
  messages: 'chat_messages1',
  to: {
    age: 'UNSPECIFIED',
    country: 'UNSPECIFIED',
    dateLastActive: 123456789,
    dateLastMessage: 123456789,
    dateSignedIn: 123456789,
    gender: 'UNSPECIFIED',
    nickname: 'User 2',
    uuid: 456779,
  },
  startedByUser: 'user1',
  isTyping: false,
  dateStarted: 123456789,
  dateLastSeen: 123456789,
  dateLastMessage: 123456789,
};

const Chat: FC<ChatProps> = () => {
  const { userId } = useParams<ChatRouteParams>();
  const history = useHistory();
  //TODO
  const chat = FIXTURE;

  const newMessageInput = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState<string>('');

  // include checks for if user signed out, etc
  const canSendMessage = useMemo<boolean>(() => newMessage?.trim().length > 0, [newMessage]);

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  const onNewMessageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  }, []);

  const onMessageSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!canSendMessage) {
        return;
      }

      console.log('TODO: send message!', newMessage);
      setNewMessage('');
      newMessageInput.current?.focus();
    },
    [newMessage, canSendMessage]
  );

  useEffect(() => {
    console.log(userId);
    //TODO create `chats` records if they dont exist
  }, [userId]);

  return (
    <div className="Chat flex flex-col flex-1">
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-4 border-b border-gray-200">
        <div>
          <div>
            <h2 className="text-lg">
              {/* TODO create <UserNickname> to format/display user nickname */}
              <span className="font-bold">{chat.to.nickname}</span>
              <span className="tracking-tighter font-light text-gray-400">#{chat.to.uuid}</span>
            </h2>
          </div>
          <div className="text-sm leading-3 text-gray-400">
            {/* TODO create <UserDetailsLine> to format/display user details */}
            {chat.to.age} {chat.to.gender}, {chat.to.country}
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
      <div className="flex-1 overflow-y-auto">user id: {userId}</div>
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
