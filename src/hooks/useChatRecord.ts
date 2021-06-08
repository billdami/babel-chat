import 'firebase/database';
import 'firebase/auth';

import { useRef } from 'react';
import firebase from 'firebase/app';
import { useListVals, useObject, useObjectVal } from 'react-firebase-hooks/database';

import { Chat } from '../types/chat';

import { userOptions } from './useUserRecord';

export const chatOptions = {
  keyField: 'id',
  refField: 'ref',
  transform: (val: any) =>
    ({
      ...val,
      toUserDetails: userOptions.transform(val?.toUserDetails ?? {}),
      dateStarted: val?.dateStarted ? new Date(val?.dateStarted) : null,
      dateLastSeen: val?.dateLastSeen ? new Date(val?.dateLastSeen) : null,
      dateLastMessage: val?.dateLastMessage ? new Date(val?.dateLastMessage) : null,
    } as Chat),
};

export const useChat = (id: string | undefined) => {
  const db = useRef<firebase.database.Database>(firebase.database());
  const ref = id ? db.current.ref(`chats/${id}`) : null;
  return useObjectVal<Chat, 'id', 'ref'>(ref, chatOptions);
};

export const useChatRef = (id: string | undefined) => {
  const db = useRef<firebase.database.Database>(firebase.database());
  const ref = id ? db.current.ref(`chats/${id}`) : null;
  return useObject(ref);
};

export const useChatByMembers = (
  originUserId: string | undefined,
  destUserId: string | undefined
) => {
  const db = useRef<firebase.database.Database>(firebase.database());
  const ref =
    originUserId && destUserId ? db.current.ref(`chats/${originUserId}/${destUserId}`) : null;
  return useObjectVal<Chat, 'id', 'ref'>(ref, chatOptions);
};

export const useChats = (userId: string | undefined) => {
  const db = useRef<firebase.database.Database>(firebase.database());
  const ref = userId ? db.current.ref(`chats/${userId}`) : null;
  return useListVals<Chat, 'id', 'ref'>(ref, chatOptions);
};
