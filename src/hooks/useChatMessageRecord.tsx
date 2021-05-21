import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

import { ChatMessage } from '../types/chat';

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
  const db = firebase.database();
  const ref = listId && id ? db.ref(`chat_messages/${listId}/${id}`) : null;
  return useObjectVal<ChatMessage, 'id', 'ref'>(ref, chatMessageOptions);
};

export const useChatMessages = (listId: string | undefined) => {
  const db = firebase.database();
  const ref = db.ref(`chat_messages/${listId}`);
  return useListVals<ChatMessage, 'id', 'ref'>(ref, chatMessageOptions);
};
