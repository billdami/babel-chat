import React, {
  createElement,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
  const isSheet = !alwaysMenu && isMobile;

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }, { name: 'flip' }],
  });

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;
      if (!popperElement?.contains(target) && !referenceElement?.contains(target)) {
        onOutsideClick?.();
      }
    },
    [onOutsideClick, popperElement, referenceElement]
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  return isSheet ? (
    // TODO mobile card/sheet view
    // TODO animate show/hide with react-spring and allow closing
    // via swipe down gesture with pmndrs/use-gesture
    // @see example: https://codesandbox.io/s/zuwji (from https://use-gesture.netlify.app/docs/examples/)
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {/* TODO createPortal to render sheet in <body> */}
      {/* TODO createPortal to render backdrop in <body> */}
      {isOpen && (
        // TODO animate show/hide with react-spring <Transition>
        <div
          className={cn(
            'z-50 absolute bottom-0 left-0 right-0 rounded-t shadow-lg border bg-white',
            sheetClassName
          )}
        >
          {createElement<T>(content, { isSheet, ...contentProps })}
        </div>
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
