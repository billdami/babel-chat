import React, { FC } from 'react';

import { UserRecord } from '../../../../../types/user';
import Spinner from '../../../../../components/Spinner';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';

import ListItem from './ListItem';

interface UsersListProps {
  users?: UserRecord[];
  isLoading: boolean;
  blockedIds: string[];
}

const UsersList: FC<UsersListProps> = ({ users, isLoading, blockedIds }) => {
  // TODO apply sorting
  // TODO apply filtering
  return (
    <div className="pb-2">
      <div className="flex px-3 py-2 mb-1 bg-gray-200 bg-opacity-70">
        <Input placeholder="Search" inputSize="sm" className="bg-opacity-100" fullWidth />
        <div className="flex ml-2">
          <Button size="sm" variant="secondary">
            <Icon name="filter" size="sm" className="inline" />
          </Button>
          <Button size="sm" variant="secondary" className="ml-1">
            <Icon name="arrow-down-a-z" size="sm" className="inline" />
          </Button>
        </div>
      </div>
      <ul>
        {users?.map((user) => (
          <ListItem key={user.id} user={user} blockedIds={blockedIds} />
        ))}
      </ul>
      {isLoading && <Spinner className="mx-3 my-2" />}
    </div>
  );
};

export default UsersList;
