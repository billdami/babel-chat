import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { ChatMessageRecord, ChatRecord } from '../../../../../types/chat';
import { SYSTEM_ID, SYSTEM_USER_DETAILS } from '../../../../../constants/user';
import { User, UserRecord } from '../../../../../types/user';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { useChatMessages } from '../../../../../hooks/useChatMessageRecord';
import usePrevious from '../../../../../hooks/usePrevious';
import usePageVisibility from '../../../../../hooks/usePageVisibility';
import Spinner from '../../../../../components/Spinner';
import Icon from '../../../../../components/Icon';
import Button from '../../../../../components/Button';
import { MSG_LOAD_MORE_BTN_HEIGHT, MSG_PAGE_LIMIT } from '../../../../../constants/chat';

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
  const [limit, setLimit] = useState<number>(MSG_PAGE_LIMIT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // TODO handle messagesError
  const [messages, isLoading] = useChatMessages(originUser?.id, destUserId, limit);
  const isPageVisible = usePageVisibility();
  const prevIsPageVisible = usePrevious<boolean>(isPageVisible);
  const prevMessages = usePrevious<ChatMessageRecord[] | undefined>(messages);
  const prevChatId = usePrevious<string | undefined>(originChat?.id);

  const isFirstMount = useRef<boolean>(true);
  const lastMessages = useRef<ChatMessageRecord[] | null | undefined>(messages);
  const containerElement = useRef<HTMLDivElement>(null);

  // TODO automatic load more on scroll up
  // const loadMoreElement = useRef<HTMLDivElement>(null);
  // const isLoadMoreVisible = useIsVisible(loadMoreElement.current);
  // const [debouncedIsLoadMoreVisible] = useDebounce(isLoadMoreVisible, 250);

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
    if (canLoadMore) {
      setLimit(limit + MSG_PAGE_LIMIT);
      setIsLoadingMore(true);
    }
  }, [canLoadMore, limit]);

  // TODO automatic load more on scroll up
  // useEffect(() => {
  //   if (!isLoading && !isLoadingMore && debouncedIsLoadMoreVisible) {
  //     loadMore();
  //   }
  // }, [isLoading, isLoadingMore, debouncedIsLoadMoreVisible, loadMore]);

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
      // const isScrolledUp = el.scrollTop + MSG_SCROLLED_UP_THRESHOLD < el.scrollHeight - el.clientHeight;
      const isScrolledUp = false;

      // scroll to the bottom when:
      //  - loading the initial list
      //  - new messages are added
      //  - TODO: list is scrolled up
      if (
        messages !== prevMessages &&
        messages?.length &&
        (!isScrolledUp || isFirstMount.current)
      ) {
        const msgsDiff = messages.length - (lastMessages.current?.length ?? 0);

        // dont scroll down when loading older messages
        if (!isLoadingMore) {
          el.scrollTo({
            top: el.scrollHeight - el.clientHeight,
            behavior: isFirstMount.current ? 'auto' : 'smooth',
          });
        } else {
          // get the first message before the new messages that were prepended
          const headMsg = msgsDiff > 0 && messages[msgsDiff];

          if (headMsg && containerElement.current) {
            // set the scroll position to the offset of that message
            const msgEl = containerElement.current.querySelector<HTMLDivElement>(
              `[data-msg-id="${headMsg.id}"]`
            );
            if (msgEl) {
              containerElement.current.scrollTop =
                msgEl.offsetTop - containerElement.current.offsetTop - MSG_LOAD_MORE_BTN_HEIGHT;
            }
          }
          // when older messages are done loading, reset the flag
          setIsLoadingMore(false);
        }

        isFirstMount.current = false;
        lastMessages.current = messages;
      }
    }
  }, [prevMessages, messages, isLoadingMore]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto" ref={containerElement}>
      <div className="py-1">
        {isSelf && (
          // TODO create <Alert>
          <div className="mx-2 my-2 md:mx-4 px-6 py-4 text-sm text-yellow-700 bg-yellow-100 bg-opacity-60 border-l-4 border-yellow-500 rounded-sm rounded-tl-none rounded-bl-none">
            Sorry, you can't talk to yourself on babel chat. 😛
          </div>
        )}

        {isBlocked && (
          // TODO create <Alert>
          <div className="mx-2 my-2 md:mx-4 px-6 py-4 text-sm text-yellow-700 bg-yellow-100 bg-opacity-60 border-l-4 border-yellow-500 rounded-sm rounded-tl-none rounded-bl-none">
            <Icon name="ban" className="mr-2 inline-block" size="sm" />
            {isSpamReported ? (
              'This user has been reported as spam and is permanently blocked.'
            ) : (
              <>
                This user has been blocked.{' '}
                <Button variant="link" size="sm" onClick={confirmToggleBlock} inline>
                  Unblock
                </Button>
              </>
            )}
          </div>
        )}

        {/* TODO show "warning!" alert when there are no messages yet, and the user is convicted of being a spammer */}

        {emptyChat && (
          <div className="px-2 md:px-3 py-3 text-sm text-gray-400">
            Nothing here yet...say hi and introduce yourself!
          </div>
        )}

        {/* TODO when "load more" button is visible, debounce a automatic loading of more messages */}
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

        {!isBlocked &&
          messages?.map((message) => (
            <div key={message.id} data-msg-id={message.id} className="px-2 md:px-3">
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
        {isLoading && <Spinner className="mx-2 md:mx-3 my-1" />}
      </div>
    </div>
  );
};

export default MessageList;
