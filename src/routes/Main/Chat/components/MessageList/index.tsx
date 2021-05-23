import React, { FC, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Val } from 'react-firebase-hooks/database/dist/database/types';
import cn from 'classnames';

import { Chat, ChatMessage } from '../../../../../types/chat';
import { SYSTEM_ID, SYSTEM_USER_DETAILS } from '../../../../../constants/user';
import { User } from '../../../../../types/user';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { useChatMessages } from '../../../../../hooks/useChatMessageRecord';
import usePrevious from '../../../../../hooks/usePrevious';

interface AuthorsMap {
  [id: string]: User & { isSelf?: boolean };
}

interface MessageListProps {
  originUser?: User | null;
  originChat?: Val<Chat, 'id', 'ref'> | null;
  destUser?: User | null;
}

const MessageList: FC<MessageListProps> = ({ originUser, originChat, destUser }) => {
  // TODO create a usePagination() hook to allow for infinite paging of messages
  // TODO handle messagesError
  const [messages, isLoading] = useChatMessages(originUser?.id, destUser?.id);
  const prevMessages = usePrevious<Val<ChatMessage, 'id', 'ref'>[] | undefined>(messages);

  const isFirstMount = useRef<boolean>(true);
  const containerElement = useRef<HTMLDivElement>(null);

  const authors = useMemo<AuthorsMap>(() => {
    const map: AuthorsMap = { [SYSTEM_ID]: SYSTEM_USER_DETAILS };
    if (originUser?.id) {
      map[originUser.id] = { ...originUser, isSelf: true };
    }

    if (destUser?.id) {
      map[destUser.id] = destUser;
    }
    return map;
  }, [originUser, destUser]);

  useEffect(() => {
    if (messages !== prevMessages) {
      if (messages !== prevMessages && originChat?.id && originChat?.ref) {
        originChat.ref.update({ dateLastSeen: getFirebaseTimestamp() });
      }
    }
  }, [prevMessages, messages, originChat]);

  useLayoutEffect(() => {
    const el = containerElement.current;
    if (el) {
      // TODO [BUG] this is being calculated AFTER the new message is appended,
      // so the container is always scrolled up. need to calculate it before
      // the new messages render...
      // POSSIBLE SOLUTION: get the height of the added message elements to add to the threshold
      // const isScrolledUp = el.scrollTop + SCROLLED_UP_THRESHOLD < el.scrollHeight - el.clientHeight;
      const isScrolledUp = false;

      if (
        messages !== prevMessages &&
        messages?.length &&
        (!isScrolledUp || isFirstMount.current)
      ) {
        el.scrollTo({
          top: el.scrollHeight - el.clientHeight,
          // TODO when transitioning between chats, make the scroll to bottom immediate
          behavior: isFirstMount.current ? 'auto' : 'smooth',
        });

        isFirstMount.current = false;
      }
    }
  }, [prevMessages, messages]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto" ref={containerElement}>
      <div className="py-1">
        {messages?.map((message) => (
          <div key={message.id} className="px-4">
            <span
              className={cn('font-bold', { 'text-green-500': authors[message.author]?.isSelf })}
            >
              {authors[message.author]?.isSelf ? 'Me' : authors[message.author]?.nickname}:
            </span>{' '}
            <span>{message.content}</span>
          </div>
        ))}
        {isLoading && (
          // TODO create <LoadingSpinner isShown={isLoading} />
          <div className="px-4">Loading&hellip;</div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
