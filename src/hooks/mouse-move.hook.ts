import { useEffect, useState } from 'react';

const useMouseMove = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window != 'undefined') {
      const handler = (e: MouseEvent) => {
        setPosition(() => ({
          x: e.clientX,
          y: e.clientY,
        }));
      };
      window.addEventListener('mousemove', handler);
      return () => {
        window.removeEventListener('mousemove', handler);
      };
    }
  }, []);

  return position;
};

export default useMouseMove;
