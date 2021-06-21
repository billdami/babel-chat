import React, { ChangeEvent, FC, useCallback, MouseEvent as ReactMouseEvent } from 'react';

import { MenuContentProps } from '../../../../../../components/Menu';
import Select, { SelectOption } from '../../../../../../components/Select';
import Button from '../../../../../../components/Button';
import Icon from '../../../../../../components/Icon';
import { UserSort, UserSortProperty } from '../../../../../../types/user';

export interface SortMenuProps extends MenuContentProps {
  sorts?: UserSort[];
  updateSort?: (sort: UserSort, updates: Partial<UserSort>) => void;
  closeSortMenu?: () => void;
}

const SortOptions: SelectOption<UserSortProperty>[] = [
  {
    value: '',
    label: 'No sort',
  },
  {
    value: 'nickname',
    label: 'Nickname',
  },
  {
    value: 'age',
    label: 'Age',
  },
  {
    value: 'gender',
    label: 'Gender',
  },
  {
    value: 'country',
    label: 'Country',
  },
  {
    value: 'status',
    label: 'Online status',
  },
];

const SortMenu: FC<SortMenuProps> = ({ isSheet, sorts, updateSort, closeSortMenu }) => {
  const onSortPropertyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>, sort?: UserSort) => {
      if (sort) {
        updateSort?.(sort, { property: event.target.value as UserSortProperty });
      }
    },
    [updateSort]
  );

  const onDirectionToggle = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>, sort?: UserSort) => {
      event.preventDefault();
      event.stopPropagation();
      if (sort) {
        updateSort?.(sort, { isDescending: !sort.isDescending });
      }
    },
    [updateSort]
  );

  return (
    <>
      <div className="flex items-end justify-between mb-2 px-4">
        <div className="text-gray-600 dark:text-gray-400 font-bold">Sort users by</div>
        {isSheet && (
          <Button
            size="sm"
            variant="muted"
            className="flex-shrink-0"
            onClick={closeSortMenu}
            outline
          >
            <Icon name="x-mark" size="sm" />
          </Button>
        )}
      </div>
      <div className="border-t border-gray-100 dark:border-gray-500 dark:border-opacity-40">
        {sorts?.map((sort, index) => (
          <div
            className="flex px-4 py-2 border-b border-gray-100 dark:border-gray-500 dark:border-opacity-40"
            key={index}
          >
            <Select
              className="w-full md:w-40"
              inputSize="sm"
              options={SortOptions}
              value={sort.property}
              onChange={(e) => onSortPropertyChange(e, sort)}
              inverse
            />
            <Button
              variant="secondary"
              size="sm"
              className="ml-2 flex-shrink-0"
              title="Toggle sort direction"
              onClick={(e) => onDirectionToggle(e, sort)}
            >
              <Icon
                name={sort.isDescending ? 'arrow-up-wide-short' : 'arrow-down-short-wide'}
                size="sm"
                title="Toggle sort direction"
              />
            </Button>
          </div>
        ))}
      </div>
      {isSheet && (
        <div className="mt-4 mb-2 mx-4">
          <Button variant="secondary" onClick={closeSortMenu} fullWidth>
            Done
          </Button>
        </div>
      )}
    </>
  );
};

export default SortMenu;
