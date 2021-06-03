import { useEffect } from 'react';

export const scrollToTop = () => {
  try {
    window.scrollTo(0, 0);
  } catch (err) {
    //silently fail if unable to scroll for whatever reason
  }
};

const useScrollToTop = () => {
  useEffect(() => scrollToTop(), []);
};

export default useScrollToTop;
