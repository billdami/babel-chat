import React, { FC } from 'react';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import cn from 'classnames';

interface LinkProps extends RRLinkProps {}

const baseClasses = `text-green-500
rounded
hover:underline
hover:text-green-600
ring-green-300 dark:ring-green-500
focus:outline-none
focus:ring-4
focus:ring-opacity-50 dark:focus:ring-opacity-50`;

const Link: FC<LinkProps> = ({ className, children, ...rest }) => (
  <RRLink className={cn(baseClasses, className)} {...rest}>
    {children}
  </RRLink>
);

export default Link;
