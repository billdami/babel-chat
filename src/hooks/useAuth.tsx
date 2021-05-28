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
import { createUser, deleteUser, logUser } from '../utils/user';
import { SignInError, ReCaptchaError } from '../errors/auth';
import { envVar } from '../utils/env';

interface AuthContext {
  user?: firebase.User | null;
  isSessionLoading: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  hasSignedOut: boolean;
  signIn: (
    captchaToken: string | null,
    details: NewUserDetails
  ) => Promise<firebase.User | null> | void;
  signOut: () => Promise<void> | void;
}

const authContext = createContext<AuthContext>({
  user: null,
  isSessionLoading: true,
  isSigningIn: false,
  isSigningOut: false,
  hasSignedOut: false,
  signIn: () => {},
  signOut: () => {},
});

const useProvideAuth = () => {
  const authChangeUnsub = useRef<null | firebase.Unsubscribe>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSigningOut, setIsSigngingOut] = useState<boolean>(false);
  const [hasSignedOut, setHasSignedOut] = useState<boolean>(false);

  const signIn = useCallback(async (captchaToken: string | null, details: NewUserDetails) => {
    if (!captchaToken) {
      throw new ReCaptchaError();
    }

    setIsSigningIn(true);

    try {
      const captchaResult = await fetch(`${envVar('FB_FUNCTIONS_BASE_URL')}/validateCaptcha`, {
        method: 'POST',
        body: new URLSearchParams({ token: captchaToken }),
      });

      if (!captchaResult?.ok) {
        throw new ReCaptchaError();
      }

      const userCred = await firebase.auth().signInAnonymously();

      if (userCred.user) {
        await createUser(userCred.user.uid, details);
        // log the new user (dont need to wait for successful response)
        logUser(userCred.user.uid);
        setIsSigningIn(false);
        setUser(userCred.user);
        return userCred.user;
      } else {
        throw new SignInError();
      }
    } catch (err) {
      setIsSigningIn(false);
      throw err;
    }
  }, []);

  const signOut = useCallback(async (shouldDelete: boolean = true) => {
    const uid = firebase.auth().currentUser?.uid;

    try {
      setIsSigngingOut(true);

      if (uid && shouldDelete) {
        await deleteUser(uid);
      }

      await firebase.auth().signOut();
      setUser(null);
      setHasSignedOut(true);
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
              await signOut(false);
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

  useEffect(() => {
    if (hasSignedOut) {
      // reload the entire sign in page to reset recaptcha, etc
      setTimeout(() => window.location.reload(), 1);
    }
  }, [hasSignedOut]);

  return {
    user,
    isSessionLoading,
    isSigningIn,
    isSigningOut,
    hasSignedOut,
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
