import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

import useAuth from '../../hooks/useAuth';

interface UnprotectedRouteProps extends RouteProps {}

const UnprotectedRoute: FC<UnprotectedRouteProps> = ({ children, ...rest }) => {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !auth.user ? children : <Redirect to={{ pathname: '/main', state: { from: location } }} />
      }
    />
  );
};

export default UnprotectedRoute;
