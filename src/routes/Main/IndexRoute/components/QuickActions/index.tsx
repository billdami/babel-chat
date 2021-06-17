import React, { FC, useCallback } from 'react';

import Icon, { IconName } from '../../../../../components/Icon';

interface QuickActionsProps {
  openAllUsers: () => void;
  openGiveFeedback: () => void;
}

interface TileButtonProps {
  icon: IconName;
  label: string;
  onClick: () => void;
}

const TileButton: FC<TileButtonProps> = ({ icon, label, onClick }) => {
  return (
    // TODO create <Button variant="tile">
    <button
      className="w-full
        px-4 py-8
        flex flex-col items-center
        bg-white
        text-gray-500 font-bold
        border border-gray-100
        shadow hover:shadow-md
        rounded-lg
        focus:outline-none focus:ring-4 focus:ring-opacity-50 dark:focus:ring-opacity-50 focus:ring-green-300 dark:focus:ring-green-500"
      onClick={onClick}
    >
      <Icon name={icon} size="lg" className="mb-4" />
      {label}
    </button>
  );
};

const QuickActions: FC<QuickActionsProps> = ({ openAllUsers, openGiveFeedback }) => {
  const openUsersSearch = useCallback(() => {
    openAllUsers();
    // TODO this isn't great.. see if we can find a better way
    setTimeout(
      () => document.querySelector<HTMLInputElement>('[data-users-search-input="true"]')?.focus(),
      1
    );
  }, [openAllUsers]);

  const openUsersFilters = useCallback(() => {
    openAllUsers();
    // TODO this isn't great.. see if we can find a better way
    setTimeout(() => {
      const toggle = document.querySelector<HTMLButtonElement>(
        '[data-users-filters-toggle="true"][aria-expanded="false"]'
      );

      // if the filters toggle is NOT expanded, expand it
      if (toggle) {
        toggle.click();
      }

      // then focus on the 'Add a filter' button
      document.querySelector<HTMLButtonElement>('[data-users-filters-add="true"]')?.focus();
    }, 1);
  }, [openAllUsers]);

  return (
    <div className="lg:flex mb-2">
      <div className="lg:w-1/3">
        <div className="mb-4 lg:mr-4">
          <TileButton icon="magnifying-glass" label="Search for users" onClick={openUsersSearch} />
        </div>
      </div>
      <div className="lg:w-1/3">
        <div className="mb-4 lg:mr-4">
          <TileButton icon="filter" label="Add advanced filters" onClick={openUsersFilters} />
        </div>
      </div>
      <div className="lg:w-1/3">
        <div className="mb-4">
          <TileButton icon="message-pen" label="Give us feedback" onClick={openGiveFeedback} />
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
