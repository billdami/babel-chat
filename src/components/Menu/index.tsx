import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';

interface MenuProps {
  isOpen?: boolean;
  trigger: ReactNode;
  onOutsideClick?: () => void;
  placement?: Placement;
  card?: boolean;
  triggerClassName?: string;
  menuClassName?: string;
}

const Menu: FC<MenuProps> = ({
  children,
  isOpen = false,
  trigger,
  onOutsideClick,
  placement = 'bottom-end',
  card = false,
  triggerClassName = '',
  menuClassName = '',
}) => {
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

  return card ? (
    <div>TODO mobile card view</div>
  ) : (
    <>
      <div className={triggerClassName} ref={setReferenceElement}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn('bg-white rounded shadow-lg', menuClassName)}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Menu;
