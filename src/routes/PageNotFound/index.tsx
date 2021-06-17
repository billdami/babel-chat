import React, { FC } from 'react';

import Link from '../../components/Link';
import PublicPage from '../../components/PublicPage';

interface PageNotFoundProps {}

const PageNotFound: FC<PageNotFoundProps> = () => {
  // TODO make cooler 😎
  return (
    <PublicPage title="Page not found">
      <h2 className="font-bold text-xl text-gray-600 dark:text-gray-500 mb-4">
        404 Page not found
      </h2>
      <p className="mb-4">Sorry, the requested page could not be found. 😿</p>
      <p className="mb-4">
        <Link to="/">&larr; Go to the homepage</Link>
      </p>
    </PublicPage>
  );
};

export default PageNotFound;
