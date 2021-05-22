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
  <div className={cn('flex items-center', className)}>
    <input
      type="radio"
      id={id}
      className="appearance-none
        border
        border-gray-400
        w-4
        h-4
        mr-2
        bg-no-repeat
        bg-center
        bg-contain
        rounded-full
        checked:bg-green-500
        checked:border-green-500
        checked:bg-radio-active
        focus:ring-4
        focus:ring-opacity-50
        focus:ring-green-300
        disabled:opacity-50
        disabled:cursor-not-allowed"
      {...rest}
    />
    <label htmlFor={id} className={labelClassName}>
      {label}
      {children}
    </label>
  </div>
);

export default Radio;
