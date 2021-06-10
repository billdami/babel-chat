import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import Link from '../../components/Link';
import Logo from '../../components/Svgs/Logos/Logo';
import BetaBadge from '../../components/BetaBadge';
import useScrollToTop from '../../hooks/useScrollToTop';
import { copyrightLine } from '../../constants/app';

interface PageNotFoundProps {}

const PageNotFound: FC<PageNotFoundProps> = () => {
  useScrollToTop();

  // TODO make cooler 😎
  return (
    <div className="w-full sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 mx-auto p-4">
      <Helmet>
        <title>Page not found | babel chat</title>
      </Helmet>
      <div className="mt-4 md:mt-10">
        <div className="flex justify-center">
          <div className="relative mt-4 mb-4 md:mb-6">
            <Link to="/" className="inline-block">
              <Logo className="h-20 md:h-24 max-w-full" />
            </Link>
            <BetaBadge className="-top-2 -right-4 md:-right-8" />
          </div>
        </div>
        <div className="p-4 md:p-6 mb-4 bg-white rounded text-gray-700">
          <h2 className="font-bold text-xl text-gray-600 mb-4">404 Page not found</h2>
          <p className="mb-4">Sorry, the requested page could not be found. 😿</p>
          <p className="mb-4">
            <Link to="/">&larr; Go to the homepage</Link>
          </p>
        </div>
        <div className="pb-4 text-sm text-gray-400 text-center">{copyrightLine}</div>
      </div>
    </div>
  );
};

export default PageNotFound;
