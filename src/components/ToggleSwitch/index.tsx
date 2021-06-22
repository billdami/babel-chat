import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';

interface ToggleSwitchProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  checked?: boolean;
  srLabel?: string;
}

const baseClasses = `inline-flex items-center
  px-0.5
  rounded-full
  w-14 h-7
  transition-colors duration-200
  focus:outline-none
  focus:ring-4
  focus:ring-green-300 dark:focus:ring-green-500
  focus:ring-opacity-50 dark:focus:ring-opacity-50`;

const ToggleSwitch: FC<ToggleSwitchProps> = ({ checked = false, srLabel, className, ...rest }) => {
  return (
    <button
      className={cn(baseClasses, className, checked ? 'bg-green-500' : 'bg-gray-400')}
      role="switch"
      aria-checked={checked}
      {...rest}
    >
      {!!srLabel && <span className="sr-only">{srLabel}</span>}
      <span
        className={cn(
          'transform transition-transform duration-200 bg-white rounded-full w-6 h-6 shadow-sm',
          { 'translate-x-7': checked }
        )}
        role="presentation"
      ></span>
    </button>
  );
};

export default ToggleSwitch;
