import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

import { User } from '../types/user';

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

export const useUser = (id: string | undefined) => {
  const db = firebase.database();
  const ref = id ? db.ref(`users/${id}`) : null;
  return useObjectVal<User, 'id', 'ref'>(ref, userOptions);
};

export const useUsers = () => {
  const db = firebase.database();
  const ref = db.ref(`users`);
  return useListVals<User, 'id', 'ref'>(ref, userOptions);
};
