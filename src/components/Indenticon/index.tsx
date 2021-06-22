import React, { DetailedHTMLProps, FC, ImgHTMLAttributes, useMemo } from 'react';
import identicon from 'identicon.js';

import useTheme from '../../hooks/useTheme';
import { md5 } from '../../utils/crypto';

interface IdenticonProps
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  identifier: string;
  size?: number;
}

const backgroundLight = [255, 255, 255, 255];
const backgroundDark = [229, 231, 235, 255];
const emptyPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

// maintain a cache of all generated identicons
const cache: { [x: string]: string } = {};

const Identicon: FC<IdenticonProps> = ({ identifier, size = 36, ...rest }) => {
  const { theme, isDarkTheme } = useTheme();

  const src = useMemo(() => {
    let _src = emptyPixel;
    if (identifier) {
      const hash = md5(identifier);
      const cacheId = `${identifier}__${size}__${theme}`;

      if (cache[cacheId]) {
        _src = cache[cacheId];
      } else {
        const icon = new identicon(hash, {
          format: 'svg',
          background: isDarkTheme ? backgroundDark : backgroundLight,
          margin: 0,
          size,
        });

        _src = `data:image/svg+xml;base64,${icon.toString()}`;
        cache[cacheId] = _src;
      }
    }

    return _src;
  }, [identifier, size, theme, isDarkTheme]);

  return <img width={size} height={size} alt="" src={src} {...rest} />;
};

export default Identicon;
