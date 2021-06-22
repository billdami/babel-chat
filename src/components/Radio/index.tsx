import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

interface RadioProps
  extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  labelClassName?: string;
}

const Radio: FC<RadioProps> = ({
  className,
  labelClassName = '',
  label = '',
  id,
  children,
  ...rest
}) => (
  <div className={cn('flex items-start', className)}>
    <input
      type="radio"
      id={id}
      className="appearance-none
        flex-shrink-0
        border
        border-gray-400
        w-4
        h-4
        mt-1
        bg-no-repeat
        bg-center
        bg-contain
        rounded-full
        transition-shadow
        checked:bg-green-500
        checked:border-green-500
        checked:bg-radio-active
        focus:border-green-500
        focus:outline-none
        focus:ring-4
        focus:ring-green-300 dark:focus:ring-green-500
        focus:ring-opacity-50 dark:focus:ring-opacity-50
        disabled:opacity-50 dark:disabled:opacity-30
        disabled:cursor-not-allowed"
      {...rest}
    />
    <label htmlFor={id} className={cn(labelClassName, 'pl-2')}>
      {label}
      {children}
    </label>
  </div>
);

export default Radio;
