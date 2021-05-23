import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { NewUserDetails, UserRecord } from '../types/user';
import { createUser, deleteUser } from '../utils/user';

import { useUser } from './useUserRecord';

interface AuthContext {
  user?: firebase.User | null;
  userRecord?: UserRecord | null;
  isInitialLoading: boolean;
  isLoading: boolean;
  signIn: (details: NewUserDetails) => Promise<firebase.User | null> | void;
  signOut: () => Promise<void> | void;
}

const authContext = createContext<AuthContext>({
  user: null,
  userRecord: null,
  isInitialLoading: true,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

const useProvideAuth = () => {
  const authChangeUnsub = useRef<null | firebase.Unsubscribe>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userRecord /*isUserLoading, userError*/] = useUser(user?.uid);

  const signIn = useCallback(async (details: NewUserDetails) => {
    setIsLoading(true);

    try {
      const userCred = await firebase.auth().signInAnonymously();

      if (userCred.user) {
        await createUser(userCred.user.uid, details);
        setIsLoading(false);
        setUser(userCred.user);
        return userCred.user;
      } else {
        // TODO custom error classes
        throw new Error('could not create user on sign in');
      }
    } catch (err) {
      setIsLoading(false);
      // TODO custom error classes
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    // TODO catch/handle errors
    const uid = firebase.auth().currentUser?.uid;

    setIsLoading(true);
    await firebase.auth().signOut();
    if (uid) {
      await deleteUser(uid);
    }

    setUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (authChangeUnsub.current) {
      authChangeUnsub.current();
    }

    authChangeUnsub.current = firebase.auth().onAuthStateChanged(async (user) => {
      // update the firebase user when the user becomes logged in or out
      setUser(user);

      // on the initial app boot only
      if (isInitialLoading) {
        // if the user is logged in w/o an associated db record, sign them out
        if (user) {
          const userRec = await firebase.database().ref(`users/${user.uid}`).get();
          if (!userRec.exists()) {
            await signOut();
          }
        }

        setIsInitialLoading(false);
      }
    });

    // set the firebase user from the current session
    setUser(firebase.auth().currentUser);

    // unsubscribe from auth state changes on unmount
    return () => authChangeUnsub.current?.();
  }, [isInitialLoading, signOut]);

  return {
    user,
    userRecord,
    isInitialLoading,
    isLoading,
    signIn,
    signOut,
  };
};

export const ProvideAuth: FC<{}> = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useAuth = () => {
  return useContext(authContext);
};

export default useAuth;
