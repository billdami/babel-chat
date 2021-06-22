import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AppOffline from '../AppOffline';
import ProtectedRoute from '../ProtectedRoute';
import NotificationHeadTags from '../NotificationHeadTags';
import Splash from '../Splash';
import UnprotectedRoute from '../UnprotectedRoute';
import About from '../../routes/About';
import Main from '../../routes/Main';
import PageNotFound from '../../routes/PageNotFound';
import PrivacyPolicy from '../../routes/PrivacyPolicy';
import SignIn from '../../routes/SignIn';
import TermsOfUse from '../../routes/TermsOfUse';
import useAuth from '../../hooks/useAuth';
import useIsAppOffline from '../../hooks/useIsAppOffline';
import usePageTracking from '../../hooks/usePageTracking';

interface AppProps {}

const App: FC<AppProps> = () => {
  usePageTracking();

  const { isSessionLoading, isSigningOut } = useAuth();
  const { isAppOffline, isAppOfflineLoading } = useIsAppOffline();
  const isSplashVisible = isAppOfflineLoading || isSessionLoading || isSigningOut;

  return (
    <>
      <NotificationHeadTags />
      <div className="App h-full min-h-full max-h-full flex">
        {isSplashVisible ? (
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
            <Route path="/terms-of-use">
              <TermsOfUse />
            </Route>
            <Route path="/privacy-policy">
              <PrivacyPolicy />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        )}
      </div>
    </>
  );
};

export default App;
