import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { envVar } from '../../utils/env';

interface BetaBadgeProps {
  className?: string;
  small?: boolean;
  target?: string;
}

const BetaBadge: FC<BetaBadgeProps> = ({ className = '', small = false, ...rest }) => {
  return !!envVar('IS_BETA') ? (
    <Link
      to="/about"
      className={cn(
        'absolute rounded bg-green-400 text-white dark:text-gray-900 text-xs font-bold ring-green-300 focus:outline-none focus:ring-4 focus:ring-opacity-50',
        className,
        {
          'px-2 md:text-sm': !small,
          'px-1': small,
        }
      )}
      {...rest}
    >
      beta
    </Link>
  ) : null;
};

export default BetaBadge;
