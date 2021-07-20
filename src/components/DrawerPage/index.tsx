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
  const { isMobile } = useMedia();
  const { isDrawerOpen, isDrawerDragEnabled, openDrawer, closeDrawer, updateDrawerDragging } =
    useDrawer();
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ down, intentional, last, active, movement: [mx, my] }) => {
      if (!intentional) {
        return;
      }

      let newX = isDrawerOpen ? DRAWER_OPEN_X + mx : mx;
      if (!down) {
        newX = isDrawerOpen ? DRAWER_OPEN_X : 0;
      } else if (mx < 0 && !isDrawerOpen) {
        newX = 0;
      } else if (newX > DRAWER_OPEN_X) {
        newX = DRAWER_OPEN_X;
      }

      updateDrawerDragging(true);
      api.start({ x: newX, y: 0, immediate: down, config: { tension: 220, clamp: true } });

      if (last || !active) {
        updateDrawerDragging(false);

        if (mx >= DRAWER_OPEN_THRESHOLD && !isDrawerOpen) {
          openDrawer();
        } else if (mx <= DRAWER_OPEN_THRESHOLD * -1 && isDrawerOpen) {
          closeDrawer();
        } else {
          api.start({
            x: isDrawerOpen ? DRAWER_OPEN_X : 0,
            y: 0,
            immediate: false,
            config: { tension: 220, clamp: true },
          });
        }
      }
    },
    {
      enabled: isMobile && isDrawerDragEnabled,
      axis: 'x',
      filterTaps: true,
      preventScrollAxis: undefined,
      threshold: 30,
    }
  );

  useEffect(() => {
    api.start({
      x: isDrawerOpen && isMobile ? DRAWER_OPEN_X : 0,
      y: 0,
      immediate: false,
      config: { tension: 220, clamp: true },
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
