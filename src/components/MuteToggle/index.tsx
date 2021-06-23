import React, { FC } from 'react';
import cn from 'classnames';

import ToggleSwitch from '../ToggleSwitch';
import Icon from '../Icon';
import useNotifications from '../../hooks/useNotifications';

interface MuteToggleProps {
  className?: string;
  toggleClassName?: string;
  buttonId?: string;
}

const MuteToggle: FC<MuteToggleProps> = ({
  className = '',
  toggleClassName = '',
  buttonId = '',
}) => {
  const { isMuted, toggleMute } = useNotifications();

  return (
    <div className={cn(className, 'flex items-center')}>
      <ToggleSwitch
        srLabel={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        onClick={() => toggleMute(!isMuted)}
        checked={isMuted}
        className={toggleClassName}
        id={buttonId}
      />
      <Icon name="volume-x-mark" size="sm" className="ml-2" />
    </div>
  );
};

export default MuteToggle;
