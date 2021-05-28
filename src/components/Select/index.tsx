import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

export interface SelectOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

interface SelectProps
  extends DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  fullWidth?: boolean;
  options?: SelectOption[] | null;
}

const baseClasses = `
appearance-none
block
w-full
pl-3
pr-7
py-2
rounded-sm
border
border-gray-300
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

const Select: FC<SelectProps> = ({ className, fullWidth = false, options, ...rest }) => (
  <select
    className={cn(baseClasses, className, {
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
