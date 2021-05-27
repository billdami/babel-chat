import React, { FC, SVGProps } from 'react';
import cn from 'classnames';

import useDeferRender from '../../hooks/useDeferRender';
import SpinnerCircle from '../Svgs/Spinners/Circle';

type SpinnerVariant = 'primary' | 'inverse';
type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps extends SVGProps<SVGSVGElement> {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  deferRender?: boolean;
  renderDelay?: number;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const variants = {
  primary: 'text-green-500',
  inverse: 'text-white',
};

const Spinner: FC<SpinnerProps> = ({
  variant = 'primary',
  size = 'md',
  deferRender = true,
  renderDelay = 250,
  className = '',
  ...rest
}) => {
  const shouldRender = useDeferRender(!deferRender, renderDelay);
  return shouldRender ? (
    <SpinnerCircle
      className={cn('animate-spin', variants[variant], sizes[size], className)}
      {...rest}
    />
  ) : null;
};

export default Spinner;
