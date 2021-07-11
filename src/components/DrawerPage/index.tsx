import React, { FC, useEffect } from 'react';
import cn from 'classnames';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import useDrawer from '../../hooks/useDrawer';
import useMedia from '../../hooks/useMedia';

interface DrawerPageProps {}

const DRAWER_OPEN_X = 320;
const DRAWER_OPEN_THRESHOLD = DRAWER_OPEN_X / 5;

const DrawerPage: FC<DrawerPageProps> = ({ children }) => {
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer();
  const { isMobile } = useMedia();

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ active, down, movement: [mx, my], initial: [ix, iy] }) => {
      let newX = mx;

      if (!down) {
        newX = 0;
      } else if (mx < 0) {
        newX = 0;
      } else if (mx > DRAWER_OPEN_X) {
        newX = DRAWER_OPEN_X;
      }

      // open the drawer if the gesture is:
      // finished, swiping right, and met the threshold
      if (!active && mx >= DRAWER_OPEN_THRESHOLD) {
        openDrawer();
      } else {
        api.start({ x: newX, y: 0, immediate: down });
      }
    },
    {
      enabled: isMobile && !isDrawerOpen,
      axis: 'x',
      threshold: 20,
    }
  );

  useEffect(() => {
    api.start({
      x: isDrawerOpen && isMobile ? DRAWER_OPEN_X : 0,
      y: 0,
      immediate: false,
    });
  }, [api, isDrawerOpen, isMobile]);

  return (
    <animated.div
      {...bind()}
      style={{ x, y }}
      className={cn(
        'touch-pan-y flex-1 flex absolute md:static inset-0 shadow-md md:shadow-none bg-white dark:bg-gray-700'
      )}
    >
      {isDrawerOpen && (
        <div role="button" className="absolute inset-0 z-50 md:hidden" onClick={closeDrawer}></div>
      )}
      {children}
    </animated.div>
  );
};

export default DrawerPage;
