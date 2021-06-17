import React, { FC } from 'react';

import Badge from '../../../../../components/Badge';
import FormattedNumber from '../../../../../components/FormattedNumber';
import Tab from '../../../../../components/Tab/TabList/Tab';
import useDrawer, { DrawerTab } from '../../../../../hooks/useDrawer';

interface SidebarTabProps {
  tabId: DrawerTab;
  label: string;
  count?: number;
  numUnread?: number;
  unreadTooltip?: string;
}

const SidebarTab: FC<SidebarTabProps> = ({
  tabId,
  label,
  count = 0,
  numUnread = 0,
  unreadTooltip = '',
}) => {
  const { activeTab, updateTab } = useDrawer();

  return (
    <Tab
      className="block
        relative
        w-full
        px-6 py-4
        border-t border-b
        text-center text-gray-800 dark:text-gray-400
        focus:outline-none
        focus:ring-inset focus:ring-2 focus:ring-opacity-50 dark:focus:ring-opacity-50 focus:ring-green-300 dark:focus:ring-green-500"
      liClassName="w-1/2 flex-none"
      inactiveClassName="dark:border-gray-900"
      activeClassName="bg-gray-100 dark:bg-gray-800 border-transparent dark:border-transparent"
      tabId={tabId}
      activeTabId={activeTab}
      onClick={updateTab}
    >
      {!!numUnread && (
        <div className="absolute inset-y-0 left-6 flex items-center">
          <Badge tooltip={unreadTooltip} />
        </div>
      )}
      {label}
      <span className="inline-block px-2 ml-2 rounded-sm bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold">
        <FormattedNumber value={count} />
      </span>
    </Tab>
  );
};

export default SidebarTab;
