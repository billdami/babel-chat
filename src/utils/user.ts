import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

import { NewUserDetails, User, UserRecord } from '../types/user';

import { generateRandomNickname, generateRandomUUID } from './random';
import { getFirebaseTimestamp } from './firebase';
import { env, envVar } from './env';

export const createUser = async (
  id: string,
  details: NewUserDetails
): Promise<firebase.database.Reference> => {
  const db = firebase.database();
  const takenUUIDs: number[] = [];
  const userUUIDs = await db.ref('user_uuids').get();

  if (userUUIDs.exists()) {
    userUUIDs.forEach((ss) => {
      if (ss.key) {
        takenUUIDs.push(Number(ss.key));
      }
    });
  }

  const uuid = generateRandomUUID(takenUUIDs);
  const userRef = db.ref(`users/${id}`);
  const userData = {
    ...details,
    uuid,
    nickname: details.nickname || generateRandomNickname(),
    dateSignedIn: getFirebaseTimestamp(),
    dateLastActive: getFirebaseTimestamp(),
  };

  await userRef.set(userData);
  await db.ref(`user_uuids/${uuid}`).set(id);

  return userRef;
};

export const deleteUser = async (uid: string): Promise<void> => {
  const db = firebase.database();
  const userRef = db.ref(`users/${uid}`);
  const userRec = await userRef.get();

  if (userRec.exists()) {
    const userData: User = userRec.val();
    const uuidRef = db.ref(`user_uuids/${userData.uuid}`);
    await Promise.all([userRef.remove(), uuidRef.remove()]);
  }
};

export const logUser = (userId: string): Promise<Response> => {
  return fetch(`${envVar('FB_FUNCTIONS_BASE_URL')}/${env()}RegisterUser`, {
    method: 'POST',
    body: new URLSearchParams({ userId }),
  });
};

export const blockUser = async (originUserId: string, blockedUserId: string): Promise<void> => {
  const db = firebase.database();
  const ref = db.ref(`user_blocks/${originUserId}/${blockedUserId}`);
  await ref.set({ dateCreated: getFirebaseTimestamp() });
};

export const unblockUser = async (originUserId: string, blockedUserId: string): Promise<void> => {
  const db = firebase.database();
  const ref = db.ref(`user_blocks/${originUserId}/${blockedUserId}`);
  await ref.remove();
};

export const reportSpamUser = async (
  originUserId: string,
  blockedUserId: string
): Promise<void> => {
  const db = firebase.database();
  const ref = db.ref(`user_spam_reports/${originUserId}/${blockedUserId}`);
  await ref.set({ dateCreated: getFirebaseTimestamp() });
};

export const createFeedbackMessage = async (
  email: string,
  message: string,
  userRec: UserRecord
): Promise<firebase.database.Reference> => {
  const db = firebase.database();
  const messagesRef = db.ref('feedback_messages');

  const user = {
    id: userRec.id,
    uuid: userRec.uuid,
    nickname: userRec.nickname,
    country: userRec.country,
    age: userRec.age,
    gender: userRec.gender,
    agreedToToS: userRec.agreedToToS,
    dateSignedIn: userRec.dateSignedIn,
    dateLastActive: userRec.dateLastActive,
  };

  const browser = {
    ua: navigator?.userAgent,
    href: window.location?.href,
    pathname: window.location?.pathname,
    screenHeight: window.screen?.height,
    screenWidth: window.screen?.width,
    screenAvailHeight: window.screen?.availHeight,
    screenAvailWidth: window.screen?.availWidth,
  };

  const messageRef = await messagesRef.push({
    dateCreated: getFirebaseTimestamp(),
    email,
    message,
    user,
    browser,
  });

  return messageRef;
};
