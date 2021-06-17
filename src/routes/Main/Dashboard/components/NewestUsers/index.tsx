import React, { FC, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Button from '../../../../../components/Button';
import RelativeTime from '../../../../../components/RelativeTime';
import Spinner from '../../../../../components/Spinner';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import useAuth from '../../../../../hooks/useAuth';
import { useNewestUsers } from '../../../../../hooks/useUserRecord';
import { UserRecord } from '../../../../../types/user';

interface NewestUsersProps {
  openAllUsers: () => void;
}

const NewestUsers: FC<NewestUsersProps> = ({ openAllUsers }) => {
  const { user: authUser } = useAuth();
  const [newestUsers, isLoadingUsers] = useNewestUsers();

  const sortedUsers = useMemo<UserRecord[]>(() => newestUsers?.reverse() ?? [], [newestUsers]);

  return (
    <div className="mb-8 w-auto lg:w-1/2 2xl:w-auto 2xl:max-w-md lg:mr-2 2xl:mr-0">
      <div className="flex justify-between sm:justify-start 2xl:justify-between items-center mb-4">
        <h3 className="text-xl text-gray-600 dark:text-gray-400 mr-2">Newest users</h3>
        <Button variant="link" size="sm" className="md:hidden" onClick={openAllUsers}>
          View all
        </Button>
      </div>
      {!!sortedUsers.length && (
        <div className="-ml-2">
          {sortedUsers.map((user) => (
            <RouterLink
              key={user.id}
              to={`/main/chat/${user.id}`}
              className="flex items-center
                w-full
                px-2 py-1
                text-left
                rounded
                hover:bg-opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600
                focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 dark:focus:ring-opacity-50 focus:ring-green-300 dark:focus:ring-green-500"
            >
              <div className="relative flex-shrink-0 mr-2">
                <UserAvatar user={user} className="border border-gray-100" />
              </div>
              <div className="truncate flex-1">
                <div className="flex justify-between items-start">
                  <UserNickname
                    user={user}
                    isCurrentUser={user.id === authUser?.uid}
                    className="text-gray-800 dark:text-gray-300"
                  />
                  <div className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                    <RelativeTime date={user.dateSignedIn} />
                  </div>
                </div>
                <UserDetails user={user} className="text-gray-400 dark:text-gray-500 text-sm" />
              </div>
            </RouterLink>
          ))}
        </div>
      )}
      {!isLoadingUsers && !sortedUsers.length && (
        <div className="mb-4 text-sm text-gray-400 dark:text-gray-500">No users found</div>
      )}
      {isLoadingUsers && <Spinner />}
    </div>
  );
};

export default NewestUsers;
