import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';

import { ChatRecord } from '../types/chat';

import useAuth from './useAuth';
import { useChats } from './useChatRecord';
import usePrevious from './usePrevious';
import { useUserBlocks } from './useUserRecord';

interface NotificationsContext {
  unreadChats: ChatRecord[];
  numUnread: number;
  isMuted: boolean;
  toggleMute: (muted: boolean) => void;
}

const notificationsContext = createContext<NotificationsContext>({
  unreadChats: [],
  numUnread: 0,
  isMuted: false,
  toggleMute: () => {},
});

const useProvideNotifications = () => {
  const { user } = useAuth();
  const [chats] = useChats(user?.uid);
  const [userBlocks] = useUserBlocks(user?.uid);

  const [isMuted, setIsMuted] = useState<boolean>(false);

  const blockedIds = useMemo<string[]>(() => userBlocks?.map((b) => b.id) ?? [], [userBlocks]);

  const unreadChats = useMemo<ChatRecord[]>(
    () =>
      chats?.filter(
        (c) => (!c.dateLastSeen || c.dateLastSeen < c.dateLastMessage) && !blockedIds.includes(c.id)
      ) ?? [],
    [chats, blockedIds]
  );
  const numUnread = unreadChats.length;

  const prevNumUnread = usePrevious<number>(numUnread);

  const toggleMute = useCallback((muted: boolean) => setIsMuted(muted), []);

  useEffect(() => {
    // TODO use setTimeout or something to wait a few ms to see if there is still new unreads
    // in case the user is currently viewing the chat w/new unreads (or is the one sending the message)
    // in which case they will be marked read immediately after

    // notification sound should play only when the number of unread increases
    if (numUnread > prevNumUnread && !isMuted) {
      // TODO implement notification sounds
      // TODO debounce to only play sound once per second max
      console.log('You have new unread messages!');
    }

    // TODO if there are unread notifications, show indicator in browser title/tab
  }, [numUnread, prevNumUnread, isMuted]);

  return {
    unreadChats,
    numUnread,
    isMuted,
    toggleMute,
  };
};

export const ProvideNotifications: FC<{}> = ({ children }) => {
  const notifications = useProvideNotifications();
  return (
    <notificationsContext.Provider value={notifications}>{children}</notificationsContext.Provider>
  );
};

const useNotifications = () => {
  return useContext(notificationsContext);
};

export default useNotifications;
