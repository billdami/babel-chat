import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, ...rest }) => {
  // TODO replace with real useAuth() hook
  // https://usehooks.com/useAuth/
  const auth = { user: null, isLoading: false };

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? children : <Redirect to={{ pathname: '/sign-in', state: { from: location } }} />
      }
    />
  );
};

export default ProtectedRoute;
