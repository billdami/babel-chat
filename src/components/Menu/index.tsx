import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { usePopper } from 'react-popper';

interface MenuProps {
  isOpen?: boolean;
  target: ReactNode;
  onOutsideClick?: () => void;
  card?: boolean;
  targetClassName?: string;
  menuClassName?: string;
}

const Menu: FC<MenuProps> = ({
  children,
  isOpen = false,
  target,
  onOutsideClick,
  card = false,
  targetClassName = '',
  menuClassName = '',
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 4] } },
    ],
  });

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !popperElement?.contains(target) &&
        !arrowElement?.contains(target) &&
        !referenceElement?.contains(target)
      ) {
        onOutsideClick?.();
      }
    },
    [onOutsideClick, popperElement, arrowElement, referenceElement]
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  return card ? (
    <div>TODO mobile card view</div>
  ) : (
    <>
      <div className={targetClassName} ref={setReferenceElement}>
        {target}
      </div>
      {isOpen && (
        <div
          className={cn('bg-white rounded shadow-lg', menuClassName)}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {children}
          <div ref={setArrowElement} style={styles.arrow}></div>
        </div>
      )}
    </>
  );
};

export default Menu;
