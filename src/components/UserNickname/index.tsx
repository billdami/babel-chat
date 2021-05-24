import cn from 'classnames';
import React, { FC } from 'react';

import { User } from '../../types/user';

interface UserNicknameProps {
  className?: string;
  user?: User;
  isCurrentUser?: boolean;
  isOffline?: boolean;
}

const UserNickname: FC<UserNicknameProps> = ({
  className = '',
  user,
  isCurrentUser = false,
  isOffline = false,
}) => (
  <h2 className={cn('truncate', className)}>
    <span className="font-bold">{user?.nickname}</span>
    <span className="tracking-tighter font-light text-gray-400">#{user?.uuid}</span>
    {isCurrentUser && <span className="ml-1 text-xs font-bold text-gray-400">(you)</span>}
    {isOffline && <span className="ml-1 text-xs italic text-gray-400">(offline)</span>}
  </h2>
);

export default UserNickname;
