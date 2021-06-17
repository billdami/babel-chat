import React, { DetailedHTMLProps, FC, useMemo } from 'react';
import cn from 'classnames';

type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption<T = string> {
  value: T;
  label?: string;
  group?: string;
  disabled?: boolean;
}

export interface SelectOptionGroup<T = string> {
  label: string;
  options: SelectOption<T>[];
}

interface SelectProps
  extends DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  inputSize?: SelectSize;
  fullWidth?: boolean;
  groups?: string[];
  options?: SelectOption[] | null;
}

const baseClasses = `
appearance-none
block
rounded-sm
dark:text-gray-300 dark:placeholder-gray-500
dark:bg-transparent
border border-gray-300 dark:border-gray-600
bg-caret dark:bg-caret-light
bg-no-repeat
bg-4x3
bg-right-3-center
transition-shadow
focus:border-green-400 dark:focus:border-green-500
focus:outline-none
focus:ring-4
focus:ring-green-300 dark:focus:ring-green-500
focus:ring-opacity-50 dark:focus:ring-opacity-50
disabled:opacity-50 dark:disabled:opacity-30
disabled:bg-gray-200 dark:disabled:bg-gray-700
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
  groups,
  options,
  ...rest
}) => {
  const groupedOptions = useMemo<SelectOptionGroup[]>(
    () =>
      !!groups?.length
        ? groups.map((g) => ({ label: g, options: options?.filter((o) => o.group === g) ?? [] }))
        : [],
    [options, groups]
  );

  const ungroupedOptions = useMemo<SelectOption[]>(
    () => (!!groups?.length ? options?.filter((o) => !o.group) ?? [] : []),
    [options, groups]
  );

  return (
    <select
      className={cn(baseClasses, className, sizeClasses[inputSize], {
        'w-full': fullWidth,
      })}
      {...rest}
    >
      {!!groupedOptions.length ? (
        <>
          {ungroupedOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
          {groupedOptions.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </>
      ) : (
        options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))
      )}
    </select>
  );
};

export default Select;
