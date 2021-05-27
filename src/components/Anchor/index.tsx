import React, { DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';

interface AnchorProps
  extends DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {}

const baseClasses = `text-green-500
rounded
hover:underline
hover:text-green-600
ring-green-300
focus:outline-none
focus:ring-4
focus:ring-opacity-50`;

const Anchor: FC<AnchorProps> = ({ className, children, ...rest }) => (
  <a className={cn(baseClasses, className)} {...rest}>
    {children}
  </a>
);

export default Anchor;
