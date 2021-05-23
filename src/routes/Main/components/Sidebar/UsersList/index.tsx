import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { UserRecord } from '../../../../../types/user';
import useAuth from '../../../../../hooks/useAuth';
import useDrawer from '../../../../../hooks/useDrawer';

interface UsersListProps {
  users?: UserRecord[];
  isLoading: boolean;
}

const UsersList: FC<UsersListProps> = ({ users, isLoading }) => {
  const auth = useAuth();
  const { closeDrawer } = useDrawer();
  // TODO apply sorting
  // TODO apply filtering
  return (
    <div className="UsersList py-2">
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            <NavLink
              className="block w-full px-3 py-1 text-left hover:bg-opacity-50 hover:bg-gray-200 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
              activeClassName="bg-gray-200 hover:bg-opacity-100"
              to={`/main/chat/${user.id}`}
              onClick={closeDrawer}
            >
              <div>
                {/* TODO create <UserNickname> to format/display user nickname */}
                <span className="font-bold text-gray-800">{user.nickname}</span>
                <span className="text-gray-400 font-light tracking-tighter">#{user.uuid}</span>
                {user.id === auth.user?.uid && (
                  <span className="ml-1 text-xs font-bold text-gray-400">(you)</span>
                )}
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
