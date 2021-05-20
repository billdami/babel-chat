import React, { FC } from 'react';
import { Val } from 'react-firebase-hooks/database/dist/database/types';
import { NavLink } from 'react-router-dom';

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
            <NavLink
              className="block w-full px-3 py-1 text-left"
              activeClassName="bg-gray-200"
              to={`/main/chat/${user.id}`}
            >
              <div>
                {/* TODO create <UserNickname> to format/display user nickname */}
                <span className="font-bold text-gray-800">{user.nickname}</span>
                <span className="text-gray-400 font-light tracking-tighter">#{user.uuid}</span>
              </div>
              <div className="text-gray-400 text-sm">
                {/* TODO create <UserDetailsLine> to format/display user details */}
                {user.age} {user.gender}, {user.country}
              </div>
            </NavLink>
          </li>
        ))}
        {isLoading && <div>Loading&hellip;</div>}
      </ul>
    </div>
  );
};

export default UsersList;
