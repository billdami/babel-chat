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

import { NewUserDetails } from '../types/user';
import { createUser, deleteUser } from '../utils/user';

interface AuthContext {
  user?: firebase.User | null;
  isSessionLoading: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  signIn: (details: NewUserDetails) => Promise<firebase.User | null> | void;
  signOut: () => Promise<void> | void;
}

const authContext = createContext<AuthContext>({
  user: null,
  isSessionLoading: true,
  isSigningIn: false,
  isSigningOut: false,
  signIn: () => {},
  signOut: () => {},
});

const useProvideAuth = () => {
  const authChangeUnsub = useRef<null | firebase.Unsubscribe>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSigningOut, setIsSigngingOut] = useState<boolean>(false);

  const signIn = useCallback(async (details: NewUserDetails) => {
    setIsSigningIn(true);

    try {
      const userCred = await firebase.auth().signInAnonymously();

      if (userCred.user) {
        // TODO failing to create the user should reject this promise
        await createUser(userCred.user.uid, details);
        setIsSigningIn(false);
        setUser(userCred.user);
        return userCred.user;
      } else {
        // TODO custom error classes
        throw new Error('could not create user on sign in');
      }
    } catch (err) {
      setIsSigningIn(false);
      // TODO custom error classes
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    // TODO catch/handle errors
    const uid = firebase.auth().currentUser?.uid;

    try {
      setIsSigngingOut(true);

      if (uid) {
        await deleteUser(uid);
      }

      await firebase.auth().signOut();

      setUser(null);
      setIsSigngingOut(false);
    } catch (err) {
      setUser(null);
      setIsSigngingOut(false);
    }
  }, []);

  useEffect(() => {
    if (authChangeUnsub.current) {
      authChangeUnsub.current();
    }

    authChangeUnsub.current = firebase.auth().onAuthStateChanged(async (user) => {
      // update the firebase user when the user becomes logged in or out
      setUser(user);

      // on the initial app boot only
      try {
        if (isSessionLoading) {
          // if the user is logged in w/o an associated db record, sign them out
          if (user) {
            const userRec = await firebase.database().ref(`users/${user.uid}`).get();
            if (!userRec.exists()) {
              await signOut();
            }
          }

          setIsSessionLoading(false);
        }
      } catch (err) {
        setIsSessionLoading(false);
      }
    });

    // set the firebase user from the current session
    setUser(firebase.auth().currentUser);

    // unsubscribe from auth state changes on unmount
    return () => authChangeUnsub.current?.();
  }, [isSessionLoading, signOut]);

  return {
    user,
    isSessionLoading,
    isSigningIn,
    isSigningOut,
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
