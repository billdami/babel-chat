import React, { FC } from 'react';

import Link from '../../components/Link';
import Logo from '../../components/Svgs/Logos/Logo';
import useScrollToTop from '../../hooks/useScrollToTop';
import { copyrightLine } from '../../constants/app';

interface PageNotFoundListProps {}

const PageNotFound: FC<PageNotFoundListProps> = () => {
  useScrollToTop();

  // TODO make cooler 😎
  return (
    <div className="mx-auto mt-20 p-4">
      <div className="w-full sm:w-116">
        <div className="flex justify-center">
          <Link to="/" className="inline-block mb-4 md:mb-6 mt-2 md:mt-0">
            <Logo className="h-20 md:h-24 max-w-full" />
          </Link>
        </div>
        <div className="p-4 md:p-6 mb-4 bg-white rounded text-gray-700">
          <h2 className="font-bold text-xl text-gray-600 mb-4">404 Page not found</h2>
          <p className="mb-4">Sorry, the requested page could not be found. 😿</p>
          <p className="mb-4">
            <Link to="/">&larr; Go to the homepage</Link>
          </p>
        </div>
        <div className="text-sm text-gray-400 text-center">{copyrightLine}</div>
      </div>
    </div>
  );
};

export default PageNotFound;
