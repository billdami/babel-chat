import React, { FC, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';

interface DialogProps {
  isOpen?: boolean;
  className?: string;
  onOutsideClick?: () => void;
  onEscapeKey?: () => void;
}

const Dialog: FC<DialogProps> = ({
  isOpen = false,
  onOutsideClick,
  onEscapeKey,
  className = '',
  children,
}) => {
  const dialogElement = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;
      if (isOpen && dialogElement.current && !dialogElement.current.contains(target)) {
        onOutsideClick?.();
      }
    },
    [isOpen, onOutsideClick, dialogElement]
  );

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (isOpen && e.key?.toUpperCase() === 'ESCAPE') {
        onEscapeKey?.();
      }
    },
    [isOpen, onEscapeKey]
  );

  // TODO wrap this logic up into a useEventListener() hook
  const handleOutsideClickRef = useRef(handleOutsideClick);
  const handleEscapeKeyRef = useRef(handleEscapeKey);

  useEffect(() => {
    document.removeEventListener('click', handleOutsideClickRef.current);
    handleOutsideClickRef.current = handleOutsideClick;

    if (isOpen) {
      setTimeout(() => document.addEventListener('click', handleOutsideClickRef.current), 1);
    }

    return () => document.removeEventListener('click', handleOutsideClickRef.current);
  }, [isOpen, handleOutsideClick]);

  useEffect(() => {
    document.removeEventListener('keyup', handleEscapeKeyRef.current);
    handleEscapeKeyRef.current = handleEscapeKey;

    if (isOpen) {
      document.addEventListener('keyup', handleEscapeKeyRef.current);
    }

    return () => document.removeEventListener('keyup', handleEscapeKeyRef.current);
  }, [isOpen, handleEscapeKey]);

  return isOpen
    ? // TODO don't allow tabbing to content outside of dialog (inert attributes)
      // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert
      // TODO animate backdrop (opacity) and modal (opacity, scale) show/hide with react-spring <Transition>
      createPortal(
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center md:block md:items-end sm:p-0">
            {/* TODO create <Backdrop> */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-60" aria-hidden="true"></div>
            {/* this element tricks the browser into centering the modal contents */}
            <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              ref={dialogElement}
              role="dialog"
              // TODO add modal={false} prop to omit backdrop, close on click outside, etc
              aria-modal={true}
              className={cn(
                `relative inline-block overflow-hidden
                align-bottom
                bg-white rounded shadow-xl text-left
                md:my-8 md:align-middle md:max-w-lg md:w-full`,
                className
              )}
            >
              {children}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default Dialog;
