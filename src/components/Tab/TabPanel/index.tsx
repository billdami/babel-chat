import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';

interface TabPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id: string;
  activeTabId: string;
  className?: string;
  /**
   * when false, inactive tabs are still rendered and hidden via CSS
   */
  unmountWhenHidden?: boolean;
}

const TabPanel: FC<TabPanelProps> = ({
  id,
  activeTabId,
  children,
  unmountWhenHidden = true,
  className = '',
  ...rest
}) =>
  unmountWhenHidden ? (
    id === activeTabId ? (
      <div role="tabpanel" id={id} className={className} {...rest}>
        {children}
      </div>
    ) : null
  ) : (
    <div
      role="tabpanel"
      id={id}
      className={cn(className, { hidden: id !== activeTabId })}
      {...rest}
    >
      {children}
    </div>
  );

export default TabPanel;
