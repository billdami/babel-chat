import React, { FC } from 'react';

import Anchor from '../../../../../components/Anchor';
import Icon from '../../../../../components/Icon';
import { TWITTER_URL, TWITTER_USER } from '../../../../../constants/app';

interface TipsAndTricksProps {}

const TipsAndTricks: FC<TipsAndTricksProps> = () => {
  return (
    <div className="mb-6 2xl:mb-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-600 dark:bg-opacity-30">
      <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">New here?</h3>
      <p className="mb-4 text-gray-800 dark:text-gray-300 max-w-3xl">
        Welcome to the babel chat community! We hope you enjoy your stay. Here's a few tips and
        tricks to make sure you have the best possible chat experience:
      </p>
      <ul className="list-disc pl-8 mb-4 text-gray-800 dark:text-gray-300 max-w-3xl">
        <li className="mb-1">
          <strong className="font-bold">It is completely anonymous.</strong> babel chat does not
          require you to provide any personal information, and has no registration process. Some
          users choose to provide some very basic information such as age and gender, but this is
          and will always be <strong className="font-bold">100% optional</strong>.
        </li>
        <li className="mb-1">
          <strong className="font-bold">Find people easily.</strong> Use the{' '}
          <Icon name="filter" size="sm" className="inline-block text-gray-400" /> "Advanced filters"
          search feature to only show users from certain countries, age ranges and more. (You can
          even add multiple filters of the same type to broaden your search!)
        </li>
        <li className="mb-1">
          <strong className="font-bold">Chat everywhere.</strong> babel chat is designed to work on
          any device, including mobile phones, iPads and other tablets, and desktop PCs. So you can
          take babel chat everywhere you go!
        </li>
        <li className="mb-1">
          <strong className="font-bold">Be safe!</strong> Never give out detailed personal
          information to complete strangers. Don’t open links unless you are absolutely sure it is a
          trusted and legitimate website.
        </li>
      </ul>
      <p className="mb-4 text-gray-800 dark:text-gray-300 max-w-3xl">
        Want to get in touch with us? Find us on Twitter at{' '}
        <Anchor target="_blank" href={TWITTER_URL}>
          {TWITTER_USER}
        </Anchor>
        .
      </p>
    </div>
  );
};

export default TipsAndTricks;
