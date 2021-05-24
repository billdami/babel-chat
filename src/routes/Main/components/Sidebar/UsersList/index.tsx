import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { UserRecord } from '../../../../../types/user';
import useAuth from '../../../../../hooks/useAuth';
import useDrawer from '../../../../../hooks/useDrawer';
import UserNickname from '../../../../../components/UserNickname';
import UserDetails from '../../../../../components/UserDetails';
import UserStatus from '../../../../../components/UserStatus';

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
              className="flex items-baseline w-full
                px-3 py-1
                text-left
                hover:bg-opacity-50 hover:bg-gray-200
                focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
              activeClassName="bg-gray-200 hover:bg-opacity-100"
              to={`/main/chat/${user.id}`}
              onClick={closeDrawer}
            >
              <UserStatus user={user} className="mr-2" />
              <div>
                <UserNickname
                  user={user}
                  isCurrentUser={user.id === auth.user?.uid}
                  className="text-gray-800"
                />
                <UserDetails user={user} className="text-gray-400 text-sm" />
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
