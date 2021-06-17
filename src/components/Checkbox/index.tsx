import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

interface CheckboxProps
  extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  isIndeterminate?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  standalone?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({
  className,
  labelClassName = '',
  inputClassName = '',
  label = '',
  id,
  children,
  standalone = false,
  isIndeterminate = false,
  ...rest
}) => (
  <div className={cn('flex items-start', className)}>
    <input
      type="checkbox"
      id={id}
      className={cn(
        `appearance-none
        flex-shrink-0
        border
        border-gray-400
        w-4
        h-4
        bg-no-repeat
        bg-center
        bg-contain
        rounded
        transition-shadow
        checked:bg-green-500
        checked:border-green-500
        checked:bg-check-active
        focus:border-green-500
        focus:outline-none
        focus:ring-4
        focus:ring-green-300 dark:focus:ring-green-500
        focus:ring-opacity-50 dark:focus:ring-opacity-50
        disabled:opacity-50 dark:disabled:opacity-30
        disabled:cursor-not-allowed`,
        {
          'mt-1': !standalone,
          'bg-check-indeterminate bg-green-500 border-green-500 ': isIndeterminate,
        },
        inputClassName
      )}
      {...rest}
    />
    {!standalone && (
      <label htmlFor={id} className={cn(labelClassName, 'pl-3')}>
        {label}
        {children}
      </label>
    )}
  </div>
);

export default Checkbox;
