import React, { DetailedHTMLProps, forwardRef } from 'react';
import cn from 'classnames';

interface InputProps
  extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  fullWidth?: boolean;
}

const baseClasses = `
appearance-none
block
px-3
py-2
rounded-sm
border
border-gray-300
transition-shadow
focus:border-green-400
focus:outline-none
focus:ring-4
focus:ring-opacity-50
focus:ring-green-300
disabled:opacity-50
disabled:bg-gray-200
disabled:cursor-not-allowed`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, fullWidth = false, ...rest }, ref) => (
    <input
      ref={ref}
      type="text"
      className={cn(baseClasses, className, {
        'w-full': fullWidth,
      })}
      {...rest}
    />
  )
);

export default Input;
