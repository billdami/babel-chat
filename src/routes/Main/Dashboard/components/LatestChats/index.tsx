import React, { FC, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import RelativeTime from '../../../../../components/RelativeTime';
import Spinner from '../../../../../components/Spinner';
import UserAvatar from '../../../../../components/UserAvatar';
import UserNickname from '../../../../../components/UserNickname';
import useAuth from '../../../../../hooks/useAuth';
import { useLatestChats } from '../../../../../hooks/useChatRecord';
import { ChatRecord } from '../../../../../types/chat';

interface LatestChatsProps {
  openAllChats: () => void;
}

const LatestChats: FC<LatestChatsProps> = ({ openAllChats }) => {
  const { user: authUser } = useAuth();
  const [latestChats, isLoadingChats] = useLatestChats(authUser?.uid);

  const sortedChats = useMemo<ChatRecord[]>(() => latestChats?.reverse() ?? [], [latestChats]);

  return (
    <div className="mb-8 w-auto lg:w-1/2 2xl:w-auto 2xl:max-w-md lg:ml-2 2xl:ml-0">
      <div className="flex justify-between sm:justify-start 2xl:justify-between items-center mb-4">
        <h3 className="text-xl text-gray-600 dark:text-gray-400 mr-2">My latest chats</h3>
        <Button variant="link" size="sm" className="md:hidden" onClick={openAllChats}>
          View all
        </Button>
      </div>
      {!!sortedChats.length && (
        <div className="-ml-2">
          {sortedChats.map((chat) => (
            <RouterLink
              key={chat.id}
              to={`/main/chat/${chat.id}`}
              className="relative
                block flex-1 min-w-0
                px-2 py-1
                text-left
                rounded
                hover:bg-opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:bg-opacity-50
                focus:outline-none
                focus:ring-inset focus:ring-2 focus:ring-opacity-50 dark:focus:ring-opacity-50 focus:ring-green-300 dark:focus:ring-green-500"
            >
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center min-w-0">
                  <UserAvatar
                    user={chat.toUserDetails}
                    size={20}
                    className="flex-shrink-0 mr-2 border border-gray-100"
                  />
                  <UserNickname
                    user={chat.toUserDetails}
                    className="flex-1 text-gray-800 dark:text-gray-300"
                  />
                </div>
                <div className="flex items-center">
                  <div className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                    <RelativeTime date={chat.dateLastMessage} />
                  </div>
                  {(!chat.dateLastSeen || chat.dateLastSeen < chat.dateLastMessage) && (
                    <Badge
                      className="flex-shrink-0 ml-1"
                      tooltip="There are unread message(s)"
                      size="md"
                      pulse={false}
                    />
                  )}
                </div>
              </div>
            </RouterLink>
          ))}
        </div>
      )}
      {!isLoadingChats && !sortedChats.length && (
        <div className="mb-4 text-sm text-gray-400 dark:text-gray-500">
          You don't have any active chats 😿
        </div>
      )}
      {isLoadingChats && <Spinner />}
    </div>
  );
};

export default LatestChats;
