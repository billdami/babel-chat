import React, { FC, useLayoutEffect, useRef } from 'react';

interface FacebookShareButtonProps {}

const FacebookShareButton: FC<FacebookShareButtonProps> = () => {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    try {
      FB?.XFBML?.parse(container.current!);
    } catch (err) {
      // fail silently
    }
  }, []);

  return (
    <div ref={container}>
      <div
        className="fb-share-button"
        data-href="https://babelchat.online/"
        data-layout="button_count"
        data-size="large"
      >
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fbabelchat.online%2F&amp;src=sdkpreparse"
          className="fb-xfbml-parse-ignore"
        >
          Share
        </a>
      </div>
    </div>
  );
};

export default FacebookShareButton;
