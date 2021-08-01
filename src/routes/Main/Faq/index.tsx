import React, { FC, useRef } from 'react';

import Button from '../../../components/Button';
import DarkModeToggle from '../../../components/DarkModeToggle';
import DrawerToggleButton from '../../../components/DrawerToggleButton';
import FaqList from '../../../components/FaqList';
import ForceScrollable from '../../../components/ForceScrollable';
import Icon from '../../../components/Icon';
import Link from '../../../components/Link';
import NavBar from '../../../components/NavBar';
import NotificationHeadTags from '../../../components/NotificationHeadTags';
import Scrollable from '../../../components/Scrollable';
import ScrollShadow from '../../../components/ScrollShadow';
import useNotifications from '../../../hooks/useNotifications';
import useIsScrolled from '../../../hooks/useIsScrolled';
import { TWITTER_URL, TWITTER_USER } from '../../../constants/app';

import Footer from '../Dashboard/components/Footer';
import Anchor from '../../../components/Anchor';

interface FaqProps {}

const Faq: FC<FaqProps> = () => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const { isMuted, toggleMute } = useNotifications();
  const { isScrolled, onScroll } = useIsScrolled(scrollContainer);

  return (
    <>
      <NotificationHeadTags title="FAQ | babel chat" />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar>
          <DrawerToggleButton />
          <div className="flex flex-shrink-0 ml-auto">
            <DarkModeToggle
              className="text-green-200 dark:text-yellow-300"
              toggleClassName="border border-green-400 dark:border-0"
            />
            <Button onClick={() => toggleMute(!isMuted)} variant="inverse" className="ml-3" outline>
              <Icon
                name={isMuted ? 'volume-x-mark' : 'volume'}
                size="sm"
                className="inline-block"
              />
            </Button>
          </div>
        </NavBar>
        <div className="flex-1 flex relative overflow-hidden">
          <ScrollShadow isVisible={isScrolled} />
          <Scrollable className="relative flex-1 flex" ref={scrollContainer} onScroll={onScroll}>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 m-4">
                <div className="mb-6 2xl:mb-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-600 dark:bg-opacity-30">
                  <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                    Frequently asked questions
                  </h3>
                  <div className="max-w-4xl">
                    <FaqList />
                  </div>
                  <p className="mb-4">
                    Still need help or have more questions? Find us on Twitter at{' '}
                    <Anchor target="_blank" href={TWITTER_URL}>
                      {TWITTER_USER}
                    </Anchor>
                    .
                  </p>
                  <p className="mb-4">
                    <Link to="/">&larr; Go to the homepage</Link>
                  </p>
                </div>
              </div>
              <Footer />
            </div>
            <ForceScrollable />
          </Scrollable>
        </div>
      </div>
    </>
  );
};

export default Faq;
