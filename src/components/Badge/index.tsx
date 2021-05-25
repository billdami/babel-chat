import classNames from 'classnames';
import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

type BadgeSizes = 'sm' | 'md' | 'lg';

interface BadgeProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  size?: BadgeSizes;
  tooltip?: string;
  pulse?: boolean;
  bordered?: boolean;
}

const sizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const Badge: FC<BadgeProps> = ({
  className = '',
  size = 'md',
  tooltip = '',
  pulse = true,
  bordered = false,
  ...rest
}) => (
  <span
    className={classNames('flex', sizes[size], className)}
    // TODO make this a popper.js tooltip
    title={tooltip}
    {...rest}
  >
    {pulse && (
      <span
        className={classNames(
          'animate-ping absolute inline-flex rounded-full bg-red-400 opacity-75',
          sizes[size]
        )}
      ></span>
    )}
    <span
      className={classNames('relative inline-flex rounded-full border bg-red-500', sizes[size], {
        'border border-red-500': bordered,
      })}
    ></span>
  </span>
);

export default Badge;
