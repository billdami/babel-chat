import React, { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

interface TextareaProps
  extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
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

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, fullWidth = false, value, ...rest }, ref) => (
    <textarea
      ref={ref}
      value={value}
      className={cn(baseClasses, className, {
        'w-full': fullWidth,
      })}
      {...rest}
    />
  )
);

export default Textarea;
