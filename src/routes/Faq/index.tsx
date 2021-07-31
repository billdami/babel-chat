import React, { FC } from 'react';

import FaqList from '../../components/FaqList';
import Link from '../../components/Link';
import PublicPage from '../../components/PublicPage';

interface FaqProps {}

const Faq: FC<FaqProps> = () => {
  return (
    <PublicPage title="FAQ">
      <h2 className="font-bold text-xl text-gray-600 dark:text-gray-500 mb-4">
        Frequently Asked Questions
      </h2>
      <div className="mb-4">
        <FaqList />
      </div>
      <p className="mb-4">
        <Link to="/">&larr; Go to the homepage</Link>
      </p>
    </PublicPage>
  );
};

export default Faq;
