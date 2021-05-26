import React, { FC, SVGProps } from 'react';

interface LogoIconProps extends SVGProps<SVGSVGElement> {}

const LogoIcon: FC<LogoIconProps> = ({ ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 365.67 482.71" {...rest}>
    <g>
      <g>
        <path d="M44.36,371,93.17,245.49a39.57,39.57,0,0,1,50.31-22.87c47.33,17,132.91,42.57,204.09,35.15l17.26,83.46a39.55,39.55,0,0,1-35.17,47.42c-48.22,4.35-125.88,9.2-180,1.91a39,39,0,0,0-27.47,6.83L0,482.71Z" fill="#10b981"/>
        <path d="M326.83,163.06l12,71.33S240.7,251.06,131.6,196.1l13.94-65.85S225.11,177.83,326.83,163.06Z" fill="#10b981"/>
        <path d="M302.76,150.38l-6.53-63.85h0c-42.81,4.35-103.76-20.32-103.76-20.32l-14.23,50.61S215.59,148.57,302.76,150.38Z" fill="#10b981"/>
        <circle cx="253.52" cy="31.38" r="31.38" fill="#10b981"/>
      </g>
      <rect x="133.4" y="276.73" width="25.25" height="33.74" rx="5.71" fill="#f3f4f6"/>
      <rect x="204.73" y="301.58" width="25.25" height="33.74" rx="5.71" fill="#f3f4f6"/>
      <rect x="276.07" y="322.98" width="25.25" height="33.74" rx="5.71" fill="#f3f4f6"/>
    </g>
  </svg>
);

export default LogoIcon;
