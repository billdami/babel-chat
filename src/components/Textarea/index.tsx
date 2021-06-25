import React, { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

type TextareaVariant = 'regular' | 'inverse' | 'muted';

interface TextareaProps
  extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  variant?: TextareaVariant;
  fullWidth?: boolean;
}

const baseClasses = `
appearance-none
block
px-3 py-2
rounded-sm
border border-gray-300 dark:border-gray-600
transition-shadow
focus:border-green-400 dark:focus:border-green-500
focus:outline-none
focus:ring-4
focus:ring-opacity-50 dark:focus:ring-opacity-50
focus:ring-green-300 dark:focus:ring-green-500
disabled:opacity-50 dark:disabled:opacity-30
disabled:bg-gray-200 dark:disabled:bg-gray-700
disabled:cursor-not-allowed`;

const variants = {
  regular: `dark:text-gray-300 dark:placeholder-gray-500 bg-white dark:bg-transparent`,
  inverse: `dark:text-gray-300 dark:placeholder-gray-400 dark:bg-gray-500 dark:bg-opacity-50`,
  muted: `dark:text-gray-300 dark:placeholder-gray-400 dark:bg-gray-600 dark:bg-opacity-70`,
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, fullWidth = false, variant = 'regular', value, ...rest }, ref) => (
    <textarea
      ref={ref}
      value={value}
      className={cn(baseClasses, className, variants[variant], {
        'w-full': fullWidth,
      })}
      {...rest}
    />
  )
);

export default Textarea;
