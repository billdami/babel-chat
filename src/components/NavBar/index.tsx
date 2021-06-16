import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

interface NavBarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const NavBar: FC<NavBarProps> = ({ children }) => {
  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-3 min-h-navbar bg-green-500 text-white">
      {children}
    </div>
  );
};

export default NavBar;
