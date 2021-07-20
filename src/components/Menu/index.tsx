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
import { animated, useSpring, useTransition } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

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
  // TODO rename onOutsideClick => onCloseMenu
  onOutsideClick?: () => void;
  placement?: Placement;
  alwaysMenu?: boolean;
  triggerClassName?: string;
  menuClassName?: string;
  sheetClassName?: string;
}

const MENU_SHEET_CLOSE_THRESHOLD = 60;
const MENU_SHEET_UP_THRESHOLD = -48;

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
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const transition = useTransition(isOpen, {
    from: { ty: 100 },
    enter: { ty: 0 },
    leave: { ty: 100 },
  });

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [sheetElement, setSheetElement] = useState<HTMLDivElement | null>(null);

  const isSheet = !alwaysMenu && isMobile;

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }, { name: 'flip' }],
  });

  const bind = useDrag(
    ({ down, intentional, last, active, movement: [mx, my], cancel }) => {
      if (!intentional) {
        return;
      }

      if (my < MENU_SHEET_UP_THRESHOLD) {
        api.start({ x: 0, y: 0, immediate: false });
        return cancel();
      }

      const newY = !down ? 0 : my;
      api.start({ x: 0, y: newY, immediate: down });

      if (last || !active) {
        if (my >= MENU_SHEET_CLOSE_THRESHOLD) {
          onOutsideClick?.();
        } else {
          api.start({ x: 0, y: 0, immediate: false });
        }
      }
    },
    {
      enabled: isSheet,
      axis: 'y',
      filterTaps: true,
      preventScrollAxis: undefined,
      threshold: 30,
    }
  );

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
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {createPortal(
        <>
          <Backdrop isShown={isOpen} />
          {transition(
            ({ ty }, item) =>
              item && (
                <animated.div
                  style={{ transform: ty.to((ty) => `translateY(${ty}%)`) }}
                  className="z-50 absolute bottom-0 left-0 right-0"
                >
                  <animated.div
                    {...bind()}
                    style={{ x, y }}
                    ref={setSheetElement}
                    role="menu"
                    className={cn(
                      'touch-none pb-16 -mb-12 rounded-t-lg border dark:border-gray-600 bg-white dark:bg-gray-600',
                      sheetClassName
                    )}
                  >
                    {createElement<T>(content, { isSheet, ...contentProps })}
                  </animated.div>
                </animated.div>
              )
          )}
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
