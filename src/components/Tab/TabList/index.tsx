import React, { FC } from 'react';

interface TabListProps {
  className?: string;
}

const TabList: FC<TabListProps> = ({ children, ...rest }) => (
  <ul role="tablist" {...rest}>
    {children}
  </ul>
);

export default TabList;
