import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import { useIsAppOffline } from '../../hooks/useAppOffline';
import Main from '../../routes/Main';
import PageNotFound from '../../routes/PageNotFound';
import SignIn from '../../routes/SignIn';
import TermsOfService from '../../routes/TermsOfService';
import ProtectedRoute from '../ProtectedRoute';
import UnprotectedRoute from '../UnprotectedRoute';
import Splash from '../Splash';
import AppOffline from '../AppOffline';

interface AppProps {}

const App: FC<AppProps> = () => {
  const { isSessionLoading } = useAuth();
  const isAppOffline = useIsAppOffline();

  return (
    <Router>
      <div className="App h-full min-h-full max-h-full flex">
        {isSessionLoading ? (
          <Splash />
        ) : isAppOffline ? (
          <AppOffline />
        ) : (
          <Switch>
            <Route exact path="/">
              <Redirect to="/main" />
            </Route>
            <ProtectedRoute path="/main">
              <Main />
            </ProtectedRoute>
            <UnprotectedRoute path="/sign-in">
              <SignIn />
            </UnprotectedRoute>
            <Route path="/terms-of-service">
              <TermsOfService />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        )}
      </div>
    </Router>
  );
};

export default App;
