import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

export const createChat = async (
  originUserId: string,
  destUserId: string
): Promise<firebase.database.Reference> => {
  const db = firebase.database();
  const getOriginUser = db.ref(`users/${originUserId}`).get();
  const getDestUser = db.ref(`users/${destUserId}`).get();
  const users = await Promise.all([getOriginUser, getDestUser]);

  if (!users[0].exists()) {
    // TODO custom error classes
    throw new Error('origin user does not exist');
  }

  if (!users[1].exists()) {
    // TODO custom error classes
    throw new Error('destination user does not exist');
  }

  const messagesRef = await db.ref('chat_messages').push();

  // create the chat record for the origin user
  const originChatRef = await db.ref('chats').push({
    messages: messagesRef.key,
    user: originUserId,
    toUser: destUserId,
    userToUser: `${originUserId}_${destUserId}`,
    startedByUser: originUserId,
    toUserDetails: users[1].val(),
    hasMessages: false,
    isTyping: false,
    dateStarted: new Date(),
    dateLastSeen: new Date(),
    dateLastMessage: null,
  });

  // create the chat record for the destination user
  await db.ref('chats').push({
    messages: messagesRef.key,
    user: destUserId,
    toUser: originUserId,
    userToUser: `${destUserId}_${originUserId}`,
    startedByUser: originUserId,
    toUserDetails: users[0].val(),
    hasMessages: false,
    isTyping: false,
    dateStarted: new Date(),
    dateLastSeen: null,
    dateLastMessage: null,
  });

  return originChatRef;
};
