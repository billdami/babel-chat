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
      <div className="flex items-start justify-between mb-2 px-4">
        <div className="text-gray-600 dark:text-gray-400 font-bold">Sort users</div>
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
      <p className="px-4 mb-4 text-sm text-gray-400 dark:text-gray-400">
        Set the order that users will appear in the list.
      </p>
      <div>
        {sorts?.map((sort, index) => (
          <div className="px-4 pb-4" key={index}>
            {!!sort.label && <div className="mb-2 text-xs">{sort.label}</div>}
            <div className="flex">
              <Select
                className="w-full"
                variant="inverse"
                inputSize="sm"
                options={SortOptions}
                value={sort.property}
                onChange={(e) => onSortPropertyChange(e, sort)}
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
          </div>
        ))}
      </div>
      {isSheet && (
        <div className="my-2 mx-4">
          <Button variant="primary" onClick={closeSortMenu} fullWidth>
            Done
          </Button>
        </div>
      )}
    </>
  );
};

export default SortMenu;
