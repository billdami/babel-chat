import React, { FC } from 'react';
import cn from 'classnames';

import ErrorText from './ErrorText';

interface FormControlProps {
  className?: string;
  label?: string;
  htmlFor?: string;
  errorText?: string;
}

const FormControl: FC<FormControlProps> = ({
  children,
  className = '',
  label = '',
  htmlFor = '',
  errorText = '',
}) => (
  <div className={cn('mb-3', className)}>
    <label
      htmlFor={htmlFor}
      className={cn('block mb-2 font-bold', { 'text-red-500': !!errorText })}
    >
      {label}
    </label>
    {children}
    {!!errorText && <ErrorText className="mt-1" text={errorText} />}
  </div>
);

export default FormControl;
