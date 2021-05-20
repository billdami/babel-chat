import React, { FC } from 'react';

interface TabPanelProps {
  id: string;
  activeTabId: string;
  className?: string;
}

const TabPanel: FC<TabPanelProps> = ({ id, activeTabId, children, ...rest }) =>
  id === activeTabId ? (
    <div role="tabpanel" id={id} {...rest}>
      {children}
    </div>
  ) : null;

export default TabPanel;
