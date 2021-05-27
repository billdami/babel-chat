import React, { FC } from 'react';

import LogoIcon from '../Svgs/Logos/Icon';

interface AppOfflineProps {}

const AppOffline: FC<AppOfflineProps> = () => {
  return (
    <div className="mx-auto my-auto p-4 text-center">
      <LogoIcon className="w-20 mb-6 mx-auto" />
      <h1 className="text-xl md:text-2xl font-bold text-gray-700">
        babel chat is temporarily offline.
      </h1>
      <h2 className="text-gray-500">The site is down for maintenance. Please check back soon!</h2>
    </div>
  );
};

export default AppOffline;
