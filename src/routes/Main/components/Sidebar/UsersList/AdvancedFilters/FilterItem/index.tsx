import React, { FC } from 'react';

import Button from '../../../../../../../components/Button';
import Icon from '../../../../../../../components/Icon';
import Select from '../../../../../../../components/Select';
import { UserFilter } from '../../../../../../../types/user';

interface FilterItemProps {
  isOpen?: boolean;
  filter: UserFilter;
  update: (oldValue: UserFilter, newValue: UserFilter) => void;
  remove: (filter: UserFilter) => void;
}

const FilterItem: FC<FilterItemProps> = ({ isOpen = false, filter, update, remove }) => {
  // TODO animate this show/hide with react-spring
  // TODO maybe set a max height and scroll
  return (
    <div className="flex items-center px-3 mb-2">
      <div className="flex-shrink-0">
        <Select
          options={[{ value: 'country', label: 'Country' }]}
          inputSize="sm"
          className="w-24 bg-opacity-60 focus:bg-opacity-100"
        />
      </div>
      <div className="ml-2 flex-1">
        <Select
          options={[{ value: 'US', label: 'United States' }]}
          inputSize="sm"
          className="bg-opacity-60 focus:bg-opacity-100"
          fullWidth
        />
      </div>
      <div className="ml-1 flex-shrink-0">
        <Button variant="link" size="sm" title="Remove filter" onClick={() => remove(filter)}>
          <Icon name="trash-can" size="sm" className="inline-block" title="Remove filter" />
        </Button>
      </div>
    </div>
  );
};

export default FilterItem;
