import React, {
  FC,
  UIEvent as ReactUIEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { useDebouncedCallback } from 'use-debounce';

import Alert from '../../../../../components/Alert';
import Button from '../../../../../components/Button';
import ScrollShadow from '../../../../../components/ScrollShadow';
import Spinner from '../../../../../components/Spinner';
import { useChatMessages } from '../../../../../hooks/useChatMessageRecord';
import usePrevious from '../../../../../hooks/usePrevious';
import usePageVisibility from '../../../../../hooks/usePageVisibility';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { ChatMessageRecord, ChatRecord } from '../../../../../types/chat';
import { User, UserRecord } from '../../../../../types/user';
import { SYSTEM_ID, SYSTEM_USER_DETAILS } from '../../../../../constants/user';
import {
  MSG_LOAD_MORE_BTN_HEIGHT,
  MSG_PAGE_LIMIT,
  MSG_SCROLLED_UP_THRESHOLD,
} from '../../../../../constants/chat';

interface AuthorsMap {
  [id: string]: (User & { isSelf?: boolean }) | undefined | null;
}

interface MessageListProps {
  originUser?: UserRecord | null;
  originChat?: ChatRecord | null;
  destUser?: UserRecord | null;
  destUserId: string;
  isBlocked?: boolean;
  isSpamReported?: boolean;
  confirmToggleBlock: () => void;
}

const MessageList: FC<MessageListProps> = ({
  originUser,
  originChat,
  destUser,
  destUserId,
  isBlocked = false,
  isSpamReported = false,
  confirmToggleBlock,
}) => {
  const isFirstMount = useRef<boolean>(true);
  const containerElement = useRef<HTMLDivElement>(null);

  const [limit, setLimit] = useState<number>(MSG_PAGE_LIMIT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(
    (containerElement.current?.scrollTop ?? 0) > 0
  );

  // TODO handle messagesError
  const [messages, isLoading] = useChatMessages(originUser?.id, destUserId, limit);
  const isPageVisible = usePageVisibility();
  const prevIsPageVisible = usePrevious<boolean>(isPageVisible);
  const prevMessages = usePrevious<ChatMessageRecord[] | undefined>(messages);
  const prevChatId = usePrevious<string | undefined>(originChat?.id);

  const lastMessages = useRef<ChatMessageRecord[] | null | undefined>(messages);

  const isSelf = !!originUser && !!destUser && originUser.id === destUser.id;
  const emptyChat = !isSelf && !isBlocked && !isLoading && !messages?.length;
  const mayHaveMore = !!messages?.length && messages?.length >= limit;
  const canLoadMore = mayHaveMore && !isSelf && !isBlocked && !isLoading;

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

  const loadMore = useCallback(() => {
    if (canLoadMore && !isLoading) {
      // TODO store a temp copy of the current messages before loading more
      // which will be rendering while loading the next page, to avoid
      // the blank white page flicker that happens when the `messages` is empty
      // once the query/limit is updated
      setLimit(limit + MSG_PAGE_LIMIT);
      setIsLoadingMore(true);
    }
  }, [canLoadMore, isLoading, limit]);

  const onContainerScroll = useDebouncedCallback((event: ReactUIEvent<HTMLDivElement, UIEvent>) => {
    const el = containerElement.current;
    if (el) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      setIsScrolled(el.scrollTop > 0);
      setIsScrolledUp(el.scrollTop + MSG_SCROLLED_UP_THRESHOLD < maxScroll);
      // when scrolled all the way to the top, auto load older messages, if there are any
      if (el.scrollTop === 0 && canLoadMore && !isLoading && !isLoadingMore) {
        loadMore();
      }
    }
  }, 300);

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
      // scroll when loading the initial list or new messages are added
      if (messages !== prevMessages && messages?.length) {
        if (!isLoadingMore && (!isScrolledUp || isFirstMount.current)) {
          // scroll to the bottom on initial mount and when not loading older messages
          // and not when the container is scrolled up

          // TODO try to allow scrollTo({ behavior: 'smooth') behavior when isFirstMount is false again
          // there is a race condition bug of some kind that makes the scroll to
          // bottom happen too late when smooth scrolling when recieving new messages
          el.scrollTop = el.scrollHeight - el.clientHeight;
        } else if (isLoadingMore) {
          // maintain the current scroll position when older messages are loaded
          const msgsDiff = messages.length - (lastMessages.current?.length ?? 0);
          // get the first message before the new messages that were prepended
          const headMsg = msgsDiff > 0 && messages[msgsDiff];

          if (headMsg && containerElement.current) {
            // set the scroll position to the offset of that message
            const msgEl = containerElement.current.querySelector<HTMLDivElement>(
              `[data-msg-id="${headMsg.id}"]`
            );
            if (msgEl) {
              el.scrollTop = msgEl.offsetTop - el.offsetTop - MSG_LOAD_MORE_BTN_HEIGHT;
            }
          }
          // when older messages are done loading, reset the flag
          setIsLoadingMore(false);
        }

        isFirstMount.current = false;
        lastMessages.current = messages;
      }
    }
  }, [prevMessages, messages, isLoadingMore, isScrolledUp]);

  return (
    <div className="flex-1 flex relative overflow-hidden">
      <ScrollShadow isVisible={isScrolled} />
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        ref={containerElement}
        onScroll={onContainerScroll}
      >
        <div className="py-1">
          {isSelf && (
            <Alert variant="warning" className="my-2 mx-2 md:mx-4">
              Sorry, you can't talk to yourself on babel chat. 😛
            </Alert>
          )}

          {isBlocked && (
            <Alert variant="warning" icon="ban" className="my-2 mx-2 md:mx-4">
              {isSpamReported ? (
                <>This user has been reported as spam and is permanently blocked.</>
              ) : (
                <>
                  This user has been blocked.{' '}
                  <Button variant="link" size="sm" onClick={confirmToggleBlock} inline>
                    Unblock
                  </Button>
                </>
              )}
            </Alert>
          )}

          {/* TODO [future] show "warning!" alert when there are no messages yet, and the user is convicted of being a spammer */}

          {emptyChat && (
            <div className="px-2 md:px-3 py-3 text-sm text-gray-400 dark:text-gray-500">
              Nothing here yet...say hi and introduce yourself!
            </div>
          )}

          {canLoadMore && (
            <div className="px-2 md:px-3 py-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadMore}
                disabled={isLoading}
                fullWidth
                outline
              >
                {isLoading ? 'Loading...' : 'Load older messages'}
              </Button>
            </div>
          )}

          {!isBlocked && (
            <div className="max-w-4xl dark:text-gray-300">
              {messages?.map((message) => (
                <div key={message.id} data-msg-id={message.id} className="px-2 md:px-3">
                  <span
                    className={cn('font-bold', {
                      'text-green-500 dark:text-green-400': authors[message.author]?.isSelf,
                    })}
                  >
                    {authors[message.author]?.isSelf
                      ? 'Me'
                      : authors[message.author]?.nickname || 'Unknown'}
                    :
                  </span>{' '}
                  <span>{message.content}</span>
                </div>
              ))}
            </div>
          )}
          {isLoading && <Spinner className="mx-2 md:mx-3 my-1" />}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
