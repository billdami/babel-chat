import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

import { User } from '../types/user';

const options = {
  keyField: 'id',
  refField: 'ref',
  transform: (val: any) =>
    ({
      ...val,
      dateSignedIn: new Date(val?.dateSignedIn),
      dateLastActive: new Date(val?.dateLastActive),
    } as User),
};

export const useUser = (id: string | undefined) => {
  const db = firebase.database();
  const ref = id ? db.ref(`users/${id}`) : null;
  return useObjectVal<User, 'id', 'ref'>(ref, options);
};

export const useUsers = () => {
  const db = firebase.database();
  const ref = db.ref(`users`);
  return useListVals<User, 'id', 'ref'>(ref, options);
};
