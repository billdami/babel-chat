import React, { ChangeEvent, FC, useCallback, MouseEvent as ReactMouseEvent } from 'react';

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
      <div className="flex items-start justify-between mb-2 px-4">
        <div className="text-gray-600 dark:text-gray-400 font-bold">Sort chats</div>
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
        Set the order that chats will appear in the list.
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
