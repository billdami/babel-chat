import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../../../../../components/Button';
import { UserRecord } from '../../../../../types/user';

interface MessageHeaderProps {
  destUser?: UserRecord;
}

const MessageHeader: FC<MessageHeaderProps> = ({ destUser }) => {
  const history = useHistory();

  const closeChat = useCallback(() => {
    history.push('/main');
  }, [history]);

  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-4 border-b border-gray-200">
      {/* TODO handle when destUser don't exist ("user not found" message) */}
      <div>
        <h2 className="text-lg">
          {/* TODO create <UserNickname> to format/display user nickname */}
          <span className="font-bold">{destUser?.nickname}</span>
          <span className="tracking-tighter font-light text-gray-400">#{destUser?.uuid}</span>
        </h2>
        <div className="text-sm leading-3 text-gray-400">
          {/* TODO create <UserDetailsLine> to format/display user details */}
          {destUser?.age} {destUser?.gender}, {destUser?.country}
        </div>
      </div>
      <Button variant="muted" onClick={closeChat}>
        &times;
      </Button>
    </div>
  );
};

export default MessageHeader;
