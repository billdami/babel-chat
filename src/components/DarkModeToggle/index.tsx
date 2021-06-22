import React, { FC } from 'react';
import cn from 'classnames';

import useTheme from '../../hooks/useTheme';
import ToggleSwitch from '../ToggleSwitch';
import Icon from '../Icon';

interface DarkModeToggleProps {
  className?: string;
  toggleClassName?: string;
  buttonId?: string;
}

const DarkModeToggle: FC<DarkModeToggleProps> = ({
  className = '',
  toggleClassName = '',
  buttonId = '',
}) => {
  const { isDarkTheme, updateTheme } = useTheme();

  return (
    <div className={cn(className, 'flex items-center')}>
      <ToggleSwitch
        srLabel="Toggle dark mode"
        onClick={() => updateTheme(isDarkTheme ? 'light' : 'dark', true)}
        checked={isDarkTheme}
        className={toggleClassName}
        id={buttonId}
      />
      <Icon name="moon" size="sm" className="ml-2 transition-colors duration-200" />
    </div>
  );
};

export default DarkModeToggle;
