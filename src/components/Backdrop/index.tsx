import React, { FC } from 'react';
import { animated, useTransition } from '@react-spring/web';

interface BackdropProps {
  isShown?: boolean;
}

const Backdrop: FC<BackdropProps> = ({ isShown = false }) => {
  const transition = useTransition(isShown, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 320 },
  });

  return transition(
    (styles, item) =>
      item && (
        <animated.div
          style={styles}
          className="fixed inset-0 bg-gray-900 bg-opacity-60"
          aria-hidden="true"
        ></animated.div>
      )
  );
};

export default Backdrop;
