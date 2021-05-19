import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

import { NewUserDetails, User } from '../types/user';
import { generateRandomNickname, generateRandomUUID } from './random';

export const createUser = async (uid: string, details: NewUserDetails): Promise<firebase.database.Reference> => {
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
  const userRef = db.ref(`users/${uid}`);
  const userData = {
    ...details,
    uuid,
    nickname: details.nickname || generateRandomNickname(),
    dateSignedIn: firebase.database.ServerValue.TIMESTAMP,
    dateLastActive: firebase.database.ServerValue.TIMESTAMP,
  };

  await userRef.set(userData);
  await db.ref(`user_uuids/${uuid}`).set(true);

  return userRef;
};

export const deleteUser = async (uid: string): Promise<void> => {
  const db = firebase.database();
  const userRef = db.ref(`users/${uid}`);
  const userRec = await userRef.get();

  if (userRec.exists()) {
    const userData: User = userRec.val();
    const uuidRef = db.ref(`user_uuids/${userData.uuid}`);

    // TODO clean up all other related data (user's own chats, etc)
    await Promise.all([userRef.remove(), uuidRef.remove()]);
  }
};
