import React, { FC } from 'react';
import cn from 'classnames';

interface ScrollShadowProps {
  isVisible?: boolean;
  gradClassName?: string;
}

const ScrollShadow: FC<ScrollShadowProps> = ({
  isVisible,
  gradClassName = 'from-gray-700 dark:from-gray-800',
}) => {
  return (
    <div
      role="presentation"
      className={cn(
        'pointer-events-none z-10 absolute inset-x-0 top-0 h-1 opacity-0 bg-gradient-to-b transition-opacity duration-500',
        gradClassName,
        {
          'opacity-30': isVisible,
        }
      )}
    ></div>
  );
};

export default ScrollShadow;
