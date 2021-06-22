import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import useSound from 'use-sound';

import { ChatRecord } from '../types/chat';
import { lsGet, lsRemove, lsSet } from '../utils/localStorage';
// @ts-ignore
import muteSfx from '../audio/mute.mp3';
// @ts-ignore
import unmuteSfx from '../audio/unmute.mp3';
// @ts-ignore
// import pingSfx from '../audio/ping.mp3';

import useAuth from './useAuth';
import { useChats } from './useChatRecord';
import usePrevious from './usePrevious';
import { useUserBlocks } from './useUserRecord';

type MutePref = 'muted' | null | undefined;

interface NotificationsContext {
  unreadChats: ChatRecord[];
  numUnread: number;
  isMuted: boolean;
  toggleMute: (muted: boolean) => void;
}

export const getMutePref = (): boolean => {
  const pref = lsGet<MutePref>('muteSounds');
  return pref === 'muted';
};

const notificationsContext = createContext<NotificationsContext>({
  unreadChats: [],
  numUnread: 0,
  isMuted: getMutePref(),
  toggleMute: () => {},
});

const useProvideNotifications = () => {
  const { user } = useAuth();
  const [chats] = useChats(user?.uid);
  const [userBlocks] = useUserBlocks(user?.uid);

  const [isMuted, setIsMuted] = useState<boolean>(getMutePref());

  const [playMute] = useSound(muteSfx, { volume: 0.25 });
  const [playUnmute] = useSound(unmuteSfx, { volume: 0.5 });

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

  const toggleMute = useCallback(
    (muted: boolean) => {
      muted ? playMute() : playUnmute();
      setIsMuted(muted);
      if (muted) {
        lsSet('muteSounds', 'muted');
      } else {
        lsRemove('muteSounds');
      }
    },
    [playMute, playUnmute]
  );

  useEffect(() => {
    // TODO use setTimeout or something to wait a few ms to see if there is still new unreads
    // in case the user is currently viewing the chat w/new unreads (or is the one sending the message)
    // in which case they will be marked read immediately after

    // notification sound should play only when the number of unread increases
    if (numUnread > prevNumUnread && !isMuted) {
      // TODO implement notification sounds
      // TODO useThrottledCallback so sounds dont play more than once a second
      // @see (https://github.com/xnimorz/use-debounce#usethrottledcallback)
      console.log('You have new unread messages!');
    }

    // TODO if there are unread notifications, show indicator text in browser title
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
