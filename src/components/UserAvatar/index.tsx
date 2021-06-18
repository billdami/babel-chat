import cn from 'classnames';
import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { User } from '../../types/user';
import Identicon from '../Indenticon';

interface UserAvatarProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  user?: User | null;
  size?: number;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, size = 32, className, ...rest }) => {
  return (
    <div className={cn('p-1 rounded bg-white dark:bg-gray-200', className)} {...rest}>
      <Identicon identifier={user ? `${user.nickname}#${user.uuid}` : ''} size={size} />
    </div>
  );
};

export default UserAvatar;
