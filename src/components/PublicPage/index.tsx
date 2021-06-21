import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import BetaBadge from '../BetaBadge';
import DarkModeToggle from '../DarkModeToggle';
import Link from '../Link';
import Logo from '../Logo';
import useMedia from '../../hooks/useMedia';
import useScrollToTop from '../../hooks/useScrollToTop';
import { COPYRIGHT_LINE } from '../../constants/app';

interface PublicPageProps {
  title: string;
}

const PublicPage: FC<PublicPageProps> = ({ children, title }) => {
  useScrollToTop();
  const { isMobile } = useMedia();

  return (
    <>
      <Helmet>
        <title>{title} | babel chat</title>
      </Helmet>
      <div className="w-full sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 mx-auto p-4">
        <div className="mt-8 md:mt-10">
          <div className="flex justify-center">
            <div className="relative mt-4 mb-4 md:mb-6">
              <Link to="/" className="inline-block">
                <Logo className="h-20 md:h-24 max-w-full" />
              </Link>
              <BetaBadge className="-top-2 -right-4 md:-right-8" />
            </div>
          </div>
          <div className="p-4 md:p-6 mb-4 bg-white dark:bg-gray-800 rounded text-gray-700 dark:text-gray-400">
            {children}
          </div>
          <div className="pb-4 text-sm text-gray-400 dark:text-gray-600 text-center">
            {COPYRIGHT_LINE}
          </div>
          {isMobile && (
            <div className="flex justify-center pb-8">
              <DarkModeToggle />
            </div>
          )}
        </div>
      </div>
      {!isMobile && <DarkModeToggle className="absolute top-3 right-3" />}
    </>
  );
};

export default PublicPage;
