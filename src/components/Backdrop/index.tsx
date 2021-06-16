import React, { FC } from 'react';

interface BackdropProps {}

const Backdrop: FC<BackdropProps> = () => {
  return <div className="fixed inset-0 bg-gray-900 bg-opacity-60" aria-hidden="true"></div>;
};

export default Backdrop;
