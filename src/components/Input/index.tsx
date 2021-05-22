import React, { DetailedHTMLProps, FC } from 'react';

import cn from 'classnames';

interface InputProps
  extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  fullWidth?: boolean;
}

const baseClasses = `
block
px-3
py-2
rounded-sm
border
border-gray-300
transition-shadow
focus:outline-none
focus:ring-4
focus:ring-opacity-50
focus:ring-green-300
disabled:opacity-50
disabled:bg-gray-200
disabled:cursor-not-allowed`;

const Input: FC<InputProps> = ({ className, fullWidth = false, ...rest }) => (
  <input
    type="text"
    className={cn(baseClasses, className, {
      'w-full': fullWidth,
    })}
    {...rest}
  />
);

export default Input;
