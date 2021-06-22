import classNames from 'classnames';
import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import useDeferRender from '../../hooks/useDeferRender';

type BadgeVariants = 'alert' | 'muted';
type BadgeSizes = 'sm' | 'md' | 'lg';

interface BadgeProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  variant?: BadgeVariants;
  size?: BadgeSizes;
  tooltip?: string;
  pulse?: boolean;
  bordered?: boolean;
  deferRender?: boolean;
  renderDelay?: number;
}

const sizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const variants = {
  alert: 'bg-red-500',
  muted: 'bg-gray-400 dark:bg-gray-800 dark:border-gray-500',
};

const variantPulse = {
  alert: 'bg-red-400',
  muted: 'bg-gray-300',
};

const Badge: FC<BadgeProps> = ({
  className = '',
  variant = 'alert',
  size = 'md',
  tooltip = '',
  pulse = true,
  bordered = false,
  deferRender = true,
  renderDelay = 250,
  ...rest
}) => {
  const shouldRender = useDeferRender(!deferRender, renderDelay);

  return shouldRender ? (
    <span
      className={classNames('flex', sizes[size], className)}
      // TODO make this a popper.js tooltip
      title={tooltip}
      {...rest}
    >
      {pulse && (
        <span
          className={classNames(
            'animate-ping absolute inline-flex rounded-full opacity-75',
            variantPulse[variant],
            sizes[size]
          )}
        ></span>
      )}
      <span
        className={classNames(
          'relative inline-flex rounded-full border',
          variants[variant],
          sizes[size],
          {
            'border border-red-500': bordered,
          }
        )}
      ></span>
    </span>
  ) : null;
};

export default Badge;
