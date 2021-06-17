import React, { FC, useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import UserAvatar from '../../../../../../components/UserAvatar';
import UserDetails from '../../../../../../components/UserDetails';
import UserNickname from '../../../../../../components/UserNickname';
import UserStatus from '../../../../../../components/UserStatus';
import useAuth from '../../../../../../hooks/useAuth';
import useDrawer from '../../../../../../hooks/useDrawer';
import { UserRecord } from '../../../../../../types/user';

interface ListItemProps {
  user: UserRecord;
  blockedIds: string[];
}

const ListItem: FC<ListItemProps> = ({ user, blockedIds }) => {
  const { user: authUser } = useAuth();
  const { closeDrawer } = useDrawer();

  const isBlocked = useMemo<boolean>(() => blockedIds.includes(user.id), [blockedIds, user]);

  return (
    <li>
      <NavLink
        className="flex items-center
          w-full
          px-3 py-1
          text-left
          hover:bg-opacity-50 hover:bg-gray-200 dark:hover:bg-gray-900 dark:hover:bg-opacity-30
          focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 dark:focus:ring-opacity-50 focus:ring-green-300 dark:focus:ring-green-500"
        activeClassName="bg-gray-200 hover:bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-50"
        to={`/main/chat/${user.id}`}
        onClick={closeDrawer}
      >
        <div className="relative flex-shrink-0 mr-2">
          <UserStatus
            user={user}
            className="absolute -bottom-1 -right-1 mb-px mr-px border-gray-100"
          />
          <UserAvatar user={user} />
        </div>
        <div className="truncate">
          <UserNickname
            user={user}
            isCurrentUser={user.id === authUser?.uid}
            isBlocked={isBlocked}
            className="text-gray-800 dark:text-gray-300"
          />
          <UserDetails user={user} className="text-gray-400 dark:text-gray-500 text-sm" />
        </div>
      </NavLink>
    </li>
  );
};

export default ListItem;
