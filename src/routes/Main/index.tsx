import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import classNames from 'classnames';

import PageNotFound from '../PageNotFound';
import useDrawer from '../../hooks/useDrawer';
import useBodyClass from '../../hooks/useBodyClass';

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

  return (
    <div className="Main flex w-full">
      <Sidebar className="z-0 md:z-auto" />
      <div
        className={classNames(
          'Content flex-1 flex absolute inset-0 md:static transition-transform md:transition-none bg-white',
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
  );
};

export default Main;
