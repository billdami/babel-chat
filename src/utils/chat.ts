import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

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

  // create the chat record for the origin user
  const originChatRef = await db.ref(`chats/${originUserId}_${destUserId}`).set({
    user: originUserId,
    toUser: destUserId,
    startedByUser: originUserId,
    toUserDetails: destUser.val(),
    hasMessages: false,
    isTyping: false,
    dateStarted: firebase.database.ServerValue.TIMESTAMP,
    dateLastSeen: isInitiator ? firebase.database.ServerValue.TIMESTAMP : null,
    dateLastMessage: null,
  });

  return originChatRef;
};

export const createChatMessage = async (
  originUserId: string,
  destUserId: string,
  content: string,
  isSystem: boolean = false
) => {
  const db = firebase.database();
  const listId = getMessageListId(originUserId, destUserId);
  const messageRef = await db.ref(`chat_messages/${listId}`).push({
    dateSent: firebase.database.ServerValue.TIMESTAMP,
    author: originUserId,
    content,
    isSystem,
  });
  return messageRef;
};
