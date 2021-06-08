import 'firebase/database';
import 'firebase/auth';

import { useRef } from 'react';
import firebase from 'firebase/app';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

import { ChatMessage } from '../types/chat';
import { getMessageListId } from '../utils/chat';

export const chatMessageOptions = {
  keyField: 'id',
  refField: 'ref',
  transform: (val: any) =>
    ({
      ...val,
      dateSent: val?.dateStarted ? new Date(val?.dateSent) : null,
    } as ChatMessage),
};

export const useChatMessage = (listId: string | undefined, id: string | undefined) => {
  const db = useRef<firebase.database.Database>(firebase.database());
  const ref = listId && id ? db.current.ref(`chat_messages/${listId}/${id}`) : null;
  return useObjectVal<ChatMessage, 'id', 'ref'>(ref, chatMessageOptions);
};

export const useChatMessages = (
  userOneId: string | undefined,
  userTwoId: string | undefined,
  limit: number
) => {
  const db = useRef<firebase.database.Database>(firebase.database());
  const id = getMessageListId(userOneId, userTwoId);
  const query = id ? db.current.ref(`chat_messages/${id}`).limitToLast(limit) : null;
  return useListVals<ChatMessage, 'id', 'ref'>(query, chatMessageOptions);
};
