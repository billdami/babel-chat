import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

import firebase from 'firebase/app';
import { useCallback } from 'react';

import { UserFirebaseRecord, UserRecord } from '../types/user';

import useAuth from './useAuth';
import { useUser } from './useUserRecord';

interface CurrentUserHook {
  user?: UserRecord | null;
  isUserLoading: boolean;
  updateUser: (values: Partial<UserFirebaseRecord>) => Promise<void> | void;
}

const useCurrentUser = (): CurrentUserHook => {
  const { user: authUser } = useAuth();
  const [user, isUserLoading /*userError*/] = useUser(authUser?.uid);

  const updateUser = useCallback(
    (values: Partial<UserFirebaseRecord>) => {
      // ensure updates are only attempted if the user is logged in
      if (firebase.auth().currentUser?.uid) {
        return user?.ref?.update(values);
      }
    },
    [user]
  );

  return {
    user,
    isUserLoading,
    updateUser,
  };
};

export default useCurrentUser;
