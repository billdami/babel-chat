import React, { FC, SVGProps } from 'react';

import useTheme from '../../hooks/useTheme';
import IconSVG from '../Svgs/Logos/Icon';
import IconDarkSVG from '../Svgs/Logos/IconDark';

interface LogoProps extends SVGProps<SVGSVGElement> {}

const Logo: FC<LogoProps> = ({ ...rest }) => {
  const { isDarkTheme } = useTheme();
  return isDarkTheme ? <IconDarkSVG {...rest} /> : <IconSVG {...rest} />;
};

export default Logo;
