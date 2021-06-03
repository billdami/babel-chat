import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

interface MenuItemProps
  extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isSheet?: boolean;
}

const MenuItem: FC<MenuItemProps> = ({ children, className, isSheet, ...rest }) => (
  <button
    type="button"
    className={cn(
      `flex items-center
      w-full py-1
      leading-6 text-left text-gray-600
      focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-green-300
      disabled:opacity-50 disabled:bg-transparent disabled:cursor-not-allowed`,
      className,
      {
        'px-4 hover:bg-gray-200 hover:bg-opacity-30 active:bg-opacity-100': !isSheet,
      }
    )}
    {...rest}
  >
    {children}
  </button>
);

export default MenuItem;
