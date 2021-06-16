import React, { FC } from 'react';
import cn from 'classnames';

interface ScrollShadowProps {
  isVisible?: boolean;
}

const ScrollShadow: FC<ScrollShadowProps> = ({ isVisible }) => {
  return (
    <div
      role="presentation"
      className={cn(
        'pointer-events-none z-10 absolute inset-x-0 top-0 h-1 opacity-0 bg-gradient-to-b from-gray-700 transition-opacity duration-500',
        {
          'opacity-30': isVisible,
        }
      )}
    ></div>
  );
};

export default ScrollShadow;
