import React, { FC } from 'react';

import { UserRecord } from '../../../../../types/user';
import Spinner from '../../../../../components/Spinner';

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
    <div className="UsersList py-2">
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
