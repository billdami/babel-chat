import React, { FC } from 'react';

import Button from '../../../../../../components/Button';
import { UserFilter } from '../../../../../../types/user';

import FilterItem from './FilterItem';

interface AdvancedFiltersProps {
  isOpen?: boolean;
  hasMaxFilters?: boolean;
  filters: UserFilter[];
  addFilter: () => void;
  removeFilter: (filter: UserFilter) => void;
  updateFilter: (oldValue: UserFilter, newValue: UserFilter) => void;
}

const AdvancedFilters: FC<AdvancedFiltersProps> = ({
  isOpen = false,
  hasMaxFilters = false,
  filters,
  addFilter,
  updateFilter,
  removeFilter,
}) => {
  // TODO animate this show/hide with react-spring
  // TODO maybe set a max height and scroll
  return isOpen ? (
    <div className="pt-3 pb-2 text-sm bg-gray-200 bg-opacity-70 shadow-inner">
      {filters.map((filter, index) => (
        // TODO animate adding/removing filters with react-spring
        <FilterItem key={index} filter={filter} update={updateFilter} remove={removeFilter} />
      ))}
      {!filters.length ? (
        <div className="flex flex-col items-center justify-center text-center py-2 text-gray-500">
          <div className="text-sm">Add filters to find users to chat with.</div>
          <Button
            variant="link"
            size="sm"
            className="inline-block"
            onClick={addFilter}
            disabled={hasMaxFilters}
          >
            Add a filter...
          </Button>
        </div>
      ) : (
        <div className="px-3">
          <Button
            variant="link"
            size="sm"
            className="inline-block -ml-2"
            onClick={addFilter}
            disabled={hasMaxFilters}
          >
            Add another filter...
          </Button>
        </div>
      )}
      {/* TODO checkbox option to hide blocked users that is enabled by default */}
    </div>
  ) : null;
};

export default AdvancedFilters;
