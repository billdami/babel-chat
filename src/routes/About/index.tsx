import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import Link from '../../components/Link';
import Logo from '../../components/Svgs/Logos/Logo';
import BetaBadge from '../../components/BetaBadge';
import useScrollToTop from '../../hooks/useScrollToTop';
import { copyrightLine } from '../../constants/app';
import Anchor from '../../components/Anchor';

interface AboutProps {}

const About: FC<AboutProps> = () => {
  useScrollToTop();

  return (
    <div className="w-full sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 mx-auto p-4">
      <Helmet>
        <title>About | babel chat</title>
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
          <h2 className="font-bold text-xl text-gray-600 mb-4">What is babel chat?</h2>
          <p className="mb-4">
            babel chat is a new, web-based chat app, that you can use to meet people from around the
            world. It is{' '}
            <strong className="font-bold">
              100% free, anonymous, and requires no registration.
            </strong>{' '}
          </p>
          <p className="mb-4">
            babel chat is designed to be fast, easy-to-use, and work on any device, including mobile
            phones, iPads and other tablets, and desktop PCs. It is capable of supporting thousands
            of simultaneous users, so it will always be stable and available.
          </p>
          <p className="mb-4">
            With intutive and fast search and filter features, you can easily find people you want
            to chat with. babel chat features private, one-on-one chats only, where you won't get
            lost in massive and noisy group chatrooms.
          </p>
          <h3 className="font-bold text-lg text-gray-600 mb-4">Beta Disclaimer</h3>
          <p className="mb-4">
            The current version of babel chat is "beta" software, which means it is new, and is
            still being updated and improved all the time. Because of this, you may encounter the
            occasional issue or missing feature. However, we encourage you to report any problems
            you find, or send us suggestions for changes and new features. You can do so within the
            app via the 'Give us feedback' option, or by contacting us on Twitter at{' '}
            <Anchor target="_blank" href="https://twitter.com/babelChatOnline">
              @babelChatOnline
            </Anchor>
            .
          </p>
          <h3 className="font-bold text-lg text-gray-600 mb-4">Thanks!</h3>
          <p className="mb-4">Thank you for using babel chat, and we hope you enjoy chatting!</p>
          <p className="mb-4">
            <Link to="/">&larr; Go to the homepage</Link>
          </p>
        </div>
        <div className="pb-4 text-sm text-gray-400 text-center">{copyrightLine}</div>
      </div>
    </div>
  );
};

export default About;
