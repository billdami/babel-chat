import React, { FC } from 'react';

interface AppOfflineProps {}

const AppOffline: FC<AppOfflineProps> = () => {
  // TODO improve styles, add logo (graphic-only) above message
  return (
    <div className="mx-auto my-auto p-4 text-center">
      <h1 className="text-xl md:text-2xl font-bold text-gray-700">
        babel chat is temporarily offline.
      </h1>
      <h2 className="text-gray-500">The site is down for maintenance. Please check back soon!</h2>
    </div>
  );
};

export default AppOffline;
