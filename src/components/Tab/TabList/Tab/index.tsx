import cn from 'classnames';
import React, { FC, MouseEvent as ReactMouseEvent } from 'react';

interface TabProps {
  tabId: any;
  activeTabId: any;
  className?: string;
  activeClassName?: string;
  liClassName?: string;
  onClick?: (tabId: any, event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Tab: FC<TabProps> = ({
  tabId,
  activeTabId,
  onClick,
  className = '',
  activeClassName = '',
  liClassName = '',
  children,
  ...rest
}) => (
  <li className={liClassName}>
    <button
      type="button"
      role="tab"
      aria-controls={tabId}
      aria-selected={tabId === activeTabId}
      onClick={(event) => onClick?.(tabId, event)}
      className={cn(className, tabId === activeTabId && activeClassName)}
      {...rest}
    >
      {children}
    </button>
  </li>
);

export default Tab;
