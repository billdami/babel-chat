import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

import useAuth from '../../hooks/useAuth';

interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, ...rest }) => {
  const auth = useAuth();

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
