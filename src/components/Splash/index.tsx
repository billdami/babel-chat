import React, { FC } from 'react';

import Spinner from '../Spinner';

interface SplashProps {}

const Splash: FC<SplashProps> = () => {
  return (
    <div className="mx-auto my-auto p-4">
      <Spinner size="lg" className="mr-3" />
    </div>
  );
};

export default Splash;
