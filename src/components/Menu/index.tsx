import React, {
  createElement,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';

import Backdrop from '../Backdrop';
import useMedia from '../../hooks/useMedia';
import useDrawer from '../../hooks/useDrawer';

export interface MenuContentProps {
  isSheet?: boolean;
}

interface MenuProps<T extends MenuContentProps> {
  isOpen?: boolean;
  trigger: ReactNode;
  content: FunctionComponent;
  contentProps: T;
  onOutsideClick?: () => void;
  placement?: Placement;
  alwaysMenu?: boolean;
  triggerClassName?: string;
  menuClassName?: string;
  sheetClassName?: string;
}

const Menu = <T extends MenuContentProps>({
  isOpen = false,
  trigger,
  content,
  contentProps,
  onOutsideClick,
  placement = 'bottom-end',
  alwaysMenu = false,
  triggerClassName = '',
  menuClassName = '',
  sheetClassName = '',
}: PropsWithChildren<MenuProps<T>>) => {
  const { isMobile } = useMedia();
  const { toggleDrawerDrag } = useDrawer();

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [sheetElement, setSheetElement] = useState<HTMLDivElement | null>(null);

  const isSheet = !alwaysMenu && isMobile;

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }, { name: 'flip' }],
  });

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isOpen &&
        !referenceElement?.contains(target) &&
        ((isSheet && !sheetElement?.contains(target)) ||
          (!isSheet && !popperElement?.contains(target)))
      ) {
        onOutsideClick?.();
      }
    },
    [isOpen, onOutsideClick, popperElement, referenceElement, sheetElement, isSheet]
  );

  // TODO also allow close on Escape press
  // TODO wrap this logic up into a useEventListener() hook
  const handleOutsideClickRef = useRef(handleOutsideClick);

  useEffect(() => {
    document.removeEventListener('click', handleOutsideClickRef.current);
    handleOutsideClickRef.current = handleOutsideClick;

    if (isOpen) {
      document.addEventListener('click', handleOutsideClickRef.current);
    }

    return () => document.removeEventListener('click', handleOutsideClickRef.current);
  }, [isOpen, handleOutsideClick]);

  useEffect(() => {
    toggleDrawerDrag(!isOpen);
  }, [isOpen, toggleDrawerDrag]);

  return isSheet ? (
    // TODO allow closing via swipe down gesture with pmndrs/use-gesture
    // @see https://codesandbox.io/s/zuwji
    // @see https://use-gesture.netlify.app/docs/examples/
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {isOpen &&
        // TODO animate backdrop (opacity) and sheet (slide up/down) show/hide with react-spring <Transition>
        createPortal(
          <>
            <Backdrop />
            <div
              ref={setSheetElement}
              role="menu"
              className={cn(
                'z-50 absolute bottom-0 left-0 right-0 rounded-t-lg border dark:border-gray-600 bg-white dark:bg-gray-600',
                sheetClassName
              )}
            >
              {createElement<T>(content, { isSheet, ...contentProps })}
            </div>
          </>,
          document.body
        )}
    </>
  ) : (
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {isOpen && (
        // TODO animate show/hide (opacity, scale) with react-spring <Transition>
        <div
          ref={setPopperElement}
          role="menu"
          className={cn('z-10 bg-white dark:bg-gray-600 rounded shadow-lg', menuClassName)}
          style={styles.popper}
          {...attributes.popper}
        >
          {createElement<T>(content, { isSheet, ...contentProps })}
        </div>
      )}
    </>
  );
};

export default Menu;
