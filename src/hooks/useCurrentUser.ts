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
      return user?.ref?.update(values);
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
