import React, { forwardRef, DetailedHTMLProps, HTMLAttributes } from 'react';
import cn from 'classnames';

import useDrawer from '../../hooks/useDrawer';

interface ScrollableProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Scrollable = forwardRef<HTMLDivElement, ScrollableProps>(
  ({ className, children, ...rest }, ref) => {
    const { isDrawerDragging } = useDrawer();
    return (
      <div
        ref={ref}
        className={cn(
          { 'overflow-hidden': isDrawerDragging, 'overflow-y-auto': !isDrawerDragging },
          'md:scrollable-dark md:dark:scrollable-light',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Scrollable;
