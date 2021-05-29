import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

interface CheckboxProps
  extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  standalone?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({
  className,
  labelClassName = '',
  label = '',
  id,
  children,
  standalone = false,
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
        focus:ring-opacity-50
        focus:ring-green-300
        disabled:opacity-50
        disabled:cursor-not-allowed`,
        { 'mt-1 mr-2': !standalone }
      )}
      {...rest}
    />
    <label htmlFor={id} className={labelClassName}>
      {label}
      {children}
    </label>
  </div>
);

export default Checkbox;
