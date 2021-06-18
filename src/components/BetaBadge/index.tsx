import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { envVar } from '../../utils/env';

interface BetaBadgeProps {
  className?: string;
  small?: boolean;
  target?: string;
  muted?: boolean;
}

const unmutedClassNames = 'bg-green-400 text-white dark:text-gray-900';
const mutedClassNames = 'bg-green-400 dark:bg-gray-400 text-white dark:text-gray-700';

const BetaBadge: FC<BetaBadgeProps> = ({
  className = '',
  small = false,
  muted = false,
  ...rest
}) => {
  return !!envVar('IS_BETA') ? (
    <Link
      to="/about"
      className={cn(
        'absolute rounded text-xs font-bold ring-green-300 dark:ring-green-500 focus:outline-none focus:ring-4 focus:ring-opacity-50 dark:focus:ring-opacity-50',
        className,
        {
          'px-2 md:text-sm': !small,
          'px-1': small,
          [unmutedClassNames]: !muted,
          [mutedClassNames]: muted,
        }
      )}
      {...rest}
    >
      beta
    </Link>
  ) : null;
};

export default BetaBadge;
