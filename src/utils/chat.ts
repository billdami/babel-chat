import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

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

  const chatRef = db.ref(`chats/${originUserId}/${destUserId}`).set({
    startedByUser: isInitiator ? originUserId : destUserId,
    toUserDetails: destUser.val(),
    isPinned: false,
    isTyping: false,
    hasMessagesFromOtherUser: !isInitiator,
    dateLastSeen: isInitiator ? getFirebaseTimestamp() : null,
    dateStarted: getFirebaseTimestamp(),
    dateLastMessage: null,
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
