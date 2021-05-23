import { useLayoutEffect } from 'react';

const useBodyClass = (className: string) => {
  useLayoutEffect(() => {
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  });
};

export default useBodyClass;
