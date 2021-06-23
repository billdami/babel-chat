import React, { ChangeEvent, FC, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import cn from 'classnames';

import { MenuContentProps } from '../../../../../../components/Menu';
import Select, { SelectOption } from '../../../../../../components/Select';
import Button from '../../../../../../components/Button';
import Icon from '../../../../../../components/Icon';
import { ChatSort, ChatSortProperty } from '../../../../../../types/chat';

export interface SortMenuProps extends MenuContentProps {
  sorts?: ChatSort[];
  updateSort?: (sort: ChatSort, updates: Partial<ChatSort>) => void;
  closeSortMenu?: () => void;
}

const SortOptions: SelectOption<ChatSortProperty>[] = [
  {
    value: '',
    label: 'No sort',
  },
  {
    value: 'nickname',
    label: 'Nickname',
  },
  {
    value: 'dateLastMessage',
    label: 'Date last messaged',
  },
  {
    value: 'dateStarted',
    label: 'Date started',
  },
];

const SortMenu: FC<SortMenuProps> = ({ isSheet, sorts, updateSort, closeSortMenu }) => {
  const onSortPropertyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>, sort?: ChatSort) => {
      if (sort) {
        updateSort?.(sort, { property: event.target.value as ChatSortProperty });
      }
    },
    [updateSort]
  );

  const onDirectionToggle = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>, sort?: ChatSort) => {
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
        <div className="text-gray-600 dark:text-gray-400 font-bold">Sort chats by</div>
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
      <div
        className={cn('border-t border-gray-100 dark:border-gray-500 dark:border-opacity-40', {
          'pb-8': !isSheet,
        })}
      >
        {sorts?.map((sort, index) => (
          <div
            className="flex px-4 py-2 border-b border-gray-100 dark:border-gray-500 dark:border-opacity-40"
            key={index}
          >
            <Select
              className="w-full md:w-40"
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
