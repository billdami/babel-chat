import React, { FC } from 'react';

interface PageNotFoundListProps {}

const PageNotFound: FC<PageNotFoundListProps> = () => {
  return <div className="PageNotFound">Sorry, the requested page could not be found. 😿</div>;
};

export default PageNotFound;
