import React, { FC } from 'react';

import Badge from '../Badge';
import Button, { ButtonProps } from '../Button';
import Icon from '../Icon';
import useDrawer from '../../hooks/useDrawer';
import useNotifications from '../../hooks/useNotifications';

interface DrawerToggleButtonProps extends ButtonProps {}

const DrawerToggleButton: FC<DrawerToggleButtonProps> = ({ ...rest }) => {
  const { toggleDrawer } = useDrawer();
  const { numUnread } = useNotifications();

  return (
    <Button
      onClick={toggleDrawer}
      variant="inverse"
      className="relative md:hidden mr-2 flex-shrink-0"
      outline
      {...rest}
    >
      <Icon name="bars" size="sm" className="inline-block" />
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
  );
};

export default DrawerToggleButton;
