import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

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
  const db = firebase.database();
  const ref = id ? db.ref(`chats/${id}`) : null;
  return useObjectVal<Chat, 'id', 'ref'>(ref, chatOptions);
};

export const useChatByUser = (userId: string | undefined, toUserId: string | undefined) => {
  const db = firebase.database();
  const query =
    userId && toUserId
      ? db.ref('chats').orderByChild('userToUser').equalTo(`${userId}_${toUserId}`).limitToFirst(1)
      : null;
  // TODO needs to use UseListVals()??
  return useObjectVal<Chat, 'id', 'ref'>(query, chatOptions);
};

export const useChats = (userId: string | undefined) => {
  const db = firebase.database();
  const query = userId ? db.ref('chats').orderByChild('user').equalTo(userId) : null;
  return useListVals<Chat, 'id', 'ref'>(query, chatOptions);
};
