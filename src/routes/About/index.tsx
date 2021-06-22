import React, { FC } from 'react';

import Anchor from '../../components/Anchor';
import Link from '../../components/Link';
import PublicPage from '../../components/PublicPage';

interface AboutProps {}

const About: FC<AboutProps> = () => {
  return (
    <PublicPage title="About">
      <h2 className="font-bold text-xl text-gray-600 dark:text-gray-500 mb-4">
        What is babel chat?
      </h2>
      <p className="mb-4">
        babel chat is a new, web-based chat app, that you can use to meet people from around the
        world. It is{' '}
        <strong className="font-bold">100% free, anonymous, and requires no registration.</strong>{' '}
      </p>
      <p className="mb-4">
        babel chat is designed to be fast, easy-to-use, and work on any device, including mobile
        phones, iPads and other tablets, and desktop PCs. It is capable of supporting thousands of
        simultaneous users, so it will always be stable and available.
      </p>
      <p className="mb-4">
        With intuitive and fast search and filter features, you can easily find people you want to
        chat with. babel chat features private, one-on-one chats only, where you won't get lost in
        massive and noisy group chatrooms.
      </p>
      <h3 className="font-bold text-lg text-gray-600 dark:text-gray-500 mb-4">Beta Disclaimer</h3>
      <p className="mb-4">
        The current version of babel chat is "beta" software, which means it is new, and is still
        being updated and improved all the time. Because of this, you may encounter the occasional
        issue or missing feature. However, we encourage you to report any problems you find, or send
        us suggestions for changes and new features. You can do so within the app via the 'Give us
        feedback' option, or by contacting us on Twitter at{' '}
        <Anchor target="_blank" href="https://twitter.com/babelChatOnline">
          @babelChatOnline
        </Anchor>
        .
      </p>
      <h3 className="font-bold text-lg text-gray-600 dark:text-gray-500 mb-4">Thanks!</h3>
      <p className="mb-4">Thank you for using babel chat, and we hope you enjoy chatting!</p>
      <p className="mb-4">
        <Link to="/">&larr; Go to the homepage</Link>
      </p>
    </PublicPage>
  );
};

export default About;
