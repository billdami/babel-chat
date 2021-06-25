import React, { FC } from 'react';

// Forces its container to always have a scroll height of at
// least 1px on mobile, to enable the "elastic rubber band"
// effect at all times.
//
// NOTE: for this to work correctly, the scrollable container
// needs to be position:relative

interface ForceScrollableProps {}

const ForceScrollable: FC<ForceScrollableProps> = () => {
  return (
    <div
      className="md:hidden absolute left-0 right-0 -bottom-px h-px pointer-events-none"
      role="presentation"
    ></div>
  );
};

export default ForceScrollable;
