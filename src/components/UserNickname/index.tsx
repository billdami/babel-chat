import cn from 'classnames';
import React, { FC } from 'react';

import { User } from '../../types/user';
import Icon from '../Icon';

interface UserNicknameProps {
  className?: string;
  user?: User | null;
  isCurrentUser?: boolean;
  isOffline?: boolean;
  mutedClassName?: string;
}

const UserNickname: FC<UserNicknameProps> = ({
  className = '',
  user,
  isCurrentUser = false,
  isOffline = false,
  mutedClassName = 'text-gray-400',
}) => (
  <h2 className={cn('truncate', className)}>
    <span className="font-bold">{user?.nickname}</span>
    {user?.uuid && (
      <span className={cn('tracking-tighter font-light', mutedClassName)}>#{user?.uuid}</span>
    )}
    {isCurrentUser && (
      <span className={cn('ml-1 text-xs font-bold', mutedClassName)}>
        <Icon name="user" size="sm" className="inline-block" title="This is you!" />
      </span>
    )}
    {isOffline && <span className={cn('ml-1 text-xs italic', mutedClassName)}>(offline)</span>}
  </h2>
);

export default UserNickname;
