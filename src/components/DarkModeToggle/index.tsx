import React, { FC } from 'react';
import cn from 'classnames';

import Checkbox from '../Checkbox';
import useTheme from '../../hooks/useTheme';

interface DarkModeToggleProps {
  className?: string;
  toggleClassName?: string;
}

const DarkModeToggle: FC<DarkModeToggleProps> = ({ className = '', toggleClassName = '' }) => {
  const { isDarkTheme, updateTheme } = useTheme();

  return (
    <div className={cn(className)}>
      {/* TODO replace with <ToggleSwitch> */}
      {/* "moon" dark mode icon on right "enabled" side of toggle */}
      <Checkbox
        id="dark-mode-toggle"
        label="Dark mode"
        className={cn('text-sm', toggleClassName)}
        onChange={(e) => updateTheme(e.target.checked ? 'dark' : 'light', true)}
        checked={isDarkTheme}
      />
    </div>
  );
};

export default DarkModeToggle;
