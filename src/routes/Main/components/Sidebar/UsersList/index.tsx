import React, { FC, useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import FormattedNumber from '../../../../../components/FormattedNumber';
import Icon from '../../../../../components/Icon';
import Input from '../../../../../components/Input';
import Menu from '../../../../../components/Menu';
import Spinner from '../../../../../components/Spinner';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import { UserRecord, UserSort, UserFilter } from '../../../../../types/user';
import { filterUserRecords, groupUserFilters, sortUserRecords } from '../../../../../utils/user';
import { DEFAULT_USER_SORTS, MAX_USER_FILTERS } from '../../../../../constants/user';

import ListItem from './ListItem';
import SortMenu, { SortMenuProps } from './SortMenu';
import AdvancedFilters from './AdvancedFilters';

interface UsersListProps {
  users?: UserRecord[];
  isLoading: boolean;
  blockedIds: string[];
}

const UsersList: FC<UsersListProps> = ({ users, isLoading, blockedIds }) => {
  const { user } = useCurrentUser();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  // const [showBlockedUsers /*, setShowBlockedUsers*/] = useState<boolean>(false);
  const [filters, setFilters] = useState<UserFilter[]>([]);
  const [sorts, setSorts] = useState<UserSort[]>(DEFAULT_USER_SORTS);

  const [debouncedSearchTerm] = useDebounce<string>(searchTerm, 250);
  const [debouncedFilters] = useDebounce<UserFilter[]>(filters, 250);
  const [debouncedSorts] = useDebounce<UserSort[]>(sorts, 250);

  const hasMaxFilters = filters.length >= MAX_USER_FILTERS;

  // TODO move blocked users filter into its own useMemo, as users filtered out by blocking
  // should not show as as "has filters state", and should not be included in the tab count
  // blockedIds, showBlockedUsers

  const filteredUsers = useMemo<UserRecord[]>(() => {
    const term = debouncedSearchTerm.trim().toLocaleUpperCase();
    const _users = users ?? [];
    const _filters = groupUserFilters(debouncedFilters);
    return term || _filters.length > 0
      ? _users.filter((u) => filterUserRecords(u, term, _filters))
      : _users;
  }, [users, debouncedSearchTerm, debouncedFilters]);

  const sortedUsers = useMemo<UserRecord[]>(() => {
    const currentTime = new Date().getTime();
    const _sorts = debouncedSorts.filter((s) => !!s.property);
    return _sorts.length
      ? filteredUsers.sort((a, b) => sortUserRecords(a, b, _sorts, currentTime, user?.country))
      : filteredUsers;
  }, [filteredUsers, debouncedSorts, user]);

  const updateSort = useCallback(
    (sort: UserSort, updates: Partial<UserSort>) => {
      setSorts(sorts.map((s) => (s === sort ? { ...sort, ...updates } : s)));
    },
    [sorts]
  );

  const closeSortMenu = useCallback(() => setIsSortMenuOpen(false), []);

  const sortMenuProps = useMemo<SortMenuProps>(
    () => ({ sorts, updateSort, closeSortMenu }),
    [sorts, updateSort, closeSortMenu]
  );

  const toggleFiltersPanel = useCallback(() => {
    setIsFiltersOpen(!isFiltersOpen);
  }, [isFiltersOpen]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters([]);
    setIsFiltersOpen(false);
  }, []);

  const addFilter = useCallback(() => {
    if (hasMaxFilters) {
      return;
    }

    setFilters([...filters, { property: 'country', value: '' }]);
  }, [hasMaxFilters, filters]);

  const removeFilter = useCallback(
    (filter: UserFilter) => {
      setFilters(filters.filter((f) => f !== filter));
    },
    [filters]
  );

  const updateFilter = useCallback(
    (oldValue: UserFilter, newValue: UserFilter) => {
      setFilters(filters.map((f) => (f !== oldValue ? f : newValue)));
    },
    [filters]
  );

  return (
    <div className="pb-2">
      <div className="mb-1">
        <div className="flex px-3 py-2 bg-gray-200 dark:bg-gray-600 bg-opacity-70 dark:bg-opacity-70">
          <div className="relative flex-1">
            <Input
              placeholder="Search users"
              inputSize="sm"
              className="bg-opacity-60 focus:bg-opacity-100 pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-users-search-input
              fullWidth
            />
            {!!searchTerm.length && (
              <button
                type="button"
                className="absolute right-0 top-0 px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setSearchTerm('')}
              >
                <Icon name="x-mark" size="sm" />
              </button>
            )}
          </div>
          <div className="flex ml-2">
            <Button
              size="sm"
              variant="muted"
              className="relative"
              title={isFiltersOpen ? 'Hide advanced filters' : 'Show advanced filters'}
              onClick={toggleFiltersPanel}
              isActive={isFiltersOpen}
              aria-expanded={isFiltersOpen}
              data-users-filters-toggle
            >
              <Icon name="filter" size="sm" className="inline" title="Advanced filters" />
              {!!filters.length && (
                <Badge
                  className="absolute -top-1 -right-1"
                  tooltip={
                    filters.length === 1
                      ? `There is 1 active filter`
                      : `There are ${filters.length} active filters`
                  }
                  size="sm"
                  variant="muted"
                  pulse={false}
                  deferRender={false}
                />
              )}
            </Button>
            <Menu<SortMenuProps>
              isOpen={isSortMenuOpen}
              content={SortMenu}
              contentProps={sortMenuProps}
              onOutsideClick={closeSortMenu}
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
        <AdvancedFilters
          isOpen={isFiltersOpen}
          hasMaxFilters={hasMaxFilters}
          filters={filters}
          addFilter={addFilter}
          removeFilter={removeFilter}
          updateFilter={updateFilter}
        />
      </div>
      {sortedUsers.length > 0 && sortedUsers.length !== users?.length && (
        <div className="px-3 mb-1 text-sm text-gray-600">
          <span className="font-bold">
            <FormattedNumber value={sortedUsers.length} />
          </span>{' '}
          of{' '}
          <span className="font-bold">
            <FormattedNumber value={users?.length} />
          </span>{' '}
          users shown.
          <Button variant="link" size="sm" className="inline-block" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
      <ul>
        {sortedUsers?.map((user) => (
          <ListItem key={user.id} user={user} blockedIds={blockedIds} />
        ))}
        {!sortedUsers.length && !isLoading && (
          <div className="px-3 py-8 text-gray-400 text-center text-sm">
            No users found.
            <Button variant="link" size="sm" className="inline-block" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </ul>
      {isLoading && <Spinner className="mx-3 my-2" />}
    </div>
  );
};

export default UsersList;
