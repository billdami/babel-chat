import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../../../../../components/Button';
import useDrawer from '../../../../../hooks/useDrawer';
import { UserRecord } from '../../../../../types/user';

interface MessageHeaderProps {
  destUser?: UserRecord;
}

const MessageHeader: FC<MessageHeaderProps> = ({ destUser }) => {
  const history = useHistory();
  const { toggleDrawer } = useDrawer();

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 border-b border-gray-200">
      <div className="flex">
        <Button variant="muted" className="mr-2 md:hidden" onClick={toggleDrawer}>
          ☰
        </Button>
        {/* TODO handle when destUser don't exist ("user not found" message) */}
        <div>
          {/* TODO fix text truncation so it works on mobile */}
          <h2 className="text-lg truncate">
            {/* TODO create <UserNickname> to format/display user nickname */}
            <span className="font-bold">{destUser?.nickname}</span>
            <span className="tracking-tighter font-light text-gray-400">#{destUser?.uuid}</span>
          </h2>
          <div className="text-sm leading-3 text-gray-400 truncate">
            {/* TODO create <UserDetailsLine> to format/display user details */}
            {destUser?.age} {destUser?.gender}, {destUser?.country}
          </div>
        </div>
      </div>
      <Button variant="muted" onClick={closeChat}>
        &times;
      </Button>
    </div>
  );
};

export default MessageHeader;
