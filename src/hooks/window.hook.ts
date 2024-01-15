import { useEffect, useState } from 'react';

const useWindow = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [visibilityState, setVisibilityState] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window != 'undefined') {
      const handleResize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);

      const handleVisibilityChange = () => {
        console.log(`document.hidden: ${!document.hidden}`);
        setVisibilityState(!document.hidden);
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  return { ...size, visibilityState };
};

export default useWindow;
