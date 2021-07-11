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
    ({ down, intentional, last, active, movement: [mx, my], initial: [ix, iy] }) => {
      if (!intentional) {
        return;
      }

      let newX = mx;

      if (!down) {
        newX = 0;
      } else if (mx < 0) {
        newX = 0;
      } else if (mx > DRAWER_OPEN_X) {
        newX = DRAWER_OPEN_X;
      }

      // TODO if dragging is still buggy on mobile, worst case make it swipe based:
      // https://v10-beta--use-gesture.netlify.app/docs/state/#swipe-drag-only
      // open the drawer if the gesture is:
      // finished, swiping right, and met the threshold
      api.start({ x: newX, y: 0, immediate: down });
      if (!down && mx >= DRAWER_OPEN_THRESHOLD) {
        openDrawer();
      } else if (last || !active) {
        api.start({ x: 0, y: 0, immediate: false });
      }
    },
    {
      enabled: isMobile && !isDrawerOpen,
      axis: 'x',
      filterTaps: true,
      preventScrollAxis: undefined,
      threshold: 50,
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
