import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

interface NavBarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const NavBar: FC<NavBarProps> = ({ children }) => {
  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-3 min-h-navbar bg-green-500 dark:bg-gray-600 text-white dark:text-gray-200">
      {children}
    </div>
  );
};

export default NavBar;
