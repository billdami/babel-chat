import React, { FC } from 'react';
import cn from 'classnames';

interface ErrorTextProps {
  className?: string;
  text?: string;
}

const ErrorText: FC<ErrorTextProps> = ({ children, className = '', text = '' }) => (
  <p className={cn('text-xs text-red-500', className)}>
    {text}
    {children}
  </p>
);

export default ErrorText;
