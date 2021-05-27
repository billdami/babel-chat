import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import UserStatus from '../../../../../components/UserStatus';
import useDrawer from '../../../../../hooks/useDrawer';
import useNotifications from '../../../../../hooks/useNotifications';
import { ChatRecord } from '../../../../../types/chat';
import { UserRecord } from '../../../../../types/user';

interface MessageHeaderProps {
  destUser?: UserRecord;
  originChat?: ChatRecord | null;
  isLoading?: boolean;
}

const MessageHeader: FC<MessageHeaderProps> = ({ destUser, originChat, isLoading = false }) => {
  const history = useHistory();
  const { toggleDrawer } = useDrawer();
  const { numUnread } = useNotifications();

  // use the main user record to display details, but fall back to the chat's copy (e.g. if they signed out)
  const isOffline = !destUser?.id;
  const user = isOffline ? originChat?.toUserDetails : destUser;
  const userDetailsExist = !!user?.nickname;

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 bg-green-500 text-white">
      <div className="flex items-center">
        <Button
          onClick={toggleDrawer}
          variant="inverse"
          className="mr-2 md:hidden relative"
          outline
        >
          &#9776;
          {!!numUnread && (
            <Badge
              className="absolute -right-1 -top-1"
              tooltip={
                numUnread
                  ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
                  : ''
              }
            />
          )}
        </Button>
        {!isLoading &&
          (userDetailsExist ? (
            <div>
              <div className="flex items-center">
                {/* TODO fix text truncation so it works on mobile */}
                <UserNickname
                  user={user}
                  isOffline={isOffline}
                  className="md:text-lg md:leading-5"
                  mutedClassName="text-green-200"
                />
                <UserStatus user={destUser} className="ml-2 shadow" />
              </div>
              <UserDetails user={user} className="text-xs md:text-sm leading-3 text-green-200" />
            </div>
          ) : (
            <div>
              <h2 className="truncate md:leading-5 font-bold text-yellow-200">User not found</h2>
              <h3 className="text-xs md:text-sm leading-3 text-green-200">
                This user no longer exists.
              </h3>
            </div>
          ))}
      </div>
      <Button onClick={closeChat} variant="inverse" outline>
        &times;
      </Button>
    </div>
  );
};

export default MessageHeader;
