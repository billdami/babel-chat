import React, { FC, memo, SVGProps } from 'react';
import cn from 'classnames';

import User from '../Svgs/Icons/User';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type IconName = 'user';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
}

const getSvg = (name: IconName) => {
  switch (name) {
    case 'user':
      return User;
  }
};

const sizes = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-10',
};

const Icon: FC<IconProps> = memo(({ name, size = 'md', className = '', ...rest }) =>
  React.createElement(getSvg(name), { className: cn(sizes[size], className), ...rest })
);

export default Icon;
