import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { ProvideAuth } from '../../hooks/useAuth';
import Main from '../../routes/Main';
import PageNotFound from '../../routes/PageNotFound';
import SignIn from '../../routes/SignIn';
import TermsOfService from '../../routes/TermsOfService';
import ProtectedRoute from '../ProtectedRoute';

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <ProvideAuth>
      <Router>
        <div className="App h-full min-h-full max-h-full flex">
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
        </div>
      </Router>
    </ProvideAuth>
  );
};

export default App;
