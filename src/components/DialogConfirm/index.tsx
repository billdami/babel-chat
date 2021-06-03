import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import Button from '../Button';
import Dialog, { DialogProps } from '../Dialog';
import Icon, { IconName } from '../Icon';

interface DialogConfirmProps extends DialogProps {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: IconName;
  iconClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DialogConfirm: FC<DialogConfirmProps> = ({
  title = 'Confirm',
  message,
  confirmText = 'OK',
  cancelText = 'Nevermind',
  iconClassName = 'bg-gray-100 text-gray-500',
  icon,
  onCancel,
  onConfirm,
  ...rest
}) => {
  return (
    <Dialog onEscapeKey={() => onCancel()} onOutsideClick={() => onCancel()} {...rest}>
      <div className="p-4">
        <div className="flex items-start">
          {!!icon && (
            <div
              className={cn(
                'flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full mr-3',
                iconClassName
              )}
            >
              <Icon name={icon} className="h-6 w-6" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="text-lg leading-6 text-gray-900">{title}</div>
              <Button
                size="sm"
                variant="muted"
                className="flex-shrink-0"
                onClick={() => onCancel()}
                outline
              >
                <Icon name="x-mark" size="sm" />
              </Button>
            </div>
            <div className="my-2 text-sm text-gray-600">{message}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-end px-4 py-3 bg-gray-50">
        {/* TODO focus on "Cancel" button on open */}
        <Button variant="link" onClick={() => onCancel()}>
          {cancelText}
        </Button>
        <Button className="ml-2" onClick={() => onConfirm()}>
          {confirmText}
        </Button>
      </div>
    </Dialog>
  );
};

export default DialogConfirm;
