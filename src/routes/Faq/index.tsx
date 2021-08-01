import React, { FC } from 'react';

import Anchor from '../../components/Anchor';
import FaqList from '../../components/FaqList';
import Link from '../../components/Link';
import PublicPage from '../../components/PublicPage';
import { TWITTER_URL, TWITTER_USER } from '../../constants/app';

interface FaqProps {}

const Faq: FC<FaqProps> = () => {
  return (
    <PublicPage title="FAQ">
      <h2 className="font-bold text-xl text-gray-600 dark:text-gray-500 mb-4">
        Frequently Asked Questions
      </h2>
      <FaqList />
      <p className="mb-4">
        Still need help or have more questions? Find us on Twitter at{' '}
        <Anchor target="_blank" href={TWITTER_URL}>
          {TWITTER_USER}
        </Anchor>
        .
      </p>
      <p className="mb-4">
        <Link to="/">&larr; Go to the homepage</Link>
      </p>
    </PublicPage>
  );
};

export default Faq;
