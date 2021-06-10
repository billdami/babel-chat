import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

import firebase from 'firebase/app';

import { Gender, NewUserDetails, User, UserFilter, UserRecord, UserSort } from '../types/user';
import { Country } from '../types/country';
import { UNSPECIFIED } from '../constants/user';

import { generateRandomNickname, generateRandomUUID } from './random';
import { getFirebaseTimestamp } from './firebase';
import { env, envVar } from './env';
import { getStatusSorting } from './time';

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

export const sortUserRecords = (
  a: UserRecord,
  b: UserRecord,
  sorts: UserSort[],
  currentTime: number,
  firstCountry?: Country
) => {
  for (let sort of sorts) {
    let d = 0;
    let aVal;
    let bVal;

    switch (sort.property) {
      case 'nickname':
        aVal = `${a.nickname}#${a.uuid}`;
        bVal = `${b.nickname}#${b.uuid}`;
        d = sort.isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        break;
      case 'country':
        aVal =
          a.country === Country.UNSPECIFIED
            ? 'ZZ'
            : firstCountry && firstCountry !== Country.UNSPECIFIED && a.country === firstCountry
            ? 'AA'
            : a.country;
        bVal =
          b.country === Country.UNSPECIFIED
            ? 'ZZ'
            : firstCountry && firstCountry !== Country.UNSPECIFIED && b.country === firstCountry
            ? 'AA'
            : b.country;
        d = sort.isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        break;
      case 'gender':
        aVal = a.gender === Gender.UNSPECIFIED ? 'ZZ' : a.gender;
        bVal = b.gender === Gender.UNSPECIFIED ? 'ZZ' : b.gender;
        d = sort.isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        break;
      case 'age':
        aVal = a.age === UNSPECIFIED ? 999 : a.age;
        bVal = b.age === UNSPECIFIED ? 999 : b.age;
        d = sort.isDescending ? bVal - aVal : aVal - bVal;
        break;
      case 'status':
        aVal = getStatusSorting(currentTime, a.dateLastActive);
        bVal = getStatusSorting(currentTime, b.dateLastActive);
        d = sort.isDescending ? bVal - aVal : aVal - bVal;
        break;
    }

    if (d !== 0) {
      return d;
    }
  }

  return 0;
};

export const groupUserFilters = (filters: UserFilter[]): UserFilter[][] => {
  const countryFilters = filters.filter((f) => f.property === 'country' && !!f.value);
  const genderFilters = filters.filter((f) => f.property === 'gender' && !!f.value);
  const nicknameFilters = filters.filter(
    (f) => f.property === 'nickname' && f.value?.trim().length > 0
  );
  // TODO allow value of "x" for age inputs to indicate "unspecified"
  const ageFilters = filters.filter(
    (f) =>
      f.property === 'age' &&
      ((f.value?.[0]?.toString().trim().length && !isNaN(Number(f.value?.[0]))) ||
        (f.value?.[1]?.toString().trim().length && !isNaN(Number(f.value?.[1]))))
  );
  return [nicknameFilters, countryFilters, genderFilters, ageFilters].filter(
    (group) => group.length > 0
  );
};

export const filterUserRecords = (
  user: UserRecord,
  term: string,
  groupedFilters: UserFilter[][]
): boolean => {
  // TODO [future] parse advanced query syntax (e.g.  “gender:female age:25-50 country:US”, "age:>25", "nickname:"foo"")
  const fullNickname = `${user.nickname.toLocaleUpperCase()}#${user.uuid}`;

  if (term && fullNickname.indexOf(term) === -1) {
    return false;
  }

  for (let group of groupedFilters) {
    // if ANY of the filters pass in the group, continue on (filters of the same type are OR'ed)
    let groupPassed = false;
    for (let filter of group) {
      switch (filter.property) {
        case 'nickname':
          if (fullNickname.indexOf(filter.value.toLocaleUpperCase()) !== -1) {
            groupPassed = true;
          }
          break;
        case 'country':
          if (user.country === filter.value) {
            groupPassed = true;
          }
          break;
        case 'gender':
          if (user.gender === filter.value) {
            groupPassed = true;
          }
          break;
        case 'age': {
          // TODO allow value of "x" for age inputs to indicate "unspecified"
          const v1 = filter.value?.[0];
          const v2 = filter.value?.[1];
          const minAge = v1?.toString().trim().length ? Number(v1) : null;
          const maxAge = v2?.toString().trim().length ? Number(v2) : null;
          if (
            (minAge === null ||
              isNaN(minAge) ||
              (typeof user.age === 'number' && user.age >= minAge)) &&
            (maxAge === null ||
              isNaN(maxAge) ||
              (typeof user.age === 'number' && user.age <= maxAge))
          ) {
            groupPassed = true;
          }
          break;
        }
      }

      if (groupPassed) {
        break;
      }
    }

    // if a group does NOT pass, immediately fail (filter groups are AND'ed)
    if (!groupPassed) {
      return false;
    }
  }

  return true;
};
