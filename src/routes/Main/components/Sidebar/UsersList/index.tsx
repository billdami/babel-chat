import React, { FC, useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { UserRecord, UserSort } from '../../../../../types/user';
import Spinner from '../../../../../components/Spinner';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';
import { filterUserRecords, sortUserRecords } from '../../../../../utils/user';
import Menu, { MenuContentProps } from '../../../../../components/Menu';
import Select from '../../../../../components/Select';

import ListItem from './ListItem';

interface UsersListProps {
  users?: UserRecord[];
  isLoading: boolean;
  blockedIds: string[];
}

interface SortMenuProps extends MenuContentProps {}

const defaultSorts: UserSort[] = [
  {
    property: 'status',
    isDescending: false,
  },
  {
    property: 'country',
    isDescending: false,
  },
];

const SortOptions = [
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

const SortMenu: FC<SortMenuProps> = ({ isSheet }) => (
  <>
    <div className="flex items-end justify-between mb-2 px-4">
      <div className="text-gray-600 font-bold">Sort users by</div>
      {isSheet && (
        <Button size="sm" variant="muted" className="flex-shrink-0" outline>
          <Icon name="x-mark" size="sm" />
        </Button>
      )}
    </div>
    <div className="flex px-4 py-2 border-t border-b border-gray-100">
      <Select className="w-full md:w-40" options={SortOptions} />
      <Button
        variant="secondary"
        size="sm"
        className="ml-2 flex-shrink-0"
        title="Toggle sort direction"
      >
        <Icon name="arrow-down-a-z" size="sm" title="Toggle sort direction" />
      </Button>
    </div>
    <div className="flex px-4 py-2 border-b border-gray-100">
      <Select className="w-full md:w-40" options={SortOptions} />
      <Button
        variant="secondary"
        size="sm"
        className="ml-2 flex-shrink-0"
        title="Toggle sort direction"
      >
        <Icon name="arrow-down-a-z" size="sm" title="Toggle sort direction" />
      </Button>
    </div>
    {isSheet && (
      <div className="mt-4 mb-2 mx-4">
        <Button variant="secondary" fullWidth>
          Done
        </Button>
      </div>
    )}
  </>
);

const UsersList: FC<UsersListProps> = ({ users, isLoading, blockedIds }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [sorts] = useState<UserSort[]>(defaultSorts);

  const [debouncedSorts] = useDebounce<UserSort[]>(sorts, 250);
  const [debouncedSearchTerm] = useDebounce<string>(searchTerm, 250);

  const filteredUsers = useMemo<UserRecord[]>(() => {
    const term = debouncedSearchTerm.trim();
    const _users = users ?? [];
    return term ? _users.filter((u) => filterUserRecords(u, term)) : _users;
  }, [users, debouncedSearchTerm]);

  const sortedUsers = useMemo<UserRecord[]>(() => {
    const currentTime = new Date().getTime();
    return debouncedSorts.length
      ? filteredUsers.sort((a, b) => sortUserRecords(a, b, debouncedSorts, currentTime))
      : filteredUsers;
  }, [filteredUsers, debouncedSorts]);

  const toggleFiltersPanel = useCallback(() => {
    setIsFiltersOpen(!isFiltersOpen);
  }, [isFiltersOpen]);

  return (
    <div className="pb-2">
      <div className="mb-1">
        <div className="flex px-3 py-2 bg-gray-200 bg-opacity-70">
          <Input
            placeholder="Search users"
            inputSize="sm"
            className="bg-opacity-60 focus:bg-opacity-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          {/* TODO clear button overlay when search term is not empty */}
          <div className="flex ml-2">
            <Button
              size="sm"
              variant="muted"
              title={isFiltersOpen ? 'Hide advanced filters' : 'Show advanced filters'}
              onClick={toggleFiltersPanel}
              isActive={isFiltersOpen}
            >
              <Icon name="filter" size="sm" className="inline" title="Advanced filters" />
            </Button>
            <Menu
              isOpen={isSortMenuOpen}
              content={SortMenu}
              contentProps={{}}
              onOutsideClick={() => setIsSortMenuOpen(false)}
              menuClassName="py-2 text-sm"
              sheetClassName="py-2 text-sm"
              triggerClassName="ml-1"
              trigger={
                <Button
                  size="sm"
                  variant="muted"
                  title="Sort"
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  isActive={isSortMenuOpen}
                  aria-expanded={isSortMenuOpen}
                  aria-haspopup={true}
                >
                  <Icon name="arrow-down-a-z" size="sm" className="inline" />
                </Button>
              }
            />
          </div>
        </div>
        {/* TODO animate this show/hide with react-spring */}
        {/* TODO maybe set a max height and scroll */}
        {isFiltersOpen && (
          <div className="py-2 bg-gray-300 bg-opacity-50 shadow-inner">
            Filters ui
            {/* TODO checkbox option to hide blocked users that is enabled by default */}
          </div>
        )}
      </div>
      {sortedUsers.length > 0 && sortedUsers.length !== users?.length && (
        <div className="px-3 mb-1 text-sm text-gray-600">
          <span className="font-bold">{sortedUsers.length}</span> of{' '}
          <span className="font-bold">{users?.length}</span> users shown.
          <Button variant="link" size="sm" className="inline-block">
            Clear filters
          </Button>
        </div>
      )}
      <ul>
        {sortedUsers?.map((user) => (
          <ListItem key={user.id} user={user} blockedIds={blockedIds} />
        ))}
        {!sortedUsers.length && !isLoading && (
          <div className="px-3 py-8 text-gray-400 text-center text-sm">No users found 😿</div>
        )}
      </ul>
      {isLoading && <Spinner className="mx-3 my-2" />}
    </div>
  );
};

export default UsersList;
