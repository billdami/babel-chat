import React, { FC, SVGProps } from 'react';

interface EllipsisVerticalProps extends SVGProps<SVGSVGElement> {}

const EllipsisVertical: FC<EllipsisVerticalProps> = ({ ...rest }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 512"
    {...rest}
  >
    <title>More</title>
    <path fill="currentColor" d="M64 112c26.5 0 48-21.5 48-48S90.5 16 64 16S16 37.5 16 64S37.5 112 64 112zM64 400c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48S90.5 400 64 400zM64 208C37.5 208 16 229.5 16 256S37.5 304 64 304s48-21.5 48-48S90.5 208 64 208z"></path>
  </svg>
);

export default EllipsisVertical;
