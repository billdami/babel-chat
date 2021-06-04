import React, { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputSize?: InputSize;
  fullWidth?: boolean;
}

const baseClasses = `
appearance-none
block
rounded-sm
bg-white
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

const sizeClasses = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-3',
  lg: 'py-3 px-3 text-lg',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = 'md', fullWidth = false, ...rest }, ref) => (
    <input
      ref={ref}
      type="text"
      className={cn(baseClasses, className, sizeClasses[inputSize], {
        'w-full': fullWidth,
      })}
      {...rest}
    />
  )
);

export default Input;
