import React, { FC } from 'react';

import Link from '../../../../../components/Link';
import { COPYRIGHT_LINE } from '../../../../../constants/app';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <div className="flex-shrink-0 px-4 py-4 text-sm text-gray-400 dark:text-gray-500">
      {COPYRIGHT_LINE} <span className="hidden md:inline">&bull;</span>{' '}
      <span className="block md:inline">
        <Link to="/privacy-policy" target="_blank">
          privacy policy
        </Link>{' '}
        &bull;{' '}
        <Link to="/terms-of-use" target="_blank">
          terms of use
        </Link>
      </span>
    </div>
  );
};

export default Footer;
