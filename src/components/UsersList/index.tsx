import React, { FC } from 'react';
import { Val } from 'react-firebase-hooks/database/dist/database/types';

import { User } from '../../types/user';

interface UsersListProps {
  users?: Val<User, 'id', 'ref'>[];
  isLoading: boolean;
}

const UsersList: FC<UsersListProps> = ({ users, isLoading }) => {
  return (
    <div className="UsersList">
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            <div>
              {user.nickname}
              <span className="text-gray-500 tracking-tighter">#{user.uuid}</span>
            </div>
            <div>
              {user.age} {user.gender}, {user.country}
            </div>
          </li>
        ))}
        {isLoading && <div>Loading&hellip;</div>}
      </ul>
    </div>
  );
};

export default UsersList;
