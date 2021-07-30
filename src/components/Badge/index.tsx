import React, { FC } from 'react';
import { animated, useTransition } from '@react-spring/web';
import classNames from 'classnames';

import useDeferRender from '../../hooks/useDeferRender';

type BadgeVariants = 'alert' | 'muted';
type BadgeSizes = 'sm' | 'md' | 'lg';

interface BadgeProps {
  className?: string;
  variant?: BadgeVariants;
  size?: BadgeSizes;
  tooltip?: string;
  pulse?: boolean;
  bordered?: boolean;
  deferRender?: boolean;
  renderDelay?: number;
  title?: string;
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
  const transition = useTransition(shouldRender, {
    from: { scale: 0 },
    enter: { scale: 1 },
    leave: { scale: 0 },
    config: { tension: 320 },
  });

  return transition(
    ({ scale }, item) =>
      item && (
        <animated.span
          className={classNames('flex', sizes[size], className)}
          style={{ transform: scale.to((s) => `scale(${s})`) }}
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
        </animated.span>
      )
  );
};

export default Badge;
