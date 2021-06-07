import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

import { ChatRecord, ChatSort } from '../types/chat';

import { getFirebaseTimestamp } from './firebase';

export const getMessageListId = (userOneId?: string, userTwoId?: string) =>
  userOneId && userTwoId
    ? [userOneId, userTwoId].sort((a, b) => a.localeCompare(b)).join('_')
    : null;

export const createChat = async (
  originUserId: string,
  destUserId: string,
  isInitiator: boolean
): Promise<firebase.database.Reference> => {
  const db = firebase.database();
  const destUser = await db.ref(`users/${destUserId}`).get();

  if (!destUser.exists()) {
    // TODO custom error classes
    throw new Error('destination user does not exist');
  }

  const chatRef = db.ref(`chats/${originUserId}/${destUserId}`).update({
    startedByUser: isInitiator ? originUserId : destUserId,
    toUserDetails: destUser.val(),
    isPinned: false,
    isTyping: false,
    hasMessagesFromOtherUser: !isInitiator,
    dateLastSeen: isInitiator ? getFirebaseTimestamp() : null,
    dateStarted: getFirebaseTimestamp(),
  });

  return chatRef;
};

export const createChatMessage = async (
  originUserId: string,
  destUserId: string,
  content: string,
  isSystem: boolean = false
): Promise<firebase.database.Reference> => {
  const db = firebase.database();
  const listId = getMessageListId(originUserId, destUserId);
  const dateSent = getFirebaseTimestamp();

  const messageRef = db.ref(`chat_messages/${listId}`).push({
    author: originUserId,
    dateSent,
    content,
    isSystem,
  });

  // update both chats with the sent date of the new message
  // and the date last seen for the sender's chat
  // and flag the dest chat as having messages from the other user
  db.ref().update({
    [`chats/${originUserId}/${destUserId}/dateLastSeen`]: dateSent,
    [`chats/${originUserId}/${destUserId}/dateLastMessage`]: dateSent,
    [`chats/${destUserId}/${originUserId}/dateLastMessage`]: dateSent,
    [`chats/${destUserId}/${originUserId}/hasMessagesFromOtherUser`]: true,
  });

  return messageRef;
};

export const sortChatRecords = (a: ChatRecord, b: ChatRecord, sorts: ChatSort[]) => {
  for (let sort of sorts) {
    let d = 0;
    let aVal;
    let bVal;

    switch (sort.property) {
      case 'nickname':
        aVal = `${a.toUserDetails.nickname}#${a.toUserDetails.uuid}`;
        bVal = `${b.toUserDetails.nickname}#${b.toUserDetails.uuid}`;
        d = sort.isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        break;
      case 'dateLastMessage':
      case 'dateStarted':
        aVal = a[sort.property]?.getTime() ?? 0;
        bVal = b[sort.property]?.getTime() ?? 0;
        d = sort.isDescending ? bVal - aVal : aVal - bVal;
        break;
    }

    if (d !== 0) {
      return d;
    }
  }

  return 0;
};
