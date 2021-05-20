import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import PageNotFound from '../PageNotFound';
import Chat from './Chat';
import Sidebar from './components/Sidebar';
import Index from './IndexRoute';

interface MainListProps {}

const Main: FC<MainListProps> = () => {
  // The `path` lets us build <Route> paths that are relative to the parent route,
  // while the `url` lets us build relative link, e.g. <Link to={`${url}/chat/123`}>
  const { path /*url*/ } = useRouteMatch();

  return (
    <div className="Main flex w-full">
      <Sidebar />
      <div className="Content flex-1 flex bg-white">
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
