import React, { FC, SVGProps } from 'react';

import IconSVG from '../Svgs/Logos/Icon';

interface LogoProps extends SVGProps<SVGSVGElement> {}

const Logo: FC<LogoProps> = ({ ...rest }) => {
  // icon logo is the same in light and dark themes, for now
  return <IconSVG {...rest} />;
};

export default Logo;
