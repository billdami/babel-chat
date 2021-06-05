import React, { FC, useMemo, useState } from 'react';

import { UserRecord, UserSort } from '../../../../../types/user';
import Spinner from '../../../../../components/Spinner';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';
import { sortUserRecords } from '../../../../../utils/user';

import ListItem from './ListItem';

interface UsersListProps {
  users?: UserRecord[];
  isLoading: boolean;
  blockedIds: string[];
}

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

const UsersList: FC<UsersListProps> = ({ users, isLoading, blockedIds }) => {
  // TODO apply sorting
  // TODO apply filtering
  const [sorts] = useState<UserSort[]>(defaultSorts);
  // TODO useDebouncedValue for updating the sortedUsers array

  const sortedUsers = useMemo<UserRecord[]>(() => {
    const currentTime = new Date().getTime();
    return users?.sort((a, b) => sortUserRecords(a, b, sorts, currentTime)) ?? [];
  }, [users, sorts]);

  return (
    <div className="pb-2">
      <div className="flex px-3 py-2 mb-1 bg-gray-200 bg-opacity-70">
        <Input
          placeholder="Search users"
          inputSize="sm"
          className="bg-opacity-60 focus:bg-opacity-100"
          fullWidth
        />
        <div className="flex ml-2">
          <Button size="sm" variant="muted" title="Advanced filters">
            <Icon name="filter" size="sm" className="inline" title="Advanced filters" />
          </Button>
          <Button size="sm" variant="muted" className="ml-1" title="Sort">
            <Icon name="arrow-down-a-z" size="sm" className="inline" />
          </Button>
        </div>
      </div>
      <ul>
        {sortedUsers?.map((user) => (
          <ListItem key={user.id} user={user} blockedIds={blockedIds} />
        ))}
      </ul>
      {isLoading && <Spinner className="mx-3 my-2" />}
    </div>
  );
};

export default UsersList;
