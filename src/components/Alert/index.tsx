import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import Icon, { IconName } from '../Icon';

type AlertVariant = 'warning' | 'danger' | 'success';

interface AlertProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant: AlertVariant;
  icon?: IconName;
}

const baseClasses = `px-6 py-4
  text-sm
  bg-opacity-60
  border-l-4
  rounded-sm rounded-tl-none rounded-bl-none`;

const variants = {
  warning:
    'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-700 dark:border-yellow-200 dark:text-yellow-200 dark:bg-opacity-100',
  danger:
    'bg-red-100 border-red-500 text-red-700 dark:bg-red-700 dark:border-red-200 dark:text-red-200 dark:bg-opacity-100',
  success:
    'bg-green-100 border-green-500 text-green-700 dark:bg-green-700 dark:border-green-200 dark:text-green-200 dark:bg-opacity-100',
};

const Alert: FC<AlertProps> = ({ children, className, variant, icon, ...rest }) => {
  return (
    <div className={cn(baseClasses, variants[variant], className)} {...rest}>
      {!!icon ? (
        <div className="flex items-start">
          <Icon name={icon} className="mt-1 mr-2 inline-block flex-shrink-0" size="sm" />
          <div>{children}</div>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default Alert;
