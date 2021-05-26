import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import { useObject } from 'react-firebase-hooks/database';
import { useMemo } from 'react';

export const useIsAppOffline = () => {
  const db = firebase.database();
  const ref = db.ref('APP_OFFLINE');
  const [snapshot] = useObject(ref);
  const isAppOffline = useMemo<boolean>(() => snapshot?.val() === true, [snapshot]);
  return isAppOffline;
};
