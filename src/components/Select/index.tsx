import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption<T = string> {
  value: T;
  label?: string;
  disabled?: boolean;
}

interface SelectProps
  extends DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  inputSize?: SelectSize;
  fullWidth?: boolean;
  options?: SelectOption[] | null;
}

const baseClasses = `
appearance-none
block
rounded-sm
border
border-gray-300
bg-white
bg-caret
bg-no-repeat
bg-4x3
bg-right-3-center
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
  sm: 'py-1 pl-3 pr-7 text-sm',
  md: 'py-2 pl-3 pr-7',
  lg: 'py-3 pl-3 pr-7 text-lg',
};

const Select: FC<SelectProps> = ({
  className,
  inputSize = 'md',
  fullWidth = false,
  options,
  ...rest
}) => (
  <select
    className={cn(baseClasses, className, sizeClasses[inputSize], {
      'w-full': fullWidth,
    })}
    {...rest}
  >
    {options?.map((opt) => (
      <option key={opt.value} value={opt.value} disabled={opt.disabled}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default Select;
