import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'inverse' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps
  extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  fullWidth?: boolean;
  outline?: boolean;
  isActive?: boolean;
}

const baseClasses = `text-center
font-bold
rounded
transition-shadow
focus:outline-none
focus:ring-4
focus:ring-opacity-50
focus:ring-green-300
disabled:shadow-none
disabled:opacity-50
disabled:cursor-not-allowed`;

const variants = {
  primary:
    'shadow active:shadow-inner hover:shadow-md text-white bg-green-400 border border-transparent hover:bg-green-500 disabled:bg-green-400',
  secondary:
    'shadow active:shadow-inner hover:shadow-md text-gray-500 bg-white border border-gray-500 hover:bg-gray-100 disabled:bg-white',
  muted:
    'active:shadow-inner text-gray-400 bg-gray-100 border border-gray-200 hover:border-gray-300 disabled:border-gray-200',
  inverse:
    'shadow active:shadow-inner hover:shadow-md text-green-400 bg-white border border-transparent hover:bg-gray-100 disabled:bg-white',
  link: 'text-green-500 border border-transparent hover:text-green-600 hover:underline disabled:text-green-500 disabled:no-underline disabled:text-green-500',
};

const outlineVariants = {
  primary:
    'active:shadow-inner text-green-500 border border-green-500 hover:bg-green-500 hover:text-white disabled:bg-transparent disabled:text-green-500',
  secondary:
    'active:shadow-inner text-gray-500 border border-gray-500 hover:bg-gray-500 hover:text-white disabled:bg-transparent disabled:text-gray-500',
  muted:
    'active:shadow-inner text-gray-400 border border-gray-200 hover:bg-gray-200 hover:text-white disabled:bg-transparent disabled:text-gray-400',
  inverse:
    'active:shadow-inner text-green-200 border border-green-300 hover:bg-white hover:border-white hover:text-green-500 disabled:bg-transparent disabled:border-green-300 disabled:text-green-200',
  link: 'text-green-500 border border-transparent hover:text-green-600 hover:underline disabled:text-green-500 disabled:text-green-500 disabled:no-underline disabled:text-green-500',
};

const activeVariants = {
  primary: 'shadow shadow-inner text-white bg-green-500 border border-transparent',
  secondary: 'shadow shadow-inner text-gray-500 bg-gray-100 border border-gray-500',
  muted: 'shadow-inner text-gray-400 bg-gray-100 border border-gray-300',
  inverse: 'shadow shadow-inner text-green-400 bg-gray-100 border border-transparent',
  link: 'text-green-600 border border-transparent underline',
};

const activeOutlineVariants = {
  primary: 'shadow-inner text-white border border-green-500 bg-green-500',
  secondary: 'shadow-inner text-white border border-gray-500 bg-gray-500',
  muted: 'shadow-inner text-white border border-gray-300 bg-gray-300',
  inverse: 'shadow-inner text-green-500 border border-white bg-white',
  link: 'text-green-600 border border-transparent underline',
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-4 text-lg',
};

const Button: FC<ButtonProps> = ({
  children,
  className,
  block = true,
  fullWidth = false,
  outline = false,
  isActive = false,
  variant = 'primary',
  size = 'md',
  ...rest
}) => (
  <button
    type="button"
    className={cn(
      baseClasses,
      isActive
        ? outline
          ? activeOutlineVariants[variant]
          : activeVariants[variant]
        : outline
        ? outlineVariants[variant]
        : variants[variant],
      sizes[size],
      className,
      {
        block: block,
        'w-full': fullWidth,
      }
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
