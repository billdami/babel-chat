import React, { FC, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import cn from 'classnames';

import PageNotFound from '../PageNotFound';
import { ProvideNotifications } from '../../hooks/useNotifications';
import useDrawer from '../../hooks/useDrawer';
import useBodyClass from '../../hooks/useBodyClass';
import useInterval from '../../hooks/useInterval';
import useCurrentUser from '../../hooks/useCurrentUser';
import { getFirebaseTimestamp } from '../../utils/firebase';
import { ACTIVE_TICK_INTERVAL } from '../../constants/user';

import Chat from './Chat';
import Index from './IndexRoute';
import Sidebar from './components/Sidebar';

interface MainListProps {}

const Main: FC<MainListProps> = () => {
  useBodyClass('overflow-hidden');
  // The `path` lets us build <Route> paths that are relative to the parent route,
  // while the `url` lets us build relative link, e.g. <Link to={`${url}/chat/123`}>
  const { path /*url*/ } = useRouteMatch();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const { updateUser } = useCurrentUser();

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
        <div
          className={cn(
            'Content flex-1 flex absolute md:static inset-0 transition-transform md:transition-none shadow-md md:shadow-none bg-white',
            { 'transform-gpu translate-x-80 md:transform-none md:translate-x-0': isDrawerOpen }
          )}
        >
          {isDrawerOpen && (
            <div
              role="button"
              className="absolute inset-0 z-50 md:hidden"
              onClick={closeDrawer}
            ></div>
          )}
          <Switch>
            <Route exact path={path}>
              <Index />
            </Route>
            <Route path={`${path}/chat/:userId`}>
              <Chat />
            </Route>
            <Route path={`${path}/*`}>
              <PageNotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </ProvideNotifications>
  );
};

export default Main;
