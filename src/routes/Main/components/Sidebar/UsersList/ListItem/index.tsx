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
          hover:bg-opacity-50 hover:bg-gray-200
          focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
        activeClassName="bg-gray-200 hover:bg-opacity-100"
        to={`/main/chat/${user.id}`}
        onClick={closeDrawer}
      >
        <div className="relative flex-shrink-0 mr-2">
          <UserStatus user={user} className="absolute -top-1 -left-1 ml-px mt-px shadow" />
          <UserAvatar user={user} />
        </div>
        <div className="truncate">
          <UserNickname
            user={user}
            isCurrentUser={user.id === authUser?.uid}
            isBlocked={isBlocked}
            className="text-gray-800"
          />
          <UserDetails user={user} className="text-gray-400 text-sm" />
        </div>
      </NavLink>
    </li>
  );
};

export default ListItem;
