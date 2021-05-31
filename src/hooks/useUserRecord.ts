import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

import { User, UserBlock, UserSpamReport } from '../types/user';

export const userOptions = {
  keyField: 'id',
  refField: 'ref',
  transform: (val: any) =>
    ({
      ...val,
      dateSignedIn: val?.dateSignedIn ? new Date(val?.dateSignedIn) : null,
      dateLastActive: val?.dateLastActive ? new Date(val?.dateLastActive) : null,
    } as User),
};

export const userBlockOptions = {
  keyField: 'id',
  refField: 'ref',
  transform: (val: any) =>
    ({
      ...val,
      dateCreated: val?.dateCreated ? new Date(val?.dateCreated) : null,
    } as UserBlock),
};

export const userSpamReportOptions = {
  keyField: 'id',
  refField: 'ref',
  transform: (val: any) =>
    ({
      ...val,
      dateCreated: val?.dateCreated ? new Date(val?.dateCreated) : null,
    } as UserSpamReport),
};

export const useUser = (id: string | undefined) => {
  const db = firebase.database();
  const ref = id ? db.ref(`users/${id}`) : null;
  return useObjectVal<User, 'id', 'ref'>(ref, userOptions);
};

export const useUsers = () => {
  const db = firebase.database();
  const ref = db.ref('users');
  return useListVals<User, 'id', 'ref'>(ref, userOptions);
};

export const useUserBlocks = (userId: string | undefined) => {
  const db = firebase.database();
  const ref = userId ? db.ref(`user_blocks/${userId}`) : null;
  return useListVals<UserBlock, 'id', 'ref'>(ref, userBlockOptions);
};

export const useUserSpamReports = (userId: string | undefined) => {
  const db = firebase.database();
  const ref = userId ? db.ref(`user_spam_reports/${userId}`) : null;
  return useListVals<UserSpamReport, 'id', 'ref'>(ref, userSpamReportOptions);
};
