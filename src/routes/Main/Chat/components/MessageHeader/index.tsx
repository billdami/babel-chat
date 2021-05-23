import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../../../../../components/Button';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import useDrawer from '../../../../../hooks/useDrawer';
import { UserRecord } from '../../../../../types/user';

interface MessageHeaderProps {
  destUser?: UserRecord;
  isLoading?: boolean;
}

const MessageHeader: FC<MessageHeaderProps> = ({ destUser, isLoading = false }) => {
  const history = useHistory();
  const { toggleDrawer } = useDrawer();

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 border-b border-gray-200">
      <div className="flex items-center">
        <Button variant="muted" className="mr-2 md:hidden" onClick={toggleDrawer}>
          ☰
        </Button>
        {!isLoading &&
          (destUser?.id ? (
            <div>
              {/* TODO fix text truncation so it works on mobile */}
              <UserNickname user={destUser} className="md:text-lg md:leading-5" />
              <UserDetails user={destUser} className="text-xs md:text-sm leading-3 text-gray-400" />
            </div>
          ) : (
            <h2 className="text-lg truncate">User not found</h2>
          ))}
      </div>
      <Button variant="muted" onClick={closeChat}>
        &times;
      </Button>
    </div>
  );
};

export default MessageHeader;
