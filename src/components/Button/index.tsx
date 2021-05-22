import React, { DetailedHTMLProps, FC } from 'react';

import cn from 'classnames';

type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps
  extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  fullWidth?: boolean;
}

const baseClasses = `text-center
font-bold
rounded
transition-shadow
active:shadow-inner
focus:outline-none
focus:ring-4
focus:ring-opacity-50
focus:ring-green-300
disabled:shadow-none
disabled:opacity-50
disabled:cursor-not-allowed`;

const variants = {
  primary:
    'shadow hover:shadow-md text-white bg-green-400 border border-transparent hover:bg-green-500 disabled:bg-green-400',
  secondary:
    'shadow hover:shadow-md text-gray-500 bg-white border border-gray-500 hover:bg-gray-100 disabled:bg-white',
  muted: 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 disabled:bg-white',
  link: 'text-green-500 border border-transparent hover:text-green-600 hover:underline disabled:text-green-500',
};

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-5 py-2',
  lg: 'px-6 py-4 text-lg',
};

const Button: FC<ButtonProps> = ({
  children,
  className,
  block = true,
  fullWidth = false,
  variant = 'primary',
  size = 'md',
  ...rest
}) => (
  <button
    type="button"
    className={cn(baseClasses, variants[variant], sizes[size], className, {
      block: block,
      'w-full': fullWidth,
    })}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
