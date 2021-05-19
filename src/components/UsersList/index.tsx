import React, { FC } from 'react';

import { useUsers } from '../../hooks/useUser';

interface UsersListProps {}

const UsersList: FC<UsersListProps> = () => {
  const [users, isLoading /*error*/] = useUsers();

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
