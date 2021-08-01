import React, { FC, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import DrawerPage from '../../components/DrawerPage';
import useAuth from '../../hooks/useAuth';
import useCurrentUser from '../../hooks/useCurrentUser';
import useBodyClass from '../../hooks/useBodyClass';
import useInterval from '../../hooks/useInterval';
import { ProvideNotifications } from '../../hooks/useNotifications';
import { getFirebaseTimestamp } from '../../utils/firebase';
import { ACTIVE_TICK_INTERVAL } from '../../constants/user';

import Chat from './Chat';
import Dashboard from './Dashboard';
import Faq from './Faq';
import PageNotFound from './PageNotFound';
import Sidebar from './components/Sidebar';

interface MainProps {}

const Main: FC<MainProps> = () => {
  useBodyClass('overflow-hidden');
  // The `path` lets us build <Route> paths that are relative to the parent route,
  // while the `url` lets us build relative link, e.g. <Link to={`${url}/chat/123`}>
  const { path /*url*/ } = useRouteMatch();
  const { user, isUserLoading, updateUser } = useCurrentUser();
  const { isSigningIn, isSigningOut, hasSignedOut, signOut } = useAuth();

  // if the user becomes deleted while signed in, auto log out
  useEffect(() => {
    if (!user?.id && !isUserLoading && !isSigningIn && !isSigningOut && !hasSignedOut) {
      signOut();
    }
  }, [user, isUserLoading, isSigningIn, isSigningOut, hasSignedOut, signOut]);

  // when the app is first opened (or reopened), update the user's last active status
  useEffect(() => {
    updateUser({ dateLastActive: getFirebaseTimestamp() });
    // only run once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // and while the app is open, update the user's last active status every few seconds
  useInterval(() => updateUser({ dateLastActive: getFirebaseTimestamp() }), ACTIVE_TICK_INTERVAL);

  return (
    <ProvideNotifications>
      <div className="Main flex w-full">
        <Sidebar className="z-0 md:z-auto" />
        <DrawerPage>
          <Switch>
            <Route exact path={path}>
              <Dashboard />
            </Route>
            <Route path={`${path}/chat/:userId`}>
              <Chat />
            </Route>
            <Route path={`${path}/faq`}>
              <Faq />
            </Route>
            <Route path={`${path}/*`}>
              <PageNotFound />
            </Route>
          </Switch>
        </DrawerPage>
      </div>
    </ProvideNotifications>
  );
};

export default Main;
