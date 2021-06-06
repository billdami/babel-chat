import React, {
  ChangeEvent,
  FC,
  useCallback,
  useMemo,
  useState,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useDebounce } from 'use-debounce';

import { UserRecord, UserSort, UserSortProperty, UserFilter } from '../../../../../types/user';
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

interface SortMenuProps extends MenuContentProps {
  sorts?: UserSort[];
  updateSort?: (sort: UserSort, updates: Partial<UserSort>) => void;
  closeSortMenu?: () => void;
}

const MAX_FILTERS = 20;

const defaultSorts: UserSort[] = [
  {
    property: 'country',
    isDescending: false,
  },
  {
    property: 'status',
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
        <div className="text-gray-600 font-bold">Sort users by</div>
        {isSheet && (
          <Button size="sm" variant="muted" className="flex-shrink-0" outline>
            <Icon name="x-mark" size="sm" />
          </Button>
        )}
      </div>
      <div className="border-t border-gray-100">
        {sorts?.map((sort, index) => (
          <div className="flex px-4 py-2 border-b border-gray-100" key={index}>
            <Select
              className="w-full md:w-40"
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
                name={sort.isDescending ? 'arrow-down-z-a' : 'arrow-down-a-z'}
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

const UsersList: FC<UsersListProps> = ({ users, isLoading, blockedIds }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  // const [showBlockedUsers /*, setShowBlockedUsers*/] = useState<boolean>(false);
  const [filters, setFilters] = useState<UserFilter[]>([]);
  const [sorts, setSorts] = useState<UserSort[]>(defaultSorts);

  const [debouncedSearchTerm] = useDebounce<string>(searchTerm, 250);
  const [debouncedFilters] = useDebounce<UserFilter[]>(filters, 250);
  const [debouncedSorts] = useDebounce<UserSort[]>(sorts, 250);

  const hasMaxFilters = filters.length >= MAX_FILTERS;

  // TODO move blocked users filter into its own useMemo, as users filtered out by blocking
  // should not show as as "has filters state", and should not be included in the tab count
  // blockedIds, showBlockedUsers

  const filteredUsers = useMemo<UserRecord[]>(() => {
    const term = debouncedSearchTerm.trim();
    const _users = users ?? [];
    const _filters = debouncedFilters; //TODO filter out "empty" filters
    return term ? _users.filter((u) => filterUserRecords(u, term, _filters)) : _users;
  }, [users, debouncedSearchTerm, debouncedFilters]);

  const sortedUsers = useMemo<UserRecord[]>(() => {
    const currentTime = new Date().getTime();
    const _sorts = debouncedSorts.filter((s) => !!s.property);
    return _sorts.length
      ? filteredUsers.sort((a, b) => sortUserRecords(a, b, _sorts, currentTime))
      : filteredUsers;
  }, [filteredUsers, debouncedSorts]);

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
        <div className="flex px-3 py-2 bg-gray-200 bg-opacity-70">
          <div className="relative flex-1">
            <Input
              placeholder="Search users"
              inputSize="sm"
              className="bg-opacity-60 focus:bg-opacity-100 pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              title={isFiltersOpen ? 'Hide advanced filters' : 'Show advanced filters'}
              onClick={toggleFiltersPanel}
              isActive={isFiltersOpen}
            >
              <Icon name="filter" size="sm" className="inline" title="Advanced filters" />
            </Button>
            <Menu
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
        {/* TODO animate this show/hide with react-spring */}
        {/* TODO maybe set a max height and scroll */}
        {/* TODO move this into UsersList/AdvancedFilters component */}
        {isFiltersOpen && (
          <div className="pt-3 pb-2 text-sm bg-gray-200 bg-opacity-70 shadow-inner">
            {filters.map((f, i) => (
              // TODO animate adding/removing filters with react-spring
              <div className="flex items-center px-3 mb-2" key={i}>
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
                  <Button
                    variant="link"
                    size="sm"
                    title="Remove filter"
                    onClick={() => removeFilter(f)}
                  >
                    <Icon
                      name="trash-can"
                      size="sm"
                      className="inline-block"
                      title="Remove filter"
                    />
                  </Button>
                </div>
              </div>
            ))}
            {!filters.length ? (
              <div className="flex flex-col items-center justify-center text-center py-2 text-gray-500">
                <div className="text-sm">Add filters to find users to chat with!</div>
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
        )}
      </div>
      {sortedUsers.length > 0 && sortedUsers.length !== users?.length && (
        <div className="px-3 mb-1 text-sm text-gray-600">
          <span className="font-bold">{sortedUsers.length}</span> of{' '}
          <span className="font-bold">{users?.length}</span> users shown.
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
