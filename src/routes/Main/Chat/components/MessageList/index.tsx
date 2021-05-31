import React, { FC, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import cn from 'classnames';

import { ChatMessageRecord, ChatRecord } from '../../../../../types/chat';
import { SYSTEM_ID, SYSTEM_USER_DETAILS } from '../../../../../constants/user';
import { User, UserRecord } from '../../../../../types/user';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { useChatMessages } from '../../../../../hooks/useChatMessageRecord';
import usePrevious from '../../../../../hooks/usePrevious';
import usePageVisibility from '../../../../../hooks/usePageVisibility';
import Spinner from '../../../../../components/Spinner';

interface AuthorsMap {
  [id: string]: (User & { isSelf?: boolean }) | undefined | null;
}

interface MessageListProps {
  originUser?: UserRecord | null;
  originChat?: ChatRecord | null;
  destUser?: UserRecord | null;
  destUserId?: string;
}

const MessageList: FC<MessageListProps> = ({ originUser, originChat, destUser, destUserId }) => {
  // TODO create a usePagination() hook to allow for infinite paging of messages
  // TODO handle messagesError
  const [messages, isLoading] = useChatMessages(originUser?.id, destUserId);
  const isPageVisible = usePageVisibility();
  const prevIsPageVisible = usePrevious<boolean>(isPageVisible);
  const prevMessages = usePrevious<ChatMessageRecord[] | undefined>(messages);
  const prevChatId = usePrevious<string | undefined>(originChat?.id);

  const isFirstMount = useRef<boolean>(true);
  const containerElement = useRef<HTMLDivElement>(null);

  const authors = useMemo<AuthorsMap>(() => {
    const map: AuthorsMap = { [SYSTEM_ID]: SYSTEM_USER_DETAILS };
    if (originUser?.id) {
      map[originUser.id] = { ...originUser, isSelf: true };
    }

    if (destUserId) {
      map[destUserId] = destUser?.id ? destUser : originChat?.toUserDetails;
    }

    if (destUser?.id && !map[destUser?.id]) {
      map[destUser?.id] = destUser;
    }

    if (originChat?.id && !map[originChat?.id]) {
      map[originChat?.id] = originChat?.toUserDetails;
    }

    return map;
  }, [originUser, originChat, destUser, destUserId]);

  useEffect(() => {
    // if new messages were added, update the user's dateLastSeen to mark them as "read"
    // unless the browser window/tab is currently not visible/active
    // OR if the window/tab just became visible/active
    if (
      originChat?.id &&
      originChat?.ref &&
      ((messages !== prevMessages && isPageVisible) || (isPageVisible && !prevIsPageVisible))
    ) {
      originChat.ref.update({ dateLastSeen: getFirebaseTimestamp() });
    }
  }, [prevMessages, messages, originChat, isPageVisible, prevIsPageVisible]);

  useEffect(() => {
    // if the chat just became created (i.e. the other user sent the first message while the user
    // is viewing the chat between them) then immediately update the dateLastSeen
    if (!prevChatId && originChat?.id) {
      originChat.ref?.update({ dateLastSeen: getFirebaseTimestamp() });
    }
  }, [originChat, prevChatId]);

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
        {originUser && destUser && originUser.id === destUser.id && (
          <div className="mx-2 my-2 md:mx-4 px-6 py-4 text-sm text-yellow-600 bg-yellow-100 rounded">
            Sorry, you can't talk to yourself on babel chat. 😛
          </div>
        )}
        {/* TODO show "welcome" CTA when there are no messages yet, e.g. "Nothing here yet... Introduce yourself and say hi!" */}
        {messages?.map((message) => (
          <div key={message.id} className="px-2 md:px-3">
            <span
              className={cn('font-bold', { 'text-green-500': authors[message.author]?.isSelf })}
            >
              {authors[message.author]?.isSelf
                ? 'Me'
                : authors[message.author]?.nickname || 'Unknown'}
              :
            </span>{' '}
            <span>{message.content}</span>
          </div>
        ))}
        {isLoading && <Spinner className="mx-2 md:mx-4 my-1" />}
      </div>
    </div>
  );
};

export default MessageList;
