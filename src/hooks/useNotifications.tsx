import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useDebounce, useThrottledCallback } from 'use-debounce';
import useSound from 'use-sound';

import { ChatRecord } from '../types/chat';
import { lsGet, lsRemove, lsSet } from '../utils/localStorage';
// @ts-ignore
import muteSfx from '../audio/mute.mp3';
// @ts-ignore
import unmuteSfx from '../audio/unmute.mp3';
// @ts-ignore
import notifySfx from '../audio/intuition.mp3';

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
  const [numUnread, setNumUnread] = useState<number>(0);
  const [dbNumUnread] = useDebounce<number>(numUnread, 250);
  const prevNumUnread = usePrevious<number>(dbNumUnread);

  const [playMute] = useSound(muteSfx, { volume: 0.25 });
  const [playUnmute] = useSound(unmuteSfx, { volume: 0.5 });
  const [playNotification] = useSound(notifySfx, { volume: 0.75, soundEnabled: !isMuted });

  const throttledPlayNotification = useThrottledCallback(playNotification, 1000, {
    trailing: false,
  });

  const blockedIds = useMemo<string[]>(() => userBlocks?.map((b) => b.id) ?? [], [userBlocks]);

  const unreadChats = useMemo<ChatRecord[]>(
    () =>
      chats?.filter(
        (c) => (!c.dateLastSeen || c.dateLastSeen < c.dateLastMessage) && !blockedIds.includes(c.id)
      ) ?? [],
    [chats, blockedIds]
  );

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

  // update the count of unread chats when the chats change as a separate state value
  // so that the updates can be debounced
  useEffect(() => setNumUnread(unreadChats.length), [unreadChats]);

  useEffect(() => {
    // notification sound should play only when the number of unread increases
    // TODO [future] play notification when new additional messages are received
    // for chats that already have unread messages (need to keep track of the last
    // message/seen date for each chat, instead of just counting the unread total)
    if (dbNumUnread > prevNumUnread) {
      throttledPlayNotification();
    }
  }, [dbNumUnread, prevNumUnread, throttledPlayNotification]);

  return {
    numUnread: dbNumUnread,
    unreadChats,
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
