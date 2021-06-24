import React, { FC, MouseEvent as ReactMouseEvent } from 'react';

import Icon from '../../../../../../components/Icon';
import { MenuContentProps } from '../../../../../../components/Menu';
import MenuItem from '../../../../../../components/Menu/MenuItem';

export interface ActionsMenuProps extends MenuContentProps {
  isPinned?: boolean;
  pinChat?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  unpinChat?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  markChatRead?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  blockUser?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  removeChat?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ActionsMenu: FC<ActionsMenuProps> = ({
  isPinned,
  pinChat,
  unpinChat,
  markChatRead,
  blockUser,
  removeChat,
}) => (
  <>
    {isPinned ? (
      <MenuItem onClick={unpinChat}>
        <Icon name="thumbtack" size="sm" className="inline-block mr-2 text-red-400" />
        Unpin
      </MenuItem>
    ) : (
      <MenuItem onClick={pinChat}>
        <Icon name="thumbtack" size="sm" className="inline-block mr-2 text-gray-400" />
        Pin
      </MenuItem>
    )}
    <MenuItem onClick={markChatRead}>
      <Icon name="message-check" size="sm" className="inline-block mr-2 text-gray-400" />
      Mark as read
    </MenuItem>
    <MenuItem onClick={blockUser}>
      <Icon name="ban" size="sm" className="inline-block mr-2 text-gray-400" />
      Block user
    </MenuItem>
    <MenuItem onClick={removeChat}>
      <Icon name="trash-can" size="sm" className="inline-block mr-2 text-gray-400" />
      Remove
    </MenuItem>
  </>
);

export default ActionsMenu;
