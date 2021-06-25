import React, { FC } from 'react';

import BetaBadge from '../../../../../components/BetaBadge';
import Button from '../../../../../components/Button';
import DonateButton from '../../../../../components/DonateButton';
import FacebookShareButton from '../../../../../components/FacebookShareButton';
import LogoIcon from '../../../../../components/Svgs/Logos/Icon';
import TweetButton from '../../../../../components/TweetButton';
import UserNickname from '../../../../../components/UserNickname';
import useCurrentUser from '../../../../../hooks/useCurrentUser';

interface HeroProps {
  openConfirmSignOut: () => void;
}

const Hero: FC<HeroProps> = ({ openConfirmSignOut }) => {
  const { user } = useCurrentUser();

  return (
    <div className="mb-6 py-4 pr-8 bg-gradient-to-l from-green-200 dark:from-gray-800 rounded-r-lg">
      <div className="text-right text-sm break-all">
        Signed in as {!!user && <UserNickname user={user} className="inline" untruncated />} (
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
              Welcome to <span className="font-normal text-gray-600 dark:text-gray-400">babel</span>{' '}
              <span className="font-normal text-green-500 dark:text-green-600">chat</span>
              <BetaBadge className="-top-2 -right-10 md:-top-1 md:-right-8" target="_blank" small />
            </span>
          </h1>
          <h2 className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8">
            Meet and chat with people from around the world.
          </h2>
          <div className="flex items-center flex-wrap mb-2">
            <div className="mr-2 mb-2 flex-shrink-0">
              <DonateButton />
            </div>
            <div className="mr-2 mb-2 flex-shrink-0">
              <FacebookShareButton />
            </div>
            <div className="mr-2 mb-2 flex-shrink-0">
              <TweetButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
