import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import Main from '../../routes/Main';
import PageNotFound from '../../routes/PageNotFound';
import SignIn from '../../routes/SignIn';
import TermsOfService from '../../routes/TermsOfService';
import ProtectedRoute from '../ProtectedRoute';

interface AppProps {}

const App: FC<AppProps> = () => {
  // TODO replace with real useAuth() hook
  // https://usehooks.com/useAuth/
  const auth = { user: null, isLoading: false };

  return (
    <Router>
      <div className="App">
        {auth.isLoading ? (
          <div>TODO loading splash...</div>
        ) : (
          <Switch>
            <Route exact path="/">
              <Redirect to="/main" />
            </Route>
            <ProtectedRoute path="/main">
              <Main />
            </ProtectedRoute>
            <Route path="/sign-in">
              <SignIn />
            </Route>
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
