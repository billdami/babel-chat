import React, { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputSize?: InputSize;
  fullWidth?: boolean;
  inverse?: boolean;
}

const baseClasses = `
appearance-none
block
rounded-sm
border border-gray-300 dark:border-gray-600
transition-shadow
focus:border-green-400 dark:focus:border-green-500
focus:outline-none
focus:ring-4
focus:ring-green-300 dark:focus:ring-green-500
focus:ring-opacity-50 dark:focus:ring-opacity-50
disabled:opacity-50 dark:disabled:opacity-30
disabled:bg-gray-200 dark:disabled:bg-gray-700
disabled:cursor-not-allowed`;

const regularStyle = `dark:text-gray-300 dark:placeholder-gray-500 dark:bg-transparent`;

const inverseStyle = `dark:text-gray-300 dark:placeholder-gray-400 dark:bg-gray-500 dark:bg-opacity-70`;

const sizeClasses = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-3',
  lg: 'py-3 px-3 text-lg',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = 'md', fullWidth = false, inverse = false, ...rest }, ref) => (
    <input
      ref={ref}
      type="text"
      className={cn(
        baseClasses,
        className,
        sizeClasses[inputSize],
        inverse ? inverseStyle : regularStyle,
        {
          'w-full': fullWidth,
        }
      )}
      {...rest}
    />
  )
);

export default Input;
