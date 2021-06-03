import React, {
  createElement,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';

import useMedia from '../../hooks/useMedia';

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

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  return isSheet ? (
    // TODO allow closing via swipe down gesture with pmndrs/use-gesture
    // @see https://codesandbox.io/s/zuwji
    // @see https://use-gesture.netlify.app/docs/examples/
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {isOpen &&
        // TODO animate show/hide with react-spring <Transition>
        createPortal(
          <>
            <div className="z-40 absolute inset-0 bg-black bg-opacity-60"></div>
            <div
              ref={setSheetElement}
              className={cn(
                'z-50 absolute bottom-0 left-0 right-0 rounded-t-lg border bg-white',
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
        // TODO animate show/hide with react-spring <Transition>
        <div
          className={cn('z-50 bg-white rounded shadow-lg', menuClassName)}
          ref={setPopperElement}
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
