import React, { FC } from 'react';

import BetaBadge from '../../../../../components/BetaBadge';
import Button from '../../../../../components/Button';
import LogoIcon from '../../../../../components/Svgs/Logos/Icon';
import UserNickname from '../../../../../components/UserNickname';
import useCurrentUser from '../../../../../hooks/useCurrentUser';

interface HeroProps {
  openConfirmSignOut: () => void;
}

const Hero: FC<HeroProps> = ({ openConfirmSignOut }) => {
  const { user } = useCurrentUser();

  return (
    <div className="mb-6 py-4 pr-8 bg-gradient-to-l from-green-200 rounded-r-lg">
      <div className="text-right text-sm">
        Signed in as {!!user && <UserNickname user={user} className="inline" />} (
        <Button variant="link" size="sm" onClick={openConfirmSignOut} inline>
          sign out
        </Button>
        )
      </div>
      <div className="relative flex justify-end py-4">
        {/* TODO subtle looping floating/bobbing animation w/CSS animations */}
        <LogoIcon className="h-40 opacity-30 md:opacity-50" />
        <div className="absolute inset-0 py-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light mb-2">
            <span className="relative">
              Welcome to <span className="font-normal text-gray-600">babel</span>{' '}
              <span className="font-normal text-green-500">chat</span>
              <BetaBadge className="-top-2 -right-10 md:-top-1 md:-right-8" target="_blank" small />
            </span>
          </h1>
          <h2 className="text-base md:text-lg text-gray-500 mb-6">
            Meet and chat with people from around the world.
          </h2>
          {/* TODO put social/share/donate widgets here */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
