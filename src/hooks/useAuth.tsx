import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import React, { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

interface AuthContext {
  user: firebase.User | null;
  isInitialLoading: boolean;
  isLoading: boolean;
  signIn: () => Promise<firebase.User | null> | void;
  signOut: () => Promise<void> | void;
}

const authContext = createContext<AuthContext>({
  user: null,
  // TODO might be able to get rid of this, if auth.currentUser is always synchronous on boot
  isInitialLoading: true,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

const useProvideAuth = () => {
  const history = useHistory();

  const [user, setUser] = useState<firebase.User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO take user details params (nickname, etc) to create db record
  const signIn = useCallback(async () => {
    // TODO catch/handle errors
    setIsLoading(true);
    const userCred = await firebase.auth().signInAnonymously();
    // TODO create user db record
    setUser(userCred.user);
    setIsLoading(false);
    return userCred.user;
  }, []);

  const signOut = useCallback(async () => {
    // TODO catch/handle errors
    setIsLoading(true);
    await firebase.auth().signOut();
    // TODO cleanup/delete user and related recs in db
    setUser(null);
    setIsLoading(false);
    history.push('/sign-in');
  }, [history]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsInitialLoading(false);
    });

    setUser(firebase.auth().currentUser);
    setIsInitialLoading(false);

    if (firebase.auth().currentUser) {
      // TODO if user is signed in with no matching db rec, create an empty one
    }

    return () => unsubscribe();
  }, []);

  return {
    user,
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
