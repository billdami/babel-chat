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

export interface MenuContentProps {
  sheet?: boolean;
}

interface MenuProps<T extends MenuContentProps> {
  isOpen?: boolean;
  trigger: ReactNode;
  content: FunctionComponent;
  contentProps: T;
  onOutsideClick?: () => void;
  placement?: Placement;
  sheet?: boolean;
  triggerClassName?: string;
  menuClassName?: string;
}

const Menu = <T extends MenuContentProps>({
  isOpen = false,
  trigger,
  content,
  contentProps,
  onOutsideClick,
  placement = 'bottom-end',
  sheet,
  triggerClassName = '',
  menuClassName = '',
}: PropsWithChildren<MenuProps<T>>) => {
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

  // TODO possibly just default sheet to isMobile (and use context provider for global match mobile listener)
  return sheet ? (
    // TODO mobile card/sheet view
    // TODO animate show/hide with react-spring and allow closing
    // via swipe down gesture with pmndrs/use-gesture
    // @see example: https://codesandbox.io/s/zuwji (from https://use-gesture.netlify.app/docs/examples/)
    <div>{createElement<T>(content, { sheet, ...contentProps })}</div>
  ) : (
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {isOpen && (
        // TODO animate show/hide with react-spring
        <div
          className={cn('bg-white rounded shadow-lg', menuClassName)}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {createElement<T>(content, { sheet, ...contentProps })}
        </div>
      )}
    </>
  );
};

export default Menu;
