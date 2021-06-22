import React, { FC, SVGProps } from 'react';

import useTheme from '../../hooks/useTheme';
import LogoSVG from '../Svgs/Logos/Logo';
import LogoDarkSVG from '../Svgs/Logos/LogoDark';

interface LogoProps extends SVGProps<SVGSVGElement> {}

const Logo: FC<LogoProps> = ({ ...rest }) => {
  const { isDarkTheme } = useTheme();
  return isDarkTheme ? <LogoDarkSVG {...rest} /> : <LogoSVG {...rest} />;
};

export default Logo;
