import React, { FC, useLayoutEffect, useRef } from 'react';

import Anchor from '../Anchor';

interface TweetButtonProps {}

const TweetButton: FC<TweetButtonProps> = () => {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    try {
      twttr?.widgets?.load(container.current!);
    } catch (err) {
      // fail silently
    }
  }, []);

  return (
    <div ref={container}>
      <Anchor
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className="twitter-share-button"
        data-size="large"
        data-text="Check out babel chat! A new, 100% anonymous and free chat app, no registration required."
        data-url="https://babel-chat-online.web.app/"
        data-via="babelChatOnline"
        data-show-count="false"
      >
        Tweet
      </Anchor>
    </div>
  );
};

export default TweetButton;
