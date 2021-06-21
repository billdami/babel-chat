import React, { FC } from 'react';
import cn from 'classnames';

import useTheme from '../../hooks/useTheme';
import ToggleSwitch from '../ToggleSwitch';

interface DarkModeToggleProps {
  className?: string;
  toggleClassName?: string;
}

const DarkModeToggle: FC<DarkModeToggleProps> = ({ className = '', toggleClassName = '' }) => {
  const { isDarkTheme, updateTheme } = useTheme();

  return (
    <div className={cn(className, 'flex')}>
      {/* "moon" dark mode icon on right "enabled" side of toggle */}
      <ToggleSwitch
        srLabel="Toggle dark mode"
        onClick={() => updateTheme(isDarkTheme ? 'light' : 'dark', true)}
        checked={isDarkTheme}
        className={toggleClassName}
      />
    </div>
  );
};

export default DarkModeToggle;
